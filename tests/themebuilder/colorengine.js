(function() {
    var colorEngine = new Color("#000"),
        root;

    function success() {
        ok(true);
    }

    ////////////////////////////////////////////////////////////////////
    module("color engine", {
        setup: function() {
            root = $("#qunit-fixture");
        }
    });

    test("css2rgba returns alpha 0 for transparent color", 1, function() {
        ok(colorEngine.css2rgba("transparent").alpha === 0);
    });

    test("css2rgba returns alpha 0 for transparent RGBA color", 1, function() {
        ok(colorEngine.css2rgba("rgba(0,0,0,0)").alpha === 0);
    });

    test("css2rgba returns alpha 1 for RGB and HEX colors", 2, function() {
        ok(colorEngine.css2rgba("rgb(0,0,0)").alpha === 1);
        ok(colorEngine.css2rgba("#365").alpha === 1);
    });

    test("css2rgba splits shorthand HEX to RGB colors", 3, function() {
        var color = colorEngine.css2rgba("#365");
        ok(color.red === 0x33);
        ok(color.green === 0x66);
        ok(color.blue === 0x55);
    });

    test("css2rgba splits HEX to RGB colors", 4, function() {
        var color = colorEngine.css2rgba("#316253");
        ok(color.red === 0x31);
        ok(color.green === 0x62);
        ok(color.blue === 0x53);
        ok(color.alpha === 1);
    });

    test("css2rgba keeps RGB colors", 3, function() {
        var color = colorEngine.css2rgba("rgb(33,66,55)");
        ok(color.red === 33);
        ok(color.green === 66);
        ok(color.blue === 55);
    });

    test("css2rgba keeps RGBA colors", 4, function() {
        var color = colorEngine.css2rgba("rgba(33,66,55,.5)");
        ok(color.red === 33);
        ok(color.green === 66);
        ok(color.blue === 55);
        ok(color.alpha === .5);
    });

    test("css2rgba converts HSL to RGB color", 1, function() {
        var color = new Color("hsl(33,66%,55%)");

        ok(color.toHex() == "#d89441");
    });

    test("Color object keeps internal value in RGBA", 4, function() {
        var color = new Color("#345"),
            color2 = colorEngine.css2rgba("rgba(33,44,55,1)");

        ok(color.value.red == parseInt(color2.red, 16));
        ok(color.value.green == parseInt(color2.green, 16));
        ok(color.value.blue == parseInt(color2.blue, 16));
        ok(color.value.alpha == color2.alpha);
    });

    test("toHex method returns shorthand values when possible", 2, function () {
        var color = new Color("#000"),
            color2 = new Color("#34f");

        ok(color.toHex() == "#000");
        ok(color2.toHex() == "#34f");
    });

    test("toHex method pads with zeroes when necessary", 1, function () {
        var color = new Color("rgb(3,4,5)");

        ok(color.toHex() == "#030405");
    });

    test("toRgb method returns RGB value", 1, function () {
        var color = new Color("#030405");

        ok(color.toRgb() == "rgb(3,4,5)");
    });

    test("toRgba method returns RGBA value", 2, function () {
        var color = new Color("#030405"),
            color2 = new Color("rgba(10,10,10,.3)");

        ok(color.toRgba() == "rgba(3,4,5,1)");
        ok(color2.toRgba() == "rgba(10,10,10,.3)");
    });

    test("isHex returns true for HEX values only", 3, function () {
        ok(colorEngine.isHex("#345"));
        ok(!colorEngine.isHex("345"));
        ok(!colorEngine.isHex("rgb(3,4,5)"));
    });

    test("isRgba returns true for RGB and RGBA values only", 4, function () {
        ok(colorEngine.isRgba("rgb(0,0,0)"));
        ok(colorEngine.isRgba("rgba(0,0,0,1)"));
        ok(!colorEngine.isRgba("#345"));
        ok(!colorEngine.isRgba("rg(3,4,5)"));
    });

    /* difference */

    test("difference() between HEX colors", function() {
        var diff = colorEngine.difference("#000000", "rgba(136,136,136,.5)");

        ok(diff.red == -0x88);
        ok(diff.blue == -0x88);
        ok(diff.green == -0x88);
        ok(diff.alpha == .5);
    });

    test("difference() between RGB colors", function() {
        var diff = colorEngine.difference("rgb(0, 0, 0)", "rgb(136, 136, 136)");

        ok(diff.red == -0x88);
        ok(diff.blue == -0x88);
        ok(diff.green == -0x88);
        ok(diff.alpha == 0);
    });

    test("difference() between RGBA colors", function() {
        var diff = colorEngine.difference("rgba(0, 0, 0, .5)", "rgb(136, 136, 136)");

        ok(diff.red == -0x88);
        ok(diff.blue == -0x88);
        ok(diff.green == -0x88);
        ok(diff.alpha == -.5);
    });

    /* complementary*/

    test("complementary() of HEX Black is #fff", function() {
        var hex = colorEngine.complementary("#000000");

        equal(hex, "#fff");
    });

    test("complementary() of HEX White is #000000", function() {
        var hex = colorEngine.complementary("#fff");

        equal(hex, "#000");
    });

    test("add method adds the color to the main one", 1, function () {
        var color = new Color("#030405");

        ok(color.add("#102030").toHex() == "#132435");
    });

    test("add method is capped to #FFF", 1, function () {
        var color = new Color("#131415");

        ok(color.add("#F0F0F0").toHex() == "#fff");
    });

    test("subtract method subtracts the color from the main one", 1, function () {
        var color = new Color("#132435");

        ok(color.subtract("#102030").toHex() == "#030405");
    });

    test("subtract method is capped to #000", 1, function () {
        var color = new Color("#131415");

        ok(color.subtract("#F0F0F0").toHex() == "#000");
    });

    test("lighten method adds gray percented color to the main one", 1, function () {
        var color = new Color("#030405");

        ok(color.lighten().toHex() == "#1d1e1f");
    });

    test("lighten method adds specified percented color to the main one", 1, function () {
        var color = new Color("#030405");

        ok(color.lighten(20).toHex() == "#363738");
    });

    test("lighten method is capped at #FFF", 1, function () {
        var color = new Color("#030405");

        ok(color.lighten(100).toHex() == "#fff");
    });

    test("darken method subtracts gray percented color from the main one", 1, function () {
        var color = new Color("#334455");

        ok(color.darken().toHex() == "#192a3b");
    });

    test("darken method subtracts specified percented color from the main one", 1, function () {
        var color = new Color("#334455");

        ok(color.darken(19).toHex() == "#031425");
    });

    test("darken method is capped at #000", 1, function () {
        var color = new Color("#334455");

        ok(color.darken(100).toHex() == "#000");
    });

    test("hue method returns the hue if without arguments", 1, function () {
        var color = new Color("#334455");

        ok(color.hue() == 210);
    });

    test("hue method changes the color hue", 2, function () {
        var color = new Color("#334455");

        ok(color.hue(0).toHex() == "#563434");
        ok(color.hue(180).toHex() == "#345656");
    });

    test("saturation method returns the saturation if without arguments", 1, function () {
        var color = new Color("#334455");

        ok(color.saturation() == 25);
    });

    test("saturation method saturates/desaturates the color", 2, function () {
        var color = new Color("#334455");

        ok(color.saturation(100).toHex() == "#00458a");
        ok(color.saturation(0).toHex() == "#454545");
    });

    test("lightness method returns the lightness if without arguments", 1, function () {
        var color = new Color("#334455");

        ok(color.lightness() == 27);
    });

    test("lightness method lightens/darkens the color", 2, function () {
        var color = new Color("#334455");

        ok(color.lightness(0).toHex() == "#000");
        ok(color.lightness(100).toHex() == "#fff");
    });

    test("complement with type complement returns the opposing color", 1, function () {
        var color = new Color();

        ok(color.complement("#f90", "complement")[0] == "#06f");
    });

    test("complement with type diad returns +60 color", 1, function () {
        var color = new Color();

        ok(color.complement("#f90", "diad")[0] == "#6f0");
    });

    test("complement with type analogous returns -30/30 colors", 2, function () {
        var color = new Color(),
            colors = color.complement("#f90", "analogous");

        ok(colors[0] == "#e6ff00");
        ok(colors[1] == "#ff1a00");
    });

    test("complement with type split returns -150/150 colors", 2, function () {
        var color = new Color(),
            colors = color.complement("#f90", "split");

        ok(colors[0] == "#00e5ff");
        ok(colors[1] == "#1900ff");
    });

    test("complement with type triad returns -120/120 colors", 2, function () {
        var color = new Color(),
            colors = color.complement("#f90", "triad");

        ok(colors[0] == "#0f9");
        ok(colors[1] == "#90f");
    });

    test("complement with type double returns 30/180/-150 colors", 3, function () {
        var color = new Color(),
            colors = color.complement("#f90", "double");

        ok(colors[0] == "#e6ff00");
        ok(colors[1] == "#06f");
        ok(colors[2] == "#1900ff");
    });

    test("complement with type tetradic returns 60/180/-120 colors", 3, function () {
        var color = new Color(),
            colors = color.complement("#f90", "tetradic");

        ok(colors[0] == "#6f0");
        ok(colors[1] == "#06f");
        ok(colors[2] == "#90f");
    });

    test("complement with type square returns 90/180/-90 colors", 3, function () {
        var color = new Color(),
            colors = color.complement("#f90", "square");

        ok(colors[0] == "#00ff19");
        ok(colors[1] == "#06f");
        ok(colors[2] == "#ff00e5");
    });
})();
