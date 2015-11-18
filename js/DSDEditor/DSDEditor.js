define(['jquery',
    'text!fx-DSDEditor/js/DSDEditor/html/DSDEditor.html',
    'fx-DSDEditor/js/DSDEditor/DSDDisplay/js/DSDDisplay',
    'fx-DSDEditor/js/DSDEditor/DSDColumnEditor/js/DSDColumnEditor',
    'fx-DSDEditor/js/DSDEditor/ColumnIDGenerator',
    'fx-DSDEditor/js/DSDEditor/DSDColumnEditor/js/Events',
    'fx-DSDEditor/js/dataManagementCommons/Validator_DSD',
    'fx-DSDEditor/js/dataManagementCommons/Validator_DSD_Errors',
    'fx-DSDEditor/js/dataManagementCommons/Notifications',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'i18n!fx-DSDEditor/multiLang/DSDEditor/nls/ML_DSDEdit',
    'amplify'
],

    function ($, DSDEditorHTML, DSDDisplay, DSDColumnEditor, ColumnIDGenerator, Evts, ValidatorDSD, VErrors, Noti, C, CD, MLRes) {
        var defConfig = {};
        var htmlIDs = {
            divDSD: "#divDSD",
            divColEditor: "#divColEditor",
            divColEditorCnt: "#divColEditorCnt",
            btnAddDimension: '#btnAddDimension',
            btnAddValue: '#btnAddValue',
            btnAddOther: '#btnAddOther',
            btnColEditorOk: '#btnColEditorOk',
            btnColEditorCancel: '#btnColEditorCancel'
        };
        var colTypes = {
            dimension: 'dimension',
            value: 'value',
            other: 'other'
        };
        var e = {
            DSDEDITOR_TO_COLUMN_EDITOR: 'fx.DSDEditor.toColumnEditor',
            DSDEDITOR_TO_COLUMN_SUMMARY: 'fx.DSDEditor.toColumnSummary'
        };

        function DSDEditor(config) {
            this.config = {};
            this.$container = null;
            $.extend(true, this.config, defConfig, config);

            this.$divDSDDisplay;
            this.$divColEditor;

            this.dsd = {};
            //this.addDatasourceAndContextSys();

            this.DSDDisplay;
            this.colEditor;
            this.changed = false;
        };

        DSDEditor.prototype.render = function (cnt, config, callB) {
            $.extend(true, this.config, config);
            this.$container = cnt;
            this.$container.html(DSDEditorHTML);

            this.$divDSDDisplay = this.$container.find(htmlIDs.divDSD);
            this.$divColEditor = this.$container.find(htmlIDs.divColEditor);

            this.DSDDisplay = new DSDDisplay();
            this.DSDDisplay.render(this.$divDSDDisplay);

            this.colEditor = new DSDColumnEditor();
            var divColEditorCnt = this.$container.find(htmlIDs.divColEditorCnt);
            this.colEditor.render(divColEditorCnt);
            this.$divColEditor.hide();

            this._bindEvents();

            if (callB) callB();
        };

        DSDEditor.prototype.set = function (dsd) {
            this.dsd = dsd;
            this.updateDSDView();
        };

        DSDEditor.prototype.get = function () {
            return this.dsd;
        };

        DSDEditor.prototype.switchVisibility = function (divID) {
            if (divID == htmlIDs.divColEditor) {
                this.$divDSDDisplay.hide();
                this.$divColEditor.show();
                amplify.publish(e.DSDEDITOR_TO_COLUMN_EDITOR);
            }
            else if (divID == htmlIDs.divDSD) {
                this.$divColEditor.hide();
                this.$divDSDDisplay.show();
                amplify.publish(e.DSDEDITOR_TO_COLUMN_SUMMARY);
            }
        };
        DSDEditor.prototype.addColumn = function (colType) {
            this.switchVisibility(htmlIDs.divColEditor);
            this.colEditor.newColumn();
            this.colEditor.setColumnEditorType(colType);
        };
        DSDEditor.prototype.editColumn = function (col) {
            this.switchVisibility(htmlIDs.divColEditor);
            this.colEditor.setColumn(col);
        };
        DSDEditor.prototype.colEditDone = function () {
            var colToAdd = this.colEditor.getColumn();
            if (!this.dsd.columns)
                this.dsd.columns = [];

            //create a new id
            if (colToAdd.id == "") {
                colToAdd.id = new ColumnIDGenerator().generate(this.dsd.columns, colToAdd);
            }

            var idx = getColumnIndexById(this.dsd.columns, colToAdd.id);
            if (idx == -1)
                this.dsd.columns.push(colToAdd);
            else
                this.dsd.columns[idx] = colToAdd;

            this.updateDSDView();
            this.changed = true;
        };

        DSDEditor.prototype.updateDSDView = function () {
            this.DSDDisplay.setCols(this.dsd.columns);
        };

        DSDEditor.prototype._colAddClick = function (evtId) {
            if (evtId == 'addDim') {
                this.addColumn(colTypes.dimension);
            }
            else if (evtId == 'addVal') {
                this.addColumn(colTypes.value);
            }
            else if (evtId == 'addOther') {
                this.addColumn(colTypes.other);
            }
        };
        DSDEditor.prototype.reset = function () {
            this.initDSD();
            this.updateDSDView();
            this.changed = false;
        };
        DSDEditor.prototype.hasChanged = function () {
            return this.changed;
        };
        DSDEditor.prototype._bindEvents = function () {
            var me = this;
            amplify.subscribe(Evts.COLUMN_CLICK_ADD, this, me._colAddClick);

            this.$container.find(htmlIDs.btnColEditorOk).on('click', function () {
                var val = me.colEditor.validate();
                if (!val) {
                    return;
                }
                me.colEditDone();
                me.switchVisibility(htmlIDs.divDSD);
            });
            this.$container.find(htmlIDs.btnColEditorCancel).on('click', function () {
                if (me.colEditor.changed()) {
                    if (!confirm(MLRes['unsavedChanges']))
                        return;
                }

                me.colEditor.reset();
                me.switchVisibility(htmlIDs.divDSD);
            });

            amplify.subscribe(Evts.COLUMN_CLICK_EDIT, this, me._colDisplayEditClicked);
            amplify.subscribe(Evts.COLUMN_CLICK_DELETE, this, me._colDisplayDeleteClicked);
        };
        DSDEditor.prototype._unbindEvents = function () {
            amplify.unsubscribe(Evts.COLUMN_CLICK_ADD, this._colAddClick);
            this.$container.find(htmlIDs.btnColEditorOk).off('click');
            this.$container.find(htmlIDs.btnColEditorCancel).off('click');

            amplify.unsubscribe(Evts.COLUMN_CLICK_EDIT, this._colDisplayEditClicked);
            amplify.unsubscribe(Evts.COLUMN_CLICK_DELETE, this._colDisplayDeleteClicked);
        };
        DSDEditor.prototype.destroy = function () {
            this._unbindEvents();
            this.DSDDisplay.destroy();
            this.colEditor.destroy();
        };

        DSDEditor.prototype._colDisplayEditClicked = function (colId) {
            var toEdit = getColumnById(this.dsd.columns, colId);
            this.editColumn(toEdit);
        };
        DSDEditor.prototype._colDisplayDeleteClicked = function (colId) {
            if (!confirm("__DELETE?"))
                return false;
            var colIdx = getColumnIndexById(this.dsd.columns, colId);
            if (colIdx != -1)
                this.dsd.columns.splice(colIdx, 1);
            this.updateDSDView();
            this.changed = true;
        };
        DSDEditor.prototype.editable = function (editable) {
            this.DSDDisplay.editable(editable);
        };
        //Validation
        DSDEditor.prototype.validate = function () {
            var val = new ValidatorDSD();
            var valRes = val.validateColumns(this.get().columns);
            this.updateValidationUI(valRes);
            if (!valRes || valRes.length == 0)
                return true;
            return false;
        };
        DSDEditor.prototype.isValid = function () {
            var val = new ValidatorDSD();
            var valRes = val.validateColumns(this.get().columns);
            if (!valRes || valRes.length == 0)
                return true;
            return false;
        };
        DSDEditor.prototype.updateValidationUI = function (valRes) {
            if (!valRes)
                return;
            for (var i = 0; i < valRes.length; i++)
                Noti.showError("Error", valRes[i].message);
        };
        //Utils
        function getColumnIndexById(cols, id) {
            if (!cols)
                return -1;
            for (var i = 0; i < cols.length; i++)
                if (cols[i].id == id)
                    return i;
            return -1;
        };
        function getColumnById(cols, id) {
            var idx = getColumnIndexById(cols, id);
            if (idx == -1)
                return null;
            return cols[idx];
        };


        return DSDEditor;
    })