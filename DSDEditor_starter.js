var locale = localStorage.getItem('locale' || 'en-us');
// Place third party dependencies in the lib folder
requirejs.config({
    config: { i18n: { locale: locale} },
    "baseUrl": "lib",
    "paths": {
        "fx-DSDEditor/config": "../config",
        "fx-DSDEditor/js": "../js",
        "fx-DSDEditor/templates": "../templates",
        "fx-DSDEditor/multiLang": "../multiLang",
        bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        }
    }
});

require([
    'jquery',
    'fx-DSDEditor/js/DSDEditor/DSDEditorWr',
    'bootstrap',
    'domReady!'

], function ($, DSDEditorWr) {

    DSDEditor_starter();

    function DSDEditor_starter() {
        DSDEditorWr = new DSDEditorWr();
        DSDEditorWr.render($('#mainContainer'));
    };


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
})
;