define(['jquery',
    'fx-DataMngCommons/js/validators/Validator_DSD_Errors'],
    function ($, VE) {
        var defConfig = {
            allowedKeyDataTypes: ['code', 'customCode', 'date', 'month', 'year']
        };
        var eLevels = {
            ERROR: 'error'
        };
        function Validator_DSD(config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
        };

        //COLUMN
        Validator_DSD.prototype.validateColumn = function (col) {
            var toRet = [];
            if (!col) {
                toRet.push({ level: eLevels.ERROR, message: VE.NULL_COLUMN });
                return toRet;
            }

            ArrConcat(toRet, validateTitle(col.title));
            ArrConcat(toRet, validateDimension(col, this.config.allowedKeyDataTypes));
            ArrConcat(toRet, validateSubject(col));
            ArrConcat(toRet, validateDatatype(col));
            ArrConcat(toRet, validateDomain(col));

            return toRet;
        };

        function validateTitle(toVal) {
            if ($.isEmptyObject(toVal))
                return { field: 'title', level: eLevels.ERROR, message: VE.TITLE_BLANK };
            return null;
        }
        function validateDimension(toVal, allowedDatatypes) {
            if (!toVal.key)//Not a Dimension
                return null;
            if (!toVal.dataType)//Datatype must be defined but it will be checked in the checkDatatype
                return null;
            for (var i = 0; i < allowedDatatypes.length; i++)
                if (toVal.dataType == allowedDatatypes[i])
                    return null;//ok
            return { field: 'dimension', level: eLevels.ERROR, message: VE.DIMENSION_DATATYPE_ERROR };
        }
        function validateSubject(toVal) {
            if (!toVal.key)
                return null;
            if (!toVal.subject)
                return { field: 'subject', level: eLevels.ERROR, message: VE.SUBJECT_EMPTY };
        }
        function validateDatatype(toVal) {
            if (!toVal.dataType)
                return { field: 'dataType', level: eLevels.ERROR, message: VE.DATATYPE_EMPTY };
        }
        function validateDomain(toVal) {
            if (!toVal.dataType) //dataType is already checked in another validation
                return null;
            if (toVal.dataType == 'code') {
                //Make it multielement!
                if (!toVal.domain || !toVal.domain.codes || !toVal.domain.codes[0] || !toVal.domain.codes[0].idCodeList)
                    return { field: 'domain', level: eLevels.ERROR, message: VE.CODELIST_EMPTY };
            }
        }
        //END COLUMN

        //Validate all the columns and the structure (duplicate IDs, at least 2 cols...)
        Validator_DSD.prototype.validateColumns = function (cols) {
            var toRet = [];
            var valStructure = validateStructure(cols);
            var duplicateSubj = checkDuplicateSubject(cols);
            ArrConcat(toRet, valStructure);
            ArrConcat(toRet, duplicateSubj);
            if (!cols)
                return toRet;
            for (var i = 0; i < cols.length; i++) {
                var colValRes = this.validateColumn(cols[i]);
                ArrConcat(toRet, colValRes);
            }
            return toRet;
        };


        function validateStructure(cols) {
            var toRet = [];
            if (!cols) {
                toRet.push({ level: eLevels.ERROR, message: VE.NULL_COLUMNS });
                return toRet;
            }
            if (cols.length < 2) {
                toRet.push({ level: eLevels.ERROR, message: VE.AT_LEAST_2_COLS });
                return toRet;
            }
            for (var i = 0; i < cols.length - 1; i++) {
                for (var j = i + 1; j < cols.length; j++) {
                    if (cols[i].id == cols[j].id) {
                        toRet.push({ level: eLevels.ERROR, message: VE.DUPLICATE_IDS });
                    }
                }
            }

            //At least a key and a value?
            var keyCount = 0;
            var valCount = 0;
            for (i = 0; i < cols.length; i++) {
                if (cols[i].key)
                    keyCount++;

                if (cols[i].subject && cols[i].subject == 'value')
                    valCount++;
            }
            if (keyCount < 1)
                toRet.push({ level: eLevels.ERROR, message: VE.AT_LEAST_1_KEY });
            if (valCount < 1)
                toRet.push({ level: eLevels.ERROR, message: VE.AT_LEAST_1_VALUE });
            return toRet;
        }

        function checkDuplicateSubject(cols) {
            var toRet = [];
            if (!cols)
                return null;
            for (var i = 0; i < cols.length - 1; i++) {
                if (cols[i].subject != 'undefined') {
                    for (var j = i + 1; j < cols.length; j++) {
                        //   if (cols[i].subject && cols[j].subject) {
                        if (cols[j].subject != 'undefined') {
                            if (cols[i].subject == cols[j].subject) {
                                toRet.push({ level: eLevels.ERROR, message: VE.DUPLICATE_SUBJECTS });
                                return toRet;
                            }
                        }
                    }
                }
            }
            return null;
        }
        function ArrConcat(a, b) {
            if (!b)
                return;
            if (!a)
                a = [];
            if (b instanceof Array)
                Array.prototype.push.apply(a, b);
            else
                a.push(b);
        };


        return Validator_DSD;
    });