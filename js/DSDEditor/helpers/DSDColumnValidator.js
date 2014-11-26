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

   DSDColumnValidator.prototype.validateColumns = function (cols) {

        var toRet = [];

        var colsValRes=this.validateStructure(cols, toRet);
        
        if (!cols)
            return toRet;
        for (i = 0; i < cols.length; i++) {
            var colValRes = this.validateColumn(cols[i], toRet);

            /*if (colValRes.length > 0)
                toRet.push({ colId: cols[i].id, validationResults: colValRes });*/
        }
        return toRet;
    }

   DSDColumnValidator.prototype.validateStructure = function (cols, toRet)
    {
        if (!cols) {
            toRet.push({ level: 'error', message: MSG_NULL_COLUMNS });
            return toRet;
        }
        if (cols.length < 2) {
            toRet.push({ level: 'error', message: MSG_AT_LEAST_2_COLS });
            return toRet;
        }
        //At least a key and a value?
        var keyCount=0;
        var valCount=0;
        for (var i = 0; i < cols.length; i++)
        {
            if (cols[i].key)
                keyCount++;
            
            if (cols[i].subject && (cols[i].subject == 'value'))
                valCount++;
        }
        if (keyCount<1)
            toRet.push({ level: 'error', message: MSG_AT_LEAST_ONE_KEY });
        /*if (valCount < 1)
            toRet.push({ level: 'error', message: MSG_AT_LEAST_ONE_VALUE });*/
    }

    DSDColumnValidator.prototype.validateColumn = function (col, toRet) {
        if (!col) {
            toRet.push({ level: 'error', message: MSG_NULL_COLUMN });
            return toRet;
        }

        arrAppend(toRet, this.validateTitle(col.title));
        arrAppend(toRet, this.validateDimension(col));
        arrAppend(toRet, this.validateDatatype(col));
        arrAppend(toRet, this.validateDomain(col));
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

    var arrAppend = function (arr1, arr2) {
        if (!arr1)
            arr1 = [];
        if (!arr2)
            return;
        arr1.push(arr2);
    }

    return DSDColumnValidator;
});