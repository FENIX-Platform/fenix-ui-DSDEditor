define(['jquery',
    '../html/comp/AddColButton.html',
    '../../../DSDColumnEditor/js/Events',
    'amplify-pubsub'
],

    function ($, AddColButtonHTML, Evts, amplify) {
        var defConfig = {};

        var h = {
            idBtnAddColTitle: '#btnAddColButtonTitle',
            idBtnAdd: '#btnAdd',
            idTdAddColButton_help: '#tdAddColButton_help',
            idAddColH: '#addColH'
        };

        var e = {
            addColButton_btnClick: Evts.COLUMN_CLICK_ADD
        };

        function AddColButton(config) {
            this.config = {};
            this.$container = null;
            $.extend(true, this.config, defConfig, config);

            this.evtId = "";

            this.$btnAddColTitle = null;
            this.$btnAdd = null;
            this.$tdAddColButton_help = null;
        };

        AddColButton.prototype.render = function (cnt, config) {
            $.extend(true, this.config, config);
            this.$container = cnt;
            this.$container.html(AddColButtonHTML);

            this.$btnAddColTitle = this.$container.find(h.idBtnAddColTitle);
            this.$btnAdd = this.$container.find(h.idBtnAdd);
            this.$tdAddColButton_help = this.$container.find(h.idTdAddColButton_help);

            this._bindEvents();
        };
        AddColButton.prototype.set = function (vals) {            
            if (!vals)
                return;
            if (vals.title)
                this.setTitle(vals.title);
            if (vals.help)
                this.setHelp(vals.help);
            if (vals.evtId)
                this.setEvtId(vals.evtId);
            if (vals.headerClass)
                this.$container.find(h.idAddColH).addClass(vals.headerClass);
        };
        AddColButton.prototype.setTitle = function (title) {
            this.$btnAddColTitle.html(title);
        };
        AddColButton.prototype.setHelp = function (msg) {
            this.$tdAddColButton_help.html(msg);
        };
        AddColButton.prototype.setEvtId = function (id) {
            this.evtId=id;
        };
        AddColButton.prototype.reset = function () {
            this.setTitle('');
            this.setHelp('');
        };

        AddColButton.prototype._bindEvents = function () {
            var me = this;
            this.$btnAdd.on('click', function () { amplify.publish(e.addColButton_btnClick, me.evtId) });
        };
        AddColButton.prototype._unbindEvents = function () {
            this.$btnAdd.off('click');
        };
        AddColButton.prototype.destroy = function () {
            this._unbindEvents();
        };

        return AddColButton;
    })