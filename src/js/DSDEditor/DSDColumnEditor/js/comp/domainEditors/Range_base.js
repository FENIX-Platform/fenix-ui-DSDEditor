define(['jquery',
    'text!fx-DSDEditor/js/DSDEditor/DSDColumnEditor/html/comp/domainEditors/Range_base.html',
    'datetimepicker',
    'moment',
    'amplify'
],
    function ($, RangeHTML, datetimepicker) {
        var defConfig = {};
        var h = {

            idLblFrom: '#lFrom',
            idFrom: '#from',
            idLblTo: '#lTo',
            idTo: '#to'
        };
        var evts = {
        };

        function Range_base(config) {
            this.config = {};
            this.$container = null;
            $.extend(true, this.config, defConfig, config);

            this.$lFrom = null;
            this.$lTo = null;
            this.$from = null;
            this.$to = null;
        };

        Range_base.prototype.render = function (cnt, config) {
            $.extend(true, this.config, config);
            this.$container = cnt;
            this.$container.html(RangeHTML);

            this.$lFrom = this.$container.find(h.idLblFrom);
            this.$lTo = this.$container.find(h.idLblTo);
            this.$from = this.$container.find(h.idFrom);
            this.$to = this.$container.find(h.idTo);

            this.$from.datetimepicker({ viewMode: 'years', locale: 'en', format: "YYYY" });
            this.$to.datetimepicker({ viewMode: 'years', locale: 'en', format: "YYYY" });

            this._bindEvents();
        };

        Range_base.prototype.reset = function () {
            this.$from.date(null);
            this.$to.date(null);
        };
        Range_base.prototype.set = function (val) {
            this.reset();
            if (!val)
                return;
            if (val.from)
                this.$from.data().date(val.from);
            if (val.to)
                this.$to.data().date(val.to);
            //validate here?
        };
        Range_base.prototype.get = function () {
            return { from: this.$from.data().date, to: this.$to.data().date };
        };

        Range_base.prototype.viewMode = function (vMode) {
            var format = 'DD/MM/YYYY';
            var vMode = 'days';
            switch (vMode) {
                case 'date':
                    break;
                case 'months':
                    format = 'MM/YYYY';
                    vMode = 'months';
                    break;
                case 'years':
                    format = 'YYYY';
                    vMode = 'years';
                    break;
            }

            this.$from.data('DateTimePicker').format(format);
            this.$from.data('DateTimePicker').viewMode(vMode);
            this.$to.data('DateTimePicker').format(format);
            this.$to.data('DateTimePicker').viewMode(vMode);
        };

        Range_base.prototype._bindEvents = function () {
            var me = this;
            //this.$from.on('dp.change', function () { console.log(me.$from.data().date); })
            //this.$yFrom.datetimepicker({ viewMode: 'years', locale: 'en', format: "YYYY" });
            //this.$yTo.datetimepicker({ viewMode: 'years', locale: 'en', format: "YYYY" });
        };
        Range_base.prototype._unbindEvents = function () {
        };


        return Range_base;
    })