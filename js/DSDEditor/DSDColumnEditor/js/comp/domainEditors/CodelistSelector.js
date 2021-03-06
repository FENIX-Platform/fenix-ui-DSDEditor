﻿define(['jquery',
    'text!fx-DSDEditor/js/DSDEditor/DSDColumnEditor/html/comp/domainEditors/CodelistSelector.html',
    'fx-DSDEditor/js/DSDEditor/DSDConfigs/js/CodelistConfigReader',
    'fx-DSDEditor/js/DSDEditor/DSDColumnEditor/js/Events',
    'amplify'
],
    function ($, CodelistSelectorHTML, CodelistConfigReader, Evts) {
        var defConfig = {};
        var h = {
            idCodesDDL: '#clSelDDL',
        };
        var e = {
            ddlChange: Evts.CODELIST_SELECTOR_CHANGED
        };

        var lang = 'EN';

        function CodelistSelector(config) {
            this.config = {};
            this.$container = null;
            $.extend(true, this.config, defConfig, config);

            this.clReader = null;
            this.tmpVal = "";
            this.tmpSubj = "";
            this.loaded = false;
        };

        CodelistSelector.prototype.render = function (cnt, config) {
            $.extend(true, this.config, config);
            this.$container = cnt;
            this.$container.html(CodelistSelectorHTML);

            this.$clDDl = this.$container.find(h.idCodesDDL);

            this._bindEvents();

            var me = this;
            this.clReader = new CodelistConfigReader(null, function () { me._clLoaded(); });
        };

        CodelistSelector.prototype._clLoaded = function () {
            this.loaded = true;
            if (this.tmpVal != "") {
                this.set(this.tmpSubj, this.tmpVal);
                return;
            }
            if (this.tmpSubj != "") {
                this.setSubject(this.tmpSubj);
            }
        };

        CodelistSelector.prototype.setSubject = function (subj) {
            if (!this.loaded) {
                this.tmpSubj = subj;
                return;
            }

            var cl = this.clReader.getFilteredCodelists(subj);
            var selVal = this.$clDDl.val();
            this.$clDDl.find('option').remove();

            if (!cl)
                return;

            this.$clDDl.append($('<option>', { value: '', text: '' }));
            for (var i = 0; i < cl.length; i++) {
                this.$clDDl.append($('<option>', { value: cl[i].value, text: cl[i].text[lang] }));
            }
            if (cl.length == 1)//if there is just one option autoselect it
                this.$clDDl.val(cl[0].value);
            else if (selVal)//tries to reselect what was selected
                this.$clDDl.val(selected);
            //this.$clDDl.selectmenu('refresh', true); //Force an autorefresh or the auto select will not show
        };

        CodelistSelector.prototype.reset = function () {
            this.$clDDl.find('option').remove();
        }

        CodelistSelector.prototype.set = function (subject, val) {
            if (!this.loaded) {
                this.tmpSubj = subject;
                this.tmpVal = val;
                return;
            }
            this.setSubject(subject);
            if (!val || val.length == 0) {
                this.$clDDl.val('');
                return;
            }
            //TODO: Codelists can be more than one (make this multielement)
            var toSet = val[0].idCodeList;
            if (val[0].version)
                toSet = toSet + "|" + val[0].version;
            this.$clDDl.val(toSet);
            //this.$clDDl.selectmenu('refresh', true); //Force an autorefresh or the auto select will not show
        };
        CodelistSelector.prototype.get = function () {
            var selVal = this.$clDDl.val();
            if (selVal == '')
                return null;
            var split = selVal.split('|');
            if (split[1])
                return { idCodeList: split[0], version: split[1] };
            else
                return { idCodeList: split[0] };
        };
        CodelistSelector.prototype._bindEvents = function () {
            var me = this;
            this.$clDDl.on('change', function (d) {
                amplify.publish(e.ddlChange, me.$clDDl.val());
            });
        };
        CodelistSelector.prototype._unbindEvents = function () {
            this.$clDDl.off('change');
        };
        CodelistSelector.prototype.destroy = function () {
            this._unbindEvents();
        };

        return CodelistSelector;
    })