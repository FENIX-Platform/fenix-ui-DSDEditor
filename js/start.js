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
        this.DSDE = new DSDEditor(cfg);
        this.DSDE.render($(containerID), null, callB);
    }

    function updateDSD(uid, version, dsd, callB) {
        var conn;
        if (cfg.D3SConnector)
            conn = new Connector(cfg.D3SConnector);
        else
            conn = new Connector();
        conn.updateDSD(uid, version, dsd, callB);
    }
    function loadDSD(uid, version, callB) {
        var conn;
        if (cfg.D3SConnector)
            conn = new Connector(cfg.D3SConnector);
        else
            conn = new Connector();
        conn.getMetadata(uid, version, callB);
    }

    function setColumns(cols) { this.DSDE.setColumns(cols); }
    function getColumns() { return this.DSDE.getColumns(); }
    function validate() { return this.DSDE.validate(); }

    function isEditable(editable) {
        if (typeof (editable) == 'undefined')
            return this.DSDE.isEditable();
        else
            this.DSDE.isEditable(editable);
    }

    return {
        init: init,
        updateDSD: updateDSD,
        loadDSD: loadDSD,
        setColumns: setColumns,
        getColumns: getColumns,
        validate: validate,
        isEditable: isEditable
    }
});