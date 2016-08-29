define(['jquery',
    'text!fx-DSDEditor/js/DSDEditor/DSDConfigs/config/Datatypes.json'
],
    function ($, Datatypes) {
        var defConfig = {};

        function DatatypeReader(config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
            this.datatypes = JSON.parse(Datatypes);
        };

        DatatypeReader.prototype.getDatatypes = function () {
            return this.datatypes;
        }
        DatatypeReader.prototype.getFilteredDatatypes = function (datatypeValues) {
            if (!datatypeValues)
                return null;
            var toRet = [];
            var toAdd;
            for (var i = 0; i < datatypeValues.length; i++) {
                {
                    toAdd = this.getDatatype(datatypeValues[i]);
                    if (toAdd)
                        toRet.push(toAdd);
                }
            }
            return toRet;
        };
        DatatypeReader.prototype.getDatatype = function (datatype) {
            for (var i = 0; i < this.datatypes.length; i++) {
                if (this.datatypes[i].value == datatype) {
                    return this.datatypes[i];
                }
            }
            return null;
        }
        return DatatypeReader;
    })