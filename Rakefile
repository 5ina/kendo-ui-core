require 'rake/clean'
require 'rake/testtask'
require 'bundler/setup'
require 'tempfile'
require 'erb'
require 'zip'
require 'json'
require 'winrm' unless RUBY_PLATFORM =~ /darwin/

VERBOSE = verbose == true

$LOAD_PATH << File.join(File.dirname(__FILE__), "build")
$LOAD_PATH << File.join(File.dirname(__FILE__), "build", "codegen", "lib")
$LOAD_PATH << File.join(File.dirname(__FILE__), "resources/product")

CDN_ROOT = 'https://kendo.cdn.telerik.com/'
KENDO_ORIGIN_HOST = 'ordkendouicdn01.telerik.local'
STAGING_CDN_ROOT = 'https://kendo.cdn.telerik.com/staging/'
DIST_JS_ROOT = "dist/js"
DIST_STYLES_ROOT = "dist/styles/"
KENDO_CONFIG_FILE = File.join("download-builder", "config", "kendo-config.json")

PLATFORM = RbConfig::CONFIG['host_os']

if PLATFORM =~ /linux|darwin|bsd/
    RELEASE_ROOT = "/kendo-dist"
    WEB_INSTALLER_ROOT = "/installers-dist"
else
    distributions = "\\\\telerik.com\\distributions\\DailyBuilds"
    ADMIN_RELEASE_UPLOAD_PASS = ENV['KendoBuildUser_PASS']
    RELEASE_ROOT = File.join(distributions, "KendoUI")
    WEB_INSTALLER_ROOT = File.join(distributions, "Guidance", "WebInstallers", "Current", "Release")
end

ARCHIVE_ROOT = File.join(RELEASE_ROOT, "BUILDS")

if ENV['DRY_RUN']
    ADMIN_URL = 'http://integrationadmin.telerik.com/'
    ADMIN_RELEASE_UPLOAD_LOGIN = 'KendoBuildUser@telerik.local'

    SITE_URL = "http://wwwsit.telerik.com"
    SITE_LOGIN = "stefan.rahnev@telerik.local"
else
    ADMIN_URL = 'http://admin.telerik.com/'
    ADMIN_RELEASE_UPLOAD_LOGIN = 'KendoBuildUser@telerik.com'

    SITE_URL = "http://www.telerik.com"
    SITE_LOGIN = "tsvetomir.tsonev@telerik.com"
    NUGET_SITE_URL = "https://www.nuget.org/"
    NUGET_SITE_LOGIN = "stefan.rahnev@telerik.com"
end


# SITE_DOWNLOAD_BUILDER_UPLOAD_PASS = "t3l3r1kc0m"
SITE_DOWNLOAD_BUILDER_UPLOAD_PASS = "E5U3WqgA#4%9hs"

NUGET_UPLOAD_PASS = "9c8kxjNdLEoDyX"

ROOT_MAP = {
    '.' => /(dist\/js|dist\/styles\/.+?)\//,
    'js' => DIST_JS_ROOT,
    'styles' => /dist\/styles\/.+?\//,
    'src/js' => DIST_JS_ROOT,
    'src/styles' => /dist\/styles\//,
    'src/Kendo.Mvc/Kendo.Mvc' => 'wrappers/mvc/src/Kendo.Mvc/',
    'src/Kendo.Mvc/packages' => 'wrappers/mvc/packages/',
    'src/AspNet.Core/Kendo.Mvc' => 'wrappers/mvc-6/src/Kendo.Mvc/',
    'src/Telerik.Web.Spreadsheet/Telerik.Web.Spreadsheet' => 'dpl/Telerik.Web.Spreadsheet/',
    'src/Telerik.Web.Spreadsheet/lib' => 'dpl/lib/',
    'apptemplates' => 'demos/apptemplates',
    'wrappers/aspnetmvc/EditorTemplates/ascx' => 'wrappers/mvc/demos/Kendo.Mvc.Examples/Views/Shared/EditorTemplates/',
    'wrappers/aspnetmvc/EditorTemplates/razor' => 'wrappers/mvc/demos/Kendo.Mvc.Examples/Views/Shared/EditorTemplates/',
    'wrappers/aspnetmvc/Binaries/Mvc3' => 'wrappers/mvc/src/Kendo.Mvc/bin/Release-MVC3/',
    'wrappers/aspnetmvc/Binaries/Mvc4' => 'wrappers/mvc/src/Kendo.Mvc/bin/Release/',
    'wrappers/aspnetmvc/Binaries/Mvc5' => 'wrappers/mvc/src/Kendo.Mvc/bin/Release-MVC5/',
    'wrappers/aspnetcore/Binaries/AspNet.Core' => 'wrappers/mvc-6/src/Kendo.Mvc/bin/Release/',
    'wrappers/aspnetcore/EditorTemplates/razor' => 'wrappers/mvc/demos/Kendo.Mvc.Examples/Views/Shared/EditorTemplates/',
    'wrappers/aspnetmvc/Scaffolding' => 'plugins/KendoScaffolder/',
    'spreadsheet/binaries/net40' => 'dpl/Telerik.Web.Spreadsheet/bin/Release',
    'spreadsheet/' => 'dpl/',
    'Kendo.Mvc.Export/binaries/net40' => 'dpl/Kendo.Mvc.Export/bin/Release',
    'wrappers/jsp/kendo-taglib' => 'wrappers/java/kendo-taglib/target/',
    'src/kendo-taglib' => 'wrappers/java/kendo-taglib/',
    'src/php' => 'wrappers/php/',
    'wrappers/jsp/spring-demos/src' => 'wrappers/java/spring-demos/src/',
    'wrappers/php' => 'wrappers/php',
    'typescript' => 'resources/typescript'
}

DATAVIZ_WIDGETS = %w(
    chart sparkline diagram map stockchart barcode qrcode lineargauge radialgauge treemap
)
WEB_WIDGETS = %w(
    autocomplete calendar colorpicker combobox datepicker datetimepicker dropdownlist
    editor gantt grid listview maskedtextbox menu multiselect notification numerictextbox
    pager panelbar pivotgrid progressbar responsive scheduler slider splitter tabstrip
    timepicker toolbar tooltip treelist treeview upload window
)
PRO_WIDGETS = %w(
    grid scheduler spreadsheet upload editor treeview treelist
).concat(DATAVIZ_WIDGETS)

def api_doc(wildcard)
    FileList[File.join("docs/api/javascript", wildcard)]
end

def all_docs(prefix)
    api_doc(File.join(prefix, "**/*.md"))
end

def framework_api_doc
    api_doc("*.md")
        .include(all_docs("data"))
        .include(all_docs("geometry"))
        .include(all_docs("drawing"))
        .include(all_docs("ooxml"))
end

