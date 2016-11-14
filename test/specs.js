/*global describe, it*/
var DSDEditor = require("../src/js/index"),
    cfg = {
        columnEditor: {
            codelists: "../dev/config/dev_codelists.json"
        },
        inputLangs: { langs: ["EN", "FR"] },
        D3SConnector: {},
        lang: "FR",
        DSD_EDITOR_CODELISTS : "../dev/config/dev_codelists.json"
    },
    fullDSD = [
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

describe("DSDEditor", function () {
    // inject the HTML for the tests
    beforeEach(function () {
        var container = '<div id="dsdeditor"></div>';
        document.body.insertAdjacentHTML( 'afterbegin', container);
    });

    // remove the html from the DOM
    afterEach(function () {
        document.body.removeChild(document.getElementById('dsdeditor'));
    });

    // remove the html from the DOM
    afterEach(function () {
        DSDEditor.destroy();
    });

    it("init", function (done) {

        var callB = function() {
            //console.log(DSDEditor);
            //console.log( DSDEditor.set(fullDSD) );
            //console.log( DSDEditor.get() );
            //console.log( DSDEditor.validate() );
            //console.log( DSDEditor.editable(editable) );
            //console.log( DSDEditor.reset() );
            //console.log( DSDEditor.destroy() );

            var x = [];
            expect(DSDEditor.get()).to.deep.equal(x);
        }

        dsdeditor = DSDEditor.init("#dsdeditor", cfg, callB);

        done(); //async execution
    });

    it("set/get", function (done){
        var callB = function() {
            DSDEditor.set(fullDSD);
            expect(DSDEditor.get()).to.deep.equal(fullDSD);
            expect(DSDEditor.get()).to.have.lengthOf(6);
        }

        dsdeditor = DSDEditor.init("#dsdeditor", cfg, callB);
        done();
    });

    it("validate", function (done) {
        var callB = function() {
            DSDEditor.set(fullDSD);
            expect(DSDEditor.validate()).to.be.true;
        }

        dsdeditor = DSDEditor.init("#dsdeditor", cfg, callB);

        done(); //async execution
    });

    it("reset", function (done) {

        var callB = function() {
            DSDEditor.set(fullDSD);
            DSDEditor.reset();
            var x = [];
            expect(DSDEditor.get()).to.deep.equal(x);
        }

        dsdeditor = DSDEditor.init("#dsdeditor", cfg, callB);

        done(); //async execution
    });


});

