// -*- fill-column: 100 -*-

(function(f, define){
    define([ "./references" ], f);
})(function(){

    "use strict";

    // WARNING: removing the following jshint declaration and turning
    // == into === to make JSHint happy will break functionality.
    /* jshint eqnull:true, newcap:false, laxbreak:true, shadow:true, validthis:true, -W054, loopfunc: true */
    /* global console */
    /* jshint latedef: nofunc */

    var calc = {};
    var spreadsheet = kendo.spreadsheet;
    spreadsheet.calc = calc;
    var exports = calc.runtime = {};
    var Class = kendo.Class;

    var Ref = spreadsheet.Ref;
    var CellRef = spreadsheet.CellRef;
    var RangeRef = spreadsheet.RangeRef;
    var UnionRef = spreadsheet.UnionRef;

    /* -----[ Errors ]----- */

    var CalcError = Class.extend({
        init: function CalcError(code) {
            this.code = code;
        },
        toString: function() {
            return "#" + this.code + "!";
        }
    });

    /* -----[ Context ]----- */

    var Context = Class.extend({
        init: function Context(callback, formula, ss, parent) {
            this.callback = callback;
            this.formula = formula;
            this.ss = ss;
            this.parent = parent;
        },

        resolve: function(val) {
            var self = this;
            if (val instanceof Ref) {
                self.resolveCells([ val ], function(){
                    val = self.ss.getData(val);
                    if (Array.isArray(val)) {
                        // got a Range, we should return a single value
                        val = val[0];
                    }
                    self._resolve(val);
                });
            } else {
                self._resolve(val);
            }
        },

        _resolve: function(val) {
            var f = this.formula;
            f.value = val;
            this.ss.onFormula(f.sheet, f.row, f.col, val);
            if (this.callback) {
                this.callback(val);
            }
        },

        resolveCells: function(a, f) {
            var context = this, formulas = [];

            (function loop(a){
                for (var i = 0; i < a.length; ++i) {
                    var x = a[i];
                    if (x instanceof Ref) {
                        add(context.ss.getRefCells(x));
                    }
                    if (Array.isArray(x)) {
                        // make sure we resolve cells in literal matrices
                        loop(x);
                    }
                }
            })(a);

            if (!formulas.length) {
                return f.call(context);
            }

            for (var pending = formulas.length, i = 0; i < formulas.length; ++i) {
                fetch(formulas[i]);
            }
            function fetch(cell) { // jshint ignore:line, because you are stupid.
                cell.formula.exec(context.ss, function(){
                    if (!--pending) {
                        f.call(context);
                    }
                }, context);
            }
            function add(a) {
                for (var i = 0; i < a.length; ++i) {
                    var cell = a[i];
                    if (cell.formula) {
                        formulas.push(cell);
                    }
                }
                return true;
            }
        },

        cellValues: function(a, f) {
            var ret = [];
            for (var i = 0; i < a.length; ++i) {
                var val = a[i];
                if (val instanceof Ref) {
                    val = this.ss.getData(val);
                    ret = ret.concat(val);
                } else if (Array.isArray(val)) {
                    ret = ret.concat(this.cellValues(val));
                } else if (val instanceof Matrix) {
                    ret = ret.concat(this.cellValues(val.data));
                } else {
                    ret.push(val);
                }
            }
            if (f) {
                return f.apply(this, ret);
            }
            return ret;
        },

        force: function(val) {
            if (val instanceof Ref) {
                return this.ss.getData(val);
            }
            return val;
        },

        func: function(fname, callback, args) {
            fname = fname.toLowerCase();
            if (Object.prototype.hasOwnProperty.call(FUNCS, fname)) {
                return FUNCS[fname].call(this, callback, args);
            }
            callback(new CalcError("NAME"));
        },

        bool: function(val) {
            if (val instanceof Ref) {
                val = this.ss.getData(val);
            }
            if (typeof val == "string") {
                return val.toLowerCase() == "true";
            }
            if (typeof val == "number") {
                return val !== 0;
            }
            if (typeof val == "boolean") {
                return val;
            }
            return val != null;
        },

        asMatrix: function(range) {
            if (range instanceof Matrix) {
                return range;
            }
            var self = this;
            if (range instanceof RangeRef) {
                var tl = range.topLeft;
                var top = tl.row, left = tl.col;
                var cells = self.ss.getRefCells(range);
                var m = new Matrix(self);
                if (isFinite(range.width())) {
                    m.width = range.width();
                }
                if (isFinite(range.height())) {
                    m.height = range.height();
                }
                if (!isFinite(top)) {
                    top = 0;
                }
                if (!isFinite(left)) {
                    left = 0;
                }
                cells.forEach(function(cell){
                    m.set(cell.row - top,
                          cell.col - left,
                          cell.value);
                });
                return m;
            }
            if (Array.isArray(range) && range.length > 0) {
                var m = new Matrix(self), row = 0;
                range.forEach(function(line){
                    var col = 0;
                    var h = 1;
                    line.forEach(function(el){
                        var isRange = el instanceof RangeRef;
                        if (el instanceof Ref && !isRange) {
                            el = self.ss.getData(el);
                        }
                        if (isRange || Array.isArray(el)) {
                            el = self.asMatrix(el);
                        }
                        if (el instanceof Matrix) {
                            el.each(function(el, r, c){
                                m.set(row + r, col + c, el);
                            });
                            h = Math.max(h, el.height);
                            col += el.width;
                        } else {
                            m.set(row, col++, el);
                        }
                    });
                    row += h;
                });
                return m;
            }
        }
    });

    var Matrix = Class.extend({
        init: function Matrix(context) {
            this.context = context;
            this.height = 0;
            this.width = 0;
            this.data = [];
        },
        clone: function() {
            var m = new Matrix(this.context);
            m.height = this.height;
            m.width = this.width;
            m.data = this.data.map(function(row){ return row.slice(); });
            return m;
        },
        get: function(row, col) {
            var line = this.data[row];
            var val = line ? line[col] : null;
            return val instanceof Ref ? this.context.ss.getData(val) : val;
        },
        set: function(row, col, data) {
            var line = this.data[row];
            if (line == null) {
                line = this.data[row] = [];
            }
            line[col] = data;
            if (row >= this.height) {
                this.height = row + 1;
            }
            if (col >= this.width) {
                this.width = col + 1;
            }
        },
        each: function(f, includeEmpty) {
            for (var row = 0; row < this.height; ++row) {
                for (var col = 0; col < this.width; ++col) {
                    var val = this.get(row, col);
                    if (includeEmpty || val != null) {
                        val = f.call(this.context, val, row, col);
                        if (val !== undefined) {
                            return val;
                        }
                    }
                }
            }
        },
        map: function(f, includeEmpty) {
            var m = new Matrix(this.context);
            this.each(function(el, row, col){
                // here `this` is actually the context
                m.set(row, col, f.call(this, el, row, col));
            }, includeEmpty);
            return m;
        },
        eachRow: function(f) {
            for (var row = 0; row < this.height; ++row) {
                var val = f.call(this.context, row);
                if (val !== undefined) {
                    return val;
                }
            }
        },
        eachCol: function(f) {
            for (var col = 0; col < this.width; ++col) {
                var val = f.call(this.context, col);
                if (val !== undefined) {
                    return val;
                }
            }
        },
        mapRow: function(f) {
            var m = new Matrix(this.context);
            this.eachRow(function(row){
                m.set(row, 0, f.call(this.context, row));
            });
            return m;
        },
        mapCol: function(f) {
            var m = new Matrix(this.context);
            this.eachCol(function(col){
                m.set(0, col, f.call(this.context, col));
            });
            return m;
        },
        toString: function() {
            return JSON.stringify(this.data);
        },
        transpose: function() {
            var m = new Matrix(this.context);
            this.each(function(el, row, col){
                m.set(col, row, el);
            });
            return m;
        },
        unit: function(n) {
            this.width = this.height = n;
            var a = this.data = new Array(n);
            for (var i = n; --i >= 0;) {
                var row = a[i] = new Array(n);
                for (var j = n; --j >= 0;) {
                    row[j] = i == j ? 1 : 0;
                }
            }
            return this;
        },
        determinant: function() {
            // have to thank my father for this function.
            // http://docere.ro/o-aplicatie-pentru-browser-cu-determinanti-si-sisteme-liniare/
            var a = this.clone().data;
            var n = a.length;
            var d = 1, C, L, i, k;
            for (C = 0; C < n; C++) {
                for (L = C; (L < n) && (!a[L][C]); L++) {}
                if (L == n) {
                    return 0;
                }
                if (L != C) {
                    d = -d;
                    for (k = C; k < n; k++) {
                        var t = a[C][k];
                        a[C][k] = a[L][k];
                        a[L][k] = t;
                    }
                }
                for (i = C+1; i < n; i++) {
                    for (k = C+1; k < n; k++) {
                        a[i][k] -= a[C][k] * a[i][C] / a[C][C];
                    }
                }
                d *= a[C][C];
            }
            return d;
        },
        inverse: function() {
            var n = this.width;
            var m = this.augment(new Matrix(this.context).unit(n));
            var a = m.data;
            var tmp;

            // Gaussian elimination
            // https://en.wikipedia.org/wiki/Gaussian_elimination#Finding_the_inverse_of_a_matrix

            // 1. Get zeros below main diagonal
            for (var k = 0; k < n; ++k) {
                var imax = argmax(k, n, function(i){ return a[i][k]; });
                if (!a[imax][k]) {
                    return null; // singular matrix
                }
                if (k != imax) {
                    tmp = a[k];
                    a[k] = a[imax];
                    a[imax] = tmp;
                }
                for (var i = k+1; i < n; ++i) {
                    for (var j = k+1; j < 2*n; ++j) {
                        a[i][j] -= a[k][j] * a[i][k] / a[k][k];
                    }
                    a[i][k] = 0;
                }
            }

            // 2. Get 1-s on main diagonal, dividing by pivot
            for (var i = 0; i < n; ++i) {
                for (var f = a[i][i], j = 0; j < 2*n; ++j) {
                    a[i][j] /= f;
                }
            }

            // 3. Get zeros above main diagonal.  Actually, we only care to compute the right side
            // here (that will be the inverse), so in the inner loop below we go while j >= n,
            // instead of j >= k.
            for (var k = n; --k >= 0;) {
                for (var i = k; --i >= 0;) {
                    if (a[i][k]) {
                        for (var j = 2*n; --j >= n;) {
                            a[i][j] -= a[k][j] * a[i][k];
                        }
                    }
                }
            }

            return m.slice(0, n, n, n);
        },
        augment: function(m) {
            var ret = this.clone(), n = ret.width;
            m.each(function(val, row, col){
                ret.set(row, col + n, val);
            });
            return ret;
        },
        slice: function(row, col, height, width) {
            var m = new Matrix(this.context);
            for (var i = 0; i < height; ++i) {
                for (var j = 0; j < width; ++j) {
                    m.set(i, j, this.get(row + i, col + j));
                }
            }
            return m;
        }

        // XXX: debug
        // dump: function() {
        //     this.data.forEach(function(row){
        //         console.log(row.map(function(val){
        //             var str = val.toFixed(3).replace(/\.?0*$/, function(s){
        //                 return [ "", " ", "  ", "   ", "    " ][s.length];
        //             });
        //             if (val >= 0) { str = " " + str; }
        //             return str;
        //         }).join("  "));
        //     });
        // }
    });

    function argmax(i, end, f) {
        var max = f(i), pos = i;
        while (++i < end) {
            var v = f(i);
            if (v > max) {
                max = v;
                pos = i;
            }
        }
        return pos;
    }

    /* -----[ Formula ]----- */

    var Formula = Class.extend({
        init: function Formula(refs, handler, printer, sheet, row, col){
            this.refs = refs;
            this.handler = handler;
            this.print = printer;
            this.absrefs = null;
            this.sheet = sheet;
            this.row = row;
            this.col = col;
            this.onReady = [];
            this.pending = false;
        },
        clone: function(sheet, row, col) {
            return new Formula(this.refs, this.handler, this.print, sheet, row, col);
        },
        exec: function(ss, callback, parentContext) {
            var self = this;

            if ("value" in self) {
                if (callback) {
                    callback(self.value);
                }
            } else {
                if (callback) {
                    self.onReady.push(callback);
                }

                var ctx = new Context(function(val){
                    self.pending = false;
                    self.onReady.forEach(function(callback){
                        callback(val);
                    });
                }, self, ss, parentContext);

                // if the call chain leads back to this same formula, we have a circular dependency.
                while (parentContext) {
                    if (parentContext.formula === self) {
                        self.pending = false;
                        ctx.resolve(new CalcError("CIRCULAR"));
                        return;
                    }
                    parentContext = parentContext.parent;
                }

                // pending is still useful for ASYNC formulas
                if (self.pending) {
                    return;
                }
                self.pending = true;

                // compute and cache the absolute references
                if (!self.absrefs) {
                    self.absrefs = self.refs.map(function(ref){
                        return ref.absolute(this.row, this.col);
                    }, self);
                }

                // finally invoke the handler given to us by the compiler in calc.js
                self.handler.call(ctx);
            }
        },
        reset: function() {
            this.onReady = [];
            this.pending = false;
            delete this.value;
        },
        adjust: function(affectedSheet, operation, start, delta) {
            affectedSheet = affectedSheet.toLowerCase();
            var formulaRow = this.row;
            var formulaCol = this.col;
            var formulaSheet = this.sheet.toLowerCase();
            if (formulaSheet == affectedSheet) {
                // move formula if it's after the change point
                if (operation == "row" && formulaRow >= start) {
                    this.row += delta;
                }
                if (operation == "col" && formulaCol >= start) {
                    this.col += delta;
                }
            }
            var newFormulaRow = this.row;
            var newFormulaCol = this.col;
            this.absrefs = null;
            this.refs = this.refs.map(function(ref){
                if (ref.sheet.toLowerCase() != affectedSheet) {
                    // a reference to another sheet should still point to the same location after
                    // adjustment; thus if row/col was removed before formula, relative references
                    // must be adjusted by delta.
                    if (operation == "row" && formulaRow >= start) {
                        ref = ref.relative(delta, 0);
                    }
                    if (operation == "col" && formulaCol >= start) {
                        ref = ref.relative(0, delta);
                    }
                    return ref;
                }
                return ref.adjust(
                    formulaRow, formulaCol,
                    newFormulaRow, newFormulaCol,
                    operation == "row",
                    start, delta
                );
            }, this);
        },
        toString: function() {
            return this.print(this.row, this.col);
        }
    });

    // spreadsheet functions --------

    var FUNCS = {
        "if": function(callback, args) {
            var self = this;
            var co = args[0], th = args[1], el = args[2];
            // XXX: I don't like this resolveCells here.  We should try to declare IF with
            // defineFunction.
            this.resolveCells([ co ], function(){
                var comatrix = self.asMatrix(co);
                if (comatrix) {
                    // XXX: calling both branches in this case, since we'll typically need values from
                    // both.  We could optimize and call them only when first needed, but oh well.
                    th(function(th){
                        el(function(el){
                            var thmatrix = self.asMatrix(th);
                            var elmatrix = self.asMatrix(el);
                            callback(comatrix.map(function(val, row, col){
                                if (self.bool(val)) {
                                    return thmatrix ? thmatrix.get(row, col) : th;
                                } else {
                                    return elmatrix ? elmatrix.get(row, col) : el;
                                }
                            }));
                        });
                    });
                } else {
                    if (self.bool(co)) {
                        th(callback);
                    } else {
                        el(callback);
                    }
                }
            });
        }
    };

    // Lasciate ogni speranza, voi ch'entrate.
    //
    // XXX: document this function.
    function compileArgumentChecks(args) {
        var arrayArgs = "function arrayArgs(args) { var xargs = [], width = 0, height = 0, arrays = [], i = 0; ";
        var resolve = "function resolve(args, callback) { var toResolve = [], i = 0; ";
        var name, forced, main = "'use strict'; function check(args) { var xargs = [], i = 0, m, err = 'VALUE'; ", haveForced = false;
        var canBeArrayArg = false, hasArrayArgs = false;
        main += args.map(comp).join("");
        main += "if (i < args.length) return new CalcError('N/A'); ";
        main += "return xargs; } ";
        arrayArgs += "return { args: xargs, width: width, height: height, arrays: arrays }; } ";

        var f;
        if (haveForced) {
            resolve += "this.resolveCells(toResolve, callback); } ";
            f = new Function("CalcError", main + resolve + arrayArgs + " return { resolve: resolve, check: check, arrayArgs: arrayArgs };");
        } else {
            f = new Function("CalcError", main + " return { check: check };");
        }
        f = f(CalcError);
        if (!hasArrayArgs) {
            delete f.arrayArgs;
        }
        return f;

        function comp(x) {
            name = x[0];
            var code = "{ ";
            if (Array.isArray(name)) {
                arrayArgs += "while (i < args.length) { ";
                resolve += "while (i < args.length) { ";
                code += "while (i < args.length) { ";
                code += x.map(comp).join("");
                code += "} ";
                resolve += "} ";
                arrayArgs += "} ";
            } else if (name == "+") {
                arrayArgs += "while (i < args.length) { ";
                resolve += "while (i < args.length) { ";
                code += "do { ";
                code += x.slice(1).map(comp).join("");
                code += "} while (i < args.length); ";
                resolve += "} ";
                arrayArgs += "} ";
            } else if (name == "?") {
                // standalone assertion without a new argument
                code += "if (!(" + cond(x[1]) + ")) return new CalcError(err); ";
            } else {
                var type = x[1];
                if (Array.isArray(type) && /^#?collect/.test(type[0])) {
                    var n = type[2];
                    force();
                    code += "try {"
                        + "var $" + name + " = this.cellValues(args.slice(i";
                    if (n) {
                        code += ", i + " + n;
                    }
                    code += ")).filter(function($"+name+"){ ";
                    if (type[0] == "collect") {
                        code += "if ($"+name+" instanceof CalcError) throw $"+name+"; ";
                    }
                    code += "return " + cond(type[1]) + "; }, this); ";
                    if (n) {
                        code += "i += " + n + "; ";
                    } else {
                        code += "i = args.length; ";
                    }
                    code += "xargs.push($"+name+")"
                        + "} catch(ex) { if (ex instanceof CalcError) return ex; throw ex; } ";
                    resolve += "toResolve.push(args.slice(i)); ";
                } else if (type == "rest") {
                    code += "xargs.push(args.slice(i)); i = args.length; ";
                } else {
                    code += "var $" + name + " = args[i++]; ";
                    if (/!$/.test(type)) {
                        type = type.substr(0, type.length - 1);
                    } else {
                        code += "if ($"+name+" instanceof CalcError) return $"+name+"; ";
                    }
                    code += typeCheck(type) + "xargs.push($"+name+"); ";
                }
            }
            code += "} ";
            return code;
        }

        function force() {
            if (forced) {
                return "$"+name+"";
            }
            haveForced = true;
            forced = true;
            resolve += "toResolve.push(args[i++]); ";
            return "($"+name+" = this.force($"+name+"))";
        }

        function typeCheck(type) {
            canBeArrayArg = false;
            forced = false;
            var ret = "if (!(" + cond(type) + ")) return new CalcError(err); ";
            if (!forced) {
                resolve += "i++; ";
            }
            if (canBeArrayArg) {
                arrayArgs += "var $" + name + " = this.asMatrix(args[i]); "
                    + "if ($" + name + ") { "
                    + "xargs.push($" + name + "); "
                    + "width = Math.max(width, $" + name + ".width); "
                    + "height = Math.max(height, $" + name + ".height); "
                    + "arrays.push(true) } else { "
                    + "xargs.push(args[i]); "
                    + "arrays.push(false); } i++; ";
            } else {
                arrayArgs += "xargs.push(args[i++]); arrays.push(false); ";
            }
            return ret;
        }

        function cond(type) {
            if (Array.isArray(type)) {
                if (type[0] == "or") {
                    return "(" + type.slice(1).map(cond).join(") || (") + ")";
                }
                if (type[0] == "and") {
                    return "(" + type.slice(1).map(cond).join(") && (") + ")";
                }
                if (type[0] == "values") {
                    return "(" + type.slice(1).map(function(val){
                        return force() + " === " + val;
                    }).join(") || (") + ")";
                }
                if (type[0] == "null") {
                    return "(" + cond("null") + " ? (($"+name+" = " + type[1] + "), true) : false)";
                }
                if (type[0] == "between" || type[0] == "[between]") {
                    return "(" + force() + " >= " + type[1] + " && " + "$"+name+" <= " + type[2] + ")";
                }
                if (type[0] == "(between)") {
                    return "(" + force() + " > " + type[1] + " && " + "$"+name+" < " + type[2] + ")";
                }
                if (type[0] == "(between]") {
                    return "(" + force() + " > " + type[1] + " && " + "$"+name+" <= " + type[2] + ")";
                }
                if (type[0] == "[between)") {
                    return "(" + force() + " >= " + type[1] + " && " + "$"+name+" < " + type[2] + ")";
                }
                if (type[0] == "assert") {
                    var err = type[2] || "N/A";
                    return "((" + type[1] + ") ? true : (err = " + JSON.stringify(err) + ", false))";
                }
                if (type[0] == "not") {
                    return "!(" + cond(type[1]) + ")";
                }
                throw new Error("Unknown array type condition: " + type[0]);
            }
            if (/^\*/.test(type)) {
                canBeArrayArg = hasArrayArgs = true;
                type = type.substr(1);
            }
            if (type == "number") {
                return "(typeof " + force() + " == 'number' || typeof $"+name+" == 'boolean')";
            }
            if (type == "integer") {
                return "((typeof " + force() + " == 'number' || typeof $"+name+" == 'boolean') ? ($"+name+" |= 0, true) : false)";
            }
            if (type == "date") {
                return "((typeof " + force() + " == 'number') ? ($"+name+" |= 0, true) : false)";
            }
            if (type == "datetime") {
                return "(typeof " + force() + " == 'number')";
            }
            if (type == "divisor") {
                return "((typeof " + force() + " == 'number' || typeof $"+name+" == 'boolean') && "
                    + "($"+name+" == 0 ? ((err = 'DIV/0'), false) : true))";
            }
            if (type == "number+") {
                return "((typeof " + force() + " == 'number' || typeof $"+name+" == 'boolean') && $"+name+" >= 0)";
            }
            if (type == "integer+") {
                return "(((typeof " + force() + " == 'number' || typeof $"+name+" == 'boolean') && $"+name+" >= 0) ? ($"+name+" |= 0, true) : false)";
            }
            if (type == "number++") {
                return "((typeof " + force() + " == 'number' || typeof $"+name+" == 'boolean') && $"+name+" > 0)";
            }
            if (type == "integer++") {
                return "(((typeof " + force() + " == 'number' || typeof $"+name+" == 'boolean') && $"+name+" > 0) ? ($"+name+" |= 0, true) : false)";
            }
            if (type == "string") {
                return "(typeof " + force() + " == 'string')";
            }
            if (type == "boolean") {
                return "(typeof " + force() + " == 'boolean')";
            }
            if (type == "logical") {
                return "(typeof " + force() + " == 'boolean' || (typeof $"+name+" == 'number' ? ($"+name+" = !!$"+name+", true) : false))";
            }
            if (type == "matrix") {
                force();
                return "((m = this.asMatrix($"+name+")) ? ($"+name+" = m) : false)";
            }
            if (type == "#matrix") {
                return "((m = this.asMatrix($"+name+")) ? ($"+name+" = m) : false)";
            }
            if (type == "ref") {
                return "($"+name+" instanceof kendo.spreadsheet.Ref)";
            }
            if (type == "area") {
                return "($"+name+" instanceof kendo.spreadsheet.CellRef || $"+name+" instanceof kendo.spreadsheet.RangeRef)";
            }
            if (type == "cell") {
                return "($"+name+" instanceof kendo.spreadsheet.CellRef)";
            }
            if (type == "null") {
                return "(" + force() + " == null)";
            }
            if (type == "anyvalue") {
                return "(" + force() + " != null && i <= args.length)";
            }
            if (type == "forced") {
                return "(" + force() + ", i <= args.length)";
            }
            if (type == "anything") {
                return "(i <= args.length)";
            }
            if (type == "blank") {
                return "(" + force() + " == null || $"+name+" === '')";
            }
            throw new Error("Can't check for type: " + type);
        }
    }

    function makeSyncFunction(handler, resolve, check, arrayArgs) {
        return function(callback, args) {
            function doit() {
                if (arrayArgs) {
                    var x = arrayArgs.call(this, args);
                    args = x.args;
                    if (x.width > 0 && x.height > 0) {
                        var result = new Matrix(this);
                        for (var row = 0; row < x.height; ++row) {
                            for (var col = 0; col < x.width; ++col) {
                                var xargs = [];
                                for (var i = 0; i < args.length; ++i) {
                                    if (x.arrays[i]) {
                                        xargs[i] = args[i].get(row, col);
                                    } else {
                                        xargs[i] = args[i];
                                    }
                                }
                                xargs = check.call(this, xargs);
                                if (xargs instanceof CalcError) {
                                    result.set(row, col, xargs);
                                } else {
                                    try {
                                        result.set(row, col, handler.apply(this, xargs));
                                    } catch(ex) {
                                        if (ex instanceof CalcError) {
                                            result.set(row, col, ex);
                                        } else {
                                            throw ex;
                                        }
                                    }
                                }
                            }
                        }
                        return callback(result);
                    }
                }
                var xargs = check.call(this, args);
                if (xargs instanceof CalcError) {
                    callback(xargs);
                } else {
                    var val;
                    try {
                        val = handler.apply(this, xargs);
                    } catch(ex) {
                        if (ex instanceof CalcError) {
                            val = ex;
                        } else {
                            throw ex;
                        }
                    }
                    callback(val);
                }
            }
            if (resolve) {
                resolve.call(this, args, doit);
            } else {
                doit.call(this);
            }
        };
    }

    // XXX: the duplication here sucks.  the only difference vs the above function is that this one
    // will insert the callback as first argument when calling the handler, and thus supports async
    // handlers.
    function makeAsyncFunction(handler, resolve, check, arrayArgs) {
        return function(callback, args) {
            function doit() {
                if (arrayArgs) {
                    var x = arrayArgs.call(this, args);
                    args = x.args;
                    if (x.width > 0 && x.height > 0) {
                        var result = new Matrix(this);
                        var count = x.width * x.height;
                        var makeCallback = function(row, col) {
                            return function(value) {
                                result.set(row, col, value);
                                --count;
                                if (count === 0) {
                                    return callback(result);
                                }
                            };
                        };
                        for (var row = 0; row < x.height && count > 0; ++row) {
                            for (var col = 0; col < x.width && count > 0; ++col) {
                                var xargs = [];
                                for (var i = 0; i < args.length; ++i) {
                                    if (x.arrays[i]) {
                                        xargs[i] = args[i].get(row, col);
                                    } else {
                                        xargs[i] = args[i];
                                    }
                                }
                                xargs = check.call(this, xargs);
                                if (xargs instanceof CalcError) {
                                    result.set(row, col, xargs);
                                    --count;
                                    if (count === 0) {
                                        return callback(result);
                                    }
                                } else {
                                    xargs.unshift(makeCallback(row, col));
                                    handler.apply(this, xargs);
                                }
                            }
                        }
                        return;
                    }
                }
                var x = check.call(this, args);
                if (x instanceof CalcError) {
                    callback(x);
                } else {
                    x.unshift(callback);
                    handler.apply(this, x);
                }
            }
            if (resolve) {
                resolve.call(this, args, doit);
            } else {
                doit.call(this);
            }
        };
    }

    function defineFunction(name, func) {
        name = name.toLowerCase();
        FUNCS[name] = func;
        return {
            args: function(args, log) {
                var code = compileArgumentChecks(args);
                // XXX: DEBUG
                if (log) {
                    if (code.arrayArgs) {console.log(code.arrayArgs.toString());}
                    if (code.resolve) {console.log(code.resolve.toString());}
                    if (code.check) {console.log(code.check.toString());}
                }
                FUNCS[name] = makeSyncFunction(func, code.resolve, code.check, code.arrayArgs);
                return this;
            },
            argsAsync: function(args, log) {
                var code = compileArgumentChecks(args);
                // XXX: DEBUG
                if (log) {
                    if (code.arrayArgs) {console.log(code.arrayArgs.toString());}
                    if (code.resolve) {console.log(code.resolve.toString());}
                    if (code.check) {console.log(code.check.toString());}
                }
                FUNCS[name] = makeAsyncFunction(func, code.resolve, code.check, code.arrayArgs);
                return this;
            }
        };
    }

    /* -----[ date calculations ]----- */

    var DAYS_IN_MONTH = [ 31, 28, 31,
                          30, 31, 30,
                          31, 31, 30,
                          31, 30, 31 ];

    var ORDINAL_ADD_DAYS = [
        [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ], // non-leap year
        [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ]  // leap year
    ];

    function isLeapYear(yr) {
        if (yr % 4) {
            return 0;
        }
        if (yr % 100) {
            return 1;
        }
        if (yr % 400) {
            return 0;
        }
        return 1;
    }

    function daysInYear(yr) {
        return isLeapYear(yr) ? 366 : 365;
    }

    function daysInMonth(yr, mo) {
        return (isLeapYear(yr) && mo == 1) ? 29 : DAYS_IN_MONTH[mo];
    }

    function unpackDate(serial) {
        // This uses the Google Spreadsheet approach: treat 1899-12-31
        // as day 1, allowing to avoid implementing the "Leap Year
        // Bug" yet still be Excel compatible for dates starting
        // 1900-03-01.
        return _unpackDate(serial - 1);
    }

    function packDate(date, month, year) {
        return _packDate(date, month, year) + 1;
    }

    var MS_IN_MIN = 60 * 1000;
    var MS_IN_HOUR = 60 * MS_IN_MIN;
    var MS_IN_DAY = 24 * MS_IN_HOUR;

    function unpackTime(serial) {
        var frac = serial - (serial|0);
        if (frac < 0) {
            frac++;
        }
        var ms = Math.round(MS_IN_DAY * frac);
        var hours = Math.floor(ms / MS_IN_HOUR);
        ms -= hours * MS_IN_HOUR;
        var minutes = Math.floor(ms / MS_IN_MIN);
        ms -= minutes * MS_IN_MIN;
        var seconds = Math.floor(ms / 1000);
        ms -= seconds * 1000;
        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            milliseconds: ms
        };
    }

    function serialToDate(serial) {
        var d = unpackDate(serial), t = unpackTime(serial);
        return new Date(d.year, d.month, d.date,
                        t.hours, t.minutes, t.seconds, t.milliseconds);
    }

    // Unpack date by assuming serial is number of days since
    // 1900-01-01 (that being day 1).  Negative numbers are allowed
    // and go backwards in time.
    function _unpackDate(serial) {
        serial |= 0;            // discard time part
        var month, tmp;
        var backwards = serial <= 0;
        var year = 1900;
        var day = serial % 7;   // 1900-01-01 was a Monday
        if (backwards) {
            serial = -serial;
            year--;
            day = (day + 7) % 7;
        }

        while (serial > (tmp = daysInYear(year))) {
            serial -= tmp;
            year += backwards ? -1 : 1;
        }

        if (backwards) {
            month = 11;
            while (serial >= (tmp = daysInMonth(year, month))) {
                serial -= tmp;
                month--;
            }
            serial = tmp - serial;
        } else {
            month = 0;
            while (serial > (tmp = daysInMonth(year, month))) {
                serial -= tmp;
                month++;
            }
        }

        return {
            year  : year,
            month : month,
            date  : serial,
            day   : day,
            ord   : ORDINAL_ADD_DAYS[isLeapYear(year)][month] + serial
        };
    }

    function _packDate(year, month, date) {
        var serial = 0;
        year += Math.floor(month / 12);
        month %= 12;
        if (month < 0) {
            // no need to decrease year because e.g. Math.floor(-1/12) is -1, so
            // it's already subtracted.
            month += 12;
        }
        if (year >= 1900) {
            for (var i = 1900; i < year; ++i) {
                serial += daysInYear(i);
            }
        } else {
            for (var i = 1899; i >= year; --i) {
                serial -= daysInYear(i);
            }
        }
        for (var i = 0; i < month; ++i) {
            serial += daysInMonth(year, i);
        }
        serial += date;
        return serial;
    }

    function packTime(hours, minutes, seconds, ms) {
        return (hours + minutes/60 + seconds/3600 + ms/3600000) / 24;
    }

    function dateToSerial(date) {
        var time = packTime(date.getHours(),
                            date.getMinutes(),
                            date.getSeconds(),
                            date.getMilliseconds());
        date = packDate(date.getFullYear(),
                        date.getMonth(),
                        date.getDate());
        if (date < 0) {
            return date - 1 + time;
        } else {
            return date + time;
        }
    }

    /* -----[ exports ]----- */

    exports.CalcError = CalcError;
    exports.Formula = Formula;
    exports.Matrix = Matrix;

    exports.packDate = packDate;
    exports.unpackDate = unpackDate;
    exports.packTime = packTime;
    exports.unpackTime = unpackTime;
    exports.serialToDate = serialToDate;
    exports.dateToSerial = dateToSerial;
    exports.daysInMonth = daysInMonth;
    exports.isLeapYear = isLeapYear;
    exports.daysInYear = daysInYear;

    spreadsheet.dateToNumber = dateToSerial;
    spreadsheet.numberToDate = serialToDate;

    exports.defineFunction = defineFunction;
    exports.defineAlias = function(alias, name) {
        FUNCS[alias] = FUNCS[name];
    };
    exports.FUNCS = FUNCS;

    /* -----[ Excel operators ]----- */

    var ARGS_NUMERIC = [
        [ "a", "*number" ],
        [ "b", "*number" ]
    ];

    var ARGS_ANYVALUE = [
        [ "a", "*anyvalue" ],
        [ "b", "*anyvalue" ]
    ];

    defineFunction("binary+", function(a, b){
        return a + b;
    }).args(ARGS_NUMERIC);

    defineFunction("binary-", function(a, b){
        return a - b;
    }).args(ARGS_NUMERIC);

    defineFunction("binary*", function(a, b){
        return a * b;
    }).args(ARGS_NUMERIC);

    defineFunction("binary/", function(a, b){
        return a / b;
    }).args([
        [ "a", "*number" ],
        [ "b", "*divisor" ]
    ]);

    defineFunction("binary^", function(a, b){
        return Math.pow(a, b);
    }).args(ARGS_NUMERIC);

    defineFunction("binary&", function(a, b){
        if (a == null) { a = ""; }
        if (b == null) { b = ""; }
        return "" + a + b;
    }).args([
        [ "a", [ "or", "*number", "*string", "*boolean", "*null" ] ],
        [ "b", [ "or", "*number", "*string", "*boolean", "*null" ] ]
    ]);

    defineFunction("binary=", function(a, b){
        return a === b;
    }).args(ARGS_ANYVALUE);

    defineFunction("binary<>", function(a, b){
        return a !== b;
    }).args(ARGS_ANYVALUE);

    defineFunction("binary<", binaryCompare(function(a, b){
        return a < b;
    })).args(ARGS_ANYVALUE);

    defineFunction("binary<=", binaryCompare(function(a, b){
        return a <= b;
    })).args(ARGS_ANYVALUE);

    defineFunction("binary>", binaryCompare(function(a, b){
        return a > b;
    })).args(ARGS_ANYVALUE);

    defineFunction("binary>=", binaryCompare(function(a, b){
        return a >= b;
    })).args(ARGS_ANYVALUE);

    defineFunction("unary+", function(a){
        return a;
    }).args([
        [ "a", "*number" ]
    ]);

    defineFunction("unary-", function(a){
        return -a;
    }).args([
        [ "a", "*number" ]
    ]);

    defineFunction("unary%", function(a){
        return a / 100;
    }).args([
        [ "a", "*number" ]
    ]);

    // range operator
    defineFunction("binary:", function(a, b){
        return new RangeRef(a, b)
            .setSheet(a.sheet || this.formula.sheet, a.hasSheet());
    }).args([
        [ "a", "cell" ],
        [ "b", "cell" ]
    ]);

    // union operator
    defineFunction("binary,", function(a, b){
        return new UnionRef([ a, b ]);
    }).args([
        [ "a", "ref" ],
        [ "b", "ref" ]
    ]);

    // intersection operator
    defineFunction("binary ", function(a, b){
        return a.intersect(b);
    }).args([
        [ "a", "ref" ],
        [ "b", "ref" ]
    ]);

    /* -----[ conditionals ]----- */

    defineFunction("not", function(a){
        return !this.bool(a);
    }).args([
        [ "a", "*anyvalue" ]
    ]);

    /* -----[ the IS* functions ]----- */

    defineFunction("isblank", function(val){
        if (val instanceof CellRef) {
            val = this.ss.getData(val);
            return val == null || val === "";
        }
        return false;
    }).args([
        [ "value", "*anything!" ]
    ]);

    defineFunction("iserror", function(val){
        return val instanceof CalcError;
    }).args([
        [ "value", "*forced!" ]
    ]);

    defineFunction("iserr", function(val){
        return val instanceof CalcError && val.code != "N/A";
    }).args([
        [ "value", "*forced!" ]
    ]);

    defineFunction("isna", function(val){
        return val instanceof CalcError && val.code == "N/A";
    }).args([
        [ "value", "*forced!" ]
    ]);

    defineFunction("islogical", function(val){
        return typeof val == "boolean";
    }).args([
        [ "value", "*forced!" ]
    ]);

    defineFunction("isnontext", function(val){
        return typeof val != "string" || val === "";
    }).args([
        [ "value", "*forced!" ]
    ]);

    defineFunction("istext", function(val){
        return typeof val == "string" && val !== "";
    }).args([
        [ "value", "*forced!" ]
    ]);

    defineFunction("isnumber", function(val){
        return typeof val == "number";
    }).args([
        [ "value", "*forced!" ]
    ]);

    defineFunction("isref", function(val){
        // apparently should return true only for cell and range
        return val instanceof CellRef || val instanceof RangeRef;
    }).args([
        [ "value", "*anything!" ]
    ]);

    /// utils

    function binaryCompare(func) {
        return function(left, right){
            if (typeof left == "string" && typeof right != "string") {
                right = right == null ? "" : right + "";
            }
            if (typeof left != "string" && typeof right == "string") {
                left = left == null ? "" : left + "";
            }
            if (typeof left == "number" && right == null) {
                right = 0;
            }
            if (typeof right == "number" && left == null) {
                left = 0;
            }
            if (typeof left == "string" && typeof right == "string") {
                // string comparison is case insensitive
                left = left.toLowerCase();
                right = right.toLowerCase();
            }
            if (typeof right == typeof left) {
                return func(left, right);
            } else {
                return new CalcError("VALUE");
            }
        };
    }

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