def md_api_suite(suite)
    case suite
    when 'all'
        all_docs("").exclude("docs/api/javascript/effects/**/*.md")
    when 'web'
        all_docs("ui")
        .include(all_docs("spreadsheet")).include(framework_api_doc)
    when 'dataviz'
        all_docs("dataviz").include(framework_api_doc)
    when 'mobile'
        all_docs("mobile").include(framework_api_doc)
    when 'dataviz.mobile'
        all_docs("mobile").include(all_docs("dataviz")).include(framework_api_doc)
    end
end

require 'version'
require 'timezone'
require './build/zip'
require './build/szip'
require 'js'
require 'css'
require 'tasks'
require 'spreadsheet'
require 'spreadsheet_redist'
require 'kendo_mvc_export'
require 'mvc'
require 'mvc_6'
require 'java'
require 'php'
require 'vsdoc'
require 'intellisense'
require 'jscheme'
require 'react'
require 'type_script'
require 'json_typedef'
require 'changelog'
require 'javascript_dependencies'
require 'bundle'
require 'theme_builder'
require 'demos'
require 'download_builder'
require 'release_notes'
require 'product_incubator_hub'
require 'cdn'
require 'tests'
require 'codegen'
require 'nuget'
require 'bower'
require 'npm'
require 'winrm_tools' unless RUBY_PLATFORM =~ /darwin/
require 'playground'
require 'vs_scaffold'
require './build/localization'

MVC_BINARIES = {
    'wrappers/aspnetmvc/Binaries/Mvc3' => MVC3_DLL,
    'wrappers/aspnetmvc/Binaries/Mvc4' => MVC4_DLL,
    'wrappers/aspnetmvc/Binaries/Mvc5' => MVC5_DLL
}

MVC_CORE_BINARIES_COMMERCIAL = {
    'wrappers/aspnetcore/Binaries/AspNet.Core' => MVC6_REDIST_COMMERCIAL
}

MVC_CORE_BINARIES_TRIAL = {
    'wrappers/aspnetcore/Binaries/AspNet.Core' => MVC6_REDIST_TRIAL
}

MVC_CONTENT = {
    'wrappers/aspnetmvc/EditorTemplates/ascx' => MVC_ASCX_EDITOR_TEMPLATES,
    'wrappers/aspnetmvc/EditorTemplates/razor' => MVC_RAZOR_EDITOR_TEMPLATES
}.merge(MVC_BINARIES)

{
    'VS2012' => { :bin => 'Release', :dll => MVC4_DLL, :demos => MVC_DEMOS },
    'VS2013' => { :bin => 'Release-MVC5', :dll => MVC5_DLL, :demos => FileList[MVC_DEMOS].exclude('**/Web.config') },
    'VS2015' => { :bin => 'Release-MVC5', :dll => MVC5_DLL, :demos => FileList[MVC_DEMOS].exclude('**/Web.config') }
}.each do |key, value|

    ROOT_MAP.merge!( {
        "wrappers/aspnetmvc/Examples/#{key}/Kendo.Mvc.Examples" => 'wrappers/mvc/demos/Kendo.Mvc.Examples/',
        "wrappers/aspnetmvc/Examples/#{key}/Kendo.Mvc.Examples/Content/shared" => 'demos/mvc/content/shared',
        "wrappers/aspnetmvc/Examples/#{key}/Kendo.Mvc.Examples/bin" => "wrappers/mvc/src/Kendo.Mvc/bin/#{value[:bin]}/",
        "wrappers/aspnetmvc/Examples/#{key}/packages" => 'wrappers/mvc/packages/'
    } )

    MVC_CONTENT.merge!( {
        "wrappers/aspnetmvc/Examples/#{key}/packages" => FileList['wrappers/mvc/packages/**/*.*'],
        "wrappers/aspnetmvc/Examples/#{key}/Kendo.Mvc.Examples/bin" => value[:dll],
        "wrappers/aspnetmvc/Examples/#{key}/Kendo.Mvc.Examples" => value[:demos],
        "wrappers/aspnetmvc/Examples/#{key}/Kendo.Mvc.Examples/Content/shared" => FileList['demos/mvc/content/shared/*'],
    } )
end

ROOT_MAP.merge!( {
    "wrappers/aspnetcore/Examples/AspNet.Core/VS2015/Kendo.Mvc.Examples" => 'wrappers/mvc-6/demos/Kendo.Mvc.Examples/',
    "wrappers/aspnetcore/Examples/AspNet.Core/VS2015/Kendo.Mvc.Examples/wwwroot/shared" => 'demos/mvc/content/shared',
    "wrappers/aspnetcore/Examples/AspNet.Core/VS2017/Kendo.Mvc.Examples" => 'wrappers/mvc-6/demos/Kendo.Mvc.Examples/',
    "wrappers/aspnetcore/Examples/AspNet.Core/VS2017/Kendo.Mvc.Examples/wwwroot/shared" => 'demos/mvc/content/shared'
} )

MVC_CORE_CONTENT = {
    "wrappers/aspnetcore/Examples/AspNet.Core/VS2015/Kendo.Mvc.Examples" => MVC_6_DEMOS_VS2015,
    "wrappers/aspnetcore/Examples/AspNet.Core/VS2015/Kendo.Mvc.Examples/wwwroot/shared" => FileList['demos/mvc/content/shared/*'],
    "wrappers/aspnetcore/Examples/AspNet.Core/VS2017/Kendo.Mvc.Examples" => MVC_6_DEMOS,
    "wrappers/aspnetcore/Examples/AspNet.Core/VS2017/Kendo.Mvc.Examples/wwwroot/shared" => FileList['demos/mvc/content/shared/*']
}

JSP_CONTENT = {
    'wrappers/jsp/kendo-taglib' => JSP_TAGLIB_JAR,
    'wrappers/jsp/spring-demos/src' => SPRING_DEMOS_SRC
}

PHP_CONTENT = {
    'wrappers/php' => PHP_DEMOS_SRC
}

APPTEMPLATES_CONTENT = FileList['demos/apptemplates/**/*'];

SPREADSHEET_CONTENT = {
    'spreadsheet/binaries/net40' => SPREADSHEET_REDIST_NET40,
    'spreadsheet/' => FileList[SPREADSHEET_ROOT + '/ReadMe.txt']
}

KENDO_MVC_EXPORT_CONTENT = {
    'Kendo.Mvc.Export/binaries/net40' => KENDO_MVC_EXPORT_REDIST_NET40
}


file KENDO_CONFIG_FILE do |t|
    sh "./node_modules/.bin/gulp download-builder"
end

# Rake tasks
desc('JavaScript')

task :js do
  gulp :scripts, '--license-pad'
end

desc "Build less files in dist/styles"
task :less do
  gulp :styles, '--license-pad'
end

desc('Build all Kendo UI distributions')
task :default => [:bundles]

