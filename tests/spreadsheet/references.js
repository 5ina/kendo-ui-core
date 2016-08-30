(function() {
    var RangeRef = kendo.spreadsheet.RangeRef;
    var CellRef = kendo.spreadsheet.CellRef;
    var UnionRef = kendo.spreadsheet.UnionRef;
    var ref;

    module("Spreadsheet refs", {
        setup: function() {
            ref = new RangeRef(loc(0, 0), loc(1, 1));
        }
    });

    function loc(row, col) {
        return new CellRef(row, col);
    }

    test("RangeRef resize left", function() {
        equal(ref.resize({ left: 1 }).print(), '$B$1:$B$2');
    });

    test("RangeRef resize left beyond boundary", function() {
        equal(ref.resize({ left: -1 }).print(), '$A$1:$B$2');
    });

    test("RangeRef resize right", function() {
        equal(ref.resize({ right: 1 }).print(), '$A$1:$C$2');
    });

    test("RangeRef resize right to empty", function() {
        equal(ref.resize({ right: -2 }).print(), '#NULL!');
    });

    test("cell ref is equal to the same", function() {
        ok(new CellRef(1, 1).eq(new CellRef(1, 1)));
    });

    test("cell ref does not equal another", function() {
        ok(!new CellRef(1, 1).eq(new CellRef(2, 1)));
    });

    test("cell ref is equal to the same range ref", function() {
        ok(new CellRef(1, 1).eq(new RangeRef(loc(1, 1), loc(1, 1))));
    });

    test("cell ref is equal to the same union ref", function() {
        ok(new CellRef(1, 1).eq(new UnionRef([ new CellRef(1, 1) ])));
    });

    test("range ref is equal to the same cell ref", function() {
        ok(new RangeRef(loc(1, 1), loc(1, 1)).eq(new CellRef(1, 1)));
    });

    test("range ref is equal to the same", function() {
        var ref2 = new RangeRef(loc(0, 0), loc(1, 1));
        ok(ref.eq(ref2));
    });

    test("range ref does not equal another", function() {
        var ref2 = new RangeRef(loc(0, 1), loc(1, 1));
        ok(!ref.eq(ref2));
    });

    test("range ref is equal to the same union", function() {
        var ref2 = new UnionRef([new RangeRef(loc(0, 0), loc(1, 1))]);
        ok(ref.eq(ref2));
    });

    test("union ref is equal to the same cell ref", function() {
        ok(new UnionRef([ new CellRef(1, 1) ]).eq(new CellRef(1, 1)));
    });

    test("union ref is equal to the same union ref", function() {
        var ref2 = new UnionRef([new RangeRef(loc(0, 0), loc(1, 1))]);
        var ref3 = new UnionRef([new RangeRef(loc(0, 0), loc(1, 1))]);
        ok(ref2.eq(ref3));
    });

    test("union ref does not equal another union ref", function() {
        var ref2 = new UnionRef([new RangeRef(loc(0, 0), loc(1, 1))]);
        var ref3 = new UnionRef([new RangeRef(loc(1, 0), loc(1, 1))]);
        ok(!ref2.eq(ref3));
    });

    test("forEachRow provides correct row references to the callback", function() {
        ref = new RangeRef(loc(0,0), loc(2, 2));
        var rows = [];

        ref.forEachRow(function(ref) {
            rows.push(ref.print());
        });

        equal(rows.toString(), "$A$1:$C$1,$A$2:$C$2,$A$3:$C$3");
    });

    test("contains works with an array of refs", function() {
        var range = new RangeRef(loc(0, 0), loc(2, 2));
        var inside = new RangeRef(loc(0, 0), loc(0, 1));
        var outside = new RangeRef(loc(3, 3), loc(4, 4));

        ok(range.contains( [ inside ]));
        ok(range.contains( [ inside, outside ]));
        ok(!range.contains( [ outside ]));
    });

    test("forEachColumn provides correct row references to the callback", function() {
        ref = new RangeRef(loc(0,0), loc(2, 2));
        var rows = [];

        ref.forEachColumn(function(ref) {
            rows.push(ref.print());
        });

        equal(rows.toString(), "$A$1:$A$3,$B$1:$B$3,$C$1:$C$3");
    });
})();
