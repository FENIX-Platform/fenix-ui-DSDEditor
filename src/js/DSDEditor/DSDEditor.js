define(['jquery',
    'loglevel',
    './html/DSDEditor.html',
    './DSDDisplay/js/DSDDisplay',
    './DSDColumnEditor/js/DSDColumnEditor',
    './ColumnIDGenerator',
    './DSDColumnEditor/js/Events',
    './validators/Validator_DSD',
    './validators/Validator_DSD_Errors',
    '../../config/config',
    '../../config/config-default',
    '../../nls/labels',
    'amplify-pubsub'
],

    function ($, log, DSDEditorHTML, DSDDisplay, DSDColumnEditor, ColumnIDGenerator, Evts, ValidatorDSD, VErrors, C, CD, MLRes, amplify) {
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

            this.lang = this.config.lang.toLowerCase();

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

            this.DSDDisplay = new DSDDisplay(this.config);
            this.DSDDisplay.render(this.$divDSDDisplay);

            this.colEditor = new DSDColumnEditor(this.config);
            var divColEditorCnt = this.$container.find(htmlIDs.divColEditorCnt);
            this.colEditor.render(divColEditorCnt);
            this.$divColEditor.hide();

            this._bindEvents();

            log.info("DSDEditor init with ",this.config);

            if (callB) callB();
        };

        //Sets the dsd
        DSDEditor.prototype.set = function (dsd) {
            this.dsd = dsd;
            this.updateDSDView();
        };
        //gets the DSD
        DSDEditor.prototype.get = function () {
            return this.dsd;
        };

        //switches the panels' visibility
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
        //Add a new column->switch to col view, sets the view mode
        DSDEditor.prototype.addColumn = function (colType) {
            this.switchVisibility(htmlIDs.divColEditor);
            this.colEditor.newColumn();
            this.colEditor.setColumnEditorType(colType);

            //this.colEditor.setEditMode({subject:false,domain:false,datatype:false});
        };
        //Edit a columns
        DSDEditor.prototype.editColumn = function (col) {
            this.switchVisibility(htmlIDs.divColEditor);
            this.colEditor.setColumn(col);
        };
        //Called when the user has finished editing a columns
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

            this._sortColumnsByType();
            this.updateDSDView();
            this.changed = true;
        };

        DSDEditor.prototype._sortColumnsByType = function () {
            this.dsd.columns.sort(function (a, b) {
                //both key, keep the order
                if (a.key && b.key) return 0;
                if (a.key) return -1; //a is key, a goes first
                if (b.key) return 1;
                //two value columns are not allowed at the moment, for the future...
                if (a.subject == 'value' && b.subject == 'value')
                    return 0;
                if (a.subject == 'value')
                    return -1;
                if (b.subject == 'value')
                    return 1;
                return 0;
            });
        };
        //Refreshes the DSD view
        DSDEditor.prototype.updateDSDView = function () {
            this.DSDDisplay.setCols(this.dsd);
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
                    if (!confirm(MLRes[me.lang]['unsavedChanges']))
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
        //Edit col
        DSDEditor.prototype._colDisplayEditClicked = function (colId) {
            var toEdit = getColumnById(this.dsd.columns, colId);
            this.editColumn(toEdit);
        };
        //Delete a column
        DSDEditor.prototype._colDisplayDeleteClicked = function (colId) {
            if (!confirm(MLRes[this.lang]['areYouSure']))
                return false;
            var colIdx = getColumnIndexById(this.dsd.columns, colId);
            if (colIdx != -1)
                this.dsd.columns.splice(colIdx, 1);
            this.updateDSDView();
            this.changed = true;
        };
        DSDEditor.prototype.editable = function (editable) {
            if (editable)
                this.colEditor.setEditMode({ subject: true, domain: true, datatype: true });
            else
                this.colEditor.setEditMode({ subject: false, domain: false, datatype: false });

            if (typeof (editable) != 'undefined')
                this.DSDDisplay.editable(editable);
            else
                return this.DSDDisplay.editable();

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
            if (!valRes)  return;
            for (var i = 0; i < valRes.length; i++)
                log.warn(valRes[i].message);
                // TODO: Add Notification in a Centralized Fashon
                // Noti.showError("Error", valRes[i].message);
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