# Kendo UI Professional
bundle :name => 'professional.commercial',
       :license => 'src-license-complete',
       :eula => 'complete',
       :readme => 'README.KendoUI.Complete',
       :readme_src => 'README.NoSource',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components),
       :demos => {
           :dir => 'examples'
       },
       :product => 'Kendo UI Professional',
       :skip_grunt_build => true,
       :contents => {
            'js' => COMPLETE_MIN_JS + COMPLETE_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES,
            'apptemplates' => APPTEMPLATES_CONTENT
       }

bundle :name => 'professional.commercial-source',
       :license => 'src-license-complete',
       :eula => 'complete',
       :changelog => %w(components),
       :contents => {
            'src/js' => COMPLETE_SRC_JS,
            'src/styles' => SRC_CSS
       }

bundle :name => 'professional.trial',
       :license => 'src-license-complete',
       :eula => 'complete',
       :readme => 'README.KendoUI.Trial',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components),
       :demos => {
           :dir => 'examples'
       },
       :contents => {
            'js' => COMPLETE_MIN_JS + COMPLETE_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES,
            'apptemplates' => APPTEMPLATES_CONTENT
       },
       :product => 'Kendo UI Professional'

bundle :name => 'professional.office365',
       :license => 'src-license-office365',
       :eula => 'office365',
       :readme => 'README.KendoUI.Office365',
       :readme_src => 'README.NoSource',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components),
       :demos => {
           :dir => 'examples'
       },
       :product => 'Kendo UI Professional',
       :skip_grunt_build => true,
       :contents => {
            'js' => COMPLETE_MIN_JS + COMPLETE_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES
       }

bundle :name => 'professional.office365-source',
       :license => 'src-license-office365',
       :eula => 'complete',
       :changelog => %w(components),
       :contents => {
            'src/js' => COMPLETE_SRC_JS,
            'src/styles' => SRC_CSS
       }

# UI for ASP.NET MVC
bundle :name => 'aspnetmvc.trial',
       :skip_grunt_build => true,
       :license => 'src-license-complete',
       :eula => 'aspnetmvc',
       :readme => 'README.KendoUI.Trial',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components aspnetmvc),
       :demos => {
           :dir => [
               'wrappers/aspnetmvc/Examples/VS2012/Kendo.Mvc.Examples/html',
               'wrappers/aspnetmvc/Examples/VS2013/Kendo.Mvc.Examples/html',
               'wrappers/aspnetmvc/Examples/VS2015/Kendo.Mvc.Examples/html'
           ],
           :template_dir => 'mvc'
       },
       :product => 'UI for ASP.NET MVC',
       :contents => {
            'js' => TRIAL_MIN_JS + MVC_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES,
            'wrappers/aspnetmvc/Scaffolding' => FileList['plugins/KendoScaffolder/KendoScaffolderExtension.vsix']
       }
       .merge(MVC_CONTENT).merge(SPREADSHEET_CONTENT).merge(KENDO_MVC_EXPORT_CONTENT),
       :post_build => ['mvc:copy_trials', 'spreadsheet:copy_trials'],
       :prerequisites => [
           'mvc:assets',
           'spreadsheet:binaries',
           'plugins/KendoScaffolder/KendoScaffolderExtension.vsix',
           'dist/bundles/aspnetmvc.trial/wrappers/aspnetmvc/Examples/VS2012/Kendo.Mvc.Examples/Kendo.Mvc.Examples.csproj',
           'dist/bundles/aspnetmvc.trial/wrappers/aspnetmvc/Examples/VS2012/Kendo.Mvc.Examples.sln',
           'dist/bundles/aspnetmvc.trial/wrappers/aspnetmvc/Examples/VS2013/Kendo.Mvc.Examples/Kendo.Mvc.Examples.csproj',
           'dist/bundles/aspnetmvc.trial/wrappers/aspnetmvc/Examples/VS2013/Kendo.Mvc.Examples/Web.config',
           'dist/bundles/aspnetmvc.trial/wrappers/aspnetmvc/Examples/VS2013/Kendo.Mvc.Examples/Views/Web.config',
           'dist/bundles/aspnetmvc.trial/wrappers/aspnetmvc/Examples/VS2013/Kendo.Mvc.Examples.sln',
           'dist/bundles/aspnetmvc.trial/wrappers/aspnetmvc/Examples/VS2015/Kendo.Mvc.Examples/Kendo.Mvc.Examples.csproj',
           'dist/bundles/aspnetmvc.trial/wrappers/aspnetmvc/Examples/VS2015/Kendo.Mvc.Examples/Web.config',
           'dist/bundles/aspnetmvc.trial/wrappers/aspnetmvc/Examples/VS2015/Kendo.Mvc.Examples/Views/Web.config',
           'dist/bundles/aspnetmvc.trial/wrappers/aspnetmvc/Examples/VS2015/Kendo.Mvc.Examples.sln'
       ]

bundle :name => 'aspnet.core.trial',
       :skip_grunt_build => true,
       :license => 'src-license-complete',
       :eula => 'aspnetcore',
       :readme => 'README.KendoUI.Trial',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components aspnetcore),
       :product => 'UI for ASP.NET MVC',
       :contents => {
           'js' => TRIAL_MIN_JS + MVC_MIN_JS_MAP + JQUERY_MAP,
           'styles' => MIN_CSS_RESOURCES,
           'wrappers/aspnetcore/EditorTemplates/razor' => MVC_RAZOR_EDITOR_TEMPLATES,
       }.merge(MVC_CORE_CONTENT).merge(MVC_CORE_BINARIES_TRIAL),
       :post_build => ['mvc_6:update_demo_deps_trial'],
       :prerequisites => [
           'mvc:assets',
           'dist/bundles/aspnet.core.trial/wrappers/aspnetcore/Examples/AspNet.Core/VS2015/Kendo.Mvc.Examples',
           'dist/bundles/aspnet.core.trial/wrappers/aspnetcore/Examples/AspNet.Core/VS2015/Kendo.Mvc.Examples/wwwroot/shared',
           'dist/bundles/aspnet.core.trial/wrappers/aspnetcore/Examples/AspNet.Core/VS2017/Kendo.Mvc.Examples',
           'dist/bundles/aspnet.core.trial/wrappers/aspnetcore/Examples/AspNet.Core/VS2017/Kendo.Mvc.Examples/wwwroot/shared'
       ]

bundle :name => 'aspnetmvc.hotfix.trial',
       :license => 'src-license-complete',
       :eula => 'aspnetmvc',
       :skip_grunt_build => true,
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components aspnetmvc),
       :product => 'UI for ASP.NET MVC',
       :contents => {
            'js' => TRIAL_MIN_JS + MVC_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES,
            'wrappers/aspnetmvc/EditorTemplates/ascx' => MVC_ASCX_EDITOR_TEMPLATES,
            'wrappers/aspnetmvc/EditorTemplates/razor' => MVC_RAZOR_EDITOR_TEMPLATES
       }.merge(MVC_BINARIES).merge(SPREADSHEET_CONTENT).merge(KENDO_MVC_EXPORT_CONTENT),
       :post_build => ['mvc:copy_trials', 'spreadsheet:copy_trials'],
       :prerequisites => [
           'mvc:assets',
           'spreadsheet:binaries',
           'type_script:master:test'
       ]

