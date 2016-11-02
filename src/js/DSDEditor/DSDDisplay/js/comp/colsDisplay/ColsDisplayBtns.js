define(['jquery',
    '../../../html/comp/colsDisplay/ColsDisplayBtns.hbs',
    '../../../../DSDColumnEditor/js/Events',
    'amplify-pubsub'
],

    function ($, ColsDisplayBtnsHTML, Evts, amplify) {
        var defConfig = {};

        var h = {
            idBtnEdit: '#colsDisplayColEdit',
            idBtnDel: '#colsDisplayColDel',
        };

        var e = {
            clickEdit: Evts.COLUMN_CLICK_EDIT,
            clickDelete: Evts.COLUMN_CLICK_DELETE
        };

        function ColsDisplayBtns(config) {
            this.config = {};
            this.$container = null;
            $.extend(true, this.config, defConfig, config);

            this.$btnEdit = null;
            this.$btnDel = null;
            this.evtId = "";

        };

        ColsDisplayBtns.prototype.render = function (cnt, config) {
            $.extend(true, this.config, config);

            this.$container = cnt;
            this.$container.html(ColsDisplayBtnsHTML);
            this.$btnEdit = this.$container.find(h.idBtnEdit);
            this.$btnDel = this.$container.find(h.idBtnDel);

            this._bindEvents();
        };

        ColsDisplayBtns.prototype.deleteEnabled = function (enabled) {
            //console.log("ColsDisplayBtns.prototype.deleteEnabled ", enabled)
            if (typeof enabled === 'undefined')
                return;
            if (enabled)
                this.$btnDel.prop("disabled", false);
            else
                this.$btnDel.prop("disabled", true);
        };

        ColsDisplayBtns.prototype.setEventId = function (evtId) {
            this.evtId = evtId;
        };

        ColsDisplayBtns.prototype._bindEvents = function () {
            var me = this;
            this.$btnEdit.on('click', function () { amplify.publish(e.clickEdit, me.evtId); });
            this.$btnDel.on('click', function () { amplify.publish(e.clickDelete, me.evtId); });
        };
        ColsDisplayBtns.prototype._unbindEvents = function () {
            this.$btnEdit.off('click');
            this.$btnDel.off('click');
        };
        ColsDisplayBtns.prototype.destroy = function () {
            this._unbindEvents();
        };

        return ColsDisplayBtns;
    })