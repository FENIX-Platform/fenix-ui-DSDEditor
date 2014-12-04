﻿require([
    './paths'
], function (DSDEditor) {
    // NOTE: This setTimeout() call is used because, for whatever reason, if you make
    // a 'require' call in here or in the Cart without it, it will just hang
    // and never actually go fetch the files in the browser. There's probably a
    // better way to handle this, but I don't know what it is.
    setTimeout(function () {
        /*
        
         @param: prefix of Components paths to reference them also in absolute mode
         @param: paths to override
         @param: callback function
         */
        DSDEditor.initialize('./', null, function () {
            require([
                'fx-DSDEditor/start'
            ], function (Editor) {
                
                var cfg = {
                    columnEditor: {
                        //subjects: "urlToSubjectsJSON",
                        //datatypes: "urlToDatatypesJSON",
                        // codelists: "urlToCodelistsJSON"
                        //codelists: "config/DSDEditor/CodelistsUAE.json"
                    },
                    MLEditor: {
                        langs: ["EN", "RU"]
                    },
                    D3SConnector: {
                        datasource: "CountrySTAT",
                        contextSystem: "CountrySTAT"
                    },
                    testMode:true
                };

                var callB = null;
                Editor.init("#mainContainer", cfg, callB);
            });
        });
    }, 0);
});