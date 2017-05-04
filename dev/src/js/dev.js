define([
    'jquery',
    'loglevel',
    '../../../src/js/index',
    '../config/dev_codelists.json'
], function ($, log, DSDEditor, DSDCodelists) {

   // console.log(DSDEditor);
    var cfg = {
        columnEditor: {
            codelists: "../config/dev_codelists.json"
        },
        columnEditorReader: {
            "dimension": [
                {
                    "subject": "item",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "indicator",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "gender",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "residence",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "food",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "sector",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "fieldManagement",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "agriculturalPopulation",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "census",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "time",
                    "datatypes": [
                        "year",
                        "month",
                        "date"
                    ]
                },
                {
                    "subject": "geo",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "other",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "freesubject",
                    "datatypes": [
                        "code"
                    ]
                }
            ],
            "value": [
                {
                    "subject": "value",
                    "datatypes": [
                        "number"
                    ]
                }
            ],
            "other": [
                {
                    "subject": "flag",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "um",
                    "datatypes": [
                        "code"
                    ]
                }
            ]
        },
        subjects: [
            {
                "value": "freesubject",
                "text": {
                    "EN": "Free Subject",
                    "FR": "Free Subject"
                },
                "codelistSubject": "freesubject"
            },
            {
                "value": "item",
                "text": {
                    "EN": "Item",
                    "FR": "Article"
                },
                "codelistSubject": "item"
            },
            {
                "value": "indicator",
                "text": {
                    "EN": "Indicator",
                    "FR": "Indicateur"
                },
                "codelistSubject": "indicator"
            },

            {
                "value": "gender",
                "text": {
                    "EN": "Gender",
                    "FR": "Genre"
                },
                "codelistSubject": "gender"
            },
            {
                "value": "residence",
                "text": {
                    "EN": "Residence",
                    "FR": "Résidence"
                },
                "codelistSubject": "residence"
            },
            {
                "value": "food",
                "text": {
                    "EN": "Food",
                    "FR": "Aliments"
                },
                "codelistSubject": "food"
            },
            {
                "value": "sector",
                "text": {
                    "EN": "Sector",
                    "FR": "Secteur"
                },
                "codelistSubject": "sector"
            },
            {
                "value": "fieldManagement",
                "text": {
                    "EN": "Field Management",
                    "FR": "Gestion du Terrain"
                },
                "codelistSubject": "fieldManagement"
            },
            {
                "value": "agriculturalPopulation",
                "text": {
                    "EN": "Agricultural",
                    "FR": "Agricole"
                },
                "codelistSubject": "agriculturalPopulation"
            },
            {
                "value": "census",
                "text": {
                    "EN": "Census",
                    "FR": "Census"
                },
                "codelistSubject": "census"
            },

            {
                "value": "time",
                "text": {
                    "EN": "Time",
                    "FR": "Temps"
                }
            },
            {
                "value": "geo",
                "text": {
                    "EN": "Geo",
                    "FR": "Geo"
                },
                "codelistSubject": "geo"
            },
            {
                "value": "flag",
                "text": {
                    "EN": "Flag",
                    "FR": "Flag"
                },
                "codelistSubject": "flag"
            },
            {
                "value": "value",
                "text": {
                    "EN": "Value",
                    "FR": "Valeur"
                }
            },
            {
                "value": "um",
                "text": {
                    "EN": "UM",
                    "FR": "Unité"
                },
                "codelistSubject": "um"
            },
            {
                "value": "other",
                "text": {
                    "EN": "Other",
                    "FR": "Autre"
                },
                "codelistSubject": "other"
            }
        ],
        inputLangs: {
            langs: ["EN", "FR"]
        },
        D3SConnector: {
            //datasource: "CountrySTAT",
            // contextSystem: "CountrySTAT"
        },
        lang: "EN",
        DSD_EDITOR_CODELISTS: [
            {
                "value": "Recensement2",
                "text": {
                    "EN": "Census Congo 2",
                    "FR": "Census Congo 2"
                },
                "subject": "freesubject"
            },
            {
                "value": "GAUL|2014",
                "text": {
                    "EN": "GAUL",
                    "FR": "GAUL"
                },
                "subject": "geo"
            },
            {
                "value": "CPC|2.1",
                "text": {
                    "EN": "CPC 2.1",
                    "FR": "CPC 2.1"
                },
                "subject": "item"
            },
            {
                "value": "Flag",
                "text": {
                    "EN": "Flag",
                    "FR": "Flag"
                },
                "subject": "flag"
            },
            {
                "value": "CountrySTAT_Agricultural_Population",
                "text": {
                    "EN": "Agricultural",
                    "FR": "Population agricole"
                },
                "subject": "freesubject"
            },
            {
                "value": "CountrySTAT_DAC",
                "text": {
                    "EN": "DAC",
                    "FR": "DAC"
                },
                "subject": "freesubject"
            },
            {
                "value": "CountrySTAT_Field_Management",
                "text": {
                    "EN": "Field Management",
                    "FR": "Gestion du terrain"
                },
                "subject": "freesubject"
            },
            {
                "value": "CountrySTAT_Food",
                "text": {
                    "EN": "Food",
                    "FR": "Alimentaire"
                },
                "subject": "freesubject"
            },
            {
                "value": "CountrySTAT_Gender",
                "text": {
                    "EN": "Gender",
                    "FR": "Genre"
                },
                "subject": "freesubject"
            },
            {
                "value": "CountrySTAT_Residence",
                "text": {
                    "EN": "Residence",
                    "FR": "Résidence"
                },
                "subject": "freesubject"
            },
            {
                "value": "CountrySTAT_Indicators",
                "text": {
                    "EN": "CountrySTAT Indicators",
                    "FR": "Indicateurs de CountrySTAT"
                },
                "subject": "indicator"
            },
            {
                "value": "HS|full",
                "text": {
                    "EN": "HS Full",
                    "FR": "HS complet"
                },
                "subject": "item"
            },
            {
                "value": "CountrySTAT_UM",
                "text": {
                    "EN": "CountrySTAT UM",
                    "FR": "CountrySTAT Unité de mesure"
                },
                "subject": "um"
            },
            {
                "value": "CountrySTAT_Fishery_products",
                "text": {
                    "EN": "Fishery products",
                    "FR": "Produits de la pêche"
                },
                "subject": "item"
            },
            {
                "value": "CountrySTAT_Forest_products",
                "text": {
                    "EN": "Forest products",
                    "FR": "Produits forestiers"
                },
                "subject": "item"
            },
            {
                "value": "CountrySTAT_Fishery_products_scientific",
                "text": {
                    "EN": "Fishery scientific products",
                    "FR": "Produits de la pêche - scientifiques"
                },
                "subject": "item"
            },
            {
                "value": "Activités_agricoles",
                "text": {
                    "EN": "Farm activities",
                    "FR": "Activités agricoles"
                },
                "subject": "census"
            },
            {
                "value": "Activités_forestières",
                "text": {
                    "EN": "Forestry activities",
                    "FR": "Activités forestières"
                },
                "subject": "census"
            },
            {
                "value": "Alphabetisation",
                "text": {
                    "EN": "Alphabetisation",
                    "FR": "Alphabetisation"
                },
                "subject": "census"
            },
            {
                "value": "Approvisionement_en_eau",
                "text": {
                    "EN": "Water supply",
                    "FR": "Approvisionement en eau"
                },
                "subject": "census"
            },
            {
                "value": "Classe_de_distance",
                "text": {
                    "EN": "Distance class",
                    "FR": "Classe de distance"
                },
                "subject": "census"
            },
            {
                "value": "Difficultés_rencontrées",
                "text": {
                    "EN": "Encountered difficulties",
                    "FR": "Difficultés rencontrées"
                },
                "subject": "census"
            },
            {
                "value": "Distance",
                "text": {
                    "EN": "Distance",
                    "FR": "Distance"
                },
                "subject": "census"
            },
            {
                "value": "Equipments_agricoles",
                "text": {
                    "EN": "Agricultural equipments",
                    "FR": "Equipments agricoles"
                },
                "subject": "census"
            },
            {
                "value": "Existence",
                "text": {
                    "EN": "Existence",
                    "FR": "Existence"
                },
                "subject": "census"
            },
            {
                "value": "Group_Age",
                "text": {
                    "EN": "Group Age",
                    "FR": "Group Age"
                },
                "subject": "census"
            },
            {
                "value": "Indicateurs_Recensement",
                "text": {
                    "EN": "Census Indicators",
                    "FR": "Indicateurs Recensement"
                },
                "subject": "census"
            },
            {
                "value": "Main_d'oeuvre",
                "text": {
                    "EN": "Workforce",
                    "FR": "Main d'oeuvre"
                },
                "subject": "census"
            },
            {
                "value": "Matériel",
                "text": {
                    "EN": "Equipment",
                    "FR": "Matériel"
                },
                "subject": "census"
            },
            {
                "value": "Mode_de_faire_valoir",
                "text": {
                    "EN": "How to claim",
                    "FR": "Mode de faire valoir"
                },
                "subject": "census"
            },
            {
                "value": "Niveau_Instruction",
                "text": {
                    "EN": "Level Instruction",
                    "FR": "Niveau Instruction"
                },
                "subject": "census"
            },
            {
                "value": "Nombre_conjointes",
                "text": {
                    "EN": "Number of joint",
                    "FR": "Nombre conjointes"
                },
                "subject": "census"
            },
            {
                "value": "Nombre_de_champs_possédés",
                "text": {
                    "EN": "Number of owned fields",
                    "FR": "Nombre de champs possédés"
                },
                "subject": "census"
            },
            {
                "value": "Nombre_de_pieds",
                "text": {
                    "EN": "Number of feet",
                    "FR": "Nombre de pieds"
                },
                "subject": "census"
            },
            {
                "value": "Objectifs_de_production",
                "text": {
                    "EN": "Production targets",
                    "FR": "Objectifs de production"
                },
                "subject": "census"
            },
            {
                "value": "Oui_Non",
                "text": {
                    "EN": "Yes No",
                    "FR": "Oui Non"
                },
                "subject": "census"
            },
            {
                "value": "Répartition_exploitations",
                "text": {
                    "EN": "Breakdown of holdings",
                    "FR": "Répartition exploitations"
                },
                "subject": "census"
            },
            {
                "value": "Route_bitumée",
                "text": {
                    "EN": "Bitumen road",
                    "FR": "Route bitumée"
                },
                "subject": "census"
            },
            {
                "value": "Situation_Matrimoniale",
                "text": {
                    "EN": "Marriage Situation",
                    "FR": "Situation Matrimoniale"
                },
                "subject": "census"
            },
            {
                "value": "Source_éléctricité",
                "text": {
                    "EN": "Source Electricity",
                    "FR": "Source éléctricité"
                },
                "subject": "census"
            },
            {
                "value": "Superficie_cultivée",
                "text": {
                    "EN": "Cultivated area",
                    "FR": "Superficie cultivée"
                },
                "subject": "census"
            },
            {
                "value": "Size",
                "text": {
                    "EN": "Size",
                    "FR": "Taille"
                },
                "subject": "freesubject"
            },
            {
                "value": "Taille_de_menage",
                "text": {
                    "EN": "Household Size",
                    "FR": "Taille de menage"
                },
                "subject": "census"
            }

        ] // << CONGO
        //DSD_EDITOR_CODELISTS : DSDCodelists
    };

    var callB = function() {
        log.info('DSD Editor Dev - Launched');

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