bundle :name => 'aspnet.core.hotfix.trial',
       :license => 'src-license-complete',
       :eula => 'aspnetcore',
       :skip_grunt_build => true,
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components aspnetcore),
       :product => 'UI for ASP.NET MVC',
       :contents => {
           'js' => TRIAL_MIN_JS + MVC_MIN_JS_MAP + JQUERY_MAP,
           'styles' => MIN_CSS_RESOURCES,
           'wrappers/aspnetcore/EditorTemplates/razor' => MVC_RAZOR_EDITOR_TEMPLATES
       }.merge(MVC_CORE_BINARIES_TRIAL),
       :prerequisites => [
           'mvc:assets',
           'spreadsheet:binaries',
           'type_script:master:test'
       ]

bundle :name => 'aspnetmvc.commercial',
       :license => 'src-license-complete',
       :eula => 'aspnetmvc',
       :readme_src => 'README.NoSource',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components aspnetmvc),
       :demos => {
           :dir => [
               'wrappers/aspnetmvc/Examples/VS2012/Kendo.Mvc.Examples/html',
               'wrappers/aspnetmvc/Examples/VS2013/Kendo.Mvc.Examples/html',
               'wrappers/aspnetmvc/Examples/VS2015/Kendo.Mvc.Examples/html'
           ],
           :template_dir => 'mvc'
       },
       :product => 'UI for ASP.NET MVC',
       :skip_grunt_build => true,
       :contents => {
            'js' => MVC_MIN_JS + MVC_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES,
            'wrappers/aspnetmvc/Scaffolding' => FileList['plugins/KendoScaffolder/KendoScaffolderExtension.vsix']
       }.merge(MVC_CONTENT).merge(SPREADSHEET_CONTENT).merge(KENDO_MVC_EXPORT_CONTENT),
       :prerequisites => [
           'mvc:assets',
           'type_script:master:test',
           'spreadsheet:binaries',
           'plugins/KendoScaffolder/KendoScaffolderExtension.vsix',
           'dist/bundles/aspnetmvc.commercial/wrappers/aspnetmvc/Examples/VS2012/Kendo.Mvc.Examples/Kendo.Mvc.Examples.csproj',
           'dist/bundles/aspnetmvc.commercial/wrappers/aspnetmvc/Examples/VS2012/Kendo.Mvc.Examples.sln',
           'dist/bundles/aspnetmvc.commercial/wrappers/aspnetmvc/Examples/VS2013/Kendo.Mvc.Examples/Kendo.Mvc.Examples.csproj',
           'dist/bundles/aspnetmvc.commercial/wrappers/aspnetmvc/Examples/VS2013/Kendo.Mvc.Examples/Web.config',
           'dist/bundles/aspnetmvc.commercial/wrappers/aspnetmvc/Examples/VS2013/Kendo.Mvc.Examples/Views/Web.config',
           'dist/bundles/aspnetmvc.commercial/wrappers/aspnetmvc/Examples/VS2013/Kendo.Mvc.Examples.sln',
           'dist/bundles/aspnetmvc.commercial/wrappers/aspnetmvc/Examples/VS2015/Kendo.Mvc.Examples/Kendo.Mvc.Examples.csproj',
           'dist/bundles/aspnetmvc.commercial/wrappers/aspnetmvc/Examples/VS2015/Kendo.Mvc.Examples/Web.config',
           'dist/bundles/aspnetmvc.commercial/wrappers/aspnetmvc/Examples/VS2015/Kendo.Mvc.Examples/Views/Web.config',
           'dist/bundles/aspnetmvc.commercial/wrappers/aspnetmvc/Examples/VS2015/Kendo.Mvc.Examples.sln'
       ]

bundle :name => 'aspnet.core.commercial',
       :license => 'src-license-complete',
       :eula => 'aspnetcore',
       :readme_src => 'README.NoSource',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components aspnetcore),
       :product => 'UI for ASP.NET MVC',
       :skip_grunt_build => true,
       :contents => {
           'js' => MVC_MIN_JS + MVC_MIN_JS_MAP + JQUERY_MAP,
           'styles' => MIN_CSS_RESOURCES,
           'wrappers/aspnetcore/EditorTemplates/razor' => MVC_RAZOR_EDITOR_TEMPLATES,
       }.merge(MVC_CORE_CONTENT).merge(MVC_CORE_BINARIES_COMMERCIAL),
       :post_build => ['mvc_6:update_demo_deps_commercial'],
       :prerequisites => [
           'mvc:assets',
 -         'type_script:master:test',
           'dist/bundles/aspnet.core.commercial/wrappers/aspnetcore/Examples/AspNet.Core/VS2015/Kendo.Mvc.Examples',
           'dist/bundles/aspnet.core.commercial/wrappers/aspnetcore/Examples/AspNet.Core/VS2015/Kendo.Mvc.Examples/wwwroot/shared',
           'dist/bundles/aspnet.core.commercial/wrappers/aspnetcore/Examples/AspNet.Core/VS2017/Kendo.Mvc.Examples',
           'dist/bundles/aspnet.core.commercial/wrappers/aspnetcore/Examples/AspNet.Core/VS2017/Kendo.Mvc.Examples/wwwroot/shared'
       ]

bundle :name => 'aspnetmvc.commercial-source',
       :license => 'src-license-complete',
       :eula => 'aspnetmvc',
       :changelog => %w(components aspnetmvc),
       :contents => {
            'src/js' => MVC_SRC_JS,
            'src/styles' => SRC_CSS,
            'src/Kendo.Mvc/packages' => FileList['wrappers/mvc/packages/**/*.*'],
            'src/Kendo.Mvc/Kendo.Mvc' => FileList['wrappers/mvc/src/Kendo.Mvc/**/*']
                .exclude('**/RegistryUtilities.cs')
                .exclude('**/KendoLicense.cs')
                .exclude('**/*.cs.source')
                .exclude('**/bin/**/*')
                .exclude('**/obj/**/*')
                .exclude('**/*.csproj'),
            'src/Telerik.Web.Spreadsheet/Telerik.Web.Spreadsheet' => FileList[SPREADSHEET_ROOT + '/Telerik.Web.Spreadsheet/**/*']
                .exclude('**/bin/**/*')
                .exclude('**/obj/**/*')
                .exclude('**/*.snk')
                .exclude('**/*.csproj')
       },
       :prerequisites => [
           'dist/bundles/aspnetmvc.commercial-source/src/Kendo.Mvc/Kendo.Mvc.sln',
           'dist/bundles/aspnetmvc.commercial-source/src/Kendo.Mvc/Kendo.Mvc/Kendo.snk',
           'dist/bundles/aspnetmvc.commercial-source/src/Kendo.Mvc/Kendo.Mvc/CommonAssemblyInfo.cs',
           'dist/bundles/aspnetmvc.commercial-source/src/Kendo.Mvc/Kendo.Mvc/Infrastructure/Licensing/KendoLicense.cs',
           'dist/bundles/aspnetmvc.commercial-source/src/Kendo.Mvc/Kendo.Mvc/Kendo.Mvc.csproj',
           'dist/bundles/aspnetmvc.commercial-source/src/Telerik.Web.Spreadsheet/Telerik.Web.Spreadsheet.sln',
           'dist/bundles/aspnetmvc.commercial-source/src/Telerik.Web.Spreadsheet/Telerik.Web.Spreadsheet/Kendo.snk',
           'dist/bundles/aspnetmvc.commercial-source/src/Telerik.Web.Spreadsheet/Telerik.Web.Spreadsheet/Telerik.Web.Spreadsheet.csproj',
           'dist/bundles/aspnetmvc.commercial-source/src/Telerik.Web.Spreadsheet/lib'
       ]

