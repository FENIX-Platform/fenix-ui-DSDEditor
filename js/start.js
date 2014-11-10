define([
    'jquery',
    'fx-DSDEditor/js/DSDEditor/DSDEditorWr',
    'bootstrap',
    'domReady!'

], function ($, DSDEditorWr) {

    function DSDEditor_starter() {
        DSDEditorWr = new DSDEditorWr();
        DSDEditorWr.render($('#mainContainer'), null);

        /*var colsAdapter = {
            //source: "http://faostat3.fao.org:7799/v2/msd/resources/metadata/dan2/1.0?dsd=true",
            //data: null
            serviceAddress: "http://faostat3.fao.org:7799/v2/msd/resources/metadata/dan2/1.0?dsd=true",
            data: null}

        DSDEditorWr.load(colsAdapter);*/
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