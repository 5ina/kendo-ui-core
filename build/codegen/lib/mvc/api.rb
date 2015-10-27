module CodeGen::MVC

    NAMESPACES = [
        'Kendo.Mvc.UI.Fluent',
        'Kendo.Mvc.UI',
        'Kendo.Mvc.Extensions',
        'Kendo.Mvc'
    ]

    COMPONENT = ERB.new(%{---
title: <%= name %>
---

# <%= full_name %>
<%= summary %>
<% if !fields.empty? %>

## Fields

<%= fields.map { |field| field.to_markdown }.join %>
<% end %>
<% if !properties.empty? %>

## Properties

<%= properties.map { |property| property.to_markdown }.join %>
<% end %>
<% if !methods.empty? %>

## Methods

<%= methods.map { |method| method.to_markdown }.join %>
<% end %>
})

    class Component
        attr_reader :full_name, :name, :methods, :properties, :fields, :type, :namespace, :summary

        def initialize(namespace, type, summary)
            @namespace = namespace
            @summary = summary
            @type = type
            @full_name = @type.sub(/`\d/, '')
            @name = @full_name.sub(@namespace + '.', '')
            @methods = []
            @properties = []
            @fields = []
        end

        def empty?
            @methods.empty? && @fields.empty? && @properties.empty? && @summary
        end

        def js_name
            name.sub('Simple', '').sub('EventBuilderBase', '').sub('EventBuilder', '').downcase
        end

        def to_markdown
            COMPONENT.result(binding)
        end
    end

METHOD = ERB.new(%{
### <%= method_name %>
<%= summary %>
<% if owner.name.include?('EventBuilder') %>
For additional information check the [<%= js_name %> event](<%= js_api_link %>#events-<%= js_name %>) documentation.
<% end %>
<% if !parameters.empty? %>
#### Parameters
<%= parameters.each_with_index.map { |parameter, index| parameter.to_markdown(parameterTypes[index])}.join %>
<% end %>
<% if returns %>
#### Returns
<%= returns %>
<% end %>
<% examples.each do |example| %>
#### Example (<%= example.lang %>)
<%= example.to_markdown %>
<% end %>
})
    class Method < Struct.new(:name, :summary, :parameters, :examples, :returns, :owner)
        def to_markdown
            parameterTypes = /\(([^\)]*)\)$/.match(name)[1].split('|') if parameters.any?

            METHOD.result(binding)
        end

        def js_name
            name.gsub(/\(.*\)/, '').camelize
        end

        def js_api_link
            "/api/javascript/#{namespace}/#{owner.js_name}"
        end

        def method_name
            name.gsub('|', ',').gsub(/</,'\\<').gsub(/>/, '\\>').gsub(/\((.*)\)/, '(\1)').sub(/(.*)T\d\(/, '\1(')
        end

        def namespace
            return 'dataviz/ui' if owner.name =~ /Chart|Gauge|Sparkline|StockChart|Map|Barcode|Diagram|LinearGauge|QRCode|RadialGauge|TreeMap/i
            return 'data' if owner.name.include?('DataSource')
            'ui'
        end
    end

PARAMETER = ERB.new(%{
##### <%= name %> <%= type %>
<%= summary %>
})
    class Parameter < Struct.new(:name, :summary)
        def to_markdown(type)
            known = false

            NAMESPACES.each do |namespace|
                if type.include?(namespace)
                    known = true

                    type = type.sub(/#{namespace}\.(\w+)/, "[#{namespace}.\\1](/api/aspnet-mvc/#{namespace}/\\1)")
                    break
                end
            end

            type = "`#{type}`" unless known

            PARAMETER.result(binding)
        end

    end

    class Example < Struct.new(:code, :lang, :component, :method)
        def to_markdown
            source = code.strip.split("\n").map { |line| line.strip }.join("\n")

            length = source.size

            open = source.scan(/\(/).size

            close = source.scan(/\)/).size

            raise "Opening parentheses are more than closing in:\n #{source}\n method: #{component.name}.#{method}" if open > close
            raise "Closing parentheses are more than opening in:\n #{source}\n method: #{component.name}.#{method}" if open < close

            open = source.scan(/}/).size

            close = source.scan(/{/).size

            raise "Opening braces are more than closing in:\n #{source}\n method: #{component.name}.#{method}" if open > close
            raise "Closing braces are more than opening in:\n #{source}\n method: #{component.name}.#{method}" if open < close

            indent = 1

            idx = 0

            line = result = ''

            while idx < length
                ch = source[idx]

                line += ch

                idx += 1

                if ch == "\n" || idx == length
                    if line =~ /^(}|<\/text>)?\)$/ || line =~ /^{$/
                        indent -=1
                    end

                    if indent == 2 && line =~ /^%>$/
                        indent -= 1
                    end

                    raise "Indent can't be less than one:\n #{source} when:\n #{result} at:\n #{line} \n method: #{component.name}.#{method}" if indent < 1

                    indent.times { result += '    ' }

                    result += line

                    if line =~ /^(@\(|<%[ :])/ || line =~ /@<text>$/ || line =~ /^{$/ || line =~ /\($/
                        indent += 1
                    end

                    if line =~ /=>.*$/
                        open = line.scan(/\(/).size

                        close = line.scan(/\)/).size

                        indent += 1 if open > close
                    end

                    line = ''
                end
            end

            result
        end
    end

    PROPERTY = ERB.new(%{
### <%= name %>

<%= summary %>
})
    class Property < Struct.new(:name, :summary)
        def to_markdown
            PROPERTY.result(binding)
        end
    end

    FIELD = ERB.new(%{
### <%= name %>
#
<%= summary %>
})
    class Field < Struct.new(:name, :summary)
        def to_markdown
            FIELD.result(binding)
        end
    end

    module CodeGen::MVC::API
        class Generator
            include Rake::DSL

            def initialize(path)
                @path = path
            end

            def component(component)
                return if component.empty?

                filename = "#{@path}#{component.namespace}/#{component.name}.md"

                ensure_path(filename)

                File.write(filename, component.to_markdown)
            end

        end

        class XmlParser
            def initialize(filename)
                @filename = filename
            end

            def components
                xml = File.read(@filename)

                xml = xml.gsub(/<see cref="([^"]*)"\s*\/>/) do |s|
                    $1.sub(/^.*?(\w+)$/, '\1')
                end

                document = Nokogiri.XML(xml).xpath("/doc/members").first

                document.xpath("member[starts-with(@name,'T:')]").each do |member|
                    type = member['name'][2..-1]

                    namespace = type.split('.')[0...-1].join('.')

                    summary = parse_summary(member)

                    next unless NAMESPACES.include?(namespace)

                    component = Component.new(namespace, type, summary)

                    prefix = component.type + '.'

                    parse_methods(prefix, document, component) do |method|
                        component.methods.push(method)
                    end

                    parse_properties(prefix, document) do |property|
                        component.properties.push(property)
                    end

                    parse_fields(prefix, document) do |field|
                        component.fields.push(field)
                    end

                    yield component if block_given?
                end

            end

            def parse_methods(prefix, document, component)
                document.xpath("member[starts-with(@name,'M:#{prefix}')]").each do |method|
                    name = method['name']

                    next if name =~ /#ctor/

                    name = parse_name(prefix, name)

                    summary = parse_summary(method)

                    parameters = parse_parameterss(method)

                    examples = parse_examples(method, component, name)

                    returns = parse_returns(method)

                    yield Method.new(name, summary, parameters, examples, returns, component) if block_given?
                end
            end

            def parse_properties(prefix, document)
                document.xpath("member[starts-with(@name,'P:#{prefix}')]").each do |property|
                    name = parse_name(prefix, property['name'])

                    summary = parse_summary(property)

                    yield Property.new(name, summary) if block_given?
                end
            end

            def parse_fields(prefix, document)
                document.xpath("member[starts-with(@name,'F:#{prefix}')]").each do |field|
                    name = parse_name(prefix, field['name'])

                    summary = parse_summary(field)

                    yield Field.new(name, summary) if block_given?
                end
            end

            def parse_parameterss(method)
                method.xpath('param').map do |parameter|
                    name = parameter['name']
                    summary = parameter.text.strip

                    Parameter.new(name, summary)
                end
            end

            def parse_examples(method, component, name)
                method.xpath('example/code').map do |code|
                    lang = code['lang']
                    lang = 'ASPX' unless lang
                    lang = 'ASPX' if lang == 'CS'
                    Example.new(code.text, lang, component, name)
                end
            end

            def parse_returns(method)
                returns = method.xpath('returns').first

                return returns.text.strip if returns
            end

            def parse_summary(node)
                summary = node.xpath('summary').first

                return summary.text.strip if summary
            end

            def parse_name(prefix, name)
                name = name[2..-1].sub(prefix, '')
                result = ''
                idx = 0
                length = name.size
                open = 0
                close = 0

                while idx < length
                    ch = name[idx]
                    idx +=1

                    if ch == '{'
                        open +=1
                        result += '<'
                    elsif ch == '}'
                        close +=1
                        result += '>'
                    elsif ch == ','
                        if (close != open)
                            result += ','
                        else
                            result += '|'
                        end
                    elsif ch == '`'
                        ticks = 0

                        ch = name[idx]
                        idx +=1

                        while ch == '`'
                            ch = name[idx]
                            idx +=1
                            ticks +=1
                        end

                        if open
                            result += 'T'
                            result += ticks.to_s if ticks > 0
                        else
                            result += '<T'
                            result += ticks.to_s if ticks > 0
                            result += '>'
                        end
                    else
                        result += ch
                    end
                end

                result
            end

        end
    end
end