bundle :name => 'aspnet.core.commercial-source',
       :license => 'src-license-complete',
       :eula => 'aspnetcore',
       :changelog => %w(components aspnetcore),
       :contents => {
           'src/js' => MVC_SRC_JS,
           'src/styles' => SRC_CSS,
           'src/AspNet.Core/Kendo.Mvc' => FileList['wrappers/mvc-6/src/Kendo.Mvc/**/*']
                                              .exclude('**/bin/**/*')
                                              .exclude('**/obj/**/*')
                                              .exclude('**/*.snk')
                                              .exclude('**/*.user'),
       },
       :prerequisites => [
           'dist/bundles/aspnet.core.commercial-source/src/AspNet.Core/Kendo.Mvc.sln',
           'dist/bundles/aspnet.core.commercial-source/src/AspNet.Core/Kendo.Mvc/Kendo.snk'
       ]

bundle :name => 'aspnetmvc.internal.commercial',
       :license => 'src-license-complete',
       :eula => 'aspnetmvc',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components aspnetmvc),
       :product => 'UI for ASP.NET MVC',
       :skip_grunt_build => true,
       :contents => {
            'js' => MVC_MIN_JS + MVC_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES,
            'wrappers/aspnetmvc/EditorTemplates/ascx' => MVC_ASCX_EDITOR_TEMPLATES,
            'wrappers/aspnetmvc/EditorTemplates/razor' => MVC_RAZOR_EDITOR_TEMPLATES,
       }.merge(MVC_BINARIES).merge(SPREADSHEET_CONTENT).merge(KENDO_MVC_EXPORT_CONTENT),
       :prerequisites => [
           'mvc:assets',
           'spreadsheet:binaries',
           'type_script:master:test'
       ]

bundle :name => 'aspnet.core.internal.commercial',
       :license => 'src-license-complete',
       :eula => 'aspnetcore',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components aspnetcore),
       :product => 'UI for ASP.NET MVC',
       :skip_grunt_build => true,
       :contents => {
           'js' => MVC_MIN_JS + MVC_MIN_JS_MAP + JQUERY_MAP,
           'styles' => MIN_CSS_RESOURCES,
           'wrappers/aspnetcore/EditorTemplates/razor' => MVC_RAZOR_EDITOR_TEMPLATES,
       }.merge(MVC_CORE_CONTENT).merge(MVC_CORE_BINARIES_COMMERCIAL),
       :prerequisites => [
           'mvc:assets',
           'spreadsheet:binaries',
           'type_script:master:test'
       ]


bundle :name => 'aspnetmvc.internal.commercial-source',
       :license => 'src-license-complete',
       :eula => 'aspnetmvc',
       :changelog => %w(components aspnetmvc),
       :contents => {
            'src/js' => MVC_SRC_JS,
            'src/styles' => SRC_CSS,
            'src/Kendo.Mvc/packages' => FileList['wrappers/mvc/packages/**/*.*'],
            'src/Kendo.Mvc/Kendo.Mvc' => FileList['wrappers/mvc/src/Kendo.Mvc/**/*']
                .exclude('**/bin/**/*')
                .exclude('**/obj/**/*')
                .exclude('**/*.csproj'),
            'src/Telerik.Web.Spreadsheet/Telerik.Web.Spreadsheet' => FileList[SPREADSHEET_ROOT + '/Telerik.Web.Spreadsheet/**/*']
                .exclude('**/bin/**/*')
                .exclude('**/obj/**/*')
                .exclude('**/*.snk')
                .exclude('**/*.csproj')
       },
       :prerequisites => [
           'dist/bundles/aspnetmvc.internal.commercial-source/src/Kendo.Mvc/Kendo.Mvc.sln',
           'dist/bundles/aspnetmvc.internal.commercial-source/src/Kendo.Mvc/Kendo.Mvc/Kendo.snk',
           'dist/bundles/aspnetmvc.internal.commercial-source/src/Kendo.Mvc/Kendo.Mvc/CommonAssemblyInfo.cs',
           'dist/bundles/aspnetmvc.internal.commercial-source/src/Kendo.Mvc/Kendo.Mvc/Kendo.Mvc.csproj',
           'dist/bundles/aspnetmvc.internal.commercial-source/src/Telerik.Web.Spreadsheet/Telerik.Web.Spreadsheet.sln',
           'dist/bundles/aspnetmvc.internal.commercial-source/src/Telerik.Web.Spreadsheet/Telerik.Web.Spreadsheet/Kendo.snk',
           'dist/bundles/aspnetmvc.internal.commercial-source/src/Telerik.Web.Spreadsheet/Telerik.Web.Spreadsheet/Telerik.Web.Spreadsheet.csproj',
           'dist/bundles/aspnetmvc.internal.commercial-source/src/Telerik.Web.Spreadsheet/lib'
       ]

bundle :name => 'aspnet.core.internal.commercial-source',
       :license => 'src-license-complete',
       :eula => 'aspnetcore',
       :changelog => %w(components aspnetcore),
       :contents => {
           'src/js' => MVC_SRC_JS,
           'src/styles' => SRC_CSS,
           'src/AspNet.Core/Kendo.Mvc' => FileList['wrappers/mvc-6/src/Kendo.Mvc/**/*']
                                              .exclude('**/bin/**/*')
                                              .exclude('**/obj/**/*')
                                              .exclude('**/*.snk')
                                              .exclude('**/*.user'),
       },
       :prerequisites => [
           'dist/bundles/aspnet.core.internal.commercial-source/src/AspNet.Core/Kendo.Mvc.sln',
           'dist/bundles/aspnet.core.internal.commercial-source/src/AspNet.Core/Kendo.Mvc/Kendo.snk',
       ]

