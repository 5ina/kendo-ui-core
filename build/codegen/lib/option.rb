module CodeGen

    class Option
        attr_accessor :name, :description, :type, :owner, :default, :values, :enum_type

        def initialize(options)
            @name = options[:name]
            @description = options[:description] || ''
            @type = options[:type]
            @owner = options[:owner]
            @recursive = options[:recursive]
            @default = options[:default]
            @content = options[:content]
            @values = options[:values]
            @enum_type = options[:enum_type]
        end

        def content?
            @content
        end

        def composite?
            false
        end

        def composite_option_class
            CodeGen::CompositeOption
        end

        def array_option_class
            ArrayOption
        end

        def to_composite
            type = []
            toggleable = (@type.include? 'Object') && (@type.include? 'Boolean')

            %w{Array Object}.each do |t|
                if @type.include?(t)
                    type.push(t)
                    @type.delete(t)
                end
            end

            @owner.options.delete(self) if @type.empty?

            target_class = composite_option_class

            target_class = array_option_class if type.include?('Array')

            parent = target_class.new(:name => @name,
                                      :owner => @owner,
                                      :recursive => @recursive,
                                      :content => @content,
                                      :type => type,
                                      :toggleable => toggleable,
                                      :default => @default,
                                      :description => @description)

            @owner.options.push(parent)

            parent
        end
    end

end
