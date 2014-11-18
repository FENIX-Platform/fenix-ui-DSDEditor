﻿define([
'jquery',
 'jqxall',
 'text!fx-DSDEditor/templates/DSDEditor/simpleEditors/datesRange/RangeMonths.htm',
 'i18n!fx-DSDEditor/multiLang/DSDEditor/nls/ML_DomainEditor'
  ],
function ($, jqx, rangeMonthsHTML, mlRes) {
    var defConfig = { yMin: 0, yMax: 3000 };

    var RangeMonths = function (config) {
        this.ignoreRangeEvents = false;
        this.$container;

        this.$mFrom;
        this.$yFrom;
        this.$mTo;
        this.$yTo;

        this.config = {};
        $.extend(true, this.config, defConfig, config);
    };

    RangeMonths.prototype.render = function (container, config) {
        $.extend(true, this.config, config);

        this.$container = container;
        this.$container.html(rangeMonthsHTML);

        this.$mFrom = this.$container.find('#divRngMonthsMFrom');
        this.$yFrom = this.$container.find('#divRngMonthsYFrom');
        this.$mTo = this.$container.find('#divRngMonthsMTo');
        this.$yTo = this.$container.find('#divRngMonthsYTo');

        this.$mFrom.jqxNumberInput({ width: 40, min: 1, max: 12, decimalDigits: 0, digits: 2, groupSeparator: '', promptChar: ' ' });
        this.$yFrom.jqxNumberInput({ width: 40, min: this.config.yMin, max: this.config.yMax, decimalDigits: 0, digits: 4, groupSeparator: '', promptChar: ' ' });
        this.$mTo.jqxNumberInput({ width: 40, min: 1, max: 12, decimalDigits: 0, digits: 2, groupSeparator: '', promptChar: ' ' });
        this.$yTo.jqxNumberInput({ width: 40, min: this.config.yMin, max: this.config.yMax, decimalDigits: 0, digits: 4, groupSeparator: '', promptChar: ' ' });
        this.reset();

        var me = this;
        this.$mFrom.on('change', function () { me.checkFromTo('f'); });
        this.$yFrom.on('change', function () { me.checkFromTo('f'); });
        this.$mTo.on('change', function () { me.checkFromTo('t'); });
        this.$yTo.on('change', function () { me.checkFromTo('t'); });

        this.doMl();
    }
    RangeMonths.prototype.reset = function () {
        var d = new Date();
        var Y = d.getFullYear();
        var M = d.getMonth() + 1;
        this.$mFrom.jqxNumberInput({ value: M });
        this.$yFrom.jqxNumberInput({ value: Y });
        this.$mTo.jqxNumberInput({ value: M + 1 });
        this.$yTo.jqxNumberInput({ value: Y });
    }

    RangeMonths.prototype.setRange = function (rng) {
        this.reset();
        if (!rng)
            return;
        this.$mFrom.jqxNumberInput({ value: rng.from.substring(4, 6) });
        this.$yFrom.jqxNumberInput({ value: rng.from.substring(0, 4) });
        this.$mTo.jqxNumberInput({ value: rng.to.substring(4, 6) });
        this.$yTo.jqxNumberInput({ value: rng.to.substring(0, 4) });
    }

    RangeMonths.prototype.getRange = function () {
        var m = this.$mFrom.jqxNumberInput('value');
        if (m < 10) m = "0" + m.trim();
        var f = this.$yFrom.jqxNumberInput('value').trim() + "" + m;
        m = this.$mTo.jqxNumberInput('value');
        if (m < 10) m = "0" + m.trim();
        var t = this.$yTo.jqxNumberInput('value').trim() + "" + m;
        return { from: f, to: t };
    }

    RangeMonths.prototype.checkFromTo = function (fOrT) {
        if (this.ignoreRangeEvents)
            return;
        this.ignoreRangeEvents = true;

        var fY = parseInt(this.$yFrom.jqxNumberInput('value').trim());
        var fM = parseInt(this.$mFrom.jqxNumberInput('value').trim());
        var tY = parseInt(this.$yTo.jqxNumberInput('value').trim());
        var tM = parseInt(this.$mTo.jqxNumberInput('value').trim());
                
        if (fY == tY && fM > tM) {
            if (fOrT == 'f')
                this.$mTo.jqxNumberInput({ value: fM });
            else
                this.$mFrom.jqxNumberInput({ value: tM });
        }
        else if (fY > tY) {
            if (fOrT == 'f') {
                this.$yTo.jqxNumberInput({ value: fY });
                this.$mTo.jqxNumberInput({ value: fM });
            }
            else {
                this.$yFrom.jqxNumberInput({ value: tY });
                this.$mFrom.jqxNumberInput({ value: tM });
            }
        }
        this.ignoreRangeEvents = false;
    }

    RangeMonths.prototype.doMl = function () {
        this.$container.find('#tdMonthFrom').html(mlRes.from);
        this.$container.find('#tdMonthTo').html(mlRes.to);
    }

    return RangeMonths;
});