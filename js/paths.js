/*global requirejs, define*/
var locale = localStorage.getItem('locale' || 'en-us');

define(function () {

    var config = {
        paths: {

            'fx-DSDEditor/start': './start',
            "fx-DSDEditor/config": "../config",
            "fx-DSDEditor/js": "../js",
            "fx-DSDEditor/templates": "../templates",
            "fx-DSDEditor/multiLang": "../multiLang",
            "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
            'jquery': '../lib/jquery',
            //'jqxall': "http://fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-light"
            'jqxall': "../lib/jqxall"

        },
        config: {i18n: {locale: locale}},
        shim: {
            "jqrangeslider": {
                deps: ["jquery", "jqueryui"]
            },
            "bootstrap": {
                deps: ["jquery"]
            }
        }
    };

    return config;
});