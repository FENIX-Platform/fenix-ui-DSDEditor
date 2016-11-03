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

        //Bootstrap
        require('bootstrap/dist/css/bootstrap.css');

        $('#btnColsEditDone').click(function () {
            DSDEditor.validate();
            $('#DSDOutput').html(JSON.stringify(DSDEditor.get()));
        });

        $('#btnColsEditToggle').click(function () {
            DSDEditor.editable(false);
        });

        //Test


        //Test buttons
        $('#btnColsLoad').click(function () {
            console.log("btnColsLoad");
            var fullDSD = [
                {
                    "dataType": "year",
                    "title": {
                        "EN": "YEAR"
                    },
                    "values": {
                        "timeList": [
                            2010,
                            2011,
                            2012,
                            2013,
                            2013,
                            2014,
                            2014,
                            2015
                        ]
                    },
                    "subject": "time",
                    "key": true,
                    "id": "DIMENSION0"
                },
                {
                    "dataType": "code",
                    "title": {
                        "EN": "INDICATOR_LABEL"
                    },
                    "values": {
                        "codes": [
                            {
                                "codes": [
                                    {
                                        "code": "0802",
                                        "label": {
                                            "EN": "Agriculturalarea"
                                        }
                                    },
                                    {
                                        "code": "0809",
                                        "label": {
                                            "EN": "LandArea"
                                        }
                                    },
                                    {
                                        "code": "0801",
                                        "label": {
                                            "EN": "AdministrativeArea"
                                        }
                                    },
                                    {
                                        "code": "0807",
                                        "label": {
                                            "EN": "Forestarea"
                                        }
                                    },
                                    {
                                        "code": "0813",
                                        "label": {
                                            "EN": "Permanentmeadowsandpastures"
                                        }
                                    },
                                    {
                                        "code": "0812",
                                        "label": {
                                            "EN": "Permanentcropsarea"
                                        }
                                    },
                                    {
                                        "code": "0814",
                                        "label": {
                                            "EN": "Temporarycropsarea"
                                        }
                                    },
                                    {
                                        "code": "0810",
                                        "label": {
                                            "EN": "Otherland?"
                                        }
                                    }
                                ],
                                "idCodeList": "CountrySTAT_Indicators",
                                "extendedName": {
                                    "EN": "CountrySTATIndicators"
                                }
                            }
                        ]
                    },
                    "domain": {
                        "codes": [
                            {
                                "idCodeList": "CountrySTAT_Indicators",
                                "extendedName": {
                                    "EN": "CountrySTATIndicators"
                                }
                            }
                        ]
                    },
                    "subject": "indicator",
                    "key": true,
                    "id": "DIMENSION1"
                },
                {
                    "dataType": "code",
                    "title": {
                        "EN": "FIELD_LABEL"
                    },
                    "values": {
                        "codes": [
                            {
                                "codes": [
                                    {
                                        "code": "8002",
                                        "label": {
                                            "EN": "Irrigated"
                                        }
                                    },
                                    {
                                        "code": "8009",
                                        "label": {
                                            "EN": "Unspecified"
                                        }
                                    }
                                ],
                                "idCodeList": "CountrySTAT_Field_Management",
                                "extendedName": {
                                    "EN": "Fieldmanagement"
                                }
                            }
                        ]
                    },
                    "domain": {
                        "codes": [
                            {
                                "idCodeList": "CountrySTAT_Field_Management",
                                "extendedName": {
                                    "EN": "Fieldmanagement"
                                }
                            }
                        ]
                    },
                    "subject": "fieldManagement",
                    "key": true,
                    "id": "DIMENSION2"
                },
                {
                    "dataType": "number",
                    "title": {
                        "EN": "VALUE"
                    },
                    "subject": "value",
                    "key": false,
                    "id": "VALUE0"
                },
                {
                    "dataType": "text",
                    "title": {
                        "EN": "FLAG"
                    },
                    "subject": "flag",
                    "key": false,
                    "id": "OTHER0"
                },
                {
                    "dataType": "code",
                    "title": {
                        "EN": "UM_LABEL"
                    },
                    "values": {
                        "codes": [
                            {
                                "codes": [
                                    {
                                        "code": "0125",
                                        "label": {
                                            "EN": "1000Ha"
                                        }
                                    }
                                ],
                                "idCodeList": "CountrySTAT_UM",
                                "extendedName": {
                                    "EN": "Unitsofmeasurement"
                                }
                            }
                        ]
                    },
                    "domain": {
                        "codes": [
                            {
                                "idCodeList": "CountrySTAT_UM",
                                "extendedName": {
                                    "EN": "Unitsofmeasurement"
                                }
                            }
                        ]
                    },
                    "subject": "um",
                    "key": false,
                    "id": "OTHER1"
                }
            ];
            DSDEditor.set(fullDSD);
        });


    };
    DSDEditor.init("#standard", cfg, callB);


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