bundle :name => 'aspnetmvc.hotfix.commercial',
       :skip_grunt_build => true,
       :license => 'src-license-complete',
       :eula => 'aspnetmvc',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components aspnetmvc),
       :product => 'UI for ASP.NET MVC',
       :vs_extension => true,
       :contents => {
            'js' => MVC_MIN_JS + MVC_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES,
            'wrappers/aspnetmvc/EditorTemplates/ascx' => MVC_ASCX_EDITOR_TEMPLATES,
            'wrappers/aspnetmvc/EditorTemplates/razor' => MVC_RAZOR_EDITOR_TEMPLATES
       }.merge(MVC_BINARIES).merge(SPREADSHEET_CONTENT).merge(KENDO_MVC_EXPORT_CONTENT),
       :prerequisites => [
           'mvc:assets',
           'type_script:master:test'
       ]

bundle :name => 'aspnet.core.hotfix.commercial',
       :skip_grunt_build => true,
       :license => 'src-license-complete',
       :eula => 'aspnetcore',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :type_script => %w(all web mobile dataviz),
       :changelog => %w(components aspnetcore),
       :product => 'UI for ASP.NET MVC',
       :vs_extension => true,
       :contents => {
           'js' => MVC_MIN_JS + MVC_MIN_JS_MAP + JQUERY_MAP,
           'styles' => MIN_CSS_RESOURCES,
           'wrappers/aspnetcore/EditorTemplates/razor' => MVC_RAZOR_EDITOR_TEMPLATES
       }.merge(MVC_CORE_BINARIES_COMMERCIAL),
       :prerequisites => [
           'mvc:assets',
           'type_script:master:test'
       ]

bundle :name => 'cdn.commercial',
       :skip_grunt_build => true,
       :license => 'src-license-cdn',
       :vsdoc => %w(all web mobile dataviz),
       :intellisense => %w(all web mobile dataviz),
       :vsdoc_dest => 'js',
       :contents => {
           'js' => COMPLETE_MIN_JS + COMPLETE_MIN_JS_MAP + MVC_MIN_JS + MVC_MIN_JS_MAP + JQUERY_MAP,
           'styles' => MIN_CSS_RESOURCES
       }

bundle :name => 'appbuilder.professional',
       :skip_grunt_build => true,
       :license => 'src-license-appbuilder',
       :type_script => %w(dataviz.mobile),
       :changelog => %w(components),
       :changelog_exclude => WEB_WIDGETS,
       :skip_changelog_in_zip => true,
       :product => 'Kendo UI Professional',
       :contents => {
            'styles' => APP_BUILDER_MIN_CSS,
            'js' => APP_BUILDER_MIN_JS,
            'typescript' => FileList['resources/typescript/jquery.d.ts']
       },
       :upload_to_appbuilder => true,
       :appbuilder_features => "Kendo UI DataViz"

bundle :name => 'appbuilder.core',
       :skip_grunt_build => true,
       :license => 'src-license-appbuilder-core',
       :type_script => %w(mobile),
       :changelog => %w(components),
       :changelog_exclude => WEB_WIDGETS.concat(DATAVIZ_WIDGETS),
       :skip_changelog_in_zip => true,
       :product => 'Kendo UI Core',
       :contents => {
            'styles' => APP_BUILDER_CORE_MIN_CSS,
            'js' => APP_BUILDER_CORE_MIN_JS,
            'typescript' => FileList['resources/typescript/jquery.d.ts']
       },
       :upload_to_appbuilder => true

# UI for JSP
bundle :name => 'jsp.trial',
       :skip_grunt_build => true,
       :license => 'src-license-complete',
       :eula => 'jsp',
       :readme => 'README.KendoUI.Trial',
       :changelog => %w(components jsp),
       :type_script => %w(all web mobile dataviz),
       :product => 'UI for JSP',
       :contents => {
            'js' => COMPLETE_MIN_JS + COMPLETE_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES,
       }
       .merge(JSP_CONTENT),
       :prerequisites => [
           "java:assets",
           "dist/bundles/jsp.trial/wrappers/jsp/spring-demos/src/main/webapp/WEB-INF/lib/#{JAR_NAME}",
           'dist/bundles/jsp.trial/wrappers/jsp/spring-demos/pom.xml'
       ]

bundle :name => 'jsp.commercial',
       :license => 'src-license-complete',
       :eula => 'jsp',
       :readme_src => 'README.NoSource',
       :changelog => %w(components jsp),
       :product => 'UI for JSP',
       :skip_grunt_build => true,
       :type_script => %w(all web mobile dataviz),
       :contents => {
            'js' => COMPLETE_MIN_JS + COMPLETE_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES,
       }.merge(JSP_CONTENT),
       :prerequisites => [
           "java:assets",
           "dist/bundles/jsp.commercial/wrappers/jsp/spring-demos/src/main/webapp/WEB-INF/lib/#{JAR_NAME}",
           "dist/bundles/jsp.commercial/wrappers/jsp/spring-demos/pom.xml"
       ]

bundle :name => 'jsp.commercial-source',
       :license => 'src-license-complete',
       :eula => 'jsp',
       :changelog => %w(components jsp),
       :contents => {
            'src/js' => COMPLETE_SRC_JS,
            'src/styles' => SRC_CSS,
            'src/kendo-taglib' => JSP_TAGLIB_SRC.exclude('**/test/**/*')
       },
       :prerequisites => [
           "dist/bundles/jsp.commercial-source/src/kendo-taglib/pom.xml"
       ]

# UI for PHP
bundle :name => 'php.trial',
       :skip_grunt_build => true,
       :license => 'src-license-complete',
       :eula => 'php',
       :readme => 'README.KendoUI.Trial',
       :changelog => %w(components php),
       :type_script => %w(all web mobile dataviz),
       :product => 'UI for PHP',
       :contents => {
            'js' => COMPLETE_MIN_JS + COMPLETE_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES,
       }
       .merge(PHP_CONTENT),
       :prerequisites => [
           "php:assets"
       ]

bundle :name => 'php.commercial',
       :license => 'src-license-complete',
       :eula => 'php',
       :readme_src => 'README.NoSource',
       :changelog => %w(components php),
       :product => 'UI for PHP',
       :skip_grunt_build => true,
       :type_script => %w(all web mobile dataviz),
       :contents => {
            'js' => COMPLETE_MIN_JS + COMPLETE_MIN_JS_MAP + JQUERY_MAP,
            'styles' => MIN_CSS_RESOURCES
       }.merge(PHP_CONTENT),
       :prerequisites => [
           "php:assets"
       ]

bundle :name => 'php.commercial-source',
       :license => 'src-license-complete',
       :eula => 'php',
       :changelog => %w(components php),
       :contents => {
            'src/js' => COMPLETE_SRC_JS,
            'src/styles' => SRC_CSS,
            'src/php' => PHP_LIB_SRC
       }

