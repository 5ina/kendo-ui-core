(function(f, define){
    define([ "./indent" ], f);
})(function(){

(function($, undefined) {

var kendo = window.kendo,
    extend = $.extend,
    Editor = kendo.ui.editor,
    EditorUtils = Editor.EditorUtils,
    Command = Editor.Command,
    Tool = Editor.Tool,
    ToolTemplate = Editor.ToolTemplate;

var ViewHtmlCommand = Command.extend({
    init: function(options) {
        var cmd = this;
        cmd.options = options;
        Command.fn.init.call(cmd, options);
        cmd.attributes = null;
        cmd.async = true;
    },

    exec: function() {
        var that = this,
            editor = that.editor,
            options = editor.options,
            messages = editor.options.messages,
            dialog = $(kendo.template(ViewHtmlCommand.template)(messages)).appendTo(document.body),
            textarea = ".k-editor-textarea",
            content;
        
        options.serialization.immutables = editor.immutables;
        content = ViewHtmlCommand.indent(editor.value());
        options.serialization.immutables = undefined;

        function apply(e) {
            options.deserialization.immutables = editor.immutables;
            editor.value(dialog.find(textarea).val());
            options.deserialization.immutables = undefined;

            close(e);

            if (that.change) {
                that.change();
            }

            editor.trigger("change");
        }

        function close(e) {
            e.preventDefault();

            dialog.data("kendoWindow").destroy();

            if (editor.immutables) {
                editor.immutables.serializedImmutables = {};
            }

            editor.focus();
        }

        this.createDialog(dialog, {
            title: messages.viewHtml,
            close: close,
            visible: false
        })
            .find(textarea).val(content).end()
            .find(".k-dialog-update").click(apply).end()
            .find(".k-dialog-close").click(close).end()
            .data("kendoWindow").center().open();

        dialog.find(textarea).focus();
    }
});

extend(ViewHtmlCommand, {
    template: "<div class='k-editor-dialog k-popup-edit-form k-edit-form-container k-viewhtml-dialog'>" +
                "<textarea class='k-editor-textarea k-input'></textarea>" +
                "<div class='k-edit-buttons k-state-default'>" +
                    "<button class='k-dialog-update k-button k-primary'>#: dialogUpdate #</button>" +
                    "<button class='k-dialog-close k-button'>#: dialogCancel #</button>" +
                "</div>" +
            "</div>",
    indent: function(content) {
        return content.replace(/<\/(p|li|ul|ol|h[1-6]|table|tr|td|th)>/ig, "</$1>\n")
                      .replace(/<(ul|ol)([^>]*)><li/ig, "<$1$2>\n<li")
                      .replace(/<br \/>/ig, "<br />\n")
                      .replace(/\n$/, "");
    }
});

kendo.ui.editor.ViewHtmlCommand = ViewHtmlCommand;

Editor.EditorUtils.registerTool("viewHtml", new Tool({ command: ViewHtmlCommand, template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "View HTML"})}));

})(window.kendo.jQuery);

}, typeof define == 'function' && define.amd ? define : function(a1, a2, a3){ (a3 || a2)(); });
