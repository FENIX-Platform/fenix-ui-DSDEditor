/*global requirejs, define*/
var locale = localStorage.getItem('locale' || 'en-us');

define(function () {
    var config = {
        paths: {
            "fx-DSDEditor/start": "./start",
            "fx-DSDEditor/config": "../config",
            "fx-DSDEditor/js": "../js",
            "fx-DSDEditor/templates": "../templates",
            "fx-DSDEditor/multiLang": "../multiLang",
            "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            //'amplify': '../lib/amplify/amplify.min',
            'text': '../lib/text',
            'pnotify': '../lib/pnotify/pnotify.custom.min',
            'datetimepicker': '../lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min',
            'moment': '../lib/moment-with-locales',
            'validate': '../lib/parsley'
        },
        config: { i18n: { locale: locale } },
        shim: {
            "bootstrap": {
                deps: ["jquery"]
            },
            'datetimepicker': {
                deps: ['moment', 'bootstrap']
            }
        , "validate": { deps: ["jquery"] }
        }
    };
    return config;
});