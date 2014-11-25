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

        $('#btnEN').click(function () { setLang('EN'); });
        $('#btnFR').click(function () { setLang('FR'); });
    }

    /*Multilang test*/
    function setLang(lang) {
        var loc = localStorage.getItem('locale');
        if (loc && loc.toUpperCase() == lang)
            return;
        localStorage.setItem('locale', lang.toLowerCase());
        location.reload();
    }

    /*End multilang test*/

    function updateDSD(uid, version, dsd, datasource, contextSys, callB) {
        /*var conn = new Connector();
        conn.getMetadata(uid, version, function (meta) {
            if (!meta)
                throw new Error("Cannot find metadata with UID " + uid + " and version " + version);
            conn.updateDSD(meta, dsd, datasource, contextSys, callB);
        });*/

        var conn = new Connector();
        conn.updateDSD(uid, version, dsd, datasource, contextSys, callB);
    }

    function setColumns(cols) {
        DSDEditor.setColumns(cols);
    }

    return {
        init: DSDEditor_starter,
        updateDSD: updateDSD,
        setColumns: setColumns,
        getColumns:getColumns
    }
});