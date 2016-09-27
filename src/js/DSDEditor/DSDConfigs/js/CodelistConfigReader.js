define(['jquery',
    '../../../../config/config',
    '../../../../config/config-default'
],
    function ($, C, DC) {
        var defConfig = {};

        function CodelistConfigReader(config, callB) {
            this.config = {};
            $.extend(true, this.config, config, defConfig);

            this.codelists = this.config.DSD_EDITOR_CODELISTS;

            if (callB) callB();
        };

        CodelistConfigReader.prototype.getCodelists = function () {
            return this.codelists;
        }

        CodelistConfigReader.prototype.getFilteredCodelists = function (subject) {
            if (!this.codelists)
                return null;
            if (!subject || subject=='undefined')
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