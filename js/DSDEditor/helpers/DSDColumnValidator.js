define([
],
function () {

    function DSDColumnValidator() { };

    var MSG_NULL_COLUMNS = 'nullColumns';
    var MSG_AT_LEAST_2_COLS = 'atLeast2Cols';
    var MSG_AT_LEAST_ONE_KEY = 'atLeastOneKey';
    var MSG_AT_LEAST_ONE_VALUE = 'atLeastOneValue';
    var MSG_NULL_COLUMN = 'nullColumn';
    var MSG_EMPTY = 'empty';
    var MSG_DIMENSION_DATATYPE_CONFLICT = 'DimensionDataTypeConflict';
    var MSG_EMPTY_ID_CODELSIT = 'EmptyIdCodeList';
    var MSG_AT_LEAST_ONE_VALUE = 'duplicateColumnIDs';
    var MSG_DUPLICATE_SUBJECT = 'duplicateSubject';

    DSDColumnValidator.prototype.validateColumns = function (cols) {
        var toRet = [];
        var valStructure = this.validateStructure(cols);
        var duplicateSubj = this.checkDuplicateSubject(cols);

        arrAppend(toRet, valStructure);
        arrAppend(toRet, duplicateSubj);
        if (!cols)
            return toRet;
        for (var i = 0; i < cols.length; i++) {
            var colValRes = this.validateColumn(cols[i]);
            arrAppend(toRet, colValRes);
        }
        return toRet;
    }

    DSDColumnValidator.prototype.validateStructure = function (cols) {
        var toRet = [];
        if (!cols) {
            toRet.push({ level: 'error', message: MSG_NULL_COLUMNS });
            return toRet;
        }
        if (cols.length < 2) {
            toRet.push({ level: 'error', message: MSG_AT_LEAST_2_COLS });
            return toRet;
        }

        for (var i = 0; i < cols.length - 1; i++) {
            for (var j = i + 1; j < cols.length; j++) {
                if (cols[i].id == cols[j].id)
                    toRet.push({ level: 'error', message: MSG_DUPLICATE_IDS });
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
            toRet.push({ level: 'error', message: MSG_AT_LEAST_ONE_KEY });
        if (valCount < 1)
            toRet.push({ level: 'error', message: MSG_AT_LEAST_ONE_VALUE });
        return toRet;
    }

    DSDColumnValidator.prototype.checkDuplicateSubject = function (cols) {
        var toRet = [];
        if (!cols)
            return null;
        for (var i = 0; i < cols.length - 1; i++) {
            for (var j = i + 1; j < cols.length; j++) {
                if (cols[i].subject == cols[j].subject) {
                    toRet.push({ level: 'error', message: MSG_DUPLICATE_SUBJECT });
                    return toRet;
                }
            }
        }
        return null;
    }

    DSDColumnValidator.prototype.validateColumn = function (col) {
        var toRet = [];
        if (!col) {
            toRet.push({ level: 'error', message: MSG_NULL_COLUMN });
            return toRet;
        }
        arrAppend(toRet, this.validateTitle(col.title));
        arrAppend(toRet, this.validateDimension(col));
        arrAppend(toRet, this.validateDatatype(col));
        arrAppend(toRet, this.validateDomain(col));

        return toRet;
    }

    DSDColumnValidator.prototype.validateTitle = function (toVal) {
        if ($.isEmptyObject(toVal))
            return { field: 'title', level: 'error', message: MSG_EMPTY };
        return null;
    }
    DSDColumnValidator.prototype.validateDimension = function (toVal) {
        if (toVal.dimension) {
            if (toVal.dataType)
                if (toVal.dataType == 'number' || toVal.dataType == 'string' || toVal.dataType == 'label' || toVal.dataType == 'boolean' || toVal.dataType == 'percentage' || toVal.dataType == 'period')
                    return { field: 'dimension', level: 'error', message: MSG_DIMENSION_DATATYPE_CONFLICT };
        }


        return null;
    }
    DSDColumnValidator.prototype.validateDatatype = function (toVal) {
        if (!toVal.dataType) {
            return { field: 'dataType', level: 'error', message: MSG_EMPTY };
        }
    }
    DSDColumnValidator.prototype.validateDomain = function (toVal) {
        if (!toVal.dataType)
            return;
        if (toVal.dataType == 'code') {
            if (!toVal.domain)
                return { field: 'domain', level: 'error', message: MSG_EMPTY };
            if (!toVal.domain.codes)
                return { field: 'domain', level: 'error', message: MSG_EMPTY };
            //TODO Make it multiElement
            if (!toVal.domain.codes[0].idCodeList)
                return { field: 'domain', level: 'error', message: MSG_EMPTY_ID_CODELSIT };
        }
    }

    var arrAppend = function (arr1, arrOrObj) {
        if (!arrOrObj)
            return;

        if (!arr1)
            arr1 = [];
        if (arrOrObj instanceof Array) {
            if (arrOrObj.length == 0)
                return;
            for (var i = 0; i < arrOrObj.length; i++)
                arr1.push(arrOrObj[i]);
        }
        else
            arr1.push(arrOrObj);
    }

    return DSDColumnValidator;
});