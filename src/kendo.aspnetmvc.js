(function(f, define){
    define([
        "./kendo.data", "./kendo.combobox", "./kendo.dropdownlist", "./kendo.multiselect", "./kendo.validator",

        "./aspnetmvc/kendo.data.aspnetmvc",
        "./aspnetmvc/kendo.combobox.aspnetmvc",
        "./aspnetmvc/kendo.dropdownlist.aspnetmvc",
        "./aspnetmvc/kendo.multiselect.aspnetmvc",
        "./aspnetmvc/kendo.imagebrowser.aspnetmvc",
        "./aspnetmvc/kendo.validator.aspnetmvc"
    ], f);
})(function(){

var __meta__ = { // jshint ignore:line
    id: "aspnetmvc",
    name: "ASP.NET MVC",
    category: "wrappers",
    description: "Scripts required by Telerik UI for ASP.NET MVC",
    depends: [ "data", "combobox", "dropdownlist", "multiselect", "validator" ]
};

(function($, undefined) {
    var extend = $.extend;

    $(function() { kendo.__documentIsReady = true; });

    function syncReady(cb) {
        if(kendo.__documentIsReady) { //sync operation
            cb();
        }
        else { //async operation
            $(cb);
        }
    }

    extend(kendo, {
        syncReady: syncReady
    });
})(window.kendo.jQuery);

}, typeof define == 'function' && define.amd ? define : function(a1, a2, a3){ (a3 || a2)(); });
