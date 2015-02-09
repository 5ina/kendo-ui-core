require 'kramdown'

module CodeGen
    MARKDOWN = FileList['docs/api/javascript/{ui,dataviz/ui}/*.md']
        .exclude('docs/api/javascript/ui/ui.md')
        .exclude('docs/api/javascript/ui/widget.md')
        .exclude('docs/api/javascript/ui/draggable.md')
        .exclude('docs/api/javascript/ui/droptarget.md')
        .exclude('docs/api/javascript/ui/droptargetarea.md')
        .exclude('docs/api/javascript/ui/validator.md')
        .include('docs/api/javascript/data/datasource.md')

class MarkdownParser

    def self.all(component_class = nil)
        MARKDOWN.map { |filename| self.read(filename, component_class) }
                .sort { |a, b| a.name <=> b.name }
    end

    def self.read(filename, component_class = nil)
        MarkdownParser.new.parse(File.read(filename), component_class)
    end

    def parse(markdown, component_class = nil)
        component_class ||= Component

        root = Kramdown::Parser::Markdown.parse(markdown)[0]

        header = root.children.find { |e| e.type == :header && e.options[:level] == 1 }

        component = component_class.new(component_settings(root))

        configuration = configuration_section(root)

        each_section(configuration) do |option, index|

            component.add_option(:name => section_name(option),
                                 :type => option_type(option),
                                 :default => option_default(option),
                                 :description => section_description(index, configuration))
        end

        fields = fields_section(root)

        each_section(fields) do |field, index|

            component.add_field(:name => section_name(field),
                                :type => option_type(field),
                                :description => section_description(index, fields))

        end

        class_methods = class_methods_section(root)
        each_section(class_methods) do |method, index|
            method = component.add_class_method(:name => section_name(method),
                                                :result => method_result(index, class_methods),
                                                :description => section_description(index, class_methods))

            parameters = class_methods.slice(index + 1, class_methods.size)

            add_parameters(method, parameters)

        end

        methods = methods_section(root)
        each_section(methods) do |method, index|
            method = component.add_method(:name => section_name(method),
                                          :result => method_result(index, methods),
                                          :description => section_description(index, methods))

            parameters = methods.slice(index + 1, methods.size)

            add_parameters(method, parameters)

        end

        events = events_section(root)

        each_section(events) do |event, index|

            event = component.add_event(:name => section_name(event),
                                        :description => section_description(index, events))

            options = events.slice(index + 1, events.size)

            add_options(event, options)
        end

        component
    end

    private

    def add_options(event, options)
        options.each_with_index do |element, index|

            level = element.options[:level]

            break if level && level < 4

            if element.type == :header && level == 5

                event.add_option(:name => section_name(element),
                                 :type => option_type(element),
                                 :description => section_description(index, options))

            end
        end
    end

    def add_parameters(method, parameters)
        parameters.each_with_index do |element, index|

            level = element.options[:level]

            break if level && level < 4

            if element.type == :header && level == 5

                name = section_name(element)

                break if name.start_with?('Example')

                method.add_parameter(:name => section_name(element),
                                     :type => option_type(element),
                                     :optional => optional(element),
                                     :description => section_description(index, parameters))

            end
        end
    end

    def method_result(index, siblings)
        siblings = siblings.slice(index + 1, siblings.size)

        index = siblings.find_index { |e| e.options[:raw_text] == 'Returns' }

        return unless index

        next_heading_index = siblings.find_index { |e| e.type == :header && e.options[:level] < 4 }

        next_heading_index = siblings.size unless next_heading_index

        return unless index < next_heading_index

        description = siblings.slice(index, siblings.size).find {|e| e.type == :p}

        {
            :type => option_type(description),
            :description => section_description(index, siblings)
        }
    end

    def configuration_section(element)
        start_index = child_index(element, 'Configuration')

        end_index = child_index(element, 'Methods')

        end_index = child_index(element, 'Events') if end_index == element.children.size

        element.children.slice(start_index..end_index)
    end

    def fields_section(element)
        start_index = child_index(element, 'Fields')

        end_index = child_index(element, 'Methods')

        element.children.slice(start_index..end_index)
    end

    def methods_section(element)
        start_index = child_index(element, 'Methods')

        end_index = child_index(element, 'Events')

        element.children.slice(start_index..end_index)
    end

    def class_methods_section(element)
        start_index = child_index(element, 'Class methods')

        end_index = child_index(element, 'Configuration')
        end_index = child_index(element, 'Methods') if end_index == element.children.size

        element.children.slice(start_index..end_index)
    end

    def events_section(element)
        start_index = child_index(element, 'Events')

        element.children.slice(start_index..element.children.size)
    end

    def child_index(element, text)
        index = element.children.find_index {|e| e.options[:raw_text] == text}

        index = element.children.size unless index

        index
    end

    def each_section(configuration)
        configuration.each_with_index do |element, index|
            next if index == 0

            break if element.type == :header && element.options[:level] < 3

            if element.type == :header && element.options[:level] == 3
                yield element, index
            end
        end
    end

    def component_settings(element)
        header = element.children.find {|e| e.type == :header && e.options[:level] == 1}
        parts = header.options[:raw_text].split(/\s?+:\s?+/)

        {
            :name => parts[0],
            :base => parts[1]
        }
    end

    def section_name(element)
        element_value find_text_child(element)
    end

    def option_type(element)
        child = element.children.find {|e| e.type == :codespan }

        element_value child
    end

    def optional(element)
        child = element.children.find {|e| e.type == :em }

        return false unless child

        element_text(child).include?('optional')
    end

    def option_default(element)
        child = element.children.find {|e| e.type == :em }

        return unless child

        default = element_value find_text_child(child)


        default.sub(/default\s*:/i, '').sub('(', '').sub(')', '').strip
    end

    def section_description(index, siblings)
        description = ""

        siblings.slice(index + 1, siblings.size).each do |element|
            break if element.type == :header

            if element.type == :p
                element.children.each_with_index do |child, index|
                    next if index == 0 && child.type == :codespan

                    description += element_text(child)
                end
            end
        end

        description.strip
    end

    def find_text_child(element)
        element.children.find {|e| e.type == :text } if element
    end

    def element_text(element)
        if element.children.any?
            element.children.map { |child| element_text(child) }.join
        else
            element.value || ""
        end
    end

    def element_value(element)
        element.value.strip if element
    end
end

end # module CodeGen
