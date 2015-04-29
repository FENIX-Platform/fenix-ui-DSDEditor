define([
    'jquery',
    'jqxall',
    'i18n!fx-DSDEditor/multiLang/DSDEditor/nls/ML_DSDEdit'
],
function ($, jqx, mlRes) {
    var widgetName = 'subjectSelector';
    var evtSubjectChanged = "changed." + widgetName + ".fenix";

    var SubjectSelector = function (lang) {
        this.$container;
        this.subjects;

        this.lang = 'EN';
        if (lang)
            this.lang = lang;
    };

    SubjectSelector.prototype.render = function (container, lang) {
        if (lang)
            this.lang = lang;
        this.$container = container;
        this.$container.jqxDropDownList({ displayMember: 'text', valueMember: 'val', autoDropDownHeight: true, promptText: mlRes.select });
        this.updateDDL();

        var me = this;
        this.$container.on('change', function (evt) { me.subjectChanged(evt.args.item.value); });
    }

    SubjectSelector.prototype.setSubjects = function (subjects) {
        this.subjects = subjects;
        this.updateDDL();
    }
    SubjectSelector.prototype.updateDDL = function () {
        if (!this.subjects)
            return;

        var DS = { localdata: this.subjects, datatype: 'array', datafields: [{ name: 'val', type: 'string' }, { name: 'text', type: 'string', map: 'text>' + this.lang }] };
        var DA = new $.jqx.dataAdapter(DS);
        this.$container.jqxDropDownList({ source: DA, promptText: mlRes.select });

    }

    SubjectSelector.prototype.getSubjects = function ()
    { return this.subjects; }

    SubjectSelector.prototype.subjectChanged = function (val) {
        var subj = getSubjectByVal(val, this.subjects);
        this.$container.trigger(evtSubjectChanged, subj);
    }

    SubjectSelector.prototype.getSelectedSubject = function () {
        if (!this.$container.jqxDropDownList('getSelectedItem'))
            return null;
        var val = this.$container.jqxDropDownList('getSelectedItem').value;
        return getSubjectByVal(val, this.subjects);
    }
    SubjectSelector.prototype.setSelectedValue = function (val) {
        if (val)
            this.$container.jqxDropDownList('val', val);
        else
            this.$container.jqxDropDownList('clearSelection');
    }
    SubjectSelector.prototype.destroy = function () {
        this.$container.off('change');
        this.$container.jqxDropDownList('destroy');
    }

    var getSubjectByVal = function (val, subjs) {
        if (!val)
            return null;
        for (var i = 0; i < subjs.length; i++)
            if (subjs[i].val == val)
                return subjs[i];
        return null;
    }

    return SubjectSelector;
});