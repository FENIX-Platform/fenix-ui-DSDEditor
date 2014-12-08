/*
config format:

{
    "columnEditor": {
        "subjects": "urlToSubjectsJSON",
        "datatypes": "urlToDatatypesJSON",
        "codelists": "urlToCodelistsJSON"
    },
    "MLEditor": {
        "langs": ["EN","FR"]
    },
    "D3SConnector": {
        "datasource": "CountrySTAT",
        "contextSystem": "CountrySTAT",
        "metadataUrl": "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/metadata",
        "dsdUrl": "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/dsd",
        "dataUrl": "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources",
        "codelistUrl": "http://faostat3.fao.org:7799/v2/msd/resources/data"
    }
}
*/
define([
    'jquery',
    'fx-DSDEditor/js/DSDEditor/DSDEditor',
    'fx-DSDEditor/js/DSDEditor/dataConnectors/Connector_D3S',
    'bootstrap',
    'domReady!'
], function ($, DSDEditor, Connector) {

    var defConfig = {
        D3SConnector: {
            "datasource": "CountrySTAT",
            "contextSystem": "CountrySTAT"
        }
    };

    var cfg = {};

    function init(containerID, config, callB) {
        $.extend(true, cfg, defConfig, config);
        DSDEditor = new DSDEditor(cfg);
        DSDEditor.render($(containerID), null, callB);
    }

    function updateDSD(uid, version, dsd, callB) {
        var conn;
        if (cfg.D3SConnector)
            conn = new Connector(cfg.D3SConnector);
        else
            conn = new Connector();
        conn.updateDSD(uid, version, dsd, callB);
    }

    function setColumns(cols) { DSDEditor.setColumns(cols); }
    function getColumns() { return DSDEditor.getColumns(); }
    function validate() { return DSDEditor.validate(); }

    function isEditable(editable) {
        if (typeof (editable) == 'undefined')
            return DSDEditor.isEditable();
        else
            DSDEditor.isEditable(editable);
    }

    return {
        init: init,
        updateDSD: updateDSD,
        setColumns: setColumns,
        getColumns: getColumns,
        validate: validate,
        isEditable:isEditable
    }
});