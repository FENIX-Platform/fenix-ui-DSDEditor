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
        baseAddress: "http://fenix.fao.org/d3s_dev/msd",
        metadataUrl: "resources/metadata",
        dsdUrl: "resources/dsd",
        dataUrl: "resources",
        getDataUrl: "resources/data",
        getMetaAndDataUrl: "resources",
        
        codelistUrl: "http://faostat3.fao.org:7799/v2/msd/resources",
        codelistMetaUrl: "http://faostat3.fao.org:7799/v2/msd/resources/metadata",
        codelistFilteredUrl: "http://faostat3.fao.org:7799/v2/msd/codes/filter",
        
        contextSystem: "CountrySTAT",
        datasource: "D3S"
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