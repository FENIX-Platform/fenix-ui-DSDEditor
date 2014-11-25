define([
'jquery',
 'jqxall',
 'text!fx-DSDEditor/templates/DSDEditor/simpleEditors/datesRange/RangeYears.htm',
 'i18n!fx-DSDEditor/multiLang/DSDEditor/nls/ML_DomainEditor'
],
function ($, jqx, rangeYearsHTML, mlRes) {
    var defConfig = { yMin: 0, yMax: 3000 };

    var RangeYears = function (config) {
        this.$container;
        this.$from;
        this.$to;

        this.config = {};
        $.extend(true, this.config, defConfig, config);
    };

    RangeYears.prototype.render = function (container, config) {
        $.extend(true, this.config, config);

        this.$container = container;
        this.$container.html(rangeYearsHTML);

        this.$from = this.$container.find('#divRngYearsFrom');
        this.$to = this.$container.find('#divRngYearsTo');

        this.$from.jqxNumberInput({ width: 40, min: this.config.yMin, max: this.config.yMax, decimalDigits: 0, digits: 4, groupSeparator: '', promptChar: ' ' });
        this.$to.jqxNumberInput({ width: 40, min: this.config.yMin, max: this.config.yMax, decimalDigits: 0, digits: 4, groupSeparator: '', promptChar: ' ' });
        this.reset();

        var me = this;
        this.$from.on('change', function () { me.checkFromTo('f'); });
        this.$to.on('change', function () { me.checkFromTo('t'); });

        this.doMl();
    }
    RangeYears.prototype.reset = function () {
        var Y = new Date().getFullYear();
        this.$from.jqxNumberInput({ value: Y });
        this.$to.jqxNumberInput({ value: Y + 1 });
    }

    RangeYears.prototype.setRange = function (rng) {
        this.reset();
        if (!rng)
            return;

        this.$from.jqxNumberInput({ value: rng.from });
        this.$to.jqxNumberInput({ value: rng.to });
    }

    RangeYears.prototype.getRange = function () {
        return { from: this.$from.jqxNumberInput('value').trim(), to: this.$to.jqxNumberInput('value').trim() };
    }

    RangeYears.prototype.checkFromTo = function (fOrT) {
        var f = parseInt(this.$from.jqxNumberInput('value').trim());
        var t = parseInt(this.$to.jqxNumberInput('value').trim());

        if (f > t)
            if (fOrT == 'f')
                this.$to.jqxNumberInput({ value: f });
            else
                this.$from.jqxNumberInput({ value: t });
    }

    RangeYears.prototype.doMl = function () {
        this.$container.find('#tdYearFrom').html(mlRes.from);
        this.$container.find('#tdYearTo').html(mlRes.to);
    }

    return RangeYears;
});