define([
    'jquery',
    './DSDEditor/DSDEditor'
], function ($, DSDEditor) {

    var defConfig = {};
    var cfg = {};

    function init(containerID, config, callB) {
        $.extend(true, cfg, defConfig, config);
        this.DSDE = new DSDEditor(cfg);
        this.DSDE.render($(containerID), cfg, callB);
    }

    function set(cols) { this.DSDE.set(cols); }
    function get() { return this.DSDE.get(); }
    function validate() { return this.DSDE.validate(); }

    function editable(editable) {
        this.DSDE.editable(editable);
    }

    function reset() { this.DSDE.reset(); }
    function destroy() { this.DSDE.destroy(); }
    function hasChanged() { return this.DSDE.hasChanged(); }

    function on(channel, fn, context){
        return this.DSDE.on(channel, fn, context);
    }

    return {
        init: init,
        set: set,
        get: get,
        validate: validate,
        editable: editable,
        reset: reset,
        destroy: destroy,
        hasChanged: hasChanged,
        on: on
    }
});