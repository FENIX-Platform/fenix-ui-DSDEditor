define([
],
function () {

    function DSDColumnValidator() { };

    DSDColumnValidator.prototype.validateColumns = function (cols) {
        var toRet = [];

        var colsValRes=this.validateColumns(cols);
        if (colsValRes.length > 0)
            for (var i = 0; i < cols.length; i++) {
                toRet.push({ validationResults: colsValRes });
            }
        if (!cols)
            return;
        for (i = 0; i < cols.length; i++) {
            var colValRes = this.validateColumn(cols[i]);
            if (colValRes.length > 0)
                toRet.push({ colId: cols[i].id, validationResults: colValRes });
        }
        return toRet;
    }
    DSDColumnValidator.prototype.validateColumns = function (cols)
    {
        var toRet=[];
        if (!cols) {
            toRet.push({ level: 'error', message: 'nullColumns' });
            return toRet;
        }
        if (cols.length < 2) {
            toRet.push({ level: 'error', message: 'atLeast2Cols' });
            return toRet;
        }
        //At least a key and a value?
        var keyCount=0;
        var valCount=0;
        for (var i = 0; i < cols.length; i++)
        {
            if (cols[i].key)
                keyCount++;
            if (cols[i].dataType == 'number')
                valCount++;
        }
        if (keyCount<1)
            toRet.push({ level: 'error', message: 'atLeastOneKey' });
        if (valCount < 1)
            toRet.push({ level: 'error', message: 'atLeastOneValue' });
        return toRet;

    }
    DSDColumnValidator.prototype.validateColumn = function (col) {
        var toRet = [];
        if (!col) {
            toRet.push({ level: 'error', message: 'nullColumn' });
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
            return { field: 'title', level: 'error', message: 'empty' };
        return null;
    }
    DSDColumnValidator.prototype.validateDimension = function (toVal) {
        if (toVal.dimension) {
            if (toVal.dataType)
                if (toVal.dataType == 'number' || toVal.dataType == 'string' || toVal.dataType == 'label' || toVal.dataType == 'boolean' || toVal.dataType == 'percentage' || toVal.dataType == 'period')
                    return { field: 'dimension', level: 'error', message: 'DimensionDataTypeConflict' };
        }
        return null;
    }
    DSDColumnValidator.prototype.validateDatatype = function (toVal) {
        if (!toVal.dataType) {
            return { field: 'dataType', level: 'error', message: 'empty' };
        }
    }
    DSDColumnValidator.prototype.validateDomain = function (toVal) {
        if (!toVal.dataType)
            return;
        if (toVal.dataType == 'code') {
            if (!toVal.domain)
                return { field: 'domain', level: 'error', message: 'empty' };
            if (!toVal.domain.codes)
                return { field: 'domain', level: 'error', message: 'empty' };
            //TODO Make it multiElement
            if (!toVal.domain.codes[0].idCodeList)
                return { field: 'domain', level: 'error', message: 'empty idCodeList' };
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