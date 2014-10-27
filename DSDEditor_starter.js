var locale = localStorage.getItem('locale' || 'en-us');
// Place third party dependencies in the lib folder
requirejs.config({
    config: { i18n: { locale: locale} },
    "baseUrl": "lib",
    "paths": {
        config: "../config",
        js: "../js",
        templates: "../templates",
        multiLang: "../multiLang",
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
    'js/DSDEditor/DSDEditorWr',
    'bootstrap',
//'text!templates/fileUpload/fileUpload.htm',
//'text!config/fileUpload/fileUpload_cfg.json',
    'domReady!'

], function ($, DSDEditorWr) {

    DSDEditor_starter();

    function DSDEditor_starter() {
        var $mainContainer = $('#mainContainer');
        DSDEditorWr = new DSDEditorWr();
        DSDEditorWr.render($mainContainer);


        $mainContainer.on('columnEditDone.DSDEditor.fenix', function (evt, param) {
            console.log(JSON.stringify(DSDEditorWr.getColumns()));
        });

        $('#btnEN').click(function () {
            setLang('en');
        });
        $('#btnFR').click(function () {
            setLang('fr');
        });
    }

    /*Multilang test*/
    function setLang(lang) {
        var loc = localStorage.getItem('locale');
        if (loc && loc.toUpperCase() == lang)
            return;
        localStorage.setItem('locale', lang.toLowerCase());
        location.reload();
    }

    /*ENd multilang test*/

});