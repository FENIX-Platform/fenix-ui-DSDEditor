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
        if (config && config.testMode)
            testMode();

        DSDEditor = new DSDEditor(config);
        DSDEditor.render($(containerID), null, callB);
    }

    function updateDSD(uid, version, dsd, datasource, contextSys, callB) {
        var conn;
        if (this.config.servicesUrls)
            conn = new Connector(this.config.servicesUrls);
        else
            conn = new Connector();
        conn.updateDSD(uid, version, dsd, datasource, contextSys, callB);
    }

    function setColumns(cols) { DSDEditor.setColumns(cols); }
    function getColumns() { return DSDEditor.getColumns(); }
    function validate() { return DSDEditor.validate(); }

    function testMode() {
        console.log("-- DSDEditor test mode active -- ");
        $('#btnColsEditDone').click(function () {
            DSDEditor.validate();
            console.log(DSDEditor.getColumns());
        });
    }



    return {
        init: init,
        updateDSD: updateDSD,
        setColumns: setColumns,
        getColumns: getColumns,
        validate: validate
    }
});