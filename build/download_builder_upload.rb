require 'selenium-webdriver'
require 'singleton'
require 'version'

class TelerikDownloadBuilderBot
    include Singleton

    attr_reader :driver

    def initialize

        @driver = Selenium::WebDriver.for(:firefox)
        @driver.get(SITE_URL + "/sitefinity")

        #driver.find_element(:xpath, "//input[contains(@id,'_UserName')]").send_keys SITE_LOGIN
        #driver.find_element(:xpath, "//input[contains(@id,'_Password')]").send_keys SITE_DOWNLOAD_BUILDER_UPLOAD_PASS
        #click_and_wait("Log in with Telerik", "Legacy Dashboard")
        driver.find_element(:xpath, "//input[contains(@id,'username')]").send_keys SITE_LOGIN
        driver.find_element(:xpath, "//input[contains(@id,'password')]").send_keys SITE_DOWNLOAD_BUILDER_UPLOAD_PASS
        click_element(driver.find_element(:xpath, "//button[contains(@id,'LoginButton')]"))
    end

    def find(selector)
        driver.find_element(:css, selector)
        rescue
        screenshot("No_such_element_" + selector)
        return false
    end

    def click_element(element)
      element.click
      rescue
      screenshot("Click_Element_Failed_For_" + element.attribute("id"))
    end

    def click_and_wait(link, title)
        driver.find_element(:link, link).click
        wait_for_title(title)
        rescue
        screenshot("Click_Element_Failed_For_" + element.attribute("id"))
    end

    def wait_for_title(title)
        Selenium::WebDriver::Wait.new(:timeout => 30).until { driver.title.downcase.start_with? title }
        rescue
        screenshot("Browser_Timeout_On_Page_Title_Wait")
    end
    def wait_for_element(css)
        Selenium::WebDriver::Wait.new(:timeout => 30).until { driver.find_element(:css, css) }
        rescue
        screenshot("Browser_Timeout_On_Element_Wait")
    end
    def wait_for_validation(element_path)
        Selenium::WebDriver::Wait.new(:timeout => 30).until { driver.find_element(:xpath, element_path) }
        rescue
        screenshot("Browser_Timeout_On_Validation")
    end
    def screenshot(failed_operation)
      if failed_operation.nil?
        failed_operation = "null"
      end

      Dir.mkdir("build/screenshots") if !File.directory?("build/screenshots")
      @driver.save_screenshot(File.join("build/screenshots", "#{failed_operation}.jpg"))
    end
    def execute_script(script)
      #output filename and code line number as part of the screenshot name
      caller_array = caller.first.split(":")
      file_name = caller_array[1].split("/")[6] 
      driver.execute_script(script)
      rescue 
      screenshot("Script_Execution_Failed_In_" + file_name + "_line_" + caller_array[2])
    end
    def set_upload_path(element, path)
      element.send_keys(path)
      rescue
      screenshot("Upload_Path_Setting_Failed_For_" + path)
    end
end

def upload_download_builder_files()

    bot = TelerikDownloadBuilderBot.instance
 
    bot.click_element(bot.driver.find_element(:xpath, "//span[contains(text(), 'Administration')]"))
    bot.click_element(bot.driver.find_element(:xpath, "//span[contains(text(), 'Upload Custom Downloads package')]"))
    bot.wait_for_title("Upload Custom Downloads package")

    if SERVICE_PACK_NUMBER != nil
        archive_folder_name = "Q#{VERSION_Q} #{VERSION_YEAR}/Q#{VERSION_Q} #{VERSION_YEAR} SP#{SERVICE_PACK_NUMBER}/changelogs"
    else
        archive_folder_name = "Q#{VERSION_Q} #{VERSION_YEAR}/Q#{VERSION_Q} #{VERSION_YEAR}/#{VERSION.gsub('.', '_')}/changelogs"
    end

    versioned_bundle_archive_path = File.join(RELEASE_ROOT, VERSION_YEAR.to_s, archive_folder_name)

    upload_files_and_test(bot, versioned_bundle_archive_path)
end
def upload_files_and_test(bot, archive_path)
  if ENV["DRY_RUN"]
    return if !bot.execute_script("if($find($telerik.$('[id$=\"_ddlAvailableVersions\"]').attr('id')).get_text() == '2014.1 318'){ return true;}")
  else
    return if !bot.execute_script("if($find($telerik.$('[id$=\"_ddlAvailableVersions\"]').attr('id')).get_text() == '#{VERSION}'){ return true;}")
  end
      version_string = VERSION.split(".")
      version_for_db = version_string[0] + "." + version_string[1] + " " + version_string[2]

      #upload zip file  
      full_path = File.expand_path(archive_path + "/#{version_for_db}.zip", File.join(File.dirname(__FILE__), ".."))

      element = bot.driver.find_element(:xpath, "//div[contains(@id,'ruUploadPackage')]")
      upload_id = element.attribute("id")

      upload_db_file(bot, upload_id, full_path)

      #upload js config file 
      full_path = File.expand_path(archive_path + "/kendo-config.#{version_for_db}.js", File.join(File.dirname(__FILE__), ".."))

      element = bot.driver.find_element(:xpath, "//div[contains(@id,'ruUploadJsConfigs')]")
      upload_id = element.attribute("id")

      upload_db_file(bot, upload_id, full_path)

      bot.click_element(bot.find("[value='Upload']"))
      sleep(20)
      bot.wait_for_validation("//div[contains(text(), 'successfully')]")
      sleep(7)
      bot.click_element(bot.driver.find_element(:xpath, "//input[contains(@id, '_btnDownload')]"))
end
def upload_db_file(bot, upload_id, full_path)
    bot.execute_script("
                (function (module, $) {
                    var upload = $find('#{upload_id}');
                    var plugins = ['Flash', 'Silverlight', 'FileApi'];

                    $('##{upload_id}ListContainer').remove();
                    $(upload.get_element()).off();
                    upload._uploadModule.dispose();

                    for (var i = 0; i < plugins.length; i++) {
                        module[plugins[i]].isAvailable = function () { return false; };
                    }
                    upload.initialize();
                })(Telerik.Web.UI.RadAsyncUpload.Modules, $telerik.$);")

    full_path.gsub!('/', '\\') unless PLATFORM =~ /linux|darwin/
    bot.set_upload_path(bot.driver.find_element(:css, "##{upload_id} input[type=file]"), full_path)
    bot.wait_for_element("##{upload_id} .ruRemove")
end
