var locale = localStorage.getItem('locale' || 'en-us');
// Place third party dependencies in the lib folder
requirejs.config({
    config: { i18n: { locale: locale} },
    "baseUrl": "lib",
    "paths": {
        config: "../config",
        js: "../js",
        templates: "../templates",
        multiLang: "../multiLang"
    }
});

require([
'jquery',
'js/DSDEditor/DSDEditorWr',
//'text!templates/fileUpload/fileUpload.htm',
//'text!config/fileUpload/fileUpload_cfg.json',
'domReady!'
], function ($,DSDEditorWr) {

    DSDEditor_starter();

    function DSDEditor_starter() {
       DSDEditorWr = new DSDEditorWr();
       DSDEditorWr.render($('#mainContainer'));

       $('#btnEN').click(function () { setLang('en'); });
       $('#btnFR').click(function () { setLang('fr'); });
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