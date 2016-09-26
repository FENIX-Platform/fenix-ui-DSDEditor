define([
    'jquery',
    'loglevel',
    '../../../src/js/index',
    '../config/dev_codelists.json'
], function ($, log, DSDEditor, DSDCodelists) {

   // console.log(DSDEditor);
    var cfg = {
        columnEditor: {
            //subjects: "urlToSubjectsJSON",
            //datatypes: "urlToDatatypesJSON",
            // codelists: "urlToCodelistsJSON"
            codelists: "../config/dev_codelists.json"
        },
        MLEditor: {
            langs: ["EN", "FR"]
        },
        D3SConnector: {
            //datasource: "CountrySTAT",
            // contextSystem: "CountrySTAT"
        },
        lang: "EN",
        DSD_EDITOR_CODELISTS : DSDCodelists
    };

    var callB = function() {
        log.info('DSD Editor Dev - Launched');
        console.log(DSDEditor)

    };
    DSDEditor.init("#standard", cfg, callB);

    console.log(DSDEditor.validate());

/*

     require([
     'fx-DSDEditor/start'
     ], function (Editor) {




     //TEST
     console.log("-- DSDEditor test mode active -- ");
     $('#btnColsEditDone').click(function () {
     Editor.validate();
     console.log(JSON.stringify(Editor.getColumns()));
     });
     $('#btnColsEditToggle').click(function () { Editor.isEditable(!Editor.isEditable()); });

     //Test
     Editor.setColumns([{ "id": "CODE", "title": { "EN": "hh" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "ECO_GAUL", "codes": [{ "code": "281" }] }] }, "subject": "item", "supplemental": null }, { "id": "YEAR", "title": { "EN": "time" }, "key": true, "dataType": "year", "domain": null, "subject": "time", "supplemental": null }, { "id": "NUMBER", "title": { "EN": "val" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null }]);

     //Test buttons
     $('#btnColsLoad').click(function () {
     //Editor.loadDSD();
     });

     $('#btnColsSave').click(function () {
     var valRes = Editor.validate();
     if (valRes == null || valRes.length == 0)
     {
     var cols = Editor.getColumns();
     var dsd = { "columns": cols };

     Editor.updateDSD("dan", null, dsd, null);
     }
     //Editor.saveDSD();
     });
     });
     }
     */

});