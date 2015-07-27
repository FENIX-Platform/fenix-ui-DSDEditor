define(['jquery',
    'text!fx-DSDEditor/js/MLInput/html/MLInput.html'
],

    function ($, MLInputHTML) {
        var defConfig = { langs: ["EN"] };
        var line = '<tr><td>%lCode%</td><td><input type="text" id="%idlCode%" class="form-control" /></td></tr>';
        var idlCode = "mlTD_";

        var h = {
            idTblMLInput: '#tblMLInput',
        };

        function MLInput(config) {
            this.config = {};
            this.$container = null;
            $.extend(true, this.config, defConfig, config);

            this.$tblMLInput = null;
            this.txt = [];
        };

        MLInput.prototype.render = function (cnt, config) {
            $.extend(true, this.config, config);
            this.$container = cnt;
            this.$container.html(MLInputHTML);

            this.$tblMLInput = this.$container.find(h.idTblMLInput);

            this._create(this.config.langs);
        };

        MLInput.prototype._create = function (lCodes) {
            if (!lCodes)
                return "";
            var toAdd = "";
            for (var i = 0; i < lCodes.length; i++)
                toAdd += createLine(lCodes[i]);
            this.$tblMLInput.html(toAdd);
            this.txt = [];
            for (i = 0; i < lCodes.length; i++)
                this.txt.push(this.$tblMLInput.find("#" + idlCode + "" + lCodes[i]));
        }

        function createLine(lCode) {
            var toRet = line.replace("%lCode%", lCode);
            toRet = toRet.replace("%idlCode%", idlCode + "" + lCode);
            return toRet;
        }

        MLInput.prototype.set = function (val) {
            this.reset();
            if (!val)
                return;
            for (var i = 0; i < this.config.langs.length; i++) {
                if (val[this.config.langs[i]]) {
                    this.txt[i].val(val[this.config.langs[i]]);
                }
            }
        };
        MLInput.prototype.get = function () {
            if (!this.txt)
                return null;
            var toRet = {};
            var v = "";
            for (var i = 0; i < this.config.langs.length; i++) {
                v = this.txt[i].val().trim();
                if (v)
                    toRet[this.config.langs[i].toUpperCase()] = v;
            }
            return toRet;
        };
        MLInput.prototype.reset = function () {
            if (!this.txt)
                return;
            for (var i = 0; i < this.txt.length; i++) {
                this.txt[i].val('');
            }
        };
        MLInput.prototype.isEmpty = function () {
            var v = this.get();
            if ($.isEmptyObject(v))
                return true;
            return false;
        };
        return MLInput;
    })