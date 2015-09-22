require 'tasks'

TESTS = FileList["tests/**/*"]
DEPS = [MIN_JS.sub("dist/js", "src").sub("min.js", "js"), FileList['styles/**/*.*'], KENDO_CONFIG_FILE, TESTS].flatten
SUPPORTED_JQUERY_VERSIONS = ["1.11.3", "2.1.4"]

namespace :tests do
    task :java do
        mvn(POM, 'clean test')
    end

    task :aspnetmvc do
        msbuild "wrappers/mvc/Kendo.Mvc.sln"
        sh "build/xunit/xunit.console.clr4.exe wrappers/mvc/tests/Kendo.Mvc.Tests/bin/Release/Kendo.Mvc.Tests.dll"

        # Commented until tests stop failing
        #copy_dpl_binaries
        #msbuild DPL_ROOT + '/Telerik.Web.Spreadsheet.sln', "/p:Configuration=Debug-NET45"
        #sh "build/xunit-2.0/xunit.console.exe #{DPL_ROOT}/Telerik.Web.Spreadsheet.Tests/bin/Debug-NET45/Telerik.Web.Spreadsheet.Tests.dll"
    end

    desc "Run tests in supported jQuery versions"
    task :jquery => DEPS do
        SUPPORTED_JQUERY_VERSIONS.each do |version|
            grunt_xvfb "ci", "--junit-results=jquery-#{version}-test-results.xml", "--single-run=true", "--jquery=#{version}"
        end
    end

    desc "Run tests in firefox"
    task :firefox => DEPS do
        grunt_xvfb "ci", "--junit-results=firefox-test-results.xml", "--single-run=true", "--browser=Firefox"
    end

    %w[CI Production TZ].each do |env|
        output = "#{env}-test-results.xml"

        file output => DEPS do |t|
            grunt_xvfb "jshint", "ci", "--junit-results=#{output}", "--single-run=true"
        end

        desc "Run #{env} tests"
        task env => [output, :java] do
            sh "touch #{output}"
        end
    end
end
