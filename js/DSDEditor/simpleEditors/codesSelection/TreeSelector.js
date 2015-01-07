define([
    'jquery',
    'jqxall'
],
function ($, jqx) {
    var WIDGET_NAME = "TreeSelector";
    var EVT_NODE_EXPAND = "nodeExpand." + WIDGET_NAME + ".fenix";

    var TreeSelector = function (config) {
        this.$tree;
    };

    //Render - creation
    TreeSelector.prototype.render = function (container) {
        this.$tree = container;
        this.$tree.jqxTree({ checkboxes: true, incrementalSearch: true });

        var me = this;
        this.$tree.on('expand', function (evt) {
            var item = me.$tree.jqxTree('getItem', evt.args.element);
            me.$tree.trigger(EVT_NODE_EXPAND, {
                value: item.value,
                label: item.label
            });
        });
    }

    TreeSelector.prototype.setChildren = function (parentId, nodes) {
        if (parentId == -1) {
            this.$tree.jqxTree({ source: nodes });
        }
        else {
            var parentNode = this.findNodeById(parentId);
            if (parentNode) {
                this.$tree.jqxTree('removeItem', parentNode.nextItem);
                this.$tree.jqxTree('addTo', nodes, parentNode.element);
            }
        }
    }
    TreeSelector.prototype.findNodeById = function (id) {
        var items = this.$tree.jqxTree('getItems');
        if (!items)
            return null;
        for (var i = 0; i < items.length; i++) {
            if (items[i].value == id)
                return items[i];
        }
        return null;
    }
    TreeSelector.prototype.getCheckedItems = function () {
        return this.$tree.jqxTree('getCheckedItems');
    }
    TreeSelector.prototype.checkItems = function (toCheck) {
        if (!toCheck)
            return;
        for (var i = 0; i < toCheck.length; i++) {
            var item = this.findNodeById(toCheck[i]);
            if (item)
                this.$tree.jqxTree('checkItem', item, true);
        }
    }

    return TreeSelector;
});