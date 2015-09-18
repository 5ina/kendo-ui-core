(function(f, define){
    define([ "../kendo.core" ], f);
})(function(){

(function(kendo) {
    var Axis = kendo.Class.extend({
        init: function(count, value) {
            this._value = value;
            this._count = count;
            this.values = new kendo.spreadsheet.RangeList(0, count - 1, value);
            this._hidden = new kendo.spreadsheet.RangeList(0, count - 1, 0);

            this.scrollBarSize = kendo.support.scrollbar();
            this._refresh();
        },

        toJSON: function(field, positions) {
            var values = [];

            var iterator = this.values.iterator(0, this._count - 1);

            for (var idx = 0; idx < this._count; idx++) {
                var value = iterator.at(idx);

                if (value === this._value) {
                    continue;
                }

                var position = positions[idx];

                if (position === undefined) {
                    position = values.length;

                    var item = { index: idx };

                    item[field] = value;

                    values.push(item);

                    positions[idx] = position;
                }
            }

            return values;
        },

        fromJSON: function(field, values) {
            for (var idx = 0; idx < values.length; idx++) {
                var value = values[idx][field];
                var index = values[idx].index;

                if (index === undefined) {
                    index = idx;
                }

                this.value(index, index, value);
            }
        },

        hide: function(index) {
            var value = this.value(index, index);
            this._hidden.value(index, index, value);
            this.value(index, index, 0);
        },

        hidden: function(index) {
            return this._hidden.value(index, index) !== 0;
        },

        includesHidden: function(start, end) {
             return this._hidden.intersecting(start, end).length > 1;
        },

        nextVisible: function(index, overflow) {
            var end = this._count - 1;

            if (index === end) {
                return overflow ? index + 1 : index;
            }

            index += 1;
            var range = this._hidden.intersecting(index, index)[0];
            if (range.value !== 0) { // hidden
                if (range.end === end) { // reached the last visible
                    return index - 1;
                } else {
                    return range.end + 1;
                }
            } else {
                return index;
            }
        },

        nextPage: function(index, pageSize) {
            return this.index(this.sum(0, index - 1) + pageSize);
        },

        prevPage: function(index, pageSize) {
            return this.index(this.sum(0, index) - pageSize);
        },

        firstVisible: function() {
            var firstHidden = this._hidden.first();
            if (firstHidden.value === 0) {
                return 0;
            } else {
                return firstHidden.end + 1;
            }
        },

        lastVisible: function() {
            var lastHidden = this._hidden.last();
            if (lastHidden.value === 0) {
                return this._count - 1;
            } else {
                return lastHidden.start - 1;
            }
        },

        prevVisible: function(index, overflow) {
            if (index === 0) {
                return overflow ? -1 : 0;
            }

            index -= 1;
            var range = this._hidden.intersecting(index, index)[0];
            if (range.value !== 0) { // hidden
                if (range.start === 0) { // reached the last visible
                    return index + 1;
                } else {
                    return range.start - 1;
                }
            } else {
                return index;
            }
        },

        unhide: function(index) {
            if (this.hidden(index)) {
                var value = this._hidden.value(index, index);
                this._hidden.value(index, index, 0);
                this.value(index, index, value);
            }
        },

        value: function(start, end, value) {
            if (value !== undefined) {
                this.values.value(start, end, value);
                this._refresh();
            } else {
                return this.values.iterator(start, end).at(0);
            }
        },

        sum: function(start, end) {
            var values = this.values.iterator(start, end);

            var sum = 0;

            for (var idx = start; idx <= end; idx ++) {
                sum += values.at(idx);
            }

            return sum;
        },

        visible: function(start, end) {
            var startSegment = null;
            var endSegment = null;
            var lastPage = false;

            if (end >= this.total + this.scrollBarSize) {
                lastPage = true;
            }

            var ranges = this._pixelValues.intersecting(start, end);

            startSegment = ranges[0];
            endSegment = ranges[ranges.length - 1];

            var startOffset = start - startSegment.start;

            var startIndex = ((startOffset / startSegment.value.value) >> 0) + startSegment.value.start;

            var offset = startOffset - (startIndex - startSegment.value.start) * startSegment.value.value;

            var endOffset = end - endSegment.start;
            var endIndex = ((endOffset / endSegment.value.value) >> 0) + endSegment.value.start;

            if (endIndex > endSegment.value.end) {
                endIndex = endSegment.value.end;
            }

            if (lastPage) {
                offset += endSegment.value.value - (endOffset - (endIndex - endSegment.value.start) * endSegment.value.value);
            }

            offset = -offset;

            return {
                values: this.values.iterator(startIndex, endIndex),
                offset: offset
            };
        },

        index: function(value) {
            var index = 0;
            var iterator = this.values.iterator(0, this._count - 1);
            var current = iterator.at(0);

            while (current < value && index < this._count - 1) {
                current += iterator.at(++index);
            }

            return index;
        },

        _refresh: function() {
            var current = 0;
            this._pixelValues = this.values.map(function(range) {
                var start = current;

                current += (range.end - range.start + 1) * range.value;

                var end = current - 1;

                return new kendo.spreadsheet.ValueRange(start, end, range);
            });

            this.total = current;
        },

        getState: function() {
            return {
                values: this.values.getState(),
                hidden: this._hidden.getState()
            };
        },

        setState: function(state) {
            this.values.setState(state.values);
            this._hidden.setState(state.hidden);
            this._refresh();
        }
    });

    var PaneAxis = kendo.Class.extend({
        init: function(axis, start, count, headerSize) {
           this._axis = axis;
           this._start = start;
           this._count = count;
           this.hasHeader = start === 0;
           this.headerSize = headerSize;
           this.defaultValue = axis._value;
           this.frozen = count > 0;
        },

        viewSize: function(viewSize) {
            this._viewSize = viewSize;
        },

        sum: function(start, end) {
            return this._axis.sum(start, end - 1);
        },

        start: function() {
            return this.sum(0, this._start);
        },

        size: function() {
            return this.sum(this._start, this._start + this._count);
        },

        index: function(value, offset) {
            return this._axis.index(value + (this.frozen ? 0 : offset) - this.headerSize);
        },

        //XXX: rename this method
        paneSegment: function() {
            var offset = this.start();
            var length;

            if (!this.hasHeader) {
                offset += this.headerSize;
            }

            if (this.frozen) {
                length = this.size();
                if (this.hasHeader) {
                    length += this.headerSize;
                } else {
                    length -= this.headerSize;
                }
            } else {
                length = this._viewSize - offset;
            }

            return {
                offset: offset,
                length: length
            };
        },

        visible: function(offset) {
            var start = this.start();
            var size;

            if (this.frozen) {
                size = this.size();
                if (!this.hasHeader) {
                    size -= this.headerSize;
                }
            } else {
                size = this._viewSize - start - this.headerSize;
                start += offset;
            }

            var result = this._axis.visible(start, start + size - 1);

            if (this.frozen) {
                result.offset = 0;
            }

            result.start = start;

            if (this.hasHeader) {
                result.offset += this.headerSize;
                result.start -= this.headerSize;
            }

            return result;
        },

        contains: function(start, end) {
            if (this.frozen) {
                if (start > this._start + this._count) {
                    return false;
                }
                if (end < this._start) {
                    return false;
                }
                return true;
            } else {
                return end >= this._start;
            }
        }
    });

    kendo.spreadsheet.Axis = Axis;
    kendo.spreadsheet.PaneAxis = PaneAxis;

})(kendo);
}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
