define(function () {

    'use strict';
    return {

        LANG : "en",
        LOCALE : "en_EN",
        LANGFALLBACKORDER : ["en", "fr", "es", "ar", "fr"],

        SECONDARY_MENU: {
            url: 'fx-d-m/config/secondary_menu.json',
            disable: ['delete', 'close', 'data', 'dsd']
        },

        DSD_EDITOR_CONTEXT_SYSTEM: 'demo1',
        DSD_EDITOR_DATASOURCES: ['D3S'],
        DSD_EDITOR_SUBJECTS: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Subjects.json",
        DSD_EDITOR_DATATYPES: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Datatypes.json",
        DSD_EDITOR_CODELISTS: "config/submodules/DSDEditor/cstat_core_codelists.json",

        DATA_MANAGEMENT_NOT_LOGGEDIN_URL: "./index.html",
        FAKE_AUTHENTICATION: true,

        CATALOG_BLANK_FILTER: 'config/submodules/catalog/uae-catalog-blank-filter.json',

        SERVICE_BASE_ADDRESS: "http://fenix.fao.org/d3s_fenix/msd",
        SERVICE_GET_DATA_METADATA: {service: "resources", queryParams: {full: true, dsd: true}},
        SERVICE_GET_METADATA: {service: "resources/metadata", queryParams: {full: true, dsd: true}},
        SERVICE_COPY_METADATA: {service: "resources/metadata", queryParams: {full: true, dsd: true, export:true}},
        SERVICE_SAVE_METADATA: {service: "resources/metadata"},
        SERVICE_SAVE_DSD: {service: "resources/dsd"},
        SERVICE_SAVE_DATA: {service: "resources"},
        SERVICE_RESOURCES_FIND: {service: "resources/find"}


    };
});
