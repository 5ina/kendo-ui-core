require 'erb'
require 'codegen/lib/options'
require 'codegen/lib/markdown_parser'
require 'codegen/lib/component'

TYPE_SCRIPT = ERB.new(File.read("build/codegen/lib/type_script/kendo.ts.erb"), 0, '%<>')

module CodeGen::TypeScript
    EXCLUDE = FileList[
        "docs/api/javascript/{kendo,class,router,view,layout,observable,drawing}.md",
        'docs/api/javascript/data/{node,binder,datasource,observableobject,observablearray,model,treelistmodel,treelistdatasource,pivotdatasource,ganttdatasource,gantttask,ganttdependencydatasource,ganttdependency,hierarchicaldatasource,schedulerdatasource,schedulerevent}.md',
        'docs/api/javascript/ui/{widget,draggable,droptarget,droptargetarea}.md',
        'docs/api/javascript/mobile/application.md',
        'docs/api/javascript/mobile/ui/mobilewidget.md',
        'docs/api/javascript/ui/ui.md'
    ]

    TYPES = {
        'Number' => 'number',
        'String' => 'string',
        'Boolean' => 'boolean',
        'Document' => 'Document',
        'Range' => 'Range',
        'Object' => 'any',
        'Array' => 'any',
        'Date' => 'Date',
        'Function' => 'Function',
        'Selection' => 'Selection',
        'Element' => 'Element',
        'HTMLCollection' => 'HTMLCollection',
        'jQuery' => 'JQuery',
        'jqXHR' => 'JQueryXHR',
        'jQueryEvent' => 'JQueryEventObject',
        'jQuery.Event' => 'JQueryEventObject',
        'Promise' => 'JQueryPromise<any>',
        'Selector' => 'string',
        'TouchEvent' => 'kendo.mobile.ui.TouchEventOptions',
        'Point' => 'kendo.mobile.ui.Point'
    }

    def self.type(type)
        return type if type.start_with?('kendo')

        result = TYPES[type]

        raise "No TypeScript mapping for type #{type}" unless result

        result
    end

    module Declaration
        attr_accessor :jsdoc

        def type_script_declaration
            declaration = "#{name}?: #{type_script_type};"

            if jsdoc
                #indentation is important!
                declaration = %{/**
        #{description}
        @member {#{type_script_type}}
        */
        #{declaration}}
            end

            declaration
        end

        def type_script_type
            raise "#{name} doesn't have a type specified" unless @type

            return 'any' if @type.size > 1

            CodeGen::TypeScript.type(@type[0])
        end
    end

    MANUALLY_GENERATED = {
        'schema' => ['model'],
        'column' => ['editor'],
        'transport' => ['parameterMap']
    }

    module Options
        include Declaration

        def field_class
            Field
        end

        def option_class
            Option
        end

        def composite_option_class
            CompositeOption
        end

        def method_class
            Method
        end

        def array_option_class
            ArrayOption
        end

        def event_class
            Event
        end

        def unique_options
            composite = composite_options

            result = options.find_all {|o| o.composite? || !composite.any? { |composite| composite.name == o.name } }

            if MANUALLY_GENERATED.has_key?(@name)
                result.delete_if { |o| MANUALLY_GENERATED[@name].include?(o.name) }
            end

            result
        end

        def jsdoc=(value)
            @jsdoc = value

            options.each { |option| option.jsdoc = value }
        end
    end

    class Event < CodeGen::Event
        include Options

        def option_class
            EventOption
        end

        def composite_option_class
            CompositeEventOption
        end

        def type_script_type
            return @owner.type_script_type + @name.pascalize + 'Event' if @options.size > 0

            @owner.type_script_type + 'Event'
        end

        def type_script_declaration
            declaration = "#{name}?(e: #{type_script_type}): void;";

            if jsdoc
                #indentation is important!
                declaration = %{/**
        #{description}
        */
        #{declaration}}
            end

            declaration
        end
    end

    FIELD_OVERRIDES = {
        'Grid' => {
            'columns' => 'GridColumn[]'
        }
    }

    class Field < CodeGen::Field
        attr_accessor :jsdoc

        def type_script_type
            raise "#{name} doesn't have a type specified" unless @type

            if FIELD_OVERRIDES.has_key?(@owner.name)
                overrides = FIELD_OVERRIDES[@owner.name]

                if overrides.has_key?(@name)
                    return overrides[name]
                end
            end

            CodeGen::TypeScript.type(@type)
        end

        def type_script_declaration

            declaration = "#{name}: #{type_script_type};"

            if jsdoc
                #indentation is important!
                declaration = %{/**
                #{description}
                */
                #{declaration}%}
            end

            declaration
        end
    end

    class EventOption < CodeGen::EventOption
        include Declaration

        def composite_option_class
            CompositeEventOption
        end

    end

    EVENT = ERB.new(File.read("build/codegen/lib/type_script/event.ts.erb"), 0, '%<>')

    class CompositeEventOption < CodeGen::CompositeEventOption
        include Options

        def type_script_type
            @owner.type_script_type + @name.pascalize
        end

        def type_script_interface
            EVENT.result(binding)
        end
    end

    class ParameterCombinations
        include Enumerable

        def initialize(parameters)
            if parameters.any?
                type_indices = parameters.map do |p|
                    raise "The #{p.name} parameter of #{p.owner.owner.name}.#{p.owner.name} does not have a type set" unless p.type
                    0.step(p.type.size-1).to_a
                end

                type_indices_product = type_indices[0].product(*type_indices[1..type_indices.length])

                # explode parameters with multiple types to an array of parameters with a single type
                parameters = type_indices_product.map do |combination|
                    parameters.each_with_index.map do |p, index|
                        param = p.clone()
                        param.type = CodeGen::TypeScript.type(param.type[combination[index]])
                        param
                    end
                end

                # remove duplicate signatures, caused by type translation
                @combinations = parameters.uniq do |params|
                    params.map { |p| p.type }.join(':')
                end
            else
                @combinations = [[]]
            end
        end

        def each &block
            @combinations.each { |p| block.call p }
        end
    end

    METHOD_JSDOC = ERB.new(%{/**
        <%= description %>
        @method
        <%- combination.each do |parameter| -%>
        @param <%= parameter.name %> - <%= parameter.description %>
        <%- end -%>
        <%- if result -%>
        @returns <%= result.description %>
        <%- end -%>
        */
        <%= declaration %>}, 0, '-')

    class Method < CodeGen::Method

        attr_accessor :jsdoc

        def result_class
            Result
        end

        def parameter_class
            Parameter
        end

        def type_script_type
            @owner.type_script_type + @name.pascalize
        end

        def type_script_parameters(parameters)
            params = parameters.map do |p|
                "#{p.name}#{p.optional ? "?" : ""}: #{p.type}"
            end

            params.join(', ')
        end

        def type_script_declarations
            combinations = ParameterCombinations.new(unique_parameters)

            if @result
                result_type = @result.type_script_type
            else
                result_type = 'void'
            end

            combinations.map do |combination|

                declaration = "#{name}(#{type_script_parameters(combination)}): #{result_type}"

                declaration = METHOD_JSDOC.result(binding) if jsdoc

                declaration + ';'
            end
        end

        def unique_parameters
            composite = composite_parameters

            parameters.find_all {|p| p.composite? || !composite.any? { |composite| composite.name == p.name } }
        end
    end

    class Parameter < CodeGen::Parameter
        include Declaration

        def composite_parameter_class
            CompositeParameter
        end
    end

    PARAMETER = ERB.new(File.read("build/codegen/lib/type_script/parameter.ts.erb"), 0, '%<>')

    class CompositeParameter < CodeGen::CompositeParameter
        include Declaration

        def parameter_class
            Parameter
        end

        def type_script_type
            @owner.type_script_type + @name.pascalize
        end

        def type_script_interface
            PARAMETER.result(binding)
        end

        def unique_parameters
            composite = composite_parameters

            parameters.find_all {|p| p.composite? || !composite.any? { |composite| composite.name == p.name } }
        end
    end

    class Result < CodeGen::Result
        def type_script_type
            CodeGen::TypeScript.type(@type.split('|')[0].strip)
        end
    end

    COMPONENT = ERB.new(File.read("build/codegen/lib/type_script/component.ts.erb"), 0, '%<>')

    class Component < CodeGen::Component
        include Options

        def plugin
            return 'Mobile' + @name if @full_name.include?('mobile')

            @name
        end

        def jsdoc=(value)
            super(value)

            methods.each { |option| option.jsdoc = value }
            events.each  { |event| event.jsdoc = value }
            fields.each  { |field| field.jsdoc = value }
        end

        def mobile?
            @full_name.include?('mobile.')
        end

        def fx?
            @full_name.include?('FX')
        end

        def type_script_base_class
            if @base
                return @base
            end

            if config_object?
                return
            end

            if fx?
                return
            end

            if widget?
                return mobile? ? 'kendo.mobile.ui.Widget' : 'kendo.ui.Widget'
            end

            'Observable'
        end

        def config_object?
            @name =~ /Options$/
        end

        def type_script_kind
            if config_object?
                return 'interface'
            end

            'class'
        end

        def namespace
            @full_name.sub('.' + @name, '')
        end

        def type_script_options_type
            if config_object?
                return
            end

            type_script_type + 'Options'
        end

        def type_script_event_type
            if config_object?
                return
            end

            type_script_type + 'Event'
        end

        def type_script_class
            COMPONENT.result(binding)
        end

        def type_script_type
            name
        end

        def add_method(settings)
            description = settings[:description]
            result = settings[:result]

            if description =~ /Gets?\/Sets?/i || description =~ /gets?\s+or\s+sets?/i

                settings[:result] = nil

                super(:description => description,
                      :name => settings[:name],
                      :result => result)
            end

            super(settings)
        end
    end

    COMPOSITE = ERB.new(File.read("build/codegen/lib/type_script/composite_option.ts.erb"), 0, '%<>')

    class CompositeOption < CodeGen::CompositeOption
        include Options

        def type_script_type
            @owner.type_script_type + @name.pascalize
        end

        def type_script_interface
            COMPOSITE.result(binding)
        end
    end

    class Option < CodeGen::Option
        include Options

        def type_script_type
            return 'any' if @type.size > 1

            CodeGen::TypeScript.type(@type[0])
        end

        def jsdoc=(value)
            @jsdoc = value
        end
    end

    class ArrayOption < CompositeOption
        include CodeGen::Array

        def item_class
            ArrayItem
        end

        def type_script_interface
            item.type_script_interface
        end

        def type_script_declaration
            "#{name}?: #{item.type_script_type}[];"
        end
    end

    class ArrayItem < CompositeOption
        def type_script_type
            super.sub(@owner.name.pascalize, '')
        end
    end

end

def get_type_script(name, sources, jsdoc)

    sources = sources.find_all { |source| !CodeGen::TypeScript::EXCLUDE.include?(source) && source.end_with?('.md') }

    components = sources.map do |source|
        parser = CodeGen::MarkdownParser.new

        File.open(source, 'r:bom|utf-8') do |file|
            parser.parse(file.read, CodeGen::TypeScript::Component)
        end
    end

    components = components.sort { |a, b| a.plugin <=> b.plugin }

    namespaces = components.group_by { |component| component.namespace }

    if jsdoc
        components.each { |component| component.jsdoc = true }
    end

    suite = name.match(/kendo\.(.*?)\.d\.ts/).captures.first

    suite = 'mobile' if suite == 'appbuilder'

    TYPE_SCRIPT.result(binding)
end

class TypeScriptTask < Rake::FileTask
    include Rake::DSL

    def execute(args=nil)
        mkdir_p File.dirname(name), :verbose => false

        $stderr.puts("Creating #{name}") if VERBOSE

        jsdoc = name.include?('appbuilder')

        File.write(name, get_type_script(name, prerequisites, jsdoc))
    end
end

def type_script(*args, &block)
    TypeScriptTask.define_task(*args, &block)
end

namespace :type_script do
    %w(master production).each do |branch|
        namespace branch do
            desc "Test TypeScript generation"
            task :test do
                %w(all web dataviz mobile).each do |suite|
                    path = "dist/kendo.#{suite}.d.ts"

                    File.write(path, get_type_script(path, md_api_suite(suite), false))

                    sh "node_modules/typescript/bin/tsc --noImplicitAny build/jquery.d.ts #{path}"
                end
            end
        end
    end
end
