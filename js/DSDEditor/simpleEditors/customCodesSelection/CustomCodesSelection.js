define([
        'jquery',
        'text!fx-DSDEditor/templates/DSDEditor/simpleEditors/customCodesSelection/CustomCodesSelection.html',
        'i18n!fx-DSDEditor/multiLang/DSDEditor/nls/ML_CustomCodeSelection',
        'jqxall'
],
function ($, CustomCodesSelectionHTML, mlRes, jqx) {
    var defConfig = {};

    var CustomCodesSelection = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$container;

        this.$txtCode;
        this.$txtString;
        this.$lstCodes;
        this.$trStringAdd;
        this.$trStringEdit;

        this.valsList = [];
    };

    //Render - creation
    CustomCodesSelection.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$container = container;
        this.$container.html(CustomCodesSelectionHTML);

        var me = this;
        this.$container.find('#btnCodeAdd').on('click',function () { me.addToList(); });
        this.$container.find('#btnCodeSelOk').on('click', function () { me.editOk(); });
        this.$container.find('#btnCodeCanc').on('click', function () { me.editCanc(); });
        this.$container.find('#btnCodeDel').on('click', function () { me.editDel(); });
        this.$txtCode = this.$container.find('#codeToAdd');
        this.$txtString = this.$container.find('#txtToAdd');
        this.$lstCodes = this.$container.find('#codesList');
        this.$lstCodes.jqxListBox({
            source: this.valsList,
            renderer: function (index, label, value) { return "[" + value + "] " + label }
        });
        this.$lstCodes.on('select', function (evt) {
            var args = evt.args;
            if (args) {
                var index = args.index;
                var item = args.item;
                me.$txtCode.val(item.value);
                me.$txtString.val(item.label);
                me.addEditMode('edit');
            }
            else {
                me.$txtString.val("");
                me.addEditMode('add');
            }
        });
        this.trCodeAdd = this.$container.find('#trCodeAdd');
        this.trCodeEdit = this.$container.find('#trCodeEdit');
        this.addEditMode('add');

        this.doML();
    }
    CustomCodesSelection.prototype.addEditMode = function (mode) {
        if (mode == 'add') {
            this.trCodeAdd.show();
            this.trCodeEdit.hide();
        }
        else if (mode == 'edit') {
            this.trCodeAdd.hide();
            this.trCodeEdit.show();
        }
    }
    CustomCodesSelection.prototype.resetInput = function () {
        this.$txtString.val("");
        this.$txtCode.val("");
    }
    CustomCodesSelection.prototype.checkAndGetInputCodeText = function () {
        var txt = this.$txtString.val().trim();
        var cod = this.$txtCode.val().trim();
        if (!txt)
            throw new Error('emptyText');
        if (!cod)
            throw new Error('emptyCode');
        return { code: cod, label: txt };
    }
    CustomCodesSelection.prototype.addToList = function () {
        var val = this.checkAndGetInputCodeText();
        this.addItem(val.code, val.label);
        this.resetInput();
    }
    CustomCodesSelection.prototype.editOk = function () {
        var selItem = this.$lstCodes.jqxListBox('getSelectedItem');
        var selIndex = -1;
        var val = this.checkAndGetInputCodeText();
        if (!selIndex)
            throw new Error('noSelection');

        selIndex = this.$lstCodes.jqxListBox('getSelectedIndex');
        var items = this.$lstCodes.jqxListBox('getItems');
        if (items)
            for (var i = 0; i < items.length; i++)
                if (i != selIndex && val.code == items[i].value)
                    throw new Error('duplicatedCode');
        this.$lstCodes.jqxListBox('removeItem', selItem);
        this.addItem(val.code, val.label, selIndex);
        this.resetInput();
        this.$lstCodes.jqxListBox('clearSelection');
        this.addEditMode('add');
    }
    CustomCodesSelection.prototype.editCanc = function () {
        this.resetInput();
        this.$lstCodes.jqxListBox('clearSelection');
        this.addEditMode('add');
    }
    CustomCodesSelection.prototype.editDel = function () {
        var selItem = this.$lstCodes.jqxListBox('getSelectedItem');
        if (!selItem)
            throw new Error('noSelection');
        this.$lstCodes.jqxListBox('removeItem', selItem);
        this.resetInput();
        this.$lstCodes.jqxListBox('clearSelection');
        this.addEditMode('add');
    }
    CustomCodesSelection.prototype.addItem = function (cod, txt, pos) {
        var item = this.getItemByCode(cod);
        if (item)
            throw new Error('duplicatedCode');

        if (pos != 'undefined' && pos >= 0)
            this.$lstCodes.jqxListBox('insertAt', { value: cod, label: txt }, pos);
        else
            this.$lstCodes.jqxListBox('addItem', { value: cod, label: txt });
    }
    CustomCodesSelection.prototype.getItemByCode = function (code) {
        var items = this.$lstCodes.jqxListBox('getItems');
        if (items)
            for (var i = 0; i < items.length; i++)
                if (code == items[i].value)
                    return items[i];
        return null;
    }

    CustomCodesSelection.prototype.getValues = function () {
        var items = this.$lstCodes.jqxListBox('getItems');
        if (items) {
            var toRet = [];
            for (var i = 0; i < items.length; i++)
                toRet.push({ code: items[i].value, label: items[i].label });
            return toRet;
        }
        else return null;
    }
    CustomCodesSelection.prototype.setValues = function (vals) {
        this.$lstString.jqxListBox('clear');
        if (!vals)
            return;
        for (var i = 0; i < vals.length; i++)
            this.addStringToList(vals[i].code, vals[i].label);
    }
    CustomCodesSelection.prototype.destroy = function () {
        this.$container.find('#btnCodeAdd').off('click');
        this.$container.find('#btnCodeSelOk').off('click');
        this.$container.find('#btnCodeCanc').off('click');
        this.$container.find('#btnCodeDel').off('click');
        this.$lstCodes.off('select');
        this.$lstCodes.jqxListBox('destroy');
    }
    CustomCodesSelection.prototype.doML = function () {
        this.$container.find('#btnCodeAdd').html(mlRes['add']);
        this.$container.find('#btnCodeSelOk').html(mlRes['ok']);
        this.$container.find('#btnCodeCanc').html(mlRes['cancel']);
        this.$container.find('#btnCodeDel').html(mlRes['delete']);

        this.$container.find('#lblCode').text(mlRes['code']);
        this.$container.find('#lblText').text(mlRes['text']);
    }

    return CustomCodesSelection;
});