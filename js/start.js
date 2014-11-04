
define([
    'jquery',
    'fx-DSDEditor/js/DSDEditor/DSDEditorWr',
    'bootstrap',
    'domReady!'

], function ($, DSDEditorWr) {

    function DSDEditor_starter() {
        DSDEditorWr = new DSDEditorWr();
        DSDEditorWr.render($('#mainContainer'));

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
    /*End multilang test*/

    return {
        init: DSDEditor_starter
    }
});