define(['jquery',
    'text!fx-DSDEditor/js/DSDEditor/DSDColumnEditor/html/DSDColumnEditor.html',
    'fx-DSDEditor/js/DSDEditor/DSDColumnEditor/js/comp/DynamicRadio',
    'fx-DSDEditor/js/DSDEditor/DSDColumnEditor/js/comp/DomainEditor',
    'i18n!fx-DSDEditor/js/DSDEditor/DSDColumnEditor/multiLang/nls/ML_DSDColumnEditor',
    'fx-DSDEditor/js/DSDEditor/DSDConfigs/js/ColumnEditorReader',
    'fx-DSDEditor/js/DSDEditor/DSDConfigs/js/SubjectReader',
    'fx-DSDEditor/js/DSDEditor/DSDConfigs/js/DatatypeReader',
    'fx-DSDEditor/js/MLInput/js/MLInput',
    'fx-DSDEditor/js/DSDEditor/DSDColumnEditor/js/Events',
    'fx-DSDEditor/js/DSDEditor/validators/Validator_DSD',
    'fx-DSDEditor/js/DSDEditor/validators/Validator_DSD_Errors',
    'validate',
    'amplify'
],
    function ($, DSDColumnEditorHTML, DynamicRadio, DomainEditor, mlRes, ColumnEditorReader, SubjectReader, DatatypeReader, MLInput, Evts, ValidatorDSD, VErrors) {
        var defConfig = { inputLangs: ['EN', 'FR'] };
        var h = {
            txtTitle: "#txtTitle",
            txtSupplemental: '#txtSupplemental',
            trSubj: '#trSubj',
            tdSubj: '#tdSubj',
            trDataType: "#trDataType",
            tdDataType: "#tdDataType",
            trDomain: '#trDomain',
            tdDomain: '#tdDomainEditor',
            tblColEditor: '#tblColEditor',

            lblTitle: '#lTitle',
            lblSuppl: '#lSupplemental',
            lblSubj: '#lSubject',
            lblDataType: '#lDataType',
            lblDomain: '#lDomain'
        };
        var EDITOR_TYPE = {
            dimension: 'dimension',
            value: 'value',
            other: 'other'
        };
        var DATA_TYPES = {
            code: 'code'
        };
        var RADIOGROUP_ID = {
            SUBJ: 'radioSubj',
            DTYPE: 'radioDatatype'
        };

        function DSDColumnEditor(config) {
            this.config = {};
            this.$cnt = null;
            $.extend(true, this.config, defConfig, config);

            this.$txtTitle;
            this.$txtSupplemental;
            this.dynRadioSubj;
            this.mlTitle;
            this.mlSupplemental;
            this.dynRadioDataType;

            this.editorType = "";
            this.colID = "";
            //keep the values field, remove it when the column's distinct will be calculated by the server
            this.valuesField = null; 

            this.domainEditor = new DomainEditor();
            this.columnEditorReader = new ColumnEditorReader();
            this.subjectReader = new SubjectReader();
            this.datatypeReader = new DatatypeReader();

            this.dynRadioSubj = null;
            this.dynRadioDataType = null;

            this.validator = null;

            this.editorsVisibilityCfg = { subject: true, domain: true, datatype: true };
        };

        DSDColumnEditor.prototype.render = function (cnt, config) {
            $.extend(true, this.config, config);
            this.$cnt = cnt;
            this.$cnt.html(DSDColumnEditorHTML);

            this.$txtTitle = this.$cnt.find(h.txtTitle);
            this.$txtSupplemental = this.$cnt.find(h.txtSupplemental);

            this.$trSubj = this.$cnt.find(h.trSubj);
            var $tdSubj = this.$cnt.find(h.tdSubj);
            this.$trDomain = this.$cnt.find(h.trDomain);
            var $tdDomain = this.$cnt.find(h.tdDomain);
            this.dynRadioSubj = new DynamicRadio();
            this.dynRadioSubj.render($tdSubj);

            this.$trDataType = this.$cnt.find(h.trDataType);
            var $tdDataType = this.$cnt.find(h.tdDataType);
            this.dynRadioDataType = new DynamicRadio();
            this.dynRadioDataType.render($tdDataType);

            this.mlTitle = new MLInput({ langs: this.config.inputLangs });
            this.mlTitle.render(this.$txtTitle);
            this.mlSupplemental = new MLInput({ langs: this.config.inputLangs });
            this.mlSupplemental.render(this.$txtSupplemental);

            this.domainEditor.render($tdDomain);

            this._bindEvents();
            this._attachValidator();
            this._doML();
        };

        function showHide($elem, visible) {
            if (typeof visible === 'undefined')
                return;
            if (visible)
                $elem.show();
            else
                $elem.hide();
        }
        DSDColumnEditor.prototype.setEditMode = function (cfg) {
            this.editorsVisibilityCfg = cfg;
            showHide(this.$trSubj, cfg.subject);
            showHide(this.$trDomain, cfg.domain);
            showHide(this.$trDataType, cfg.datatype);
        };

        DSDColumnEditor.prototype.newColumn = function () {
            this.reset();
        };

        DSDColumnEditor.prototype._subjectChanged = function (v) {
            this.updateDataTypes(this.editorType, v);
            this.domainEditor.reset();
        };

        DSDColumnEditor.prototype._dataTypeChanged = function (v) {
            this.domainEditor.setMode(v, this.dynRadioSubj.get());
        };

        DSDColumnEditor.prototype.setColumnEditorType = function (type) {
            this.editorType = type;
            var subj = this.columnEditorReader.getColumnTypeSubjects(type);
            if (!subj || subj.length == 0) {
                this._subjectsVisible(false);
                return;
            }

            var s = this.subjectReader.getFilteredSubjects(subj);
            var s2 = [];
            for (var i = 0; i < s.length; i++) {
                s2.push({ value: s[i].value, text: s[i].text.EN });
            }
            var checked = null;
            if (s2.length == 1) {
                checked = s2[0].value;
                this._subjectsVisible(false);
            }
            else {
                this._subjectsVisible(true);
            }

            this.dynRadioSubj.setRadios(RADIOGROUP_ID.SUBJ, s2, checked);
            this.updateDataTypes(type, checked);
        };
        DSDColumnEditor.prototype.updateDataTypes = function (columnType, subject) {
            var dts = this.columnEditorReader.getSubjectDatatypes(columnType, subject);
            if (!dts)
                return;
            var dts2 = this.datatypeReader.getFilteredDatatypes(dts);
            var dts3 = [];
            for (var i = 0; i < dts2.length; i++) {
                dts3.push({ value: dts2[i].value, text: dts2[i].text.EN });
            }
            this.dynRadioDataType.setRadios(RADIOGROUP_ID.DTYPE, dts3, '');
        };
        DSDColumnEditor.prototype.reset = function () {
            this.colID = "";
            this.valuesField = null;
            this.mlTitle.reset();
            this.mlSupplemental.reset();
            this.dynRadioSubj.reset();
            this.dynRadioDataType.reset();
            //this.editorType = "";
            this.setColumnEditorType("");
            this.domainEditor.reset();
        };
        DSDColumnEditor.prototype._subjectsVisible = function (visible) {
            //overridden by the component's config
            if (typeof this.editorsVisibilityCfg.subject !== 'undefined')
                if (!this.editorsVisibilityCfg.subject)
                    return;

            //var $trSubj = this.$cnt.find(h.trSubj);
            if (visible)
                this.$trSubj.show();
            else
                this.$trSubj.hide();
        };

        DSDColumnEditor.prototype.getColumn = function () {
            var toRet = {};
            toRet.id = this.colID;
            if (this.valuesField)
                toRet.values = this.valuesField;
            if (this.editorType == EDITOR_TYPE.dimension)
                toRet.key = true;
            else
                toRet.key = false;
            toRet.subject = this.dynRadioSubj.get();
            toRet.dataType = this.dynRadioDataType.get();
            toRet.title = this.mlTitle.get();
            toRet.supplemental = this.mlSupplemental.get();
            toRet.domain = this.domainEditor.get();

            return toRet;
        };

        DSDColumnEditor.prototype.setColumn = function (toSet) {
            this.reset();
            this.colID = toSet.id;
            this.valuesField = toSet.values;
            var type = EDITOR_TYPE.other;
            if (toSet.key)
                type = EDITOR_TYPE.dimension;
            else if (toSet.subject == 'value')
                type = EDITOR_TYPE.value;
            this.setColumnEditorType(type);
            this.mlTitle.set(toSet.title);
            this.mlSupplemental.set(toSet.supplemental);
            this.dynRadioSubj.set(toSet.subject);
            this.dynRadioDataType.set(toSet.dataType);

            if (toSet.dataType == DATA_TYPES.code) {
                this.domainEditor.set(DATA_TYPES.code, toSet.subject, toSet.domain);
            }
        };

        DSDColumnEditor.prototype._bindEvents = function () {
            var me = this;
            amplify.subscribe(Evts.DYNAMIC_RADIO_CHANGED, this, function (val, group) {
                if (group == RADIOGROUP_ID.SUBJ) { me._subjectChanged(val); }
                else if (group == RADIOGROUP_ID.DTYPE) { me._dataTypeChanged(val); };
            });
        };

        DSDColumnEditor.prototype._unbindEvents = function () {
            amplify.unsubscribe(Evts.DYNAMIC_RADIO_CHANGED);
        };

        DSDColumnEditor.prototype._attachValidator = function () {
            var tblColEditor = this.$cnt.find(h.tblColEditor);
            this.validator = tblColEditor.parsley();
        };
        DSDColumnEditor.prototype._detachValidator = function () {
            this.validator.destroy();
        };

        DSDColumnEditor.prototype.validate = function () {
            val = new ValidatorDSD();
            var valRes = val.validateColumn(this.getColumn());
            this.updateValidationUI(valRes);

            if (!valRes || valRes.length == 0)
                return true;
            return false;
        };
        DSDColumnEditor.prototype.updateValidationUI = function (valRes) {

            window.ParsleyUI.removeError(this.$cnt.find('#lTitle').parsley(), 'required', mlRes[VErrors.TITLE_BLANK]);
            window.ParsleyUI.removeError(this.$cnt.find('#lSubject').parsley(), 'required', mlRes[VErrors.SUBJECT_EMPTY]);
            window.ParsleyUI.removeError(this.$cnt.find('#lDataType').parsley(), 'required', mlRes[VErrors.DATATYPE_EMPTY]);
            window.ParsleyUI.removeError(this.$cnt.find('#lDomain').parsley(), 'required', mlRes[VErrors.CODELIST_EMPTY]);

            if (!valRes)
                return;
            for (var i = 0; i < valRes.length; i++) {
                switch (valRes[i].message) {
                    case VErrors.TITLE_BLANK:
                        window.ParsleyUI.addError(this.$cnt.find('#lTitle').parsley(), 'required', mlRes[VErrors.TITLE_BLANK]);
                        break;
                    case VErrors.SUBJECT_EMPTY:
                        window.ParsleyUI.addError(this.$cnt.find('#lSubject').parsley(), 'required', mlRes[VErrors.SUBJECT_EMPTY]);
                        break;
                    case VErrors.DATATYPE_EMPTY:
                        window.ParsleyUI.addError(this.$cnt.find('#lDataType').parsley(), 'required', mlRes[VErrors.DATATYPE_EMPTY]);
                        break;
                    case VErrors.CODELIST_EMPTY:
                        window.ParsleyUI.addError(this.$cnt.find('#lDomain').parsley(), 'required', mlRes[VErrors.CODELIST_EMPTY]);
                        break;
                }
            }
        };
        DSDColumnEditor.prototype.changed = function () {
            return this.mlTitle.changed() || this.mlSupplemental.changed() || this.domainEditor.changed() || this.dynRadioSubj.changed() || this.dynRadioDataType.changed();
        };
        DSDColumnEditor.prototype._doML = function () {
            this.$cnt.find(h.lblTitle).html(mlRes.title);
            this.$cnt.find(h.lblSuppl).html(mlRes.supplemental);
            this.$cnt.find(h.lblSubj).html(mlRes.subject);
            this.$cnt.find(h.lblDataType).html(mlRes.dataType);
            this.$cnt.find(h.lblDomain).html(mlRes.domain);
        };

        DSDColumnEditor.prototype.destroy = function () {
            this._unbindEvents();
            this._detachValidator();
            this.mlTitle.destroy();
            this.mlSupplemental.destroy();
            this.domainEditor.destroy();
            this.dynRadioSubj.destroy();
            this.dynRadioDataType.destroy();
        };

        return DSDColumnEditor;
    })