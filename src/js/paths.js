if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
var locale = localStorage.getItem('locale' || 'en-us');

define(function () {
    var config = {
        paths: {
            "fx-DSDEditor/start": "../src/js/start",
            "fx-DSDEditor/config": "../src/config",
            "fx-DSDEditor/js": "../src/js",
            "fx-DSDEditor/templates": "../templates",
            "fx-DSDEditor/multiLang": "../src/multiLang",
            "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'text': '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            'pnotify': '{FENIX_CDN}/js/pnotify/pnotify.custom.min',
            'eonasdan-bootstrap-datetimepicker': '{FENIX_CDN}/js/bootstrap-datetimepicker/4.14.30/src/js/bootstrap-datetimepicker',
            'moment': '{FENIX_CDN}/js/moment/2.12.0/min/moment-with-locales.min',
            'parsleyjs': '{FENIX_CDN}/js/parsley/2.1.2/parsley'
        },
        config: { i18n: { locale: locale } },
        shim: {
            "bootstrap": {
                deps: ["jquery"]
            },
            'eonasdan-bootstrap-datetimepicker': {
                deps: ['moment', 'bootstrap']
            }
        , "parsleyjs": { deps: ["jquery"] }
        }
    };
    return config;
});