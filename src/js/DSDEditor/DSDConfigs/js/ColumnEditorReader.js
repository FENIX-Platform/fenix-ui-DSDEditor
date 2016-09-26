define(['jquery',
    '../config/ColumnEditorCfg.json'
],
    function ($, ColumnEditorCfg) {
        var defConfig = {};

        function ColumnEditorReader(config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
            this.columnECfg = ColumnEditorCfg;
        };

        ColumnEditorReader.prototype.getColumnEditorCfg = function () {
            return this.columnECfg;
        };
        ColumnEditorReader.prototype.getColumnTypeSubjects = function (columnType) {
            if (!this.columnECfg[columnType])
                return null;
            var toRet = [];
            for (var i = 0; i < this.columnECfg[columnType].length; i++)
                toRet.push(this.columnECfg[columnType][i].subject);
            return toRet;
        };

        ColumnEditorReader.prototype.getSubjectDatatypes = function (columnType, subject) {
            if (!this.columnECfg[columnType])
                return null;

            for (var i = 0; i < this.columnECfg[columnType].length; i++) {
                if (this.columnECfg[columnType][i].subject == subject) {
                    return this.columnECfg[columnType][i].datatypes;
                }
            }
            return null;
        };
        return ColumnEditorReader;
    })