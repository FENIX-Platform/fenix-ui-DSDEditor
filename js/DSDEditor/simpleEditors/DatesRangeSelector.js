//TODO:Accept a configuration and pass it to the timeRange selectors
define([
'jquery',
'jqxall',
'fx-DSDEditor/js/DSDEditor/simpleEditors/datesRange/RangeYears',
'fx-DSDEditor/js/DSDEditor/simpleEditors/datesRange/RangeMonths',
'fx-DSDEditor/js/DSDEditor/simpleEditors/datesRange/RangeDates',
'text!fx-DSDEditor/templates/DSDEditor/simpleEditors/DatesRangeSelector.htm'
],
function ($, jqx, RangeYears, RangeMonths, RangeDates, datesRangeSelectorHTML) {

    var MODE_DATE = 'date';
    var MODE_MONTH = 'month';
    var MODE_YEAR = 'year';

    var DatesRangeSelector = function () {
        this.$container;

        this.$datesRangeSelector;
        this.$chkLimit;
        this.mode = '';

        this.rangeSelector;
    };

    DatesRangeSelector.prototype.render = function (container) {
        this.$container = container;
        this.$container.html(datesRangeSelectorHTML);

        this.$datesRangeSelector = this.$container.find('#divDatesRange');

        var me = this;
        this.$chkLimit = this.$container.find('#datesRangeChkLimit');
        this.$chkLimit.change(function () {
            if (me.$chkLimit.prop('checked'))
                me.$datesRangeSelector.show();
            else
                me.$datesRangeSelector.hide();
        });
    }
    DatesRangeSelector.prototype.reset = function () {
        this.$chkLimit.prop('checked', '');
        this.$datesRangeSelector.hide();
        if (this.rangeSelector)
            this.rangeSelector.reset();
    }

    DatesRangeSelector.prototype.setMode = function (mode) {
        this.mode = mode;
        switch (mode) {
            case MODE_YEAR:
                this.rangeSelector = new RangeYears();
                this.rangeSelector.render(this.$datesRangeSelector);
                break;
            case MODE_MONTH:
                this.rangeSelector = new RangeMonths();
                this.rangeSelector.render(this.$datesRangeSelector);
                break;
            case MODE_DATE:
                this.rangeSelector = new RangeDates();
                this.rangeSelector.render(this.$datesRangeSelector);
                break;
        }
    }

    DatesRangeSelector.prototype.setRange = function (rng) {
        if (!rng) {
            this.$chkLimit.prop('checked', '');
            this.$datesRangeSelector.hide();
        }
        else {
            this.$chkLimit.prop('checked', 'checked');
            this.$datesRangeSelector.show();
            this.rangeSelector.setRange(rng);
        }
    }
    DatesRangeSelector.prototype.getRange = function () {
        if (!this.$chkLimit.prop('checked'))
            return null;
        return this.rangeSelector.getRange();
    }

    return DatesRangeSelector;
});