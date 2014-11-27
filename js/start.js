define([
    'jquery',
    'fx-DSDEditor/js/DSDEditor/DSDEditor',
    'fx-DSDEditor/js/DSDEditor/dataConnectors/Connector_D3S',
    'bootstrap',
    'domReady!'
], function ($, DSDEditor, Connector) {

    function DSDEditor_starter(config, callB) {
        DSDEditor = new DSDEditor(config);
        DSDEditor.render($('#mainContainer'), null, callB);

        testMode();
    }

    function updateDSD(uid, version, dsd, datasource, contextSys, callB) {
        var conn = new Connector();
        conn.updateDSD(uid, version, dsd, datasource, contextSys, callB);
    }

    function setColumns(cols) {
        DSDEditor.setColumns(cols);
    }
    function getColumns() {
        return DSDEditor.getColumns();
    }

    function testMode()
    {
        console.log("-- DSDEditor test mode active -- ");
        $('#btnColsEditDone').click(function () {
            DSDEditor.validate();
            console.log(DSDEditor.getColumns());
        });
    }

    return {
        init: DSDEditor_starter,
        updateDSD: updateDSD,
        setColumns: setColumns,
        getColumns:getColumns
    }
});