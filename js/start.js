define([
    'jquery',
    'fx-DSDEditor/js/DSDEditor/DSDEditor',
    'fx-DSDEditor/js/DSDEditor/dataConnectors/Connector_D3S',
    'bootstrap',
    'domReady!'
], function ($, DSDEditor, Connector) {

    this.config = {};

    function init(containerID, config, callB) {
        this.config = config;
        //DSDEditor = new DSDEditor(config);
        DSDEditor = new DSDEditor();
        DSDEditor.render($(containerID), null, callB);
    }

    function updateDSD(uid, version, dsd, datasource, contextSys, callB) {

        console.log(this.config);
        var conn;
        if (this.config.servicesUrls)
            conn = new Connector(this.config.servicesUrls);
        else
            conn = new Connector();
        conn.updateDSD(uid, version, dsd, datasource, contextSys, callB);
    }

    function setColumns(cols) {
        DSDEditor.setColumns(cols);
    }
    function getColumns() {
        return DSDEditor.getColumns();
    }

    return {
        init: init,
        updateDSD: updateDSD,
        setColumns: setColumns,
        getColumns: getColumns
    }
});