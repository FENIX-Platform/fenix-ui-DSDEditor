define([
],
function () {
    var DSDEditor_Utils = function () {
    };
    DSDEditor_Utils.prototype.MLStringToString = function (MLString, separator) {
        if (!MLString)
            return "";
        var toRet = "";
        for (var l in MLString) {
            toRet += l + ": " + MLString[l] + separator;
        }
        //Removes the last separator
        toRet = toRet.substring(0, toRet.length - separator.length);
        return toRet;
    }

    return DSDEditor_Utils;
});