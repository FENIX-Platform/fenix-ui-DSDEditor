define([
'jquery',
 'jqxall',
  'text!fx-DSDEditor/templates/DSDEditor/simpleEditors/datesRange/RangeDates.htm',
  'i18n!fx-DSDEditor/multiLang/DSDEditor/nls/ML_DomainEditor'
],
function ($, jqx, rangeDatesHTML, mlRes) {
    var defConfig = {};
    defConfig.dateMin = new Date(0, 0, 1);
    defConfig.dateMax = new Date(3000, 11, 31);

    var RangeDates = function (config) {
        this.$container;
        this.$from;
        this.$to;

        this.config = {};
        $.extend(true, this.config, defConfig, config);
    };

    RangeDates.prototype.render = function (container, config) {
        $.extend(true, this.config, config);

        this.$container = container;
        this.$container.html(rangeDatesHTML);

        this.$from = this.$container.find('#divRngFrom');
        this.$to = this.$container.find('#divRngTo');

        this.$from.jqxCalendar({ min: this.config.dateMin, max: this.config.dateMax });
        this.$to.jqxCalendar({ min: this.config.dateMin, max: this.config.dateMax });
        this.reset();

        var me = this;
        this.$from.on('change', function () { me.checkFromTo('f'); });
        this.$to.on('change', function () { me.checkFromTo('t'); });

        this.doMl();
    }
    RangeDates.prototype.reset = function () {
        var d = new Date();
        this.$from.jqxCalendar('setDate', d);
        this.$to.jqxCalendar('setDate', d);
    }
    RangeDates.prototype.setRange = function (rng) {
        this.reset();
        if (!rng)
            return;

        this.$from.jqxCalendar('setDate', D3SDateToDate(rng.from));
        this.$to.jqxCalendar('setDate', D3SDateToDate(rng.to));
    }
    RangeDates.prototype.getRange = function () {
        var f = this.$from.jqxCalendar('getDate');
        var t = this.$to.jqxCalendar('getDate');
        return { from: dateToD3SDate(f), to: dateToD3SDate(t) };
    }
    RangeDates.prototype.checkFromTo = function (changed) {
        var f = this.$from.jqxCalendar('getDate');
        var t = this.$to.jqxCalendar('getDate');
        if (changed == 't') {
            if (t < f)
                this.$from.jqxCalendar('setDate', t);
        }
        else if (changed == 'f')
            if (f > t)
                this.$to.jqxCalendar('setDate', f);
    }

    var dateToD3SDate = function (date) {
        var m = date.getMonth() + 1;
        var d = date.getDate();
        if (m < 10)
            m = "0" + m;
        if (d < 10)
            d = "0" + d;
        return date.getFullYear() + "" + m + "" + d;
    }
    var D3SDateToDate = function (d) {
        return new Date(d.substring(0, 4), d.substring(4, 6) - 1, d.substring(6, 8));
    }

    RangeDates.prototype.doMl = function () {
        this.$container.find('#tdDateFrom').html(mlRes.from);
        this.$container.find('#tdDateTo').html(mlRes.to);
    }

    return RangeDates;
});