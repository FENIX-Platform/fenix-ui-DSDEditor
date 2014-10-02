// Place third party dependencies in the lib folder
requirejs.config({
    "baseUrl": "lib",
    "paths": {
        config: "../config",
        js: "../js",
        templates: "../templates"
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

    }
});


/*

require([
'jquery',
'views/DSDEditor/DSDEditorWr',
'text!root/z_tmp/testDSD.json',
'domReady!'
], function ($, DSDEditorWr, testDSD) {
    startDSD_Edit();

    function startDSD_Edit() {
        DSDEditorWr = new DSDEditorWr();
        DSDEditorWr.render($('#mainContainer'));

        $('#btnLangEN').click(function (args) { setLang('EN'); });
        $('#btnLangFR').click(function (args) { setLang('FR'); });

        */
        /*
        var tM = {};
        tM.meta = JSON.parse(testDSD);
        tM.data = {};
        */
/*
        //tM.meta.dsd.columns[0].title = null;
        //DSDEditor.setColumns(tM.meta.dsd.columns);



        //DSDEditor.reset();
    }*/
