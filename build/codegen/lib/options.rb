module CodeGen
    module Options
        def composite_options
            @options.find_all { |option| option.composite? }.sort {|a, b| a.name <=> b.name }
        end

        def simple_options
            @options.find_all { |option| !option.composite? }.sort {|a, b| a.name <=> b.name }
        end

        def all_options
            all = @options.dup
            composite_options.each do |co|
                all.concat(co.all_options)
            end

            all.sort do |a, b|
                if a.respond_to? 'full_name'
                    a.full_name <=> b.full_name
                else
                    a.name <=> b.name
                end
            end
        end

        def composite_option_class
            CompositeOption
        end

        def option_class
            Option
        end

        def event_class
            Event
        end

        def add_option(settings)
            name = settings[:name].strip

            prefix = settings[:prefix]

            name = name.sub(prefix, '') if prefix

            recursive = settings[:recursive]

            content = settings[:content]

            description = settings[:description]

            default = settings[:default]

            types = settings[:type]

            values = settings[:values]

            enum_type = settings[:enum_type]

            remove_existing = settings[:remove_existing] || false

            return unless types

            if types.is_a?(String)
                type = types.split('|').map { |type| type.strip }.find_all do |t|
                    TYPES.include?(t) || t.start_with?('kendo')
                end
            else
                type = types
            end

            return if type.empty?

            parents = @options.find_all { |option| name.start_with?(option.name + '.') && (option.type.include?('Object') || option.type.include?('Array')) }

            parents.map! { |parent| parent.to_composite }

            if parents.any?

                parents.each do |parent|
                    parent.add_option(
                      :name => name,
                      :type => type,
                      :recursive => recursive,
                      :content => content,
                      :default => default,
                      :prefix => parent.name + '.',
                      :values => values,
                      :enum_type => enum_type,
                      :description => description,
                      :remove_existing => remove_existing
                    )

                end

            else

                @options.delete_if { |o| o.name == name } if remove_existing

                @options.push option_class.new(:name => name,
                                               :owner => self,
                                               :recursive => recursive,
                                               :content => content,
                                               :type => type,
                                               :default => default,
                                               :values => values,
                                               :enum_type => enum_type,
                                               :description => description)
            end

        end
    end
end
