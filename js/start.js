/*
config format:

{
    "columnEditor": {
        "subjects": "urlToSubjectsJSON",
        "datatypes": "urlToDatatypesJSON",
        "codelists": "urlToCodelistsJSON"
    },
    "MLEditor": {
        "langs": ["EN","FR"]
    },
}
*/
define([
    'jquery',
    'fx-DSDEditor/js/DSDEditor/DSDEditor',
    'bootstrap'
], function ($, DSDEditor) {

    var defConfig = {
    };

    var cfg = {};

    function init(containerID, config, callB) {
        $.extend(true, cfg, defConfig, config);
        this.DSDE = new DSDEditor(cfg);
        this.DSDE.render($(containerID), cfg, callB);
    }

    function setColumns(cols) { this.DSDE.setColumns(cols); }
    function getColumns() { return this.DSDE.getColumns(); }
    function validate() { return this.DSDE.validate(); }

    function isEditable(editable) {
        if (typeof (editable) == 'undefined')
            return this.DSDE.isEditable();
        else
            this.DSDE.isEditable(editable);
    }

    function reset() { this.DSDE.reset(); }
    function destroy() { this.DSDE.destroy(); }
    function hasChanged() { return this.DSDE.hasChanged(); }

    return {
        init: init,
        setColumns: setColumns,
        getColumns: getColumns,
        validate: validate,
        isEditable: isEditable,
        reset: reset,
        destroy: destroy,
        hasChanged: hasChanged
    }
});