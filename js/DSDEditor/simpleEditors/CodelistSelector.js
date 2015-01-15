define([
        'jquery',
        'jqxall',
        'fx-DSDEditor/js/DSDEditor/simpleEditors/ColumnEditorComponents/LimitedDDL',
        'text!fx-DSDEditor/templates/DSDEditor/simpleEditors/CodelistSelector.htm',
        'fx-DSDEditor/js/DSDEditor/simpleEditors/codesSelection/CodesSelector'
],
    function ($, jqx, LimitedDDL, codelistSelectorHTML, CodesSelector) {

        var CodelistSelector = function () {
            this.$container;
            this.codelists;
            this.codelistsDDL = new LimitedDDL();
            this.$limitCheckbox;
            this.codesSelector;
        };

        CodelistSelector.prototype.render = function (container) {
            this.$container = container;
            this.$container.html(codelistSelectorHTML);
            var clSelDiv = this.$container.find('#clSel_div_codelist');
            this.codelistsDDL.render(clSelDiv);
            this.$limitCheckbox = this.$container.find('#clSel_chkLimit');
            this.updateCodelistsDDL();

            //Attach events for the Limit codelist enable/disable
            var me = this;
            clSelDiv.on('change.LimitedDDL.fenix',
                function (evt) {
                    if (evt.args && evt.args.item.value)
                        me.limitCheckboxEnabled(true);
                    else
                        me.limitCheckboxEnabled(false);
                    me.updateCodesList();
                });

            this.$limitCheckbox.on('change', function () {
                var chkd = $(this).is(":checked");
                me.updateCodesList();
            });
        }

        CodelistSelector.prototype.setCodelists = function (cl) {
            this.codelists = cl;
            this.updateCodelistsDDL();
        }
        CodelistSelector.prototype.updateCodelistsDDL = function () {
            this.limitCheckboxEnabled(false);
            if (!this.$container)
                return;
            if (!this.codelists)
                return;
            this.codelistsDDL.setItems(this.codelists);
        }

        CodelistSelector.prototype.limitOnSubject = function (subject) {
            if (!this.codelists)
                return;
            if (!subject) {
                this.codelistsDDL.limitItems(null);
                return;
            }
            var limitVals = [];
            for (var i = 0; i < this.codelists.length; i++) {
                if (this.codelists[i].subject == subject)
                    limitVals.push(this.codelists[i].val);
            }
            this.codelistsDDL.limitItems(limitVals);

            if (!this.getDomain())
                this.limitCheckboxEnabled(false);
        }
        CodelistSelector.prototype.removeLimit = function (subject) {
            this.codelistsDDL.limitItems(null);
        }

        CodelistSelector.prototype.setDomain = function (domain) {
            //TOTO Make it multielement
            if (domain.codes[0].version)
                var clValue = domain.codes[0].idCodeList + "|" + domain.codes[0].version;
            else
                var clValue = domain.codes[0].idCodeList;

            this.codelistsDDL.setSelectedValue(clValue);
            //The codelist in the set is not available? Check.
            if (!this.getDomain())
                this.limitCheckboxEnabled(false);
            else {
                this.limitCheckboxEnabled(true);
                if (domain.codes[0].codes)//The domain has a limit on the codes?
                {
                    this.$limitCheckbox.prop('checked', true);
                    var me = this;
                    this.updateCodesList(function () { me.selectCodesInCodelist(domain.codes[0].codes); });
                    
                }
            }


        }
        CodelistSelector.prototype.getDomain = function () {
            //Make it multielement
            var selCl = this.getSelectedCodelist();
            if (!selCl)
                return null;
            var toRet = { codes: [selCl] }
            codesLimit = this.getLimitCodes();
            if (codesLimit)
                toRet.codes[0].codes = codesLimit;
            return toRet;
        }
        CodelistSelector.prototype.getSelectedCodelist = function () {
            var selVal = this.codelistsDDL.getSelectedValue();
            if (!selVal)
                return null;
            var split = selVal.split('|');
            if (split[1])
                return { idCodeList: split[0], version: split[1] };
            else
                return { idCodeList: split[0] };
        }
        CodelistSelector.prototype.getLimitCodes = function () {
            if (!this.$limitCheckbox.is(":checked"))
                return null;
            return this.codesSelector.getSelectedCodes();
        }

        //The limit checkbox
        CodelistSelector.prototype.limitCheckboxEnabled = function (enabled) {
            if (enabled)
                this.$limitCheckbox.removeAttr('disabled');
            else {
                this.$limitCheckbox.prop('checked', false);
                this.$limitCheckbox.attr('disabled', true);
            }
        }
        CodelistSelector.prototype.updateCodesList = function (callB) {
            var cnt = this.$container.find('#clSel_div_codesList');
            var hide = false;
            if (!this.$limitCheckbox.is(":checked"))
                hide = true;
            var cList = this.getSelectedCodelist();
            if (!cList)
                hide = true;
            if (hide) {
                cnt.html("");
                return;
            }
            this.codesSelector = new CodesSelector();
            this.codesSelector.render(cnt);
            //Make it multiCL
            this.codesSelector.loadCodelist(cList.idCodeList, cList.version, callB);
        }
        CodelistSelector.prototype.selectCodesInCodelist = function (codes) {
            this.codesSelector.checkCodes(codes);
        }

        return CodelistSelector;
    });