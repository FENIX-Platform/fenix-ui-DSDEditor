define(['jquery',
    'fx-DSDEditor/js/DSDEditor/DSDColumnEditor/js/comp/domainEditors/Range_base',
    'amplify'
],
    function ($, rangeBase, datetimepicker) {
        var defConfig = {};

        function RangeDate(config) {
            this.parent.constructor.call(this, config);
        };
        RangeDate.prototype = Object.create(rangeBase.prototype);
        RangeDate.prototype.constructor = rangeBase;
        RangeDate.prototype.parent = rangeBase.prototype;

        RangeDate.prototype.render = function (cnt, config) {
            this.parent.render(cnt, config);
            this.parent.viewMode('date');
        };

        return RangeDate;
    })