require 'release_build_upload'
require 'beta_build_upload'
require 'erb'

def description(name)
    name = name.split(/\W/).map { |c| c.capitalize }.join(' ')

    "Build Kendo UI #{name}"
end

desc "Upload all internal builds on kendoui.com"
task "internal_builds:bundles:all" => [ "build:production:get_binaries" ]


def bundle(options)
    name = options[:name]
    eula = options[:eula]
    readme = options[:readme]
    vsdoc_sources = options[:vsdoc]
    intellisense_sources = options[:intellisense]
    vsdoc_dest = options[:vsdoc_dest] || "vsdoc"
    type_script_sources = options[:type_script]
    changelog_suites = options[:changelog]
    demo_suites = options[:demos]
    path = "dist/bundles/#{name}"
    beta = options[:beta] || BETA
    legal_dir = File.join('resources', 'legal', beta ? 'beta' : 'official')
    license = nil

    prerequisites = [:js, :less] + options[:prerequisites].to_a

    add_file = lambda do |to, from|
        dest = File.join(path, to, from)
        file_copy :from => from, :to => dest
        prerequisites.push(dest)
    end

    unless options[:skip_grunt_build]
        add_file.call('src', 'package.json')
        add_file.call('src', 'npm-shrinkwrap.json')

        license_path = File.join(path, 'src/resources/legal/core-license.txt')
        file_copy :from => File.join(legal_dir, "#{options[:license]}.txt"), :to => license_path

        grunt_path = File.join(path, 'src/Gruntfile.js')
        file_copy :from => 'build/Gruntfile.dist.js', :to => grunt_path

        build_files = File.join(path, 'src/build')

        tree :to => build_files,
             :from => 'build/{grunt/**/*,less-js/**/*,kendo-meta.js}',
             :root => 'build'

        prerequisites.push(build_files)
        prerequisites.push(license_path)
        prerequisites.push(grunt_path)
    end

    if options[:license]
        license = "#{path}.license"
        file_license license => File.join(legal_dir, "#{options[:license]}.txt")
    end

    options[:contents].each do |target, contents|

        root = ROOT_MAP[target]

        raise "Nothing specified for '#{target}' in ROOT_MAP" unless root

        to = File.join(path, target)

        tree :to => to,
             :from => contents,
             :root => root,
             :license => license

        prerequisites.push(to)
    end

    if eula
        license_agreements_path = File.join(path, "license-agreements")
        third_party_path = File.join(license_agreements_path, "third-party")
        eula_dir = beta ? "eula" : eula + "-eula"
        source_path = File.join(legal_dir, eula_dir)

        tree :to => license_agreements_path,
             :from =>  File.join(source_path, "*"),
             :root => source_path

        tree :to => third_party_path,
             :from =>  File.join(THIRD_PARTY_LEGAL_DIR, "*"),
             :root => THIRD_PARTY_LEGAL_DIR

        prerequisites.push(license_agreements_path)
        prerequisites.push(third_party_path)
    end

    if readme
        readme_path = File.join(path, "README")
        file_copy :to => readme_path, :from => File.join(README_DIR, "#{readme}.txt")
        prerequisites.push(readme_path)
    end

    if vsdoc_sources
        vsdoc_sources.each do |file|
            vsdoc_path = File.join(path, vsdoc_dest, "kendo.#{file}-vsdoc.js")
            vsdoc vsdoc_path => md_api_suite(file)
            prerequisites.push(vsdoc_path)
        end
    end

    if intellisense_sources
        intellisense_sources.each do |file|
            intellisense_path = File.join(path, vsdoc_dest, "kendo.#{file}.min.intellisense.js")
            intellisense intellisense_path => md_api_suite(file)
            prerequisites.push(intellisense_path)
        end
    end

    if type_script_sources
        type_script_build_files = FileList["build/codegen/lib/type_script/*.*"]

        type_script_sources.each do |file|
            type_script_path = File.join(path, "typescript", "kendo.#{file}.d.ts")
            type_script type_script_path => [md_api_suite(file), type_script_build_files].flatten
            prerequisites.push(type_script_path)
        end
    end

    if changelog_suites
        changelog_path = File.join(path, "changelog.html")
        write_changelog(changelog_path, changelog_suites, options[:changelog_exclude])
        prerequisites.push(changelog_path)
    end

    if demo_suites

        demo_dirs = demo_suites[:dir]

        demo_dirs = [demo_dirs] unless demo_dirs.is_a? Array

        demo_files = demo_dirs.map do |dir|
            demos({
                :path => "#{path}/#{dir}",
                :template_dir => demo_suites[:template_dir]
            })
        end

        prerequisites = prerequisites + demo_files.flatten
    end

    if options[:post_build]
        if options[:post_build].kind_of?(Array)
            prerequisites.push(*options[:post_build])
        else
            prerequisites.push(options[:post_build])
        end
    end

    zip "#{path}.zip" =>  prerequisites

    desc description(name)
    task "bundles:#{name}" => "#{path}.zip"

    xml_changelog_path = "dist/bundles/#{name}.changelog.xml"
    write_changelog(xml_changelog_path, changelog_suites, options[:changelog_exclude])

    if options[:upload_as_internal_build]
        versioned_bundle_lib_archive_path = File.join(ARCHIVE_ROOT, 'LIB Archive', VERSION, versioned_bundle_name(name) + ".zip")

        file_copy :to => versioned_bundle_lib_archive_path, :from => "#{path}.zip"

        desc "Upload #{name} as an internal build on kendoui.com"
        task "internal_builds:bundles:#{name}" => versioned_bundle_lib_archive_path do
            upload_internal_build \
                :title => versioned_bundle_name(name),
                :product => options[:product],
                :changelog_path => changelog_path,
                :vs_extension => !!options[:vs_extension],
                :archive_path => versioned_bundle_lib_archive_path
        end

        # add bundle to bundles:all
        task "internal_builds:bundles:all" => "internal_builds:bundles:#{name}"
    end

    if options[:upload_to_appbuilder]
        versioned_bundle_path = File.join(ARCHIVE_ROOT, 'AppBuilder/Uploads', VERSION, versioned_bundle_name(name) + ".zip")

        file_copy :to => versioned_bundle_path, :from => "#{path}.zip"

        desc "Upload #{name} in AppBuidler"
        task "appbuilder_builds:bundles:#{name}" => [versioned_bundle_path, changelog_path] do
            if options[:skip_changelog_in_zip]
                Zip::File.open(versioned_bundle_path, Zip::File::CREATE) do |file|
                    file.remove("changelog.html")
                end
            end
            sh  *["./build/appbuilder-upload.js", options[:product], VERSION, versioned_bundle_path, changelog_path, false, options[:appbuilder_features]].compact
        end

        desc "Upload bundles in AppBuidler"
        task "appbuilder_builds:bundles:all" => "appbuilder_builds:bundles:#{name}"

        desc "Upload #{name} in AppBuidler (verified)"
        task "appbuilder_builds:bundles:verified:#{name}" => [versioned_bundle_path, changelog_path] do
            if options[:skip_changelog_in_zip]
                Zip::File.open(versioned_bundle_path, Zip::File::CREATE) do |file|
                    file.remove("changelog.html")
                end
            end
            sh  *["./build/appbuilder-upload.js", options[:product], VERSION, versioned_bundle_path, changelog_path, true, options[:appbuilder_features]].compact
        end

        desc "Upload bundles in AppBuidler"
        task "appbuilder_builds:bundles:verified:all" => "appbuilder_builds:bundles:verified:#{name}"
    end

    if options[:release_build]
      if SERVICE_PACK_NUMBER != nil
        release_destination_folder_name = "Q#{VERSION_Q} #{VERSION_YEAR} SP#{SERVICE_PACK_NUMBER}"
      else
        release_destination_folder_name = "Q#{VERSION_Q} #{VERSION_YEAR}/Q#{VERSION_Q} #{VERSION_YEAR}"
      end

      versioned_bundle_release_destination_path = File.join(RELEASE_ROOT, VERSION_YEAR.to_s, release_destination_folder_name)
      versioned_bundle_release_archive_path = File.join(ARCHIVE_ROOT, "Production")

      desc "Copy #{name} as release build on telerik.com"
      task "release_builds:copy:#{name}" do
          FileUtils.mkdir_p(versioned_bundle_release_destination_path)
          release_build_file_copy(options[:release_build], name, versioned_bundle_release_destination_path, versioned_bundle_release_archive_path)

      end

      desc "Upload #{name} as release build on telerik.com"
      task "release_builds:upload:#{name}" =>  "release_builds:copy:#{name}" do
          upload_release_build \
                  :title => name,
                  :product => options[:product],
                  :params => options[:release_build],
                  :archive_path => versioned_bundle_release_destination_path
      end

      # add bundle to bundles:all
      task "release_builds:bundles:all" => "release_builds:upload:#{name}"
    end

    if options[:beta_build]
      if ENV["DRY_RUN"]
          beta_destination_folder_name = "Q#{VERSION_Q} #{VERSION_YEAR}/DRY_RUN_BETA"
      else
          beta_destination_folder_name = "Q#{VERSION_Q} #{VERSION_YEAR}/BETA"
      end

      versioned_bundle_beta_destination_path = File.join(RELEASE_ROOT, VERSION_YEAR.to_s, beta_destination_folder_name)
      versioned_bundle_beta_archive_path = File.join(ARCHIVE_ROOT, "Stable")

      desc "Copy #{name} as beta build on telerik.com"
      task "beta_builds:copy:#{name}" do
          FileUtils.mkdir_p(versioned_bundle_beta_destination_path)

          beta_build_file_copy(options[:beta_build], name, versioned_bundle_beta_destination_path, versioned_bundle_beta_archive_path)

      end

      desc "Upload #{name} as beta build on telerik.com"
      task "beta_builds:upload:#{name}" =>  "beta_builds:copy:#{name}" do

          upload_beta_build \
                  :title => name,
                  :product => options[:product],
                  :params => options[:beta_build],
                  :archive_path => versioned_bundle_beta_destination_path
      end

      # add bundle to bundles:all
      task "beta_builds:bundles:all" => "beta_builds:upload:#{name}"

    end

end

