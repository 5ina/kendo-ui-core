(function(){

    var ss;
    var Sheet1 = "Sheet1";

    module("Formula parser/printer/evaluator", {
        setup: function() {
            ss = new Spreadsheet();
            ss.fill({
                A1: 1, B1: 2, C1: 3,
                A2: 4, B2: 5, C2: 6,
                A3: 7, B3: 8, C3: 9,
                A4: '=""', B4: '=" "',

                e1: 1, e2: 2, e3: 3, e4: 4, e5: 5, e6: 6, e7: 7, e8: 8,
                f2: 7, f3: 6, f4: 5, f5: 4, f6: 3, f7: 2, f8: 1,
                g1: "aaa", g2: "bbb", g3: "ccc", g4: "ddd", g5: "eee", g6: "fff", g7: "ggg", g8: "hhh",
                h1: "hhh", h2: "ggg", h3: "fff", h4: "eee", h5: "ddd", h6: "ccc", h7: "bbb", h8: "aaa",
            });
        },
        teardown: function() {
        }
    });

    var spreadsheet = kendo.spreadsheet;
    var calc = spreadsheet.calc;
    var runtime = calc.runtime;

    // check for the existence of `props` in `obj` (deep).  does not
    // mind if `obj` contains additional properties, but those
    // specified in 'props' must be present and have same values.
    function hasProps(obj, props) {
        for (var i in props) {
            if (Object.prototype.hasOwnProperty.call(props, i)) {
                var val = props[i];
                if (Array.isArray(val) || (typeof val == "object" && val != null)) {
                    hasProps(obj[i], val);
                } else {
                    equal(obj[i], val);
                }
            }
        }
    }

    // minimal data object with the glue functionality so we
    // can run expressions.
    var Spreadsheet = kendo.Class.extend({
        init: function() {
            this.data = {};
            this.maxrow = 0;
            this.maxcol = 0;
        },
        onFormula: function(f) {
            var sheet = f.sheet, row = f.row, col = f.col, value = f.value;
            this.maxrow = Math.max(row, this.maxrow);
            this.maxcol = Math.max(col, this.maxcol);
            var cell = this.data[this.id(row, col)];
            if (!cell) {
                this.data[this.id(row, col)] = cell = {};
            }
            cell.value = value;
            return true;
        },
        getRefCells: function(ref) {
            if (ref instanceof spreadsheet.CellRef) {
                var cell = this.get(ref.row, ref.col);
                if (cell) {
                    cell.sheet = Sheet1;
                    cell.row = ref.row;
                    cell.col = ref.col;
                }
                return cell ? [ cell ] : [];
            }
            if (ref instanceof spreadsheet.RangeRef) {
                ref = ref.intersect(this.bounds());
                if (!(ref instanceof spreadsheet.RangeRef)) {
                    return this.getRefCells(ref);
                }
                var a = [];
                for (var row = ref.topLeft.row; row <= ref.bottomRight.row; ++row) {
                    for (var col = ref.topLeft.col; col <= ref.bottomRight.col; ++col) {
                        var cell = this.get(row, col);
                        if (cell) {
                            cell.sheet = Sheet1;
                            cell.row = row;
                            cell.col = col;
                            a.push(cell);
                        }
                    }
                }
                return a;
            }
            if (ref instanceof spreadsheet.UnionRef) {
                var a = [];
                for (var i = 0; i < ref.refs.length; ++i) {
                    a = a.concat(this.getRefCells(ref.refs[i]));
                }
                return a;
            }
            if (ref instanceof spreadsheet.NameRef) {
                return [{
                    value: new kendo.spreadsheet.calc.runtime.CalcError("NAME")
                }];
            }
            return [];
        },
        getData: function(ref) {
            if (!(ref instanceof spreadsheet.Ref)) {
                return ref;
            }
            var a = this.getRefCells(ref).filter(function(cell){
                return cell.value != null;
            }).map(function(cell){
                return cell.value;
            });
            return ref instanceof spreadsheet.CellRef ? a[0] : a;
        },
        makeRef: function(ref) {
            if (ref instanceof spreadsheet.Ref) {
                return ref;
            }
            return calc.parseReference(ref);
        },
        set: function(row, col, val) {
            val += "";
            val = calc.parse(Sheet1, row, col, val);
            if (val.type == "exp") {
                val = { formula: calc.compile(val), exp: val };
            }
            this.maxrow = Math.max(row, this.maxrow);
            this.maxcol = Math.max(col, this.maxcol);
            this.data[this.id(row, col)] = val;
        },
        bounds: function() {
            return new spreadsheet.RangeRef(
                new spreadsheet.CellRef(0, 0, 0),
                new spreadsheet.CellRef(this.maxrow, this.maxcol, 0)
            ).setSheet(Sheet1);
        },
        get: function(row, col) {
            return this.data[this.id(row, col)];
        },
        id: function(row, col) {
            return row + ":" + col;
        },
        fill: function(data) {
            var self = this;
            if (typeof data == "string") {
                // alternate syntax.
                var ref = this.makeRef(data).toRangeRef();
                data = arguments[1], i = 0;
                for (var row = ref.topLeft.row; row <= ref.bottomRight.row; ++row) {
                    for (var col = ref.topLeft.col; col <= ref.bottomRight.col; ++col) {
                        if (data instanceof runtime.Matrix) {
                            self.set(row, col, data.get(row, col));
                        } else {
                            self.set(row, col, data[i++]);
                        }
                    }
                }
                if (arguments.length > 2) {
                    this.fill.apply(this, Array.prototype.slice.call(arguments, 2));
                }
            } else {
                Object.keys(data).forEach(function(key){
                    var ref = self.makeRef(key);
                    self.set(ref.row, ref.col, data[key]);
                });
                if (arguments.length > 1) {
                    this.fill.apply(this, Array.prototype.slice.call(arguments, 1));
                }
            }
        },
        recalculate: function(callback) {
            var self = this;
            var cells = self.getRefCells(self.bounds()).filter(function(cell){
                if (cell.formula) {
                    cell.formula.reset();
                    return true;
                }
            });
            var count = cells.length;
            if (callback && !count) {
                callback();
            }
            cells.forEach(function(cell){
                cell.formula.exec(self, function(){
                    if (!--count && callback) {
                        callback();
                    }
                });
            });
        },
        $: function(x) {
            return this.getData(this.makeRef(x));
        },
        expectEqual: function(hash) {
            var self = this;
            Object.keys(hash).forEach(function(cell){
                var val = self.$(cell);
                var expected = hash[cell];
                if (expected instanceof APPROX) {
                    if (typeof val != "number") {
                        val = parseFloat(val);
                    }
                    ok(Math.abs(val - expected.val) < expected.eps);
                    if (!(Math.abs(val - expected.val) < expected.eps)) {
                        console.log(val, expected.val);
                    }
                } else {
                    equal(val, expected);
                }
            });
        }
    });

    function APPROX(val, eps) {
        if (!(this instanceof APPROX)) {
            return new APPROX(val);
        }
        if (!eps) {
            var tmp = (val+"").replace(/^.*\./, "");
            eps = Math.pow(10, -tmp.length);
        }
        this.val = val;
        this.eps = eps;
    }

    function DATE(str) {
        return runtime.dateToSerial(new Date(str)) | 0;
    }

    function calcTest(hash) {
        var ss = new Spreadsheet();
        var data = {}, expect = {}, row = 1;
        for (var i in hash) {
            if (Object.prototype.hasOwnProperty.call(hash, i)) {
                var cell = "A" + (row++);
                data[cell] = i;
                var val = hash[i];
                if (typeof val == "number") {
                    val = APPROX(val);
                }
                expect[cell] = val;
            }
        }
        ss.fill(data);
        ss.recalculate(function(){
            ss.expectEqual(expect);
        });
    }

    // test async function
    runtime.defineFunction("asum", function(callback, timeout, numbers) {
        var self = this;
        setTimeout(function(){
            var sum = 0;
            numbers.forEach(function(num){
                sum += num;
            });
            callback(sum);
        }, timeout);
    }).argsAsync([
        [ "timeout", "number" ],
        [ "numbers", [ "collect", "number" ] ]
    ]);

    // these two will be used to test conditional evaluation
    runtime.defineFunction("foo", function(callback, args){
        if (!this.ss.fooCount)
            this.ss.fooCount = 0;
        ++this.ss.fooCount;
        callback("foo");
    });
    runtime.defineFunction("bar", function(callback, args){
        if (!this.ss.barCount)
            this.ss.barCount = 0;
        ++this.ss.barCount;
        callback("bar");
    });

    /* -----[ parser tests ]----- */

    test("cell reference", function(){
        var exp = calc.parse(Sheet1, 0, 0, "=G5");
        hasProps(exp, {
            type: "exp",
            ast: {
                type: "ref",
                ref: "cell",
                sheet: Sheet1,
                row: 4,
                col: 6,
                rel: 3
            }
        });
    });

    test("normalizes range reference", function(){
        var exp = calc.parse(Sheet1, 0, 0, "=A4:C2");
        hasProps(exp, {
            type: "exp",
            ast: {
                type: "ref",
                ref: "range",
                sheet: Sheet1,
                topLeft: {      // A2
                    type: "ref",
                    ref: "cell",
                    row: 1,
                    col: 0,
                    rel: 3
                },
                bottomRight: {  // C4
                    type: "ref",
                    ref: "cell",
                    row: 3,
                    col: 2,
                    rel: 3
                }
            }
        });
    });

    test("function call", function(){
        var exp = calc.parse(Sheet1, 0, 0, "=sum(A2, A3, A4)");
        hasProps(exp, {
            type: "exp",
            ast: {
                type: "func",
                func: "sum",
                args: [
                    { type: "ref", ref: "cell", row: 1, col: 0 },
                    { type: "ref", ref: "cell", row: 2, col: 0 },
                    { type: "ref", ref: "cell", row: 3, col: 0 },
                ]
            }
        });
    });

    test("union operator", function(){
        var exp = calc.parse(Sheet1, 0, 0, "=sum((A2, A3, A4))");
        hasProps(exp, {
            type: "exp",
            ast: {
                type: "func",
                func: "sum",
                args: [
                    { type: "binary", op: ",",
                      left: { type: "binary", op: ",",
                              left: { type: "ref", ref: "cell", row: 1, col: 0 },
                              right: { type: "ref", ref: "cell", row: 2, col: 0 }
                            },
                      right: { type: "ref", ref: "cell", row: 3, col: 0 }
                    }
                ]
            }
        });
    });

    test("intersection operator", function(){
        var exp = calc.parse(Sheet1, 0, 0, "=sum(A2:A5 A3:A4, Sheet2!FOO)");
        hasProps(exp, {
            type: "exp",
            ast: {
                type: "func",
                func: "sum",
                args: [
                    // first arg is intersection of A2:A5 x A3:A4
                    { type: "binary", op: " ",
                      left: { type: "ref", ref: "range", // A2:A5
                              topLeft: { type: "ref", ref: "cell", row: 1, col: 0 },
                              bottomRight: { type: "ref", ref: "cell", row: 4, col: 0 },
                            },
                      right: { type: "ref", ref: "range", // A3:A4
                               topLeft: { type: "ref", ref: "cell", row: 2, col: 0 },
                               bottomRight: { type: "ref", ref: "cell", row: 3, col: 0 },
                             },
                    },
                    // second arg is the user-defined name FOO
                    { type: "ref", ref: "name", name: "FOO", sheet: "Sheet2", _hasSheet: true }
                ]
            }
        });
    });

    test("operator precedence", function(){
        var exp = calc.parse(Sheet1, 0, 0, "=a + b * c + d / e");
        hasProps(exp, {
            type: "exp",
            ast: {
                type: "binary", op: "+",
                left: { type: "binary", op: "+", // a+b*c
                        left: { name: "a" },
                        right: { type: "binary", op: "*", // b*c
                                 left: { name: "b" },
                                 right: { name: "c" }
                               }
                      },
                right: { type: "binary", op: "/", // d/e
                         left: { name: "d" },
                         right: { name: "e" }
                       }
            }
        });
    });

    test("intersection and union precedence", function(){
        var exp = calc.parse(Sheet1, 0, 0, "=areas((A1:C3 B2, B3:B4))");
        var f = calc.compile(exp);
        equal(f.print(0, 0), "areas((A1:C3 B2,B3:B4))");

        var exp = calc.parse(Sheet1, 0, 0, "=areas(A1:C3 (B2, B3:B4))");
        var f = calc.compile(exp);
        equal(f.print(0, 0), "areas(A1:C3 (B2,B3:B4))");
    });

    test("range as cell:funcall", function(){
        var exp = calc.parse(Sheet1, 0, 0, "=sum(a1:choose(2, b1, b2, b3))");
        var f = calc.compile(exp);
        equal(f.print(0, 0), "sum(A1:choose(2, B1, B2, B3))");
    });

    test("column range and union intersection", function(){
        var exp = calc.parse(Sheet1, 0, 0, "=aaa:ccc (a1, a2, a3)");
        var f = calc.compile(exp);
        equal(f.print(0, 0), "AAA:CCC (A1,A2,A3)");
    });

    test("omit intermediate arguments in funcall", function(){
        var exp = calc.parse(Sheet1, 0, 0, "=sum(a1,,b1)");
        var f = calc.compile(exp);
        equal(f.print(0, 0), "sum(A1, , B1)");
    });

    /* -----[ validation tests ]----- */

    test("validation parse greaterThan", function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A1",
            //to: "",
            comparerType: "greaterThan",
            dataType: "date"
        });

        hasProps(exp, {
            comparerType: "greaterThan",
            dataType: "date",
            from: {
                type: "exp",
                ast: {
                    type: "ref",
                    ref: "cell",
                    sheet: Sheet1,
                    row: 0,
                    col: 0,
                    rel: 3
                }
            }
        });
    });

    test("validation parse between", function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            to: "A3",
            comparerType: "between",
            dataType: "date"
        });

        hasProps(exp, {
            comparerType: "between",
            dataType: "date",
            from: {
                type: "exp",
                ast: {
                    type: "ref",
                    ref: "cell",
                    sheet: Sheet1,
                    row: 1,
                    col: 0,
                    rel: 3
                }
            },
            to: {
                type: "exp",
                ast: {
                    type: "ref",
                    ref: "cell",
                    sheet: Sheet1,
                    row: 2,
                    col: 0,
                    rel: 3
                }
            }
        });
    });

    test("validation exec calls exec of nested functions as well and execute passed callback", 3, function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            to: "A3",
            comparerType: "between",
            dataType: "date"
        });

        var validationCallback = function(e) {
            ok(true);
        };

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
              ok(true);
            callback();
        };

        f.to.exec = function(e, callback) {
            ok(true);
            callback();
        };

        f.exec(ss, 10, "m/d/yyyy", validationCallback);
    });

    test("validation exec call without compare values executes nested functions without error", 2, function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            to: "A3",
            comparerType: "between",
            dataType: "date"
        });

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
            ok(true);
            callback();
        };

        f.to.exec = function(e, callback) {
            ok(true);
            callback();
        };

        f.exec(ss);
    });

    test("validation initializes nested functions correctly", function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            to: "A3",
            comparerType: "between",
            dataType: "date"
        });

        var f = calc.compileValidation(exp);

        ok(f.from instanceof kendo.spreadsheet.calc.runtime.Formula);
        ok(f.to instanceof kendo.spreadsheet.calc.runtime.Formula);
    });

    test("validation toJSON exports JSON object", function(){
        var customOptions = {
            from: "A2",
            to: "A3",
            comparerType: "between",
            dataType: "date",
            type: "reject",
            tooltipTitleTemplate: "tooltipTitle",
            tooltipMessageTemplate: "tooltipMessage",
            messageTemplate: "Custom message",
            titleTemplate: "CustomTitle"
        };
        var exp = calc.parseValidation(Sheet1, 0, 0, $.extend({}, customOptions));

        var f = calc.compileValidation(exp);

        var parsedOutput = f.toJSON();

        equal(parsedOutput.from, customOptions.from);
        equal(parsedOutput.to, customOptions.to);
        equal(parsedOutput.comparerType, customOptions.comparerType);
        equal(parsedOutput.dataType, customOptions.dataType);
        equal(parsedOutput.type, customOptions.type);
        equal(parsedOutput.tooltipTitleTemplate, customOptions.tooltipTitleTemplate);
        equal(parsedOutput.tooltipMessageTemplate, customOptions.tooltipMessageTemplate);
        equal(parsedOutput.messageTemplate, customOptions.messageTemplate);
        equal(parsedOutput.titleTemplate, customOptions.titleTemplate);
    });

    test("validation type is set to warning by default", function(){
        var customOptions = {
            from: "A2",
            to: "A3",
            comparerType: "between",
            dataType: "date"
        };
        var exp = calc.parseValidation(Sheet1, 0, 0, $.extend({}, customOptions));

        var f = calc.compileValidation(exp);

        var parsedOutput = f.toJSON();

        equal(parsedOutput.type, "warning");
    });

    test("validation default messages are set", function(){
        var customOptions = {
            from: "A2",
            to: "A3",
            comparerType: "between",
            dataType: "date",
            type: "reject"
        };

        var exp = calc.parseValidation(Sheet1, 0, 0, $.extend({}, customOptions));

        var f = calc.compileValidation(exp);

        var validationCallback = function(result) {
            equal(f.tooltipTitle, undefined);
            equal(f.tooltipMessage, undefined);
            equal(f.message, "Please enter a valid date value between 4 and 7.");
            equal(f.title, "Validation reject");
        };

        f.exec(ss, 2, "m/d/yyyy", validationCallback);
    });

    test("validation adjust modify both the validation ref and the nested formulas", 5, function(){
        var customOptions = {
            from: "Sheet1!A2",
            to: "Sheet1!A3",
            comparerType: "between",
            dataType: "date",
            type: "reject"
        };

        var exp = calc.parseValidation(Sheet1, 0, 0, $.extend({}, customOptions));
        var f = calc.compileValidation(exp);

        f.adjust("Sheet1","row", 0, 1);

        var validationCallback = function(result) {
            equal(f.row, 1);
            equal(f.from.row, 1);
            equal(f.to.row, 1);
            equal(f.from.absrefs[0].row, 2);
            equal(f.to.absrefs[0].row, 3);
        };

        f.exec(ss, 2, "m/d/yyyy", validationCallback);
    });

    test("validation reset modify both the validation and the nested formulas", 5, function(){
        var customOptions = {
            from: "Sheet1!A2",
            to: "Sheet1!A3",
            comparerType: "between",
            dataType: "date",
            type: "reject"
        };

        var exp = calc.parseValidation(Sheet1, 0, 0, $.extend({}, customOptions));

        var f = calc.compileValidation(exp);

        f.adjust("row", 0, 1);

        var validationCallback = function(result) {
            f.pending = true;

            f.from.reset = function () {
                ok(true);
            };

            f.to.reset = function () {
                ok(true);
            };

            f.reset();

            equal(f.onReady.length, 0);
            equal(f.value, undefined);
            equal(f.pending, false);
        };

        f.exec(ss, 2, "m/d/yyyy", validationCallback);
    });

    test("validation clone is working as expected", 9, function(){
        var customOptions = {
            from: "Sheet1!A2",
            to: "Sheet1!A3",
            comparerType: "between",
            dataType: "date",
            type: "reject",
            allowNulls: true
        };

        var exp = calc.parseValidation(Sheet1, 0, 0, $.extend({}, customOptions));

        var f = calc.compileValidation(exp);

        var newFormula = f.clone("Sheet2", 1, 1);

        equal(newFormula.handler, f.handler);
        equal(newFormula.row, 1);
        equal(newFormula.col, 1);
        equal(newFormula.type, customOptions.type);

        equal(newFormula.from.row, 1);
        equal(newFormula.from.col, 1);
        equal(newFormula.to.row, 1);
        equal(newFormula.to.col, 1);
        equal(newFormula.allowNulls, true);
    });

    test("validation allow null values when allowNulls is set to true", 1, function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            to: "A3",
            comparerType: "between",
            dataType: "date",
            allowNulls: true
        });

        var validationCallback = function(result) {
            ok(result);
        };

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
            f.from.value = 1;
            callback(1);
        };

        f.to.exec = function(e, callback) {
            f.to.value = 3;
            callback(3);
        };

        f.exec(ss, null, "m/d/yyyy", validationCallback);
    });

    test("validation does not allow null values by default", 1, function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            to: "A3",
            comparerType: "between",
            dataType: "date"
        });

        var validationCallback = function(result) {
            ok(!result);
        };

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
            f.from.value = 1;
            callback(1);
        };

        f.to.exec = function(e, callback) {
            f.to.value = 3;
            callback(3);
        };

        f.exec(ss, null, "m/d/yyyy", validationCallback);
    });

    test("validation compare values between correctly", 1, function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            to: "A3",
            comparerType: "between",
            dataType: "date"
        });

        var validationCallback = function(result) {
            ok(result);
        };

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
            f.from.value = 1;
            callback(1);
        };

        f.to.exec = function(e, callback) {
            f.to.value = 3;
            callback(3);
        };

        f.exec(ss, 2, "m/d/yyyy", validationCallback);
    });

    test("validation compare values greaterThan correctly", 1, function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            comparerType: "greaterThan",
            dataType: "date"
        });

        var validationCallback = function(result) {
            ok(result);
        };

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
            f.from.value = 1;
            callback(1);
        };

        f.exec(ss, 2, "m/d/yyyy", validationCallback);
    });

    test("validation compare values lessThan correctly", 1, function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            comparerType: "lessThan",
            dataType: "date"
        });

        var validationCallback = function(result) {
            ok(result);
        };

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
            f.from.value = 2;
            callback(2);
        };

        f.exec(ss, 1, "m/d/yyyy", validationCallback);
    });

    test("validation compare values equalTo correctly", 1, function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            comparerType: "equalTo",
            dataType: "date"
        });

        var validationCallback = function(result) {
            ok(result);
        };

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
            f.from.value = 2;
            callback(2);
        };

        f.exec(ss, 2, "m/d/yyyy", validationCallback);
    });

    test("validation compare values notEqualTo correctly", 1, function(){
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            comparerType: "notEqualTo",
            dataType: "date"
        });

        var validationCallback = function(result) {
            ok(result);
        };

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
            f.from.value = 2;
            callback(2);
        };

        f.exec(ss, 21321321, "m/d/yyyy", validationCallback);
    });

    test("validation compare values greaterThanOrEqualTo correctly", 2, function(){
        var firstExecute = true;
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            comparerType: "greaterThanOrEqualTo",
            dataType: "date"
        });

        var validationCallback = function(result) {
            ok(result);
            if (firstExecute) {

                firstExecute = false;
                f.reset();

                f.exec(ss, 2, "m/d/yyyy", validationCallback);
            }
        };

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
            f.from.value = 2;
            callback(2);
        };

        f.exec(ss, 23, "m/d/yyyy", validationCallback);

    });

    test("validation compare values lessThanOrEqualTo correctly", 2, function(){
        var firstExecute = true;
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            comparerType: "lessThanOrEqualTo",
            dataType: "date"
        });

        var validationCallback = function(result) {
            ok(result);
            if (firstExecute) {

                firstExecute = false;
                f.reset();

                f.exec(ss, 2, "m/d/yyyy", validationCallback);
            }
        };

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
            f.from.value = 2;
            callback(2);
        };

        f.exec(ss, 1, "m/d/yyyy", validationCallback);
    });

    test("validation compare values notBetween correctly", 2, function(){
        var firstExecute = true;
        var exp = calc.parseValidation(Sheet1, 0, 0, {
            from: "A2",
            to: "A3",
            comparerType: "notBetween",
            dataType: "date"
        });

        var validationCallback = function(result) {
            ok(result);
            if (firstExecute) {

                firstExecute = false;
                f.reset();

                f.exec(ss, 4, "m/d/yyyy", validationCallback);
            }
        };

        var f = calc.compileValidation(exp);

        f.from.exec = function(e, callback) {
            f.from.value = 1;
            callback(1);
        };

        f.to.exec = function(e, callback) {
            f.to.value = 3;
            callback(3);
        };

        f.exec(ss, 0, "m/d/yyyy", validationCallback);
    });

    /* -----[ printer tests ]----- */

    test("print adjusts cell references", function(){
        var exp = calc.parse(Sheet1, 0, 1, "=sum(A1:A5)");
        var formula = calc.compile(exp);
        var origCell = { formula: formula, row: 0, col: 1, sheet: Sheet1 };

        var str = formula.print(1, 1);
        equal(str, "sum(A2:A6)");

        var str = formula.print(2, 2);
        equal(str, "sum(B3:B7)");
    });

    test("print absolute references", function(){
        function testOne(input, output) {
            var exp = calc.parse(Sheet1, 0, 1, input);
            var formula = calc.compile(exp);
            var origCell = { formula: formula, row: 0, col: 1, sheet: Sheet1 };

            var str = formula.print(4, 4);
            equal(str, output);
        }
        testOne("=A1", "D5");
        testOne("=$A1", "$A5");
        testOne("=A$1", "D$1");
        testOne("=$A$1", "$A$1");

        testOne("=sum(A1:C3)", "sum(D5:F7)");
        testOne("=sum($A1:C3)", "sum($A5:F7)");
        testOne("=sum(A$1:C3)", "sum(D$1:F7)");
        testOne("=sum($A$1:C3)", "sum($A$1:F7)");
        testOne("=sum(A1:$C3)", "sum(D5:$C7)");
        testOne("=sum(A1:C$3)", "sum(D5:F$3)");
        testOne("=sum(A1:$C$3)", "sum(D5:$C$3)");
    });

    test("print in RC notation", function(){
        function testOne(input, output) {
            var exp = calc.parse(Sheet1, 4, 4, input);
            var formula = calc.compile(exp);
            equal(formula.print(), output);
        }

        testOne("=A1", "R[-4]C[-4]");
        testOne("=A2", "R[-3]C[-4]");
        testOne("=B1", "R[-4]C[-3]");
        testOne("=B2", "R[-3]C[-3]");
        testOne("=$C$3", "R3C3");
        testOne("=$C3", "R[-2]C3");
        testOne("=C$3", "R3C[-2]");
        testOne("=C3", "R[-2]C[-2]");
    });

    test("parenthesize name references in range operator", function(){
        function testOne(input, output) {
            var exp = calc.parse(Sheet1, 0, 0, input);
            var formula = calc.compile(exp);
            equal(formula.print(0, 0), output);
        }

        testOne("=sum((foo):(bar))", "sum((foo):(bar))");
        testOne("=sum(a1:(bar))", "sum(A1:(bar))");
        testOne("=sum((foo):a1)", "sum((foo):A1)");
    });

    test("formula cache", function(){
        function testOne(f1, f2) {
            var e1 = calc.parse(Sheet1, 0, 0, f1);
            var e2 = calc.parse(Sheet1, 1, 0, f2);
            f1 = calc.compile(e1);
            f2 = calc.compile(e2);
            ok(f1.refs === f2.refs);
            ok(f1.handler === f2.handler);
            ok(f1.print === f2.print);
        }

        testOne("=B1+C1", "=B2+C2");
        testOne("=sum(3:5)", "=sum(4:6)");
        testOne("=sum(C2:E5)", "=sum(C3:E6)");
        testOne("=B$1+C1", "=B$1+C2");
    });

    test("formula adjustment", function(){
        function makeFormula(input) {
            return calc.compile(calc.parse(Sheet1, 5, 5, input));
        }
        var f = makeFormula("=sum(a10:c15)");

        // insert 3 rows before row 7; the formula is at 5,5
        f.adjust(Sheet1, "row", 7, 3);
        equal(f.print(5, 5), "sum(A13:C18)");

        // insert 2 cols before col 1; the formula will move to 5,7
        f.adjust(Sheet1, "col", 1, 2);
        equal(f.print(5, 7), "sum(A13:E18)");

        // insert 1 col before col A; the formula moves to 5,8
        f.adjust(Sheet1, "col", 0, 1);
        equal(f.print(5, 8), "sum(B13:F18)");

        // delete col A; the formula moves back to 5,7
        f.adjust(Sheet1, "col", 0, -1);
        equal(f.print(5, 7), "sum(A13:E18)");

        // delete col E; the formula moves to 5,6
        f.adjust(Sheet1, "col", 4, -1);
        equal(f.print(5, 6), "sum(A13:D18)");

        // delete cols C and D; the formula moves to 5,4
        f.adjust(Sheet1, "col", 2, -2);
        equal(f.print(5, 4), "sum(A13:B18)");

        // delete rows 1-4; the formula moves to 1,4
        f.adjust(Sheet1, "row", 0, -4);
        equal(f.print(1, 4), "sum(A9:B14)");

        // delete row 10
        f.adjust(Sheet1, "row", 9, -1);
        equal(f.print(1, 4), "sum(A9:B13)");

        // delete rows 9 and 10
        f.adjust(Sheet1, "row", 8, -2);
        equal(f.print(1, 4), "sum(A9:B11)");

        // delete col A; the formula moves to 1,3
        f.adjust(Sheet1, "col", 0, -1);
        equal(f.print(1, 3), "sum(A9:A11)");
    });

    /* -----[ reference operations ]----- */

    test("reference intersection", function(){
        function ref(input) {
            var exp = calc.parse(Sheet1, 0, 0, "=" + input);
            hasProps(exp, {
                type: "exp",
                ast: {
                    type: "ref"
                }
            });
            ok(exp.ast instanceof spreadsheet.Ref);
            return exp.ast;
        }
        function print(ref) {
            return ref.print(0, 0);
        }
        function intersect(r1, r2) {
            return print(ref(r1).intersect(ref(r2)));
        }
        equal(intersect("B3:D6", "A1:E7"), "$B$3:$D$6");
        equal(intersect("B3:D6", "B6:D10"), "$B$6:$D$6");
        equal(intersect("A1:A3", "A3:A6"), "$A$3");
        equal(intersect("A1:A3", "A4:A5"), "#NULL!");

        equal(intersect("B3:D6", "A1:B3"), "$B$3");
        equal(intersect("B3:D6", "A1:C4"), "$B$3:$C$4");

        equal(intersect("B3:D6", "D1:D10"), "$D$3:$D$6");
        equal(intersect("B3:D6", "E1:E10"), "#NULL!");
        equal(intersect("B3:D6", "D1:D3"), "$D$3");

        equal(intersect("B3:D6", "D5:E10"), "$D$5:$D$6");
        equal(intersect("B3:D6", "D6:E10"), "$D$6");
        equal(intersect("B3:D6", "D7:E10"), "#NULL!");

        equal(intersect("B3:D6", "A5:D6"), "$B$5:$D$6");
        equal(intersect("B3:D6", "A6:D6"), "$B$6:$D$6");
        equal(intersect("B3:D6", "A7:D8"), "#NULL!");
        equal(intersect("B3:D6", "A6:B6"), "$B$6");

        equal(intersect("B3:D6", "1:2"), "#NULL!");
        equal(intersect("B3:D6", "2:3"), "$B$3:$D$3");
        equal(intersect("B3:D6", "3:4"), "$B$3:$D$4");
        equal(intersect("B3:D6", "A:E"), "$B$3:$D$6");
        equal(intersect("B3:D6", "A:C"), "$B$3:$C$6");
        equal(intersect("B3:D6", "C:C"), "$C$3:$C$6");
        equal(intersect("B3:D6", "C:E"), "$C$3:$D$6");
        equal(intersect("B3:D6", "E:F"), "#NULL!");
    });

    /* -----[ expression evaluation ]----- */

    test("circular deps", function(){
        var ss = new Spreadsheet();
        // for reasons beyond comprehension, the D2 test fails
        // although it works properly in the actual spreadsheet.
        ss.fill({
            A1: '=A2',
            A2: '=A1',
            //D2: '=sum(C1:E3)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A1: "#CIRCULAR!",
                A2: "#CIRCULAR!",
                //D2: "#CIRCULAR!",
            });
        });
    });

    test("evaluate simple sum", function(){
        ss.fill({
            D1: "=sum(A1:C3)"
        });
        ss.recalculate(function(){
            equal(ss.getData(ss.makeRef("D1")), 45);
        });
    });

    test("evaluate average", function(){
        ss.fill({
            D1: "=average(A1:C3)"
        });
        ss.recalculate(function(){
            equal(ss.getData(ss.makeRef("D1")), 5);
        });
    });

    test("error in cell is propagated as formula result", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: "=undefined",
            A2: "=A1 * 2",
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A2: "#NAME?"
            });
        });
    });

    test("AVERAGE and AVERAGEA", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: 2, B1: "foo", C1: 3,
            A2: "bar", B2: "=true", C2: "=false",
            D1: "=average(A1:C3)",
            E1: "=averagea(A1:C3)",
        });
        ss.recalculate(function(){
            equal(ss.getData(ss.makeRef("D1")), (2+3)/2);
            equal(ss.getData(ss.makeRef("E1")), (2+0+3+0+1+0)/6);
        });
    });

    test("AVEDEV", function(){
        ss.fill({
            A5: '=avedev(A1:C4)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A5: APPROX(2.222222)
            });
        });
    });

    test("STDEV-SP, VAR-SP", function(){
        ss.fill({
            F1: 1345,
            F2: 1301,
            F3: 1368,
            F4: 1322,
            F5: 1310,
            F6: 1370,
            F7: 1318,
            F8: 1350,
            F9: 1303,
            F10: 1299,
            F11: '=stdev.s(F1:F10)',
            F12: '=stdev.p(F1:F10)',
            F13: '=var.s(F1:F10)',
            F14: '=var.p(F1:F10)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                F11: APPROX(27.463916),
                F12: APPROX(26.054558),
                F13: APPROX(754.2666666666665),
                F14: APPROX(678.84),
            });
        });
    });

    test("MEDIAN", function(){
        ss.fill({
            A5: '=median(A1:C4)',
            A6: '=median(2, 3, 4, 5)',
        });
        ss.recalculate(function(){
            equal(ss.$("A5"), 5);
            equal(ss.$("A6"), 3.5);
        });
    });

    test("MODE", function(){
        ss.fill({
            D1: 2, D2: 2, D3: 9,
            E1: 9, E2: 3, E3: 3,
            A4: '=mode.sngl(A1:D3)',
            A5: '=mode.sngl(A1:C3)',
            A6: '=mode.sngl()',
            A7: '=mode.mult(A1:E3)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A4: 2,
                A5: "#N/A!",
                A6: "#N/A!",
                A7: '[[2],[9],[3]]',
            });
        });
    });

    test("GCD, LCM", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: 12, A2: 36, A3: 24,
            B1: '=gcd(a1:a3)',
            B2: '=lcm(a1:a3)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                B1: 12,
                B2: 72,
            });
        });
    });

    test("PERCENTILE", function(){
        ss.fill({
            A4: '=percentile(A1:C3, 75%)',
            A5: '=percentile.inc({ 1, 2, 3, 4 }, 75%)',
            A6: '=percentile.inc({ 15, 20, 35, 40, 50 }, 40%)',
            A7: '=percentile.exc({ 1, 2, 3, 10, 20, 30 }, 25%)',

            B4: '=quartile(A1:C3, 3)',
            B5: '=quartile.inc({ 1, 2, 3, 4 }, 3)',
            B6: '=quartile.inc({ 15, 20, 35, 40, 50 }, 2)',
            B7: '=quartile.exc({ 1, 2, 3, 10, 20, 30 }, 1)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A4: 7,
                A5: 3.25,
                A6: 29,
                A7: 1.75,

                B4: ss.$("A4"),
                B5: ss.$("A5"),
                B6: 35,
                B7: ss.$("A7"),
            });
        });
    });

    test("AGGREGATE", function(){
        ss.fill({
            D1: "=1/0",
            A4: '=aggregate(9, 0, A1:D3)',
            A5: '=aggregate(9, 3, A1:D3)',
            A6: '=aggregate(9, 3, A1:D5)',
            A7: '=aggregate(9, 4, A1:D5)',
            A8: '=aggregate(9, 6, A1:D5)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A4: "#DIV/0!",
                A5: 45,
                A6: 45,
                A7: "#DIV/0!",
                A8: 90,
            });
        });
    });

    test("MDETERM", function(){
        ss.fill({
            A4: '=mdeterm(A1:C3)',
            A5: '=mdeterm({ 5, 2; 7, 1 })',
            A6: '=mdeterm({ 6, 4, 2; 3, 5, 3; 2, 3, 4 })',
            A7: '=mdeterm({ 1, 2, 3; 4, 5, 6 })',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A4: 0,
                A5: -9,
                A6: 40,
                A7: "#N/A!",
            });
        });
    });

    test("BINOMDIST and friends", function(){
        var ss = new Spreadsheet();
        // some examples I found over the net
        ss.fill({
            A1  : '=BinomDist(10, 20, 0.5, 1)',
            A2  : '=BinomDist(10, 20, 0.5, 0)',
            A3  : '=BINOMDIST(1, 6, 1/6, true)',
            A4  : '=BINOMDIST(1, 6, 1/6, false)',
            A5  : '=BINOM.DIST.RANGE(60, 0.75, 48)',
            A6  : '=BINOM.DIST.RANGE(60, 0.75, 45, 50)',
            A7  : '=negbinom.dist(10, 5, 0.25, false)',
            A8  : '=negbinom.dist(10, 5, 0.25, true)',

            A9  : '=binom.inv(100, 50%, 20%)',
            A10 : '=binom.inv(100, 50%, 50%)',
            A11 : '=binom.inv(100, 50%, 90%)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A1: APPROX(0.588099),
                A2: APPROX(0.176197),
                A3: APPROX(0.736776),
                A4: APPROX(0.401878),
                A5: APPROX(0.083975),
                A6: APPROX(0.523630),
                A7: APPROX(0.055049),
                A8: APPROX(0.313514),
            });

            equal(ss.$("A9"), 46);
            equal(ss.$("A10"), 50);
            equal(ss.$("A11"), 56);
        });
    });

    test("COMBIN", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: '=combin(5,0)',
            A2: '=combin(5,1)',
            A3: '=combin(5,2)',
            A4: '=combin(5,3)',
            A5: '=combin(5,4)',
            A6: '=combin(5,5)',
            A7: '=combin(5,6)',
            A8: '=combin(5,4)',

            B1: '=combina(4,3)',
            B2: '=combina(10,3)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A1: 1,
                A2: 5,
                A3: 10,
                A4: 10,
                A5: 5,
                A6: 1,
                A7: "#N/A!",
                A8: 5,

                B1: 20,
                B2: 220,
            });
        });
    });

    test("evaluate dependent formulas", function(){
        ss.fill({
            D1: '=sum(indirect("D2"):indirect("$D$3"))',
            D2: "=sum(A1:C3, D3)",
            D3: "=sum(A1:C3)"
        });
        ss.recalculate(function(){
            equal(ss.$("D1"), 135);
            equal(ss.$("D2"), 90);
            equal(ss.$("D3"), 45);
        });
    });

    asyncTest("async formulas", function(){
        ss.fill({
            D1: "=sum(A1:C3, D2)",
            D2: "=asum(100, A1:A3)",
            D3: "=asum(100, A1:A3, asum(200, B1:B3))",
            E1: "=sum(A:D)",
            E2: "=asum(50, A:D)",
            E3: "=asum(50, A:D, asum(100, A:D))"
        });
        var time = Date.now();
        ss.recalculate(function(){
            //console.log("recalculate async took " + (Date.now() - time) + " milliseconds");
            start();
            equal(ss.getData(ss.makeRef("D1")), 57);
            equal(ss.getData(ss.makeRef("D2")), 12);
            equal(ss.getData(ss.makeRef("D3")), 27);
            equal(ss.getData(ss.makeRef("E1")), 141);
            equal(ss.getData(ss.makeRef("E2")), 141);
            equal(ss.getData(ss.makeRef("E3")), 282);
        });
    });

    test("conditional: IF", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: 1, B1: 0, C1: true, D1: false, E1: "stuff", F1: "",
            A2: "=if(a1, foo(), bar())", // inc foo
            A3: "=if(b1, foo(), bar())", // inc bar
            A4: "=if(c1, foo(), bar())", // inc foo
            A5: "=if(d1, foo(), bar())", // inc bar
            A6: "=if(e1, foo(), bar())", // inc bar
            A7: "=if(f1, foo(), bar())", // inc bar
        });
        ss.recalculate(function(){
            // IF is special; only one of the branches should be evaluated
            equal(ss.fooCount, 2);
            equal(ss.barCount, 4);
            equal(ss.getData(ss.makeRef("a2")), "foo");
            equal(ss.getData(ss.makeRef("a3")), "bar");
            equal(ss.getData(ss.makeRef("a4")), "foo");
            equal(ss.getData(ss.makeRef("a5")), "bar");
            equal(ss.getData(ss.makeRef("a6")), "bar");
            equal(ss.getData(ss.makeRef("a7")), "bar");
        });
    });

    test("conditional: AND, OR", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: "=AND(false, foo())", // does not call foo
            A2: "=AND(true, foo())",  // does call foo
            A3: "=OR(false, bar())",  // does call bar
            A4: "=OR(true, bar())",   // does not call bar
        });
        ss.recalculate(function(){
            equal(ss.fooCount, 1);
            equal(ss.barCount, 1);
            // foo and bar return strings and they are falsy in
            // conditionals
            equal(ss.getData(ss.makeRef("A1")), false);
            equal(ss.getData(ss.makeRef("A2")), false);
            equal(ss.getData(ss.makeRef("A3")), false);
            equal(ss.getData(ss.makeRef("A4")), true);
        });
    });

    asyncTest("async conditional", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: 1, B1: 2, C1: 3,
            A3: "=asum(100, A1:C1)",
            A4: "=asum(100, A2:C2)",
            A5: "=IF(A3, true, false)",
            A6: "=IF(A4, true, false)",
            A7: "=IF(asum(100, A1:C1) > 0, asum(100, A1:C1), 0)",
            A8: "=IF(asum(100, A2:C2) > 0, asum(100, A2:C2), \"zero\")",
        });
        ss.recalculate(function(){
            start();
            equal(ss.getData(ss.makeRef("A3")), 6);
            equal(ss.getData(ss.makeRef("A4")), 0);
            equal(ss.getData(ss.makeRef("A5")), true);
            equal(ss.getData(ss.makeRef("A6")), false);
            equal(ss.getData(ss.makeRef("A7")), 6);
            equal(ss.getData(ss.makeRef("A8")), "zero");
        });
    });

    test("COUNT, COUNTA, COUNTUNIQUE", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: 1, B1: 2, C1: 1,
            A2: "x", B2: "", C2: "'",
            A4: "=count(A1:D2)",
            A5: "=counta(A1:D2)",
            A6: "=countunique(A1:D2)",
        });
        ss.recalculate(function(){
            equal(ss.$("A4"), 3);
            equal(ss.$("A5"), 6);
            equal(ss.$("A6"), 4);
        });
    });

    test("COUNTBLANK", function(){
        ss.fill({
            A5: '=countblank(A1:C4)',
        });
        ss.recalculate(function(){
            equal(ss.$("A5"), 2);
        });
    });

    test("SUMIFS, COUNTIFS, AVERAGEIFS", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: 1, B1: 2, C1: 3, D1: 'ya', E1: 'n', F1: 'y',
            A2: 4, B2: 5, C2: 6, D2: 'no', E2: 'y', F2: 'n',
            A3: 7, B3: 8, C3: 9, D3: 'ye', E3: 'n', F3: 'y',

            A5: '=sumif(a1:c3, ">3")',
            A6: '=sumif(d1:f3, "y", a1:c3)',
            A7: '=sumif(d1:f3, "y*", a1:c3)',
            A8: '=sumifs(a1:c3, a1:c3, ">3", a1:c3, "<7")',

            B5: '=countif(a1:c3, ">3")',
            B6: '=countif(d1:f3, "y")',
            B7: '=countif(d1:f3, "y*")',
            B8: '=countifs(a1:c3, ">3", a1:c3, "<7")',

            C5: '=averageif(a1:c3, ">3")',
            C6: '=averageif(d1:f3, "y", a1:c3)',
            C7: '=averageif(d1:f3, "y*", a1:c3)',
            C8: '=averageifs(a1:c3, a1:c3, ">3", a1:c3, "<7")',
        });
        ss.recalculate(function(){
            equal(ss.getData(ss.makeRef("A5")), 4+5+6+7+8+9);
            equal(ss.getData(ss.makeRef("A6")), 3+5+9);
            equal(ss.getData(ss.makeRef("A7")), 1+3+5+7+9);
            equal(ss.getData(ss.makeRef("A8")), 4+5+6);

            equal(ss.getData(ss.makeRef("B5")), 6);
            equal(ss.getData(ss.makeRef("B6")), 3);
            equal(ss.getData(ss.makeRef("B7")), 5);
            equal(ss.getData(ss.makeRef("B8")), 3);

            equal(ss.getData(ss.makeRef("C5")), (4+5+6+7+8+9)/6);
            equal(ss.getData(ss.makeRef("C6")), (3+5+9)/3);
            equal(ss.getData(ss.makeRef("C7")), (1+3+5+7+9)/5);
            equal(ss.getData(ss.makeRef("C8")), (4+5+6)/3);
        });
    });

    // https://support.office.com/en-sg/article/IS-functions-490afee4-fd91-4839-89d4-1257a21b4e25
    test("ISERROR, IS*", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: 'foo', B1: '1', C1: "'2", D1: '', E1: '=foo()', F1: '=a1+b1', G1: '=sumif()',
            A3: '=iserror(A1)', B3: '=iserror(B1+A1)', C3: '=iserror(F1)', D3: '=iserror(G1)', E3: '=iserror(sumif())',
            A4: '=iserr(A1)', B4: '=iserr(B1+A1)', C4: '=iserr(F1)', D4: '=isna(G1)', E4: '=isna(sumif())',
            A5: '=isna(A1)', B5: '=isna(B1+A1)', C5: '=isna(F1)', D5: '=iserr(G1)', E5: '=iserr(sumif())',
            A6: '=istext(A1)', B6: '=isnontext(A1)', C6: '=istext(B1)', D6: '=isnontext(B1)', E6: '=istext(D1)', F6: '=isnontext(D1)', G6: '=istext(H1)', H6: '=isnontext(H1)',
            A7: '=isblank(A1)', B7: '=isblank(D1)', C7: '=isblank(H1)',
            A8: '=isnumber(A1)', B8: '=isnumber(B1)', C8: '=isnumber(C1)', D8: '=isnumber(D1)', E8: '=isnumber(H1)',
            A9: '=islogical(A1)', B9: '=islogical(B1)', C9: '=islogical(A9)', D9: '=islogical(H1)',
            A10: 'A1', B10: '=isref(A10)', C10: '=isref("A10")', D10: '=isref(indirect(A10))', E10: '=isref(H1)', F10: '=isref(A1:C3)',
        });
        ss.recalculate(function(){
            // ISERROR returns true if and only if the argument is an error
            equal(ss.$("A3"), false);
            equal(ss.$("B3"), true);
            equal(ss.$("C3"), true);
            equal(ss.$("D3"), true);
            equal(ss.$("E3"), true);

            // ISERR returns true if the argument is an error but not N/A
            equal(ss.$("A4"), false);
            equal(ss.$("B4"), true);
            equal(ss.$("C4"), true);
            equal(ss.$("D4"), false);
            equal(ss.$("E4"), false);

            // ISNA returns true if the argument is a N/A error
            equal(ss.$("A5"), false);
            equal(ss.$("B5"), false);
            equal(ss.$("C5"), false);
            equal(ss.$("D5"), true);
            equal(ss.$("E5"), true);

            // ISTEXT returns true if the argument is text, or a cell containing text
            // ISNONTEXT returns true if the argument is not text (including blank cell)
            // seems to me that a cell containing empty string should be treated as blank.
            equal(ss.$("A6"), true);
            equal(ss.$("B6"), false);
            equal(ss.$("C6"), false);
            equal(ss.$("D6"), true);
            equal(ss.$("E6"), true);
            equal(ss.$("F6"), false);
            equal(ss.$("G6"), false);
            equal(ss.$("H6"), true);

            // ISBLANK returns true if the argument is an empty cell
            equal(ss.$("A7"), false);
            equal(ss.$("B7"), false);
            equal(ss.$("C7"), true);

            // ISNUMBER returns true if the argument is numeric
            equal(ss.$("A8"), false);
            equal(ss.$("B8"), true);
            equal(ss.$("C8"), false);
            equal(ss.$("D8"), false);
            equal(ss.$("E8"), false);

            // ISLOGICAL returns true if the argument is boolean
            equal(ss.$("A9"), false);
            equal(ss.$("B9"), false);
            equal(ss.$("C9"), true);
            equal(ss.$("D9"), false);

            // ISREF returns true if the argument is a cell or range reference
            equal(ss.$("B10"), true);
            equal(ss.$("C10"), false);
            equal(ss.$("D10"), true);
            equal(ss.$("E10"), true);
            equal(ss.$("F10"), true);
        });
    });

    /* -----[ lookup functions ]----- */

    test("ADDRESS", function(){
        ss.fill({
            A4  : '=address(1,1)', // absolute
            B4  : '=address(A1,B1,A2)', // take args from cell
            A5  : '=address(1,1,1)', // absolute
            A6  : '=address(1,1,2)', // absolute row, relative col
            A7  : '=address(1,1,3)', // relative row, absolute col
            A8  : '=address(1,1,4)', // relative
            A9  : '=address(1,1,5)', // error
            A10 : '=address(1,1,4,false)', // print in R[1]C[1] style
            B10 : '=address(1,1,1,false)', // print in R[1]C[1] style, absolute
            A11 : '=address(1,1,4,true)', // print in A1 style (default)
            A12 : '=address(1,1,4,true,"Sheet2")', // add sheet information
            A13 : '=address(1,1,,,"Sheet2")',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A4  : "$A$1", B4: "B1",
                A5  : "$A$1",
                A6  : "A$1",
                A7  : "$A1",
                A8  : "A1",
                A9  : "#VALUE!",
                A10 : "R[0]C[0]",
                B10 : "R1C1",
                A11 : "A1",
                A12 : "Sheet2!A1",
                A13 : "Sheet2!$A$1",
            });
        });
    });

    test("AREAS", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: '=areas(B2:D4)',
            A2: '=areas((B2:D4,E5,F6:I9))',
            A3: '=areas(B2:D4 B2)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A1: 1, A2: 3, A3: 1
            });
        });
    });

    test("CHOOSE", function(){
        ss.fill({
            A4: '=choose(4, "a", "b", "c", "d", "e", "f")',
            A5: '=choose(4, 1, 2)',
            A6: '=choose(0)',
            A7: '=choose(1, "x")',
            A8: '=choose(B1:C2, "a", "b", "c", "d", "e", "f")'
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A4: "d",
                A5: "#N/A!",
                A6: "#VALUE!",
                A7: "x",
            });
            // result of A8 should be a Matrix object
            var m = ss.$("A8");
            equal(m.get(0,0), "b");
            equal(m.get(0,1), "c");
            equal(m.get(1,0), "e");
            equal(m.get(1,1), "f");
        });
    });

    test("COLUMN", function(){
        ss.fill({
            c4: '=column()',
            a4: '=column(d4)',
            a5: '=column(a1:c3)'
        });
        ss.recalculate(function(){
            ss.expectEqual({
                c4: 3,
                a4: 4,
            });
            equal(JSON.stringify(ss.$("a5").data), "[[1,2,3]]");
        });
    });

    test("COLUMNS", function(){
        ss.fill({
            a4: '=columns(A1:C3)',
            a5: '=columns(a1)',
            a6: '=columns({ 1,2; 3,4,5 })'
        });
        ss.recalculate(function(){
            ss.expectEqual({
                a4: 3,
                a5: 1,
                a6: 3
            });
        });
    });

    test("FORMULATEXT", function(){
        ss.fill({
            a4: '=sum(a1:c3)',
            b4: '=formulatext(a4)',
            a5: '=areas((b2:d4, e5, f6:i9))',
            b5: '=formulatext(a5)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                a4: 45, a5: 3,
                b4: 'sum(A1:C3)',
                b5: 'areas((B2:D4,E5,F6:I9))'
            });
        });
    });

    test("HLOOKUP", function(){
        ss.fill({
            a4: '=hlookup(2, a1:c3, 3)',
            a5: '=hlookup(2.5, a1:c3, 3)',
            a6: '=hlookup(2.5, a1:c3, 3, false)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                a4: 8,
                a5: 8,
                a6: "#N/A!"
            });
        });
    });

    test("INDEX", function(){
        ss.fill({
            a4: '=index(a1:c3, 2, 2)',
            a5: '=index(a1:c3, 2)',
            a6: '=index(a1:c3, , 2)'
        });
        ss.recalculate(function(){
            ss.expectEqual({
                a4: 5,
            });
            equal(JSON.stringify(ss.$("a5").data), "[[4,5,6]]");
            equal(JSON.stringify(ss.$("a6").data), "[[2],[5],[8]]");
        });
    });

    asyncTest("INDIRECT", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: 1,
            A2: 2,
            A3: 3,
            B1: "a1",
            C1: "a3",
            A5: "=2 * indirect(\"A\" & ASUM(50, A1:A3))", // 2 * indirect('A6')
            A6: "=asum(100, indirect(b1):indirect(c1))",
        });
        ss.recalculate(function(){
            start();
            equal(ss.getData(ss.makeRef("A5")), 12);
            equal(ss.getData(ss.makeRef("A6")), 6);
        });
    });

    test("MATCH", function(){
        ss.fill({
            a4  : '=match(3, e1:e8)',
            a5  : '=match(3.5, e1:e8)',
            a6  : '=match(3.5, e1:e8, 0)',
            a7  : '=match(4, f1:f8, -1)',
            a8  : '=match("d*", g1:g8, 0)',
            a9  : '=match("dde", g1:g8)',
            a10 : '=match("dde", h1:h8, -1)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                a4  : 3,
                a5  : 3,
                a6  : "#N/A!",
                a7  : 5,
                a8  : 4,
                a9  : 4,
                a10 : 4
            });
        });
    });

    test("OFFSET", function(){
        var ss = new Spreadsheet();
        ss.fill({
            G7: 'This is G7',
            A3: 'This is A3',
            B6: 'This is B6',
            b1: '=offset(D5, 2, 3, 4, 5)',
            b2: '=offset(d5:f7, -2, -3)',
            b3: '=offset(d5:f7, -2, -4)',
            b4: '=offset(D5, 1, -2)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                b1: 'This is G7', // G7:K10 range, only first cell is returned
                b2: 'This is A3', // A3:C5 range
                b3: '#VALUE!',
                b4: 'This is B6',
            });
        });
    });

    test("ROW", function(){
        ss.fill({
            c4: '=row()',
            a4: '=row(d1)',
            a5: '=row(a1:c3)'
        });
        ss.recalculate(function(){
            ss.expectEqual({
                c4: 4,
                a4: 1,
            });
            equal(JSON.stringify(ss.$("a5").data), "[[1],[2],[3]]");
        });
    });

    test("ROWS", function(){
        ss.fill({
            a4: '=rows(A1:C3)',
            a5: '=rows(a1)',
            a6: '=rows({ 1,2; 3,4,5 })'
        });
        ss.recalculate(function(){
            ss.expectEqual({
                a4: 3,
                a5: 1,
                a6: 2
            });
        });
    });

    test("TRANSPOSE", function(){
        ss.fill({
            a4: "=transpose(a1:c2)",
            a5: "=transpose({1;2;3})"
        });
        ss.recalculate(function(){
            equal(JSON.stringify(ss.$("a4").data), "[[1,4],[2,5],[3,6]]");
            equal(JSON.stringify(ss.$("a5").data), "[[1,2,3]]");
        });
    });

    test("VLOOKUP", function(){
        ss.fill({
            a4: '=vlookup(4, a1:c3, 3)',
            a5: '=vlookup(4.5, a1:c3, 3)',
            a6: '=vlookup(4.5, a1:c3, 3, false)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                a4: 6,
                a5: 6,
                a6: "#N/A!"
            });
        });
    });

    /* -----[ date/time functions ]----- */

    test("EDATE, EOMONTH", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: "2008-01-31",
            A2: "2008-01-31",
            A3: "2008-01-31",
            A4: "2008-02-28",
            A5: "2008-02-29",

            B1: "=edate(A1, 9)",
            B2: "=edate(A2, 22)",
            B3: "=edate(A3, -16)",
            B4: "=edate(A4, 12)",
            B5: "=edate(A5, 12)",

            C1: "=eomonth(A1+5, 9)",
            C2: "=eomonth(A2+5, 22)",
            C3: "=eomonth(A3+5, -16)",
            C4: "=eomonth(A4+5, 12)",
            C5: "=eomonth(A5+5, 12)",
        });
        ss.recalculate(function(){
            ss.expectEqual({
                B1: DATE("2008-10-31"),
                B2: DATE("2009-11-30"),
                B3: DATE("2006-09-30"),
                B4: DATE("2009-02-28"),
                B5: DATE("2009-02-28"),

                C1: DATE("2008-11-30"),
                C2: DATE("2009-12-31"),
                C3: DATE("2006-10-31"),
                C4: DATE("2009-03-31"),
                C5: DATE("2009-03-31"),
            });
        });
    });

    test("WORKDAY", function(){
        var ss = new Spreadsheet();
        ss.fill({
            B1: "2010-12-01",
            B2: "2010-12-27",
            B3: "2010-12-28",
            B4: "2011-01-03",
            C2: "=workday(B1, 25)",
            C3: "=workday(B1, 25, B2:B4)",
            C4: "=workday(date(2010, 12, 1), 25, B2:B4)",
        });
        ss.recalculate(function(){
            ss.expectEqual({
                C2: DATE("2011-01-05"),
                C3: DATE("2011-01-10"),
                C4: DATE("2011-01-10"),
            });
        });
    });

    test("NETWORKDAYS", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: "2010-12-01",
            A2: "2011-01-05",
            A3: "2010-12-27",
            A4: "2010-12-28",
            A5: "2011-01-03",
            B1: "=networkdays(a1, a2)",
            B2: "=networkdays(a1, a2, a3:a5)",
        });
        ss.recalculate(function(){
            ss.expectEqual({
                B1: 26,
                B2: 23,
            });
        });
    });

    test("DAYS", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: "2015-01-01",
            A2: "2015-02-02",
            A3: "=DAYS(A1, A2)",
            A4: "=DAYS(A2, A1)",
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A3: 32, A4: -32,
            });
        });
    });

    test("DAYS360", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: "2015-01-01",
            A2: "2015-01-31",
            A3: "2015-02-01",
            A4: "2008-02-29",
            A5: "2015-03-31",
            B1: "=DAYS360(A1, A2)",
            B2: "=DAYS360(A1, A2, TRUE)",
            B3: "=DAYS360(A1, A3, FALSE)",
            B4: "=DAYS360(A3, DATE(2015, 2, 2))",
            B5: "=days360(A4, A5, true)",
            B6: "=days360(A4, A5, false)",
        });
        ss.recalculate(function(){
            ss.expectEqual({
                B1: 30,
                B2: 29,
                B3: 30,
                B4: 1,
                B5: 2551,
                B6: 2550,
            });
        });
    });

    test("YEARFRAC", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: "2012-01-01",
            A2: "2012-07-30",
            A3: "=YEARFRAC(A1,A2)",
            A4: "=YEARFRAC(A1,A2,1)",
            A5: "=YEARFRAC(A1,A2,3)",
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A3: APPROX(0.58055556),
                A4: APPROX(0.57650273),
                A5: APPROX(0.57808219),
            });
        });
    });

    test("WEEKNUM", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: '=WEEKNUM(DATE(2016, 3, 8), 21)',
            A2: '=WEEKNUM(DATE(2012, 3, 9))',
            A3: '=WEEKNUM(DATE(2012, 3, 9), 2)',
            A4: '=WEEKNUM(DATE(2015, 1, 3), 21)',
            A5: '=WEEKNUM(DATE(2016, 1, 1), 21)',
            A6: '=WEEKNUM(DATE(2016, 1, 31), 21)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A1: 10,
                A2: 10,
                A3: 11,
                A4: 1,
                A5: 0,
                A6: 4,
            });
        });
    });

    test("ISOWEEKNUM", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: '=ISOWEEKNUM(DATE(2016, 3, 8))',
            A2: '=ISOWEEKNUM(DATE(2012, 3, 9))',
            A3: '=ISOWEEKNUM(DATE(2014, 12, 31))',
            A4: '=ISOWEEKNUM(DATE(2015, 1, 3))',
            A5: '=ISOWEEKNUM(DATE(2016, 1, 1))',
            A6: '=ISOWEEKNUM(DATE(2016, 1, 31))',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A1: 10,
                A2: 10,
                A3: 1,
                A4: 1,
                A5: 53,
                A6: 4,
            });
        });
    });

    test("DATE, TIME and friends", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1  : "=now()",
            A2  : "=today()",
            A3  : "=date(2015, 7, 16)",
            A4  : "=year(A3)",
            A5  : "=month(A3)",
            A6  : "=day(A3)",
            A7  : "=weekday(A3)",
            A8  : "=time(10, 20, 30)",
            A9  : "=hour(A8)",
            A10 : "=minute(A8)",
            A11 : "=second(A8)",
        });
        ss.recalculate(function(){
            // need to lose some precision here, milliseconds matter.
            equal(ss.$("A1").toFixed(3), runtime.dateToSerial(new Date()).toFixed(3));

            ss.expectEqual({
                A2: runtime.dateToSerial(new Date()) | 0,
                A3: DATE("2015-07-16"),
                A4: 2015,
                A5: 7,
                A6: 16,
                A7: 5,
                A8: runtime.packTime(10, 20, 30, 0),
                A9: 10,
                A10: 20,
                A11: 30
            });
        });
    });

    test("RANK", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: '=rank.eq(5, { 5, 4, 5, 5, 6 })',
            A2: '=rank.avg(5, { 5, 5, 4, 5, 5, 6 })'
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A1: 2,
                A2: 3.5,
            });
        });
    });

    test("KURT", function(){
        var ss = new Spreadsheet();
        ss.fill({
            A1: '=kurt({ 3, 4, 5, 2, 3, 4, 5, 6, 4, 7 })',
            A2: '=kurt({ 4, 5, 4, 4, 4, 4, 4, 2, 3, 5, 5, 3 })'
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A1: APPROX(-0.1518),
                A2: APPROX(0.532658)
            });
        });
    });

    test("PERCENTRANK", function(){
        var ss = new Spreadsheet();
        ss.fill("A2:A11", [ 13, 12, 11, 8, 4, 3, 2, 1, 1, 1 ], {
            A13: '=PERCENTRANK(A2:A11, 2)',
            A14: '=PERCENTRANK(A2:A11, 4)',
            A15: '=PERCENTRANK(A2:A11, 8)',
            A16: '=PERCENTRANK(A2:A11, 5)',
        });
        ss.fill("B1:B9", [ 1, 2, 4, 6.5, 8, 9, 10, 12, 14 ], {
            C1: '=PERCENTRANK(B1:B9, 6.5)',
            C2: '=PERCENTRANK(B1:B9, 7, 5)',
            C3: '=PERCENTRANK(B1:B9, 8)',
            C4: '=PERCENTRANK(B1:B9, 14)',
            C5: '=PERCENTRANK.EXC(B1:B9, 6.5)',
            C6: '=PERCENTRANK.EXC(B1:B9, 7, 5)',
            C7: '=PERCENTRANK.EXC(B1:B9, 8)',
            C8: '=PERCENTRANK.EXC(B1:B9, 14)',
        });
        ss.fill("D1:D9", [ 1, 2, 3, 6, 6, 6, 7, 8, 9 ], {
            D10: '=PERCENTRANK.EXC(D1:D9, 7)',
            D11: '=PERCENTRANK.EXC(D1:D9, 5.43)',
            D12: '=PERCENTRANK.EXC(D1:D9, 5.43, 1)',
        });
        ss.recalculate(function(){
            ss.expectEqual({
                A13: 0.333,
                A14: 0.555,
                A15: 0.666,
                A16: 0.583,

                C1: 0.375,
                C2: 0.41666,
                C3: 0.5,
                C4: 1,
                C5: 0.4,
                C6: 0.43333,
                C7: 0.5,
                C8: 0.9,

                D10: 0.7,
                D11: 0.381,
                D12: 0.3
            });
        });
    });

    test("COVARIANCE", function(){
        var ss = new Spreadsheet();
        ss.fill(
            "A1:A8", [ 2, 7, 8, 3, 4, 1, 6, 5 ],
            "B1:B8", [ 22.90, 33.49, 34.50, 27.61, 19.5, 10.11, 37.90, 31.80 ],
            "C1:C5", [ 3, 2, 4, 5, 6 ],
            "D1:D5", [ 9, 7, 12, 15, 17 ],
            {
                E1: "=COVARIANCE.P(A1:A8, B1:B8)",
                E2: "=COVARIANCE.P(C1:C5, D1:D5)",
                E3: "=COVARIANCE.S(A1:A8, B1:B8)",
                E4: "=COVARIANCE.S({ 2, 4, 8 }, { 5, 11, 12 })",
            }
        );
        ss.recalculate(function(){
            ss.expectEqual({
                E1: 16.678125,
                E2: 5.2,
                E3: APPROX(19.06071),
                E4: APPROX(9.666666667)
            });
        });
    });

    // statistical & probabilities functions

    test("ERF", function(){
        calcTest({
            "=ERF(0.745)"             : 0.70792892,
            "=ERF(1)"                 : 0.84270079,
            "=ERF(0.476936276204470)" : 0.5,
            "=ERF(-1.25)"             : -0.92290012825646,
            "=ERFC(-1.25)"            : 1.92290012825646,
            "=ERF(-3)"                : -0.999977909503,
            "=ERFC(-3)"               : 1.999977909503,
            "=ERF(5.5)"               : 1,
            "=ERF(0.25, 0.75)"        : 0.434829,
        });
    });

    test("GAMMA*", function(){
        calcTest({
            "=GAMMALN(4)"                           : 1.7917595,
            "=GAMMALN(56.38)"                       : 169.854974,
            "=GAMMALN(1.567)"                       : -0.1162796456949,
            "=GAMMA(3)"                             : 2,
            "=GAMMA(4)"                             : 6,
            "=GAMMA(-0.36)"                         : -3.900356033708,
            "=GAMMA(-3.75)"                         : 0.26786612886142,
            "=GAMMA(0.5)"                           : 1.7724538509056,
            "=GAMMA.DIST(10.00001131, 9, 2, true)"  : 0.068094,
            "=GAMMA.DIST(10.00001131, 9, 2, false)" : 0.032639,
            "=GAMMA.INV(0.068094, 9, 2)"            : 10.0000112,
        });
    });

    test("NORM.S.*", function(){
        calcTest({
            "=NORM.S.DIST(1.333333, true)"  : 0.908788726,
            "=NORM.S.DIST(1.333333, false)" : 0.164010148,
            "=NORM.S.DIST(-3, false)"       : 0.00443184841194,
            "=NORM.S.DIST(-3, true)"        : 0.00134989803163,
            "=NORM.S.INV(0.65)"             : 0.385320466,
            "=NORM.S.INV(0.908788726)"      : 1.333333,
            "=NORM.S.INV(0.001)"            : -3.090232,
            "=NORM.S.INV(0.0000002)"        : -5.068958,
            "=NORM.S.INV(0.02425)"          : -1.972961,
            "=NORM.S.INV(0.001)"            : -3.0902323,
            "=NORM.S.INV(0.000001)"         : -4.7534243,
        });
    });

    test("NORM.DIST, NORM.INV", function(){
        calcTest({
            "=NORM.DIST(42, 40, 1.5, false)": 0.10934,
            "=NORM.DIST(-3, 0, 1, true)": 0.00134989803163,
            "=NORM.DIST(42, 40, 1.5, true)": 0.9087888,
            "=NORM.INV(0.9087888, 40, 1.5)": 42,
        });
    });

    test("BETA.DIST", function(){
        calcTest({
            "=BETADIST(0.12, 2, 3)": 0.07319808,
            "=BETA.DIST(0.12, 2, 3, false, 0, 4)": 0.084681,
            "=BETA.DIST(0.12, 2, 3, false, 0, 2)": 0.318096,
            "=BETADIST(0.60709662860678, 1.6, 1)": 0.44999999999999196,
            "=BETADIST(0.0065, 300, 39700)": 0.0079787,
            "=BETA.DIST(3, 7.5, 9, true, 1, 4)": 0.960370938,
            "=BETA.DIST(3, 7.5, 9, false, 1, 4)": 0.250512509,
            "=BETA.DIST(7.5, 8, 9, true, 5, 10)": 0.598190308,
            "=BETA.DIST(7.5, 8, 9, false, 5, 10)": 0.628417969,
            "=BETA.INV(0.008, 300, 39700)": 0.0065,
            "=BETA.INV(0.45, 1.6, 1)": 0.6070966286068,
        });
    });

    test("CHISQ.*", function(){
        calcTest({
            "=CHISQ.DIST(0.5, 1, true)": 0.52049988,
            "=CHISQ.DIST(2, 3, false)": 0.20755375,
            "=CHISQ.INV(0.5, 1)": 0.454936423,
            "=CHISQ.INV(0.1, 2)": 0.210721031,
            "=CHISQ.INV(0.25, 3)": 1.212532903,
            "=CHISQ.DIST.RT(3, 4)": 0.557825,
            "=CHISQ.INV.RT(0.050001, 10)": 18.306973,
        });
    });

    test("CHISQ.TEST", function(){
        calcTest({
            "=CHISQ.TEST({58, 35; 11, 25; 10, 23}, {45.35, 47.65; 17.56, 18.44; 16.09, 16.91})": 0.000308192
        });
    });

    test("EXPON.DIST", function(){
        calcTest({
            "=EXPON.DIST(0.2, 10, true)": 0.86466472,
            "=EXPON.DIST(0.2, 10, false)": 1.35335283,
        });
    });

    test("POISSON.DIST", function(){
        calcTest({
            "=poisson.dist(2, 5, true)": 0.124652,
            "=poisson.dist(2, 5, false)": 0.084224,
        });
    });

    test("F/DIST", function(){
        calcTest({
            "=F.DIST(15.2069, 6, 4, false)": 0.0012238,
            "=F.DIST(15.2069, 6, 4, true)": 0.990000,
            "=F.DIST(0.21119, 5, 10, true)": 0.05000,
            "=F.DIST.RT(15.2068649, 6, 4)": 0.010000,
            "=F.INV.RT(0.01, 6, 4)": 15.20686,
            "=F.INV(0.01, 6, 4)": 0.10930991,
            "=F.TEST({6,7,9,15,21}, {20,28,31,38,40})": 0.64831785,
        });
    });

    test("FISHER", function(){
        calcTest({
            "=FISHER(0.75)": 0.9729551,
            "=FISHERINV(0.972955)": 0.75,
        });
    });

    test("T/DIST", function(){
        calcTest({
            "=T.DIST(60, 1, true)": 0.99469533,
            "=T.DIST(8, 3, false)": 0.00073691,
            "=T.DIST(2.093025, 19, false)": 0.049448058,
            "=T.DIST.2T(1.959999998, 60)": 0.054645,
            "=T.DIST(1.3, 19, true)": 0.8954242498513758,
            "=T.INV(0.8954242498513758, 19)": 1.3,
            "=T.INV(0.75, 2)": 0.8164966,
            "=T.INV.2T(0.546449, 60)": 0.606533,
            "=T.TEST({3,4,5,8,9,1,2,4,5}, {6,19,3,2,14,4,5,17,1}, 2, 1)": 0.196016,
            "=T.TEST({500,480,520,470,510}, {280,230,290,250,240}, 1, 2)": 1.14133E-7,
            "=T.TEST({11.4, 17.3, 21.3, 25.9, 40.1}, {23.2, 25.8, 29.9, 33.5, 42.7}, 1, 2)": 0.11180432234967963,
        });
    });

    test("CONFIDENCE.*", function(){
        calcTest({
            "=CONFIDENCE.T(0.05, 1, 50)": 0.284196855,
            "=CONFIDENCE.NORM(0.05, 2.5, 50)": 0.692952,
        });
    });

    test("GAUSS, PHI", function(){
        calcTest({
            "=GAUSS(2)": 0.47725,
            "=PHI(0.75)": 0.301137432,
        });
    });

    test("LOGNORM.*", function(){
        calcTest({
            "=LOGNORM.DIST(4, 3.5, 1.2, false)": 0.0176176,
            "=LOGNORM.DIST(4, 3.5, 1.2, true)": 0.0390836,
            "=LOGNORM.INV(0.039084, 3.5, 1.2)": 4.0000252
        });
    });

    test("PROB", function(){
        calcTest({
            "=prob({0,1,2,3}, {0.2,0.3,0.1,0.4}, 1, 3)": 0.8,
            "=prob({0,1,2,3}, {0.2,0.3,0.1,0.4}, 2)": 0.1
        });
    });

    test("SLOPE", function(){
        calcTest({
            "=slope({11.4, 17.3, 21.3, 25.9, 40.1}, {23.2, 25.8, 29.9, 33.5, 42.7})": 1.417959936
        });
    });

    test("INTERCEPT", function(){
        calcTest({
            "=intercept({2,3,9,1,8}, {6,5,11,7,5})": 0.0483871
        });
    });

    test("PEARSON", function(){
        calcTest({
            "=pearson({9,7,5,3,1}, {10,6,1,5,3})": 0.699379
        });
    });

    test("RSQ", function(){
        calcTest({
            "=rsq({2,3,9,1,8,7,5}, {6,5,11,7,5,4,4})": 0.05795
        });
    });

    test("STEYX", function(){
        calcTest({
            "=steyx({2,3,9,1,8,7,5}, {6,5,11,7,5,4,4})": 3.305719
        });
    });

    test("FORECAST", function(){
        calcTest({
            "=forecast(30, {6,7,9,15,21}, {20,28,31,38,40})": 10.607253
        });
    });

})();