# Kendo UI Core
bundle :name => 'core',
       :license => 'src-license-core',
       :product => 'Kendo UI Core',
       :changelog => %w(components),
       :changelog_exclude => PRO_WIDGETS,
       :readme => 'README.KendoUI.Core',
       :contents => {
            'js' => CORE_MIN_JS + CORE_MIN_JS_MAP + JQUERY_MAP,
            'styles' => CORE_MIN_CSS_RESOURCES,
            'src/js' => CORE_SRC_JS,
            'src/styles' => CORE_SRC_CSS
       }

BUNDLES = [
    'aspnetmvc.commercial',
    'aspnet.core.commercial',
    'aspnetmvc.commercial-source',
    'aspnet.core.commercial-source',
    'aspnetmvc.internal.commercial',
    'aspnet.core.internal.commercial',
    'aspnetmvc.internal.commercial-source',
    'aspnet.core.internal.commercial-source',
    'aspnetmvc.hotfix.commercial',
    'aspnet.core.hotfix.commercial',
    'aspnetmvc.hotfix.trial',
    'aspnet.core.hotfix.trial',
    'aspnetmvc.trial',
    'aspnet.core.trial',
    'cdn.commercial',
    'professional.commercial',
    'professional.commercial-source',
    'professional.trial',
    'professional.office365',
    'professional.office365-source',
    'jsp.commercial',
    'jsp.commercial-source',
    'jsp.trial',
    'php.commercial',
    'php.commercial-source',
    'php.trial',
    'appbuilder.professional',
    'appbuilder.core',
    'core'
]

