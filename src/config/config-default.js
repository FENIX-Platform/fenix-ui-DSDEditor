define(function () {

    'use strict';
    return {

        LANG : "EN",
        LOCALE : "en_EN",
        LANGFALLBACKORDER : ["EN", "FR", "ES", "AR", "PR"],

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
        SERVICE_RESOURCES_FIND: {service: "resources/find"},

        METADATA_PATH: {
            //schemaPath: '../config/schemas/',
            schemaPath: 'fx-MetaEditor/config/schemas/'
        },

        METADATA_SEC: [
            {
                id: "identification", text: "Identification", icon: "img/fenix-catalog-sprite-small.svg",
                state: {
                    selected: true
                }
            },
            {id: "contacts", text: "Contacts"},
            {
                id: "content", text: "Content", children: [
                {id: 'content_ReferencePopulation', text: "Reference Population"},
                {id: 'content_Coverage', text: "Coverage"}
            ]
            },
            {id: "institutionalMandate", text: "Institutional Mandate"},
            {
                id: "statisticalProcessing",
                text: "Statistical Processing",
                state: {disabled: true, opened: true},
                children: [
                    {id: 'statisticalProcessing_primaryDataCollection', text: "Primary Data Collection"},
                    {id: 'statisticalProcessing_secondaryDataCollection', text: "Secondary Data Collection"},
                    {id: 'statisticalProcessing_dataCompilation', text: "Data Compilation"},
                    {id: 'statisticalProcessing_dataValidation', text: "Data Validation"}
                ]
            },
            {
                id: "dataQuality", text: "Data Quality", children: [
                {id: "dataQuality_accuracy", text: "Accuracy"},
                {id: "dataQuality_dataRevision", text: "Data Revision"},
                {id: "dataQuality_relevance", text: "Relevance"},
                {id: "dataQuality_compatibilityCoherence", text: "Compatibility Coherence"},
                {id: "dataQuality_timelinessAndPunctuality", text: "Timeliness and Puctuality"}
            ]
            },
            {
                id: "accessibility", text: "Accessibility", state: {disabled: true, opened: true}, children: [
                {
                    id: "accessibility_dataDissemination",
                    text: "Data Dissemination",
                    state: {disabled: true, opened: true},
                    children: [
                        {id: "accessibility_dataDissemination_distribution", text: "Distribution"},
                        {id: "accessibility_dataDissemination_releasePolicy", text: "Release Policy"}
                    ],

                },
                {id: "accessibility_clarity", text: "Clarity"},
                {id: "accessibility_confidentiality", text: "Confidentiality"}
            ]
            },
            {
                id: "maintenance", text: "Maintenance", children: [
                {id: "maintenance_update", text: "Update"},
                {id: "maintenance_metadataMaintenance", text: "Metadata Maintenance"}
            ]
            }
            //,{ id: "documents", text: "Documents" }
        ],

    };
});
