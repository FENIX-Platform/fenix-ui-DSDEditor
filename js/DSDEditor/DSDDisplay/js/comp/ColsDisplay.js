define(['jquery',
    'text!fx-DSDEditor/js/DSDEditor/DSDDisplay/html/comp/ColsDisplay.html',
    'fx-DSDEditor/js/DSDEditor/DSDEditor_Utils',
    'fx-DSDEditor/js/DSDEditor/DSDDisplay/js/comp/colsDisplay/ColsDisplayBtns',
    'fx-DSDEditor/js/DSDEditor/DSDConfigs/js/CodelistConfigReader'
],

    function ($, ColsDisplayHTML, DSDEditor_Utils, ColsDisplayBtns, CodelistConfigReader) {
        var defConfig = {
            lang: "EN"
        };

        var h = {
            idTrHead: '#trColInfoHead',
            idTrEdit: '#trEdit',
            idTrSubj: '#trSubj',
            idTrDataType: '#trDataType',
            idTrDomain: '#trDomain',
            idTrSuppl: '#trSuppl'
        };

        var e = {
        };

        var _html = {
            colTH_empty: '<th style="width:10%"></th>',
            colTD_empty: '<td></td>',
            colTH: '<th class="%cl%">%cnt%</th>',
            colTD_Edit: '<td><div id="%id%"></div></td>',
            colTD: '<td>%cnt%</td>',
            colSubj: '<td class="text-muted">Subject</td>',
            colDataType: '<td class="text-muted">Data type</td>',
            colDomain: '<td class="text-muted">Domain</td>',
            colSuppl: '<td class="text-muted">Supplemental</td>'
        };

        var utils = new DSDEditor_Utils();

        function ColsDisplay(config) {
            this.config = {};
            this.$container = null;
            $.extend(true, this.config, defConfig, config);

            this.$trHead = null;
            this.$trEdit = null;
            this.$trSubj = null;
            this.$trDataType = null;
            this.$trDomain = null;

            this.editBtns = [];
        };

        ColsDisplay.prototype.render = function (cnt, config) {
            $.extend(true, this.config, config);
            this.$container = cnt;
            this.$container.html(ColsDisplayHTML);

            this.$trHead = this.$container.find(h.idTrHead);
            this.$trEdit = this.$container.find(h.idTrEdit);
            this.$trSubj = this.$container.find(h.idTrSubj);
            this.$trDataType = this.$container.find(h.idTrDataType);
            this.$trDomain = this.$container.find(h.idTrDomain);
            this.$trSuppl = this.$container.find(h.idTrSuppl);

            this._bindEvents();
        };
        ColsDisplay.prototype.set = function (cols) {
            this.reset();
            if (!cols)
                return;
            this._createHeader(cols);
            this._createEditRow(cols);
            this._createRows(cols);
        };
        ColsDisplay.prototype._createHeader = function (cols) {
            if (!cols)
                return '';
            var toRet = _html.colTH_empty;
            for (var i = 0; i < cols.length; i++) {
                toRet += createColTH(cols[i]);
            }
            this.$trHead.html(toRet);
        };
        function createColTH(col) {
            var w = 90 / col.length;
            var toRet = _html.colTH;
            toRet = toRet.replace('%cnt%', utils.MLStringToString(col.title, '<br/>'));
            if (col.key)
                toRet = toRet.replace('%cl%', 'bg-dim');
            else if (col.subject == 'value')
                toRet = toRet.replace('%cl%', 'bg-val');
            else
                toRet = toRet.replace('%cl%', 'bg-other');
            return toRet;
        }
        ColsDisplay.prototype._createEditRow = function (cols) {
            if (!cols)
                return;
            var toSet = _html.colTD_empty;
            var idPart = "tdEdit_";
            for (var i = 0; i < cols.length; i++) {
                toSet += _html.colTD_Edit.replace("%id%", idPart + "" + cols[i].id);
            }
            this.$trEdit.html(toSet);
            this.editBtns = [];

            for (i = 0; i < cols.length; i++) {
                var toFind = '#' + idPart + "" + cols[i].id;
                var td = this.$trEdit.find(toFind);
                var btn = new ColsDisplayBtns();
                btn.render(td);
                btn.setEventId(cols[i].id);
                this.editBtns.push(btn);
            }
        };

        ColsDisplay.prototype._createRows = function (cols) {
            if (!cols)
                return '';
            var subj = _html.colSubj;
            var dT = _html.colDataType;
            var domain = _html.colDomain;
            var suppl = _html.colSuppl;
            for (var i = 0; i < cols.length; i++) {
                subj += createColTD(cols[i], 'subject', this.config.lang);
                dT += createColTD(cols[i], 'dataType', this.config.lang);
                domain += createColTD(cols[i], 'domain', this.config.lang);
                suppl += createColTD(cols[i], 'supplemental', this.config.lang);
            }
            this.$trSubj.html(subj);
            this.$trDataType.html(dT);
            this.$trDomain.html(domain);
            this.$trSuppl.html(suppl);
        };
        function createColTD(col, field, lang) {
            var toRet = _html.colTD;
            switch (field) {
                case 'subject':
                    if (col.subject)
                        toRet = toRet.replace('%cnt%', col.subject);
                    else
                        toRet = toRet.replace('%cnt%', '');
                    break;
                case 'dataType':
                    if (col.dataType)
                        toRet = toRet.replace('%cnt%', col.dataType);
                    else
                        toRet = toRet.replace('%cnt%', '');
                    break;
                case 'domain':
                    if (col.domain)
                        toRet = toRet.replace('%cnt%', _domainToString(col.domain, lang));
                    else
                        toRet = toRet.replace('%cnt%', '');
                    break;
                case 'supplemental':
                    if (col.supplemental)
                        toRet = toRet.replace('%cnt%', utils.MLStringToString(col.supplemental, '<br/>'));
                    else
                        toRet = toRet.replace('%cnt%', '');
                    break;
            }
            return toRet;
        };
        function _domainToString(domain, lang) {
            //Make it multielement
            if (domain.codes && domain.codes[0]) {
                //Read the config reater just once!
                var clId = domain.codes[0].idCodeList;
                if (domain.codes[0].version)
                    clId += " - " + domain.codes[0].version;
                var clCfg = new CodelistConfigReader();
                var cl = clCfg.getCodelist(clId);
                if (!cl)
                    return "";
                return cl.text[lang];
            }
            return "";
        };
        ColsDisplay.prototype.reset = function () {
            this.$trHead.html('');
            this.$trSubj.html('');
            this.$trDataType.html('');
            this.$trDomain.html('');
            this.$trSuppl.html('');
            this.editBtns = [];
        };
        ColsDisplay.prototype.editable = function (editable) {
            if (editable)
                this.$trEdit.show();
            else
                this.$trEdit.hide();
        };

        ColsDisplay.prototype._bindEvents = function () { };
        ColsDisplay.prototype._unbindEvents = function () { };
        ColsDisplay.prototype.destroy = function () {
            //this._unbindEvents();
            if (this.editBtns) {
                for (var i = 0; i < this.editBtns.length; i++)
                    this.editBtns[i].destroy();
            }
        };

        return ColsDisplay;
    })