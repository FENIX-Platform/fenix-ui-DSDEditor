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
        "contextSystem": "CountrySTAT"
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
        if (this.config && cfg.testMode)
            testMode();
        DSDEditor = new DSDEditor(cfg);
        DSDEditor.render($(containerID), null, callB);
    }

    function updateDSD(uid, version, dsd, callB) {
        var conn;
        if (this.config.servicesUrls)
            conn = new Connector(cfg.servicesUrls);
        else
            conn = new Connector();
        conn.updateDSD(uid, version, dsd, cfg.D3SConnector.datasource, cfg.D3SConnector.contextSystem, callB);
    }

    function setColumns(cols) { DSDEditor.setColumns(cols); }
    function getColumns() { return DSDEditor.getColumns(); }
    function validate() { return DSDEditor.validate(); }

    return {
        init: init,
        updateDSD: updateDSD,
        setColumns: setColumns,
        getColumns: getColumns,
        validate: validate
    }
});