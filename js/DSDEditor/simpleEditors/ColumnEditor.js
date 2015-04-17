/*
config format:
{langs:['EN','FR']}
*/
define([
        'jquery',
        'jqxall',
        'fx-DSDEditor/js/DSDEditor/simpleEditors/MLTextEditor',
        'fx-DSDEditor/js/DSDEditor/simpleEditors/DomainEditor',
        'fx-DSDEditor/js/DSDEditor/simpleEditors/ColumnEditorComponents/LimitedDDL',
        'fx-DSDEditor/js/DSDEditor/simpleEditors/ColumnEditorComponents/SubjectSelector',
        'i18n!fx-DSDEditor/multiLang/DSDEditor/nls/ML_DSDEdit',
        'text!fx-DSDEditor/templates/DSDEditor/ColumnEditor.htm'
],
    function ($, jqx, MLTextEditor, DomainEditor, LimitedDDL, SubjectSelector, mlRes, columnEditorHTML) {

        var defConfig = {};

        function ColumnEditor(config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
            this.$container;

            this.colId = "";
            this.mlEditorTitle = new MLTextEditor();
            this.subjectSelector = new SubjectSelector();
            this.dataTypeSelector = new LimitedDDL();
            this.$dimension;
            this.domainEditor = new DomainEditor();
            this.mlEditorSupplemental = new MLTextEditor();

            this.changed = false;
        };

        ColumnEditor.prototype.render = function (container, config) {
            $.extend(true, this.config, config);
            this.$container = container;
            this.$container.html(columnEditorHTML);
            this.mlEditorTitle.render(this.$container.find('#colEditTitle'), this.config.MLEditor);
            var $dataType = this.$container.find('#colEditDataType');
            this.dataTypeSelector.render($dataType);
            $subject = this.$container.find('#colEditSubject');
            this.subjectSelector.render($subject);
            this.domainEditor.render(this.$container.find('#colEditDomain'));
            this.mlEditorSupplemental.render(this.$container.find('#colEditSupplemental'), this.config.MLEditor);
            //Evts
            var me = this;
            $subject.on('changed.subjectSelector.fenix', function (evt, param) {
                me.subjectChanged(param);
            });
            $dataType.on('change', function (evt) {
                me.dataTypeChanged(evt.args.item.value);
            });

            this.$container.find('#colEditSupplemental').on('keyup', function () {
                me.changed = true;
            });
            this.$container.find('#colEditTitle').on('keyup', function () {
                me.changed = true;
            });


            this.doML();
        }

        ColumnEditor.prototype.setSubjects = function (subjects) {
            this.subjectSelector.setSubjects(subjects);
        }
        ColumnEditor.prototype.getSubjects = function () {
            this.subjectSelector.getSubjects();
        }

        ColumnEditor.prototype.setDataTypes = function (dataTypes) {
            this.dataTypeSelector.setItems(dataTypes);
        }
        ColumnEditor.prototype.getDataTypes = function () {
            this.dataTypeSelector.getItems();
        }

        ColumnEditor.prototype.setCodelists = function (cl) {
            this.domainEditor.setCodelists(cl);
        }
        ColumnEditor.prototype.getCodelists = function () {
            return this.domainEditor.getCodelsits();
        }

        ColumnEditor.prototype.reset = function () {
            this.validationActive = false;
            this.colId = "";
            this.mlEditorTitle.reset();
            this.keyEnabled(true);
            $('#colEditKey').prop('checked', false);
            this.dataTypeSelector.clearSelection();
            this.dataTypeSelector.limitItems(null);
            this.subjectSelector.setSelectedValue('');
            this.domainEditor.reset();
            this.mlEditorSupplemental.reset();
            this.resetValidationResults();
            this.validationActive = true;
            this.changed = false;
        }

        ColumnEditor.prototype.setColumn = function (col) {
            this.reset();
            this.validationActive = false;

            this.colId = col.id;
            if (col.title)
                this.mlEditorTitle.setLabels(col.title);
            if (col.dataType)
                this.dataTypeSelector.setSelectedValue(col.dataType);
            if (col.subject)
                this.subjectSelector.setSelectedValue(col.subject);
            if (col.domain)
                this.setDomain(col.dataType, col.domain);
            if (col.key)
                $('#colEditKey').prop('checked', col.key);
            if (col.supplemental)
                this.mlEditorSupplemental.setLabels(col.supplemental);
            this.validationActive = true;
        }
        ColumnEditor.prototype.getColumn = function () {
            var toRet = {};
            toRet.id = this.colId;
            toRet.title = this.mlEditorTitle.getLabels();
            toRet.key = $('#colEditKey').is(':checked');
            toRet.dataType = this.dataTypeSelector.getSelectedValue();
            toRet.domain = this.domainEditor.getDomain();
            var subj = this.subjectSelector.getSelectedSubject();
            if (subj)
                toRet.subject = subj.val;

            toRet.supplemental = this.mlEditorSupplemental.getLabels();
            if ($.isEmptyObject(toRet.supplemental))
                toRet.supplemental = null;

            //Link here
            return toRet;
        }

        ColumnEditor.prototype.showValidationResults = function (valRes) {
            this.resetValidationResults();

            if (valRes)
                for (var i = 0; i < valRes.length; i++) {
                    switch (valRes[i].field) {
                        case 'title':
                            this.$container.find('#lTD_Title').addClass("fx-red-cell");
                            break;
                        case 'dimension':
                            this.$container.find('#lTD_Dimension').addClass("fx-red-cell");
                            break;
                        case 'dataType':
                            this.$container.find('#lTD_DataType').addClass("fx-red-cell");
                            break;
                        case 'domain':
                            this.$container.find('#lTD_Domain').addClass("fx-red-cell");
                    }
                }
        }

        ColumnEditor.prototype.resetValidationResults = function () {
            this.$container.find('#lTD_Title').removeClass("fx-red-cell");
            this.$container.find('#lTD_Dimension').removeClass("fx-red-cell");
            this.$container.find('#lTD_DataType').removeClass("fx-red-cell");
            this.$container.find('#lTD_Domain').removeClass("fx-red-cell");
        }

        ColumnEditor.prototype.setDomain = function (dataType, domain) {
            this.domainEditor.setMode(dataType);
            this.domainEditor.setDomain(domain);
        }

        //Evts
        ColumnEditor.prototype.subjectChanged = function (newSubj) {
            this.keyEnabled(this._enableDisableKey(newSubj, null));
            this.limitDataTypes(newSubj);
            this.limitCodelists(newSubj);
            this.changed = true;
        }

        ColumnEditor.prototype.dataTypeChanged = function (newDataType) {
            this.domainEditor.setMode(newDataType);
            var subj = this.subjectSelector.getSelectedSubject();
            if (newDataType == 'code')
                this.limitCodelists(subj);
            var dT = this.dataTypeSelector.getSelectedItem();
            this.keyEnabled(this._enableDisableKey(subj, dT));
            this.changed = true;
        }
        ColumnEditor.prototype._enableDisableKey = function (subj, dT) {
            var kEnabled = true;
            if (subj && subj.canBeDimension === false)
                kEnabled = false;
            if (dT && dT.canBeDimension === false)
                kEnabled = false;
            return kEnabled;
        }

        ColumnEditor.prototype.keyEnabled = function (enabled) {
            if (enabled)
                $('#colEditKey').removeAttr('disabled');
            else {
                $('#colEditKey').prop('checked', false);
                $('#colEditKey').prop('disabled', true);
            }
        }

        ColumnEditor.prototype.limitDataTypes = function (subj) {
            if (subj)
                this.dataTypeSelector.limitItems(subj.dataTypes);
            else
                this.dataTypeSelector.limitItems(null);
        }
        ColumnEditor.prototype.limitCodelists = function (subj) {
            if (subj)
                this.domainEditor.setCodelistSubject(subj.codelistSubject);
            else
                this.domainEditor.setCodelistSubject(null);
        }

        ColumnEditor.prototype.destroy = function () {
            this.$container.find('#colEditSubject').off('changed.subjectSelector.fenix');
            this.$container.find('#colEditDataType').off('change');
            this.$container.find('#colEditSupplemental').off('keyup');
            this.$container.find('#colEditTitle').off('keyup');

            this.dataTypeSelector.destroy();
            this.subjectSelector.destroy();
            this.domainEditor.destroy();
        }

        ColumnEditor.prototype.hasChanged = function () { return this.changed; }

        //Multilang
        ColumnEditor.prototype.doML = function () {
            this.$container.find('#lTD_Title').html(mlRes.title);
            this.$container.find('#lTD_Subject').html(mlRes.subject);
            this.$container.find('#lTD_DataType').html(mlRes.datatype);
            this.$container.find('#lTD_Domain').html(mlRes.domain);
            this.$container.find('#lTD_key').html(mlRes.key);
            this.$container.find('#lTD_Supplemental').html(mlRes.supplemental);
        }
        //END Multilang

        return ColumnEditor;
    });