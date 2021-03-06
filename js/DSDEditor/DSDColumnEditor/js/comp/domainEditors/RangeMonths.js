﻿define(['jquery',
    'fx-DSDEditor/js/DSDEditor/DSDColumnEditor/js/comp/domainEditors/Range_base',
    'amplify'
],
    function ($, rangeBase, datetimepicker) {
        var defConfig = {};

        function RangeMonths(config) {
            this.parent.constructor.call(this, config);
        };
        RangeMonths.prototype = Object.create(rangeBase.prototype);
        RangeMonths.prototype.constructor = rangeBase;
        RangeMonths.prototype.parent = rangeBase.prototype;

        RangeMonths.prototype.render = function (cnt, config) {
            this.parent.render(cnt, config);
            this.parent.viewMode('months');
        };

        return RangeMonths;
    })