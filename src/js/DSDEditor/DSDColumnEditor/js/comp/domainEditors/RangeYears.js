define(['jquery',
    'Range_base'
],
    function ($, rangeBase) {
        var defConfig = {};

        function RangeYears(config) {
            this.parent.constructor.call(this, config);
        };
        RangeYears.prototype = Object.create(rangeBase.prototype);
        RangeYears.prototype.constructor = rangeBase;
        RangeYears.prototype.parent = rangeBase.prototype;

        RangeYears.prototype.render = function (cnt, config) {
            this.parent.render(cnt, config);
            this.parent.viewMode('years');
        };

        return RangeYears;
    })