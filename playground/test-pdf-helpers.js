function container() {
    $(".surface").remove();
    return $("<div class='surface' style='position: absolute; z-index: 30000; background: white; right: 0; top: 0; height: 10000px; width: 600px'></div>").appendTo(document.body);
}

window.draw = function draw(sel, type) {
    var el = $(sel)[0];
    console.time("drawing");
    kendo.dataviz.drawing.drawDOM(el).done(function(root){
        console.timeEnd("drawing");
        var surface = kendo.dataviz.drawing.Surface.create(container(), { type: type || "svg" });
        surface.draw(root);
    });
}

window.pdf = function pdf(sel) {
    var el = $(sel)[0];
    console.time("pdf");
    console.time("drawing");
    kendo.dataviz.drawing.drawDOM(el).done(function(root){
        console.timeEnd("drawing");
        root.options.set("pdf", {
            paperSize: "auto",
            margin: {
                left: "10mm",
                top: "10mm",
                right: "10mm",
                bottom: "10mm"
            }
        });
        kendo.dataviz.drawing.pdf.saveAs(root, "kendo.pdf", "http://kendo.local:7569/", function(){
            console.timeEnd("pdf");
        });
    });
}

window.pdfPages = function(sel, options) {
    var el = $(sel)[0];
    console.time("pdf");
    console.time("drawing");
    kendo.dataviz.drawing.drawDOM(el, {
        forcePageBreak : ".page-break",
        pageHeight     : options.pageHeight,
        pageWidth      : options.pageWidth
    }).done(function(root){
        console.timeEnd("drawing");
        root.options.set("pdf.multiPage", true);
        root.options.set("pdf.paperSize", [ options.pageWidth, options.pageHeight ]);
        root.options.set("pdf.margin", "1cm");
        Object.keys(options).forEach(function(key){
            root.options.set("pdf." + key, options[key]);
        });
        kendo.dataviz.drawing.pdf.saveAs(root, "kendo.pdf", "http://kendo.local:7569/", function(){
            console.timeEnd("pdf");
        });
    });
};

window.h2c = function h2c(sel) {
    console.time("html2canvas");
    html2canvas($(sel)[0]).then(function(canvas){
        console.timeEnd("html2canvas");
        container().append(canvas);
    });
}
