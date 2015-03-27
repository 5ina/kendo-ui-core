require 'selenium-webdriver'
require 'singleton'
require 'version'

class TelerikReleaseNotesBot
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
        
        @products = ["Kendo UI", "UI for ASP.NET MVC", "UI for JSP", "UI for PHP"]

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
    def get_select(title)
        element = driver.find_element(:xpath, "//label[text()='#{title}']/..//select")  
        select_element = Selenium::WebDriver::Support::Select.new(element)
        return select_element
    end
    def fetch_product()
      return @products.pop()
    end
    def products()
      return @products
    end
end

def set_path_and_upload()

    bot = TelerikReleaseNotesBot.instance

    #Beta release
    if ENV["BETA"] != nil
      if ENV["DRY_RUN"]
        archive_folder_name = "Q#{VERSION_Q} #{VERSION_YEAR}/DRY_RUN_BETA/changelogs"
      else
        archive_folder_name = "Q#{VERSION_Q} #{VERSION_YEAR}/BETA/changelogs"
      end    
    else
      #official release
      if SERVICE_PACK_NUMBER != nil
        archive_folder_name = "Q#{VERSION_Q} #{VERSION_YEAR} SP#{SERVICE_PACK_NUMBER}/changelogs"
      else
        archive_folder_name = "Q#{VERSION_Q} #{VERSION_YEAR}/Q#{VERSION_Q} #{VERSION_YEAR}/changelogs"
      end
    end 

    archive_path = File.join(RELEASE_ROOT, VERSION_YEAR.to_s, archive_folder_name)

    upload_release_notes(bot, archive_path) 
end
def upload_release_notes(bot, archive_path)
    if bot.products.size > 0
      navigate_to_import_form(bot)
      upload_files_and_validate(bot, archive_path, bot.fetch_product)
    else
       bot.driver.quit
    end
end
def navigate_to_import_form(bot)
    bot.click_element(bot.driver.find_element(:xpath, "//span[contains(text(), 'Administration')]"))
    bot.click_element(bot.driver.find_element(:xpath, "//span[contains(text(), 'Import Release Notes')]"))
    bot.wait_for_title("Import Release Notes")
end
def upload_files_and_validate(bot, archive_path, productName)

    set_fields_data(bot, productName)
    full_path = String.new

    case productName
      when "Kendo UI"
         full_path = File.expand_path(archive_path + "/telerik.kendoui.professional.#{VERSION}.trial.xml", File.join(File.dirname(__FILE__), ".."))
      when "UI for ASP.NET MVC"
        full_path = File.expand_path(archive_path + "/telerik.ui.for.aspnetmvc.#{VERSION}.trial.xml", File.join(File.dirname(__FILE__), ".."))
      when "UI for JSP"
        full_path = File.expand_path(archive_path + "/telerik.ui.for.jsp.#{VERSION}.trial.xml", File.join(File.dirname(__FILE__), ".."))
      when "UI for PHP"
        full_path = File.expand_path(archive_path + "/telerik.ui.for.php.#{VERSION}.trial.xml", File.join(File.dirname(__FILE__), ".."))
    end
    
    element = bot.driver.find_element(:xpath, "//input[contains(@id,'ReleaseNoteFileUploader')]")
    upload_id = element.attribute("id")
    upload_relnotes_file(bot, upload_id, full_path)
    
    sleep(5)

    bot.click_element(bot.driver.find_element(:xpath, "//a[contains(@id,'ImportReleaseNotesButton')]"))

    sleep(3)
    bot.wait_for_validation("//div[contains(text(), 'successfully')]")

    upload_release_notes(bot, archive_path)

end
def set_fields_data(bot, productName)
    #Beta release notes
    if ENV["BETA"] != nil
      bot.execute_script("$('[id$=\"_TitleTb\"]').val('Q#{VERSION_Q} #{VERSION_YEAR} Beta')")
      #due to mandatory non-empty value requirement (form validation bug)
      bot.execute_script("$('[id$=\"_ProductMinorVersionTb\"]').val('11')")
      bot.execute_script("$('[id$=\"_ReleaseTypeRadioButtons_2\"]').click()")  
    else
    #official release notes
      if SERVICE_PACK_NUMBER != nil
        bot.execute_script("$('[id$=\"_TitleTb\"]').val('Q#{VERSION_Q} #{VERSION_YEAR} SP#{SERVICE_PACK_NUMBER}')")
        bot.execute_script("$('[id$=\"_ProductMinorVersionTb\"]').val('#{SERVICE_PACK_NUMBER}')")
        bot.execute_script("$('[id$=\"_ReleaseTypeRadioButtons_1\"]').click()")
      else
        bot.execute_script("$('[id$=\"_TitleTb\"]').val('Q#{VERSION_Q} #{VERSION_YEAR}')")
        #due to mandatory non-empty value requirement (form validation bug)
        bot.execute_script("$('[id$=\"_ProductMinorVersionTb\"]').val('11')")
        bot.execute_script("$('[id$=\"_ReleaseTypeRadioButtons_0\"]').click()")
      end
    end 
    bot.execute_script("$('[id$=\"_ReleaseVersionTb\"]').val('#{VERSION}')") 

    date = DateTime.now.strftime('%d/%m/%Y')
    bot.execute_script("$find($telerik.$('[id$=\"_ReleaseDateDatePicker_dateInput\"]').attr('id')).set_value('#{date}')")

    option_select = bot.get_select("Product")
    option_select.select_by(:text, productName)

end
def upload_relnotes_file(bot, upload_id, full_path)
    full_path.gsub!('/', '\\') unless PLATFORM =~ /linux|darwin/
    bot.set_upload_path(bot.driver.find_element(:css, "##{upload_id}"), full_path)
end
