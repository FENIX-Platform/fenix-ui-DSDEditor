define([
'jquery',
 'jqxall',
 'fx-DSDEditor/js/DSDEditor/simpleEditors/CodelistSelector',
 'fx-DSDEditor/js/DSDEditor/simpleEditors/DatesRangeSelector',
 'fx-DSDEditor/js/DSDEditor/simpleEditors/customCodesSelection/CustomCodesSelection',
 'i18n!fx-DSDEditor/multiLang/DSDEditor/nls/ML_DomainEditor',
 'text!fx-DSDEditor/templates/DSDEditor/simpleEditors/DomainEditor.htm'
],
function ($, jqx, CodelistSelector, DatesRangeSelector, CustomCodesSelection, mlRes, domainEditorHTML) {

    var DomainEditor = function () {
        this.$container;

        this.$divNoDatatype;
        this.$divNoDomain;
        this.$divDomainEditor;

        this.mode = '';

        this.cLists;
        this.codelistSelector;
        this.datesSelector;
        this.customCodeSelector;
    };

    var MODES = {
        code: 'code',
        year: 'year',
        month: 'month',
        date: 'date',
        customCode:'customCode'
    };

    DomainEditor.prototype.render = function (container) {
        this.$container = container;
        this.$container.html(domainEditorHTML);

        this.$divNoDatatype = this.$container.find('#domEdit_noDatatype');
        this.$divNoDomain = this.$container.find('#domEdit_noDomain');
        this.$divDomainEditor = this.$container.find('#domEdit_editor');
        this.$divNoDatatype.show();
        this.$divNoDomain.hide();
        this.$divDomainEditor.hide();

        var me = this;
        this.doML();
    }
    DomainEditor.prototype.reset = function () {
        this.setMode('');
    }
    DomainEditor.prototype.setCodelists = function (codelists) {
        this.cLists = codelists;

        if (this.codelistSelector)
            this.codelistSelector.setCodelists(this.cLists);
    }
    DomainEditor.prototype.getCodelists = function () { return this.cLists; }


    DomainEditor.prototype.setMode = function (mode) {
        this.mode = mode;
        this.$divDomainEditor.empty();
        this.$divDomainEditor.hide();
        this.$divNoDomain.hide();
        this.$divNoDatatype.hide();

        switch (mode) {
            case '':
                this.$divDomainEditor.hide();
                this.$divNoDatatype.show();
                break;
            case MODES.code:
                this.$divDomainEditor.show();
                this.codelistSelector = new CodelistSelector();
                this.codelistSelector.render(this.$divDomainEditor);
                this.codelistSelector.setCodelists(this.cLists);
                break;
            case MODES.year:
            case MODES.month:
            case MODES.date:
                this.$divDomainEditor.show();
                this.datesSelector = new DatesRangeSelector();
                this.datesSelector.render(this.$divDomainEditor);
                this.datesSelector.setMode(mode);
                break;
            case MODES.customCode:
                this.$divDomainEditor.show();
                this.customCodeSelector = new CustomCodesSelection();
                this.customCodeSelector.render(this.$divDomainEditor);
                break;
            default:
                this.$divNoDomain.show();
                break;
        }
    }

    DomainEditor.prototype.setDomain = function (domain) {
        switch (this.mode) {
            case MODES.code:
                this.codelistSelector.setDomain(domain);
                break;
            case MODES.year:
            case MODES.month:
            case MODES.date:
                this.datesSelector.setRange(domain.period);
                break;
        }
    }

    DomainEditor.prototype.getDomain = function () {
        switch (this.mode) {
            case MODES.code:
                return this.codelistSelector.getDomain();
                break;
            case MODES.year:
            case MODES.month:
            case MODES.date:
                var rng = this.datesSelector.getRange();
                if (!rng) return null;
                return { period: rng };
                break;
        }
    }

    DomainEditor.prototype.setCodelistSubject = function (subject) {
        if (this.mode == MODES.code)
            this.codelistSelector.limitOnSubject(subject);
    }

    DomainEditor.prototype.doML = function () {
        this.$container.find('#domEdit_noDatatype').html(mlRes.selectADataType);
        this.$container.find('#domEdit_noDomain').html(mlRes.noLimitForThisDataType);
    }

    return DomainEditor;
});