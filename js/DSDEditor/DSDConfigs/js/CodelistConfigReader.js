define(['jquery',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default'
],
    function ($, C, DC) {
        var defConfig = {};

        function CodelistConfigReader(config, callB) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);

            var clPath = C.DSD_EDITOR_CODELISTS || DC.DSD_EDITOR_CODELISTS
            this.codelists = null;
            var me = this;
            $.getJSON(clPath, function (data) {
                me.codelists = data;
                if (callB) callB();
            });
        };

        CodelistConfigReader.prototype.getCodelists = function () {
            return this.codelists;
        }

        CodelistConfigReader.prototype.getFilteredCodelists = function (subject) {
            if (!this.codelists)
                return null;
            if (!subject)
                return this.codelists;
            var toRet = [];

            for (var i = 0; i < this.codelists.length; i++) {
                if (this.codelists[i].subject.toLowerCase() == subject.toLowerCase()) {
                    toRet.push(this.codelists[i]);
                }
            }
            return toRet;
        };

        CodelistConfigReader.prototype.getCodelist = function (codelistId) {
            if (!this.codelists)
                return null;
            for (var i = 0; i < this.codelists.length; i++) {
                if (this.codelists[i].value == codelistId)
                    return this.codelists[i];
            }
            return null;
        }

        return CodelistConfigReader;
    })