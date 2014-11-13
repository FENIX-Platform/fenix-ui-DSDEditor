define([
    'jquery',
//    'fx-DSDEditor/js/DSDEditor/DSDEditorWr',
'fx-DSDEditor/js/DSDEditor/DSDEditor',
    'fx-DSDEditor/js/DSDEditor/dataConnectors/D3S_Connector',
    'bootstrap',
    'domReady!'

//], function ($, DSDEditorWr, Connector) {
], function ($, DSDEditor, DSDEditorBridge, Connector) {

    function DSDEditor_starter(config, callB) {



        /*DSDEditor = new DSDEditor(config);
        DSDEditor.render($('#mainContainer'), callB);*/

        DSDEditor = new DSDEditor({ "codelists": "../config/DSDEditor/Codelists_UNECA.json" });
        DSDEditor.render($('#mainContainer'), null, );

        /*
        var subjects;
        var dataTypes;
        var codelists;

        bridge = new DSDEditorBridge();
        bridge.getSubjects('../config/DSDEditor/Subjects.json', function (data) {
            subjects = data;
            bridge.getDataTypes('../config/DSDEditor/Datatypes.json', function (data) {
                dataTypes = data;
                bridge.getCodelists('../config/DSDEditor/Codelists.json', function (data) {
                    codelists = data;
                    DSDEditor.setSubjects(subjects);
                    DSDEditor.setDataTypes(dataTypes);
                    DSDEditor.setCodelists(codelists);

                });
            });
        });
        */

        /*bridge = new DSDEditorBridge();
        bridge.getDSD("http://faostat3.fao.org/d3s2/v2/msd/resources/metadata", "dan3", null, function (data) { console.log(data); });*/

        //$('#btnEN').click(function () { setLang('EN'); });
        //$('#btnFR').click(function () { setLang('FR'); });

        /*var colsAdapter = {
         //source: "http://faostat3.fao.org:7799/v2/msd/resources/metadata/dan2/1.0?dsd=true",
         //data: null
         serviceAddress: "http://faostat3.fao.org:7799/v2/msd/resources/metadata/dan2/1.0?dsd=true",
         data: null}

         DSDEditorWr.load(colsAdapter);*/
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

    function updateDSD(uid, version, dsd) {
         var conn = new Connector();
         conn.getMetadata(uid, version, function (meta) {
             if (!meta)
                 throw new Error("Cannot find metadata with UID " + uid + " and version " + version);
             conn.updateDSD(meta, dsd);
         });
    }

    function setColumns(cols) {
        DSDEditorWr.setColumns(cols);
    }

    return {
        init: DSDEditor_starter,
        updateDSD: updateDSD,
        setColumns: setColumns
    }
});