namespace :build do
    WEB_ROOT = "/tmp"
    TOMCAT_ROOT = "/var/lib/tomcat7/webapps"

    def nuget_targets(destination)
        nugets = []

        NUGETS.each do |nuget|
            if nuget.match(/AspNet.Core/)
                name = nuget;
            else
                name = nuget.pathmap("%n") + ".#{VERSION}.nupkg";
            end

            dest = File.join(ARCHIVE_ROOT, destination, name)
            source = File.join("dist/bundles",  name)

            file_copy :to => dest, :from => source

            nugets.push(dest)
        end

        NUGET_ZIPS.each do |zip|
            dest = File.join(ARCHIVE_ROOT, destination, zip.pathmap("%f"))
            file_copy :from => zip, :to => dest
            nugets.push(dest)
        end

        nugets
    end

    def zip_targets(destination)
        zip_bundles = []

        BUNDLES.each do |bundle|
            ['.zip', '.7z'].each do |ext|
                latest_zip_filename = File.join(ARCHIVE_ROOT, destination, latest_bundle_name(bundle) + ext)
                file_copy :to => latest_zip_filename,
                          :from => "dist/bundles/#{bundle}#{ext}"

                zip_bundles.push(latest_zip_filename)

                versioned_zip_filename = File.join(ARCHIVE_ROOT, destination, versioned_bundle_name(bundle) + ext)
                file_copy :to => versioned_zip_filename,
                          :from => "dist/bundles/#{bundle}#{ext}"

                zip_bundles.push(versioned_zip_filename)
            end
        end

        zip_demos = "#{ARCHIVE_ROOT}/#{destination}/online-examples.zip"

        file_copy :to => zip_demos,
                  :from => "dist/demos/production.zip"

        zip_bundles.push(zip_demos)

        zip_mvc_demos = "#{ARCHIVE_ROOT}/#{destination}/online-mvc-examples.zip"
        file_copy :to => zip_mvc_demos,
                  :from => "dist/demos/mvc.zip"
        zip_bundles.push(zip_mvc_demos)

        db_root = "#{ARCHIVE_ROOT}/#{destination}/download-builder"
        db_version = "#{VERSION}".sub(/((\w+|\.){6})\./, '\1 ')

        db_content = "#{db_root}/#{db_version}.zip"
        file_copy :to => db_content,
                  :from => "dist/download-builder/content.zip"

        db_config_file = File.join(db_root, "kendo-config.#{db_version}.js")
        file_copy :to => db_config_file,
                  :from => "dist/download-builder/kendo-config.js"

        zip_bundles.push(db_config_file, db_content)

        tree :to => "#{ARCHIVE_ROOT}/AppBuilder/#{destination}/js",
             :from => FileList[APP_BUILDER_MIN_JS].pathmap('dist/bundles/appbuilder.professional/js/%f'),
             :root => 'dist/bundles/appbuilder.professional/js'

        zip_bundles.push("#{ARCHIVE_ROOT}/AppBuilder/#{destination}/js")

        tree :to => "#{ARCHIVE_ROOT}/AppBuilder/#{destination}/styles",
             :from => FileList[APP_BUILDER_MIN_CSS].sub!(/dist\/styles\/(mobile|dataviz)/, 'dist/bundles/appbuilder.professional/styles'),
             :root => 'dist/bundles/appbuilder.professional/styles'

        tree :to => "#{ARCHIVE_ROOT}/AppBuilder/#{destination}/js",
             :from => FileList[APP_BUILDER_CORE_MIN_JS].pathmap('dist/bundles/appbuilder.core/js/%f'),
             :root => 'dist/bundles/appbuilder.core/js'

        zip_bundles.push("#{ARCHIVE_ROOT}/AppBuilder/#{destination}/js")

        tree :to => "#{ARCHIVE_ROOT}/AppBuilder/#{destination}/styles",
             :from => FileList[APP_BUILDER_CORE_MIN_CSS].sub!(/dist\/styles\/(mobile|dataviz)/, 'dist/bundles/appbuilder.core/styles'),
             :root => 'dist/bundles/appbuilder.core/styles'

        zip_bundles.push("#{ARCHIVE_ROOT}/AppBuilder/#{destination}/styles")

        clean_task = "#{ARCHIVE_ROOT}/#{destination}"

        task clean_task do
            sh "find #{ARCHIVE_ROOT}/#{destination}/* -maxdepth 0 -type f -mtime +2 -exec rm {} \\;"
            sh "find #{ARCHIVE_ROOT}/#{destination}/download-builder/* -maxdepth 0 -type f -not -newermt 'today 00:00' -exec rm {} \\;"
        end

        zip_bundles.push(clean_task)

        zip_bundles
    end

    def changelogs(destination)
        [
            'professional.trial',
            'aspnetmvc.trial',
            'aspnet.core.trial',
            'php.trial',
            'jsp.trial'
        ].map do |bundle|
            path = File.join(ARCHIVE_ROOT, destination, 'changelogs')
            basename = versioned_bundle_name(bundle)

            xml_file = File.join(path, basename + '.xml')
            txt_file = File.join(path, basename + '.txt')

            file_copy :to => xml_file,
                      :from => "dist/bundles/#{bundle}.changelog.xml"

            file_copy :to => txt_file,
                      :from => "dist/bundles/#{bundle}.changelog.txt"

            [xml_file, txt_file]
        end
    end

    def map_archive_root drive
        sh "if not exist #{drive} ( net use #{drive} #{ARCHIVE_ROOT} /user:progress\\KendoBuildUser \"#{ADMIN_RELEASE_UPLOAD_PASS}\" /YES" )
    end

    { :production => "Production", :master => "Stable" }.each do |env, destination|
        namespace env do
            desc 'Build and publish ASP.NET MVC DLLs for #{destination} distribution'
            task :aspnetmvc_binaries => [ "mvc:binaries", "tests:aspnetmvc",
                                          "spreadsheet:binaries", "tests:spreadsheet",
                                          'demos:release', 'vs_scaffold:build' ] do
                map_archive_root 'L:'

                target_dir = "L:\\#{destination}\\binaries\\"

                sh "if not exist #{target_dir} ( mkdir #{target_dir} )"
                sh "xcopy dist\\binaries\\* #{target_dir} /E /Y"

                sh "xcopy plugins\\KendoScaffolder\\KendoScaffolder\\KendoScaffolderExtension\\bin\\Release\\*.vsix L:\\#{destination}\\binaries\\scaffolding\\ /Y"
            end

            desc 'Copy ASP.NET MVC DLLs from distribution archive'
            task :get_binaries do
                sh "cp -r #{ARCHIVE_ROOT}/#{destination}/binaries dist/binaries"
            end
        end
    end

    namespace :production do
        desc 'Run tests and VSDoc'
        task :tests => ["tests:Production", "vsdoc:production:test"]

        desc 'Update the /production build machine web site'
        task :demos => [ :get_binaries, 'demos:staging', 'download_builder:staging' ] do
            sync "dist/demos/staging/", "#{WEB_ROOT}/production/"
        end

        changelog = "#{WEB_ROOT}/changelog/index.html"
        write_changelog changelog, %w(components aspnetmvc)

        desc 'Package and publish bundles to the Production directory, and update the changelog'
        task :bundles => [
            :get_binaries,
            'bundles:all',
            'nuget:default',
            'demos:production',
            'demos:production_mvc',
            'download_builder:bundle',
            zip_targets("Production"),
            nuget_targets("Production"),
            changelogs("Production"),
            changelog
        ].flatten

        task :generate_mvc_api => [ :get_binaries, 'wrappers/mvc/src/Kendo.Mvc/bin/Release/Kendo.Mvc.xml', 'generate:mvc:api' ]
        task :generate_kendo_api => [ 'generate:php:api', 'generate:jsp:api' ]

        components_changelog_path = File.join("dist", "nuget", "changelog.xml")
        core_components_changelog_path = File.join("dist", "nuget", "changelog-core.xml")
        nuget_mvc_components_changelog_path = File.join("dist", "nuget", "changelog-mvc.xml")

        write_changelog(components_changelog_path, %w(components), [])
        write_changelog(nuget_mvc_components_changelog_path, %w(components aspnetmvc), [])
        write_changelog(core_components_changelog_path, %w(components aspnetmvc), PRO_WIDGETS)

        desc 'Upload NuGet packages to private repository'
        task :private_nuget => [ components_changelog_path, core_components_changelog_path, nuget_mvc_components_changelog_path] do
            map_archive_root 'L:'

            mkdir_p 'dist/nuget'

            # copy nuget packages
            source_files = "L:\\Production\\*#{VERSION}.nupkg"

            sh "xcopy #{source_files} dist\\nuget\\ /E /Y"

            # generate metadata xml
            template = ERB.new(File.read(File.join(File.dirname(__FILE__), 'build', 'nuget-metadata.xml.erb')), 0, '%<>')
            File.open("dist/nuget/#{VERSION}.xml", "w") do |f|
                f.write template.result(binding)
            end

            # run metadata tool
            Kernel.system [
                'Telerik.Metadata.Tool.exe',
                '-u', 'true',
                '-p', File.join(File.dirname(__FILE__), 'dist', 'nuget'),
                '-v', VERSION
            ].join(" "), {
                :chdir => 'c:\nuget-uploader\MetadataTool\\'
            }
        end
    end

    namespace :master do
        desc 'Runs test suite over the master branch'
        task :tests => ["tests:CI", "vsdoc:master:test", "intellisense:master:test", "type_script:master:test"]

        desc 'Update the /staging build machine web site'
        task :demos => [
            :get_binaries,
            'demos:staging',
            'download_builder:staging',
            'demos:staging_java',
            'demos:staging_php',
            'demos:staging_mvc'
        ] do
            sync "dist/demos/staging/", "#{WEB_ROOT}/staging/"
            sync "dist/download-builder-staging/", "#{WEB_ROOT}/download-builder-staging/"
            #sync "dist/demos/staging-java/", "#{TOMCAT_ROOT}/staging-java/"
            sync "dist/demos/staging-php/", "#{WEB_ROOT}/staging-php/"

            #TODO to make those things to happen on new build machine
            # Deploy MVC demos on kendoiis
            #remote = WinRemote.new "kendoiis.telerik.com"

            #sync "dist/aspnetmvc-demos/", "/mnt/kendo-iis/stable-demos-src/"

            #shares = "c:\\shares"
            #source = "#{shares}\\stable-demos-src"

            #remote.build("#{source}\\VS2012\\Kendo.Mvc.Examples.sln")
            #remote.build("#{source}\\VS2013\\Kendo.Mvc.Examples.sln")

            #remote.stop_iis()
            #remote.deploy("#{source}\\VS2012\\Kendo.Mvc.Examples", "#{shares}\\staging-mvc\\")
            #remote.deploy("#{source}\\VS2013\\Kendo.Mvc.Examples", "#{shares}\\staging-mvc5\\")
            #remote.start_iis()
        end

        desc 'Package and publish bundles to the Stable directory'
        task :bundles => [
            :get_binaries,
            'bundles:all',
            'demos:production',
            'nuget:default',
            NUGET_ZIPS,
            'download_builder:bundle',
            zip_targets("Stable"),
            nuget_targets("Stable"),
            changelogs("Stable")
        ].flatten

        task :generate_mvc_api => [ :get_binaries, 'wrappers/mvc/src/Kendo.Mvc/bin/Release/Kendo.Mvc.xml', 'generate:mvc:api' ]
        task :generate_kendo_api => [ 'generate:php:api', 'generate:jsp:api' ]
    end

    namespace :update do
        task :demos => [
            'demos:staging'
        ] do
            sync "dist/demos/staging/", "#{WEB_ROOT}/update/"
        end
    end

end

namespace :bundles do
    CLEAN.include('dist/bundles')

    desc('Clean bundle files')

    task :clean do
        rm_rf 'dist/bundles'
    end

    task :all => BUNDLES
end

Rake::TestTask.new do |t|
    t.test_files = FileList['build/codegen/tests/*.rb']
end

desc 'Build all bundles'
task :bundles =>  "bundles:all"

task :default => :bundles

