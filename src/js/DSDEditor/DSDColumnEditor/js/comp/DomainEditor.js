//TODO: the changed function must be done

define(['jquery',
    '../../html/comp/DomainEditor.hbs',
    './domainEditors/CodelistSelector',
    '../../../../../nls/labels',
    //'components/DSDEditor/DSDColumnEditor/js/comp/domainEditors/DatesRange',
    'amplify-pubsub'
],
    function ($, DomainEditorHTML, CodelistSelector, mlRes, amplify) {
        var defConfig = {};
        var h = {
            idNoDataType: '#domEdit_noDatatype',
            idNoDomain: '#domEdit_noDomain',
            idEditor: '#domEdit_editor'
        };
        var evts = {
        };

        var MODES = {
            code: 'code',
            year: 'year',
            month: 'month',
            date: 'date',
            customCode: 'customCode'
        };

        function DomainEditor(config) {
            this.config = {};
            this.$container = null;
            $.extend(true, this.config, defConfig, config);

            this.mode = '';
            this.$divNoDatatype = null;
            this.$divNoDomain = null;
            this.$divDomainEditor = null;

            this.codelistSelector = null;
            this._changed = false;

            this.lang = this.config.lang.toLowerCase();

        };

        DomainEditor.prototype.render = function (cnt, config) {
            $.extend(true, this.config, config);
            this.$container = cnt;

            this.$container.html(DomainEditorHTML);
            this.$divNoDatatype = this.$container.find(h.idNoDataType);
            this.$divNoDomain = this.$container.find(h.idNoDomain);
            this.$divDomainEditor = this.$container.find(h.idEditor);
            this.$divNoDatatype.show();
            this.$divNoDomain.hide();
            this.$divDomainEditor.hide();
            this._bindEvents();
            this._doML();
        };
        DomainEditor.prototype.set = function (mode, subject, domain) {
            //this.reset();
            this._changed = false;
            this.setMode(mode, subject);
            switch (this.mode) {
                case MODES.code:
                    this.codelistSelector.set(subject, domain.codes);
                    break;
                case MODES.year:
                case MODES.month:
                case MODES.date:
                    //this.datesSelector.setRange(domain.period);
                    break;
            }
        };
        DomainEditor.prototype.get = function () {
            switch (this.mode) {
                case MODES.code:
                    return { codes: [this.codelistSelector.get()] };
                    break;
                case MODES.year:
                case MODES.month:
                case MODES.date:
                    //var rng = this.datesSelector.getRange();
                    //if (!rng) return null;
                    //return { period: rng };
                    break;
            }
        };
        DomainEditor.prototype.reset = function () {
            this.setMode('');
            this._changed = false;
        };

        DomainEditor.prototype.setMode = function (mode, subject) {
            //this.mode = mode;
            if (this.mode == mode)
                return;
            this.mode = mode;
            this.$divDomainEditor.empty();
            this.$divDomainEditor.hide();
            this.$divNoDomain.hide();
            this.$divNoDatatype.hide();

            //Domain handler is changing destroy the old one
            if (this.codelistSelector)
                this.codelistSelector.destroy();
            this.codelistSelector = null;

            switch (mode) {
                case '':
                    this.$divNoDatatype.show();
                    break;
                case MODES.code:
                    this.$divDomainEditor.show();
                    this.codelistSelector = new CodelistSelector(this.config);
                    this.codelistSelector.render(this.$divDomainEditor);
                    this.codelistSelector.setSubject(subject);
                    //this.codelistSelector.setCodelists(this.cLists);
                    break;
                case MODES.year:
                case MODES.month:
                case MODES.date:
                    this.$divDomainEditor.show();
                    //this.datesSelector = new DatesRangeSelector();
                    //this.datesSelector.render(this.$divDomainEditor);
                    //this.datesSelector.setMode(mode);
                    break;
                case MODES.customCode:
                    //this.$divDomainEditor.show();
                    //this.customCodeSelector = new CustomCodesSelection();
                    //this.customCodeSelector.render(this.$divDomainEditor);
                    break;
                default:
                    this.$divNoDomain.show();
                    break;
            }
        }
        DomainEditor.prototype._bindEvents = function () { };
        DomainEditor.prototype._unbindEvents = function () { };

        DomainEditor.prototype.changed = function () { return this._changed;};
        DomainEditor.prototype.destroy = function () {
            if (this.codelistSelector)
                this.codelistSelector.destroy();
            this._unbindEvents();
        };

        DomainEditor.prototype._doML = function () {
            this.$container.find(h.idNoDataType).html(mlRes[this.lang]['domEdit_noDatatype']);
            this.$container.find(h.idNoDomain).html(mlRes[this.lang]['domEdit_noDomain']);
        };

            return DomainEditor;
    });