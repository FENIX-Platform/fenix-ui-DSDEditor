﻿define(['jquery',
    'loglevel',
    '../../html/comp/ColsDisplay.hbs',
    '../../../DSDEditor_Utils',
    './colsDisplay/ColsDisplayBtns',
    '../../../DSDConfigs/js/CodelistConfigReader',
    '../../../../../nls/labels',
],

    function ($, log, ColsDisplayHTML, DSDEditor_Utils, ColsDisplayBtns, CodelistConfigReader, MLRes) {
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
            colTH: '<th style="cursor:move;" draggable="true" class="%cl%">%cnt%</th>',
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

            this.lang = this.config.lang.toLowerCase();

            this.cols = null;

            this.$trHead = null;
            this.$trEdit = null;
            this.$trSubj = null;
            this.$trDataType = null;
            this.$trDomain = null;

            this.editBtns = [];
            this.editable;

            log.info('ColsDisplay', this);
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
            this._doML();
        };

        ColsDisplay.prototype._doML = function () {
            _html.colSubj = '<td class="text-muted">'+MLRes[this.lang]['subject']+'</td>';
            _html.colDataType =  '<td class="text-muted">'+MLRes[this.lang]['datatype']+'</td>';
            _html.colDomain =   '<td class="text-muted">'+MLRes[this.lang]['domain']+'</td>';
            _html.colSuppl =  '<td class="text-muted">'+MLRes[this.lang]['supplemental']+'</td>';
        };


        ColsDisplay.prototype.set = function (cols) {
            this.reset();
            if (!cols) return;
            this._createHeader(cols);
            this._createEditRow(cols);
            this._createRows(cols);
            this.cols = cols;
        };
        ColsDisplay.prototype._createHeader = function (cols) {
            log.info('_createHeader', cols);
            if (!cols) return '';
            var toRet = _html.colTH_empty;
            for (var i = 0; i < cols.length; i++) {
                toRet += createColTH(cols[i]);
            }
            this.$trHead.html(toRet);
            if (this.editable) this._bindHeaders();
        };

        ColsDisplay.prototype._bindHeaders = function () {
            var tds = this.$trHead.find('.dragHeader');
            var me = this;
            for (var i = 0; i < tds.length; i++) {
                $(tds[i]).on('drop', function (event) { me.drop(event); });
                $(tds[i]).on('dragover', me.allowDrop);
                $(tds[i]).on('dragstart', me.drag);
            }
        };

        ColsDisplay.prototype._removeBindHeaders = function () {
            var tds = this.$trHead.find('.dragHeader');
            for (var i = 0; i < tds.length; i++) {
                $(tds[i]).off('drop');
                $(tds[i]).off('dragover');
                $(tds[i]).off('dragstart');
            }
        };

        ColsDisplay.prototype.drag = function (ev) {
            ev.originalEvent.dataTransfer.setData("cellNumber", ev.target.cellIndex);
        };

        ColsDisplay.prototype.allowDrop = function (ev) {
            ev.preventDefault();
        };

        ColsDisplay.prototype.drop = function (ev) {
            if (!this.editable) return;
            ev.preventDefault();
            var idxSource = ev.originalEvent.dataTransfer.getData("cellNumber") - 1,
                idxTarget = ev.target.cellIndex - 1;
                colSource = this.cols[idxSource].id.substring(0,5),
                colTarget = this.cols[idxTarget].id.substring(0,5);

            if (colSource == colTarget) {
                log.info('before', this.cols);
                var selection = this.cols;
                var tmp = this.cols[idxTarget];
                this.cols[idxTarget] = this.cols[idxSource];
                this.cols[idxSource] = tmp;
                log.info('after', selection);
                log.info(this);
                this.set(this.cols);
            } else {
                log.info('dropping not allowed here')
            }

        };


        function createColTH(col) {

            var w = 90 / col.length;
            var toRet = _html.colTH;
            toRet = toRet.replace('%cnt%', utils.MLStringToString(col.title, '<br/>'));
            if (col.key)
                toRet = toRet.replace('%cl%', 'dragHeader bg-dim');
            else if (col.subject == 'value')
                toRet = toRet.replace('%cl%', 'dragHeader bg-val');
            else
                toRet = toRet.replace('%cl%', 'dragHeader bg-other');
            return toRet;
        }
        ColsDisplay.prototype._createEditRow = function (cols) {
            //log.info("ColsDisplay :"+this.editable);
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
                var btn = new ColsDisplayBtns(this.config);
                btn.render(td);
                btn.setEventId(cols[i].id);
                btn.deleteEnabled(this.editable);
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
                subj += this._createColTD(cols[i], 'subject', this.lang.toUpperCase());
                dT += this._createColTD(cols[i], 'dataType', this.lang.toUpperCase());
                domain += this._createColTD(cols[i], 'domain', this.lang.toUpperCase());
                suppl += this._createColTD(cols[i], 'supplemental', this.lang.toUpperCase());
            }
            this.$trSubj.html(subj);
            this.$trDataType.html(dT);
            this.$trDomain.html(domain);
            this.$trSuppl.html(suppl);
        };
        ColsDisplay.prototype._createColTD = function (col, field, lang) {
            var toRet = _html.colTD;
            switch (field) {
                case 'subject':
                    if (col.subject) {
                        toRet = toRet.replace('%cnt%', col.subject);
                    } else {
                        toRet = toRet.replace('%cnt%', 'freesubject');
                    }
                    break;
                case 'dataType':
                    if (col.dataType)
                        toRet = toRet.replace('%cnt%', col.dataType);
                    else
                        toRet = toRet.replace('%cnt%', '');
                    break;
                case 'domain':
                    if (col.domain)
                        toRet = toRet.replace('%cnt%', this._domainToString(col.domain, lang));
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
        ColsDisplay.prototype._domainToString = function(domain, lang) {
            //Make it multielement
            if (domain.codes && domain.codes[0]) {
                //Read the config reater just once!
                var clId = domain.codes[0].idCodeList;
                if (domain.codes[0].version)
                    clId += "|" + domain.codes[0].version;
                var clCfg = new CodelistConfigReader(this.config);
                var cl = clCfg.getCodelist(clId);
                if (!cl) return "";
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
            this._removeBindHeaders();
        };
        ColsDisplay.prototype.editable = function (editable) {
            log.info("ColsDisplay.prototype.editable", editable);
            this.editable = editable;
            if (this.editBtns) {
                for (var i = 0; i < this.editBtns.length; i++)
                    this.editBtns[i].deleteEnabled(editable);
            }
            log.info("ColsDisplay.prototype.editable return> ", editable);
            return editable;
            /*if (editable)
                this.$trEdit.show();
            else
                this.$trEdit.hide();*/
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