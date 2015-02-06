define([
        'jquery',
        'fx-DSDEditor/js/DSDEditor/simpleEditors/codesSelection/TreeSelector',
        'text!fx-DSDEditor/templates/DSDEditor/simpleEditors/codesSelection/codesSelection.html',
        'fx-DSDEditor/js/DSDEditor/dataConnectors/Connector_D3S',
        'fx-DSDEditor/js/DSDEditor/helpers/MLUtils'
],
    function ($, TreeSel, CodelistSelectorHTML, Connector, MLUtils) {
        var defConfig = {};

        var CodesSelector = function (config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
            this.$container;
            this.cl = {};
            this.treeSel = new TreeSel();
        };

        //Render - creation
        CodesSelector.prototype.render = function (container, config) {
            $.extend(true, this.config, config);
            this.$container = container;
            this.$container.html(CodelistSelectorHTML);

            var $cntTree = this.$container.find('#clSel_divTree');
            this.treeSel.render($cntTree);

            var me = this;
            $cntTree.on("nodeExpand.TreeSelector.fenix", function (evt, nodeExpandEvt) {
                var val = nodeExpandEvt.value;
                me.loadBranch(val);
            });
        }

        CodesSelector.prototype.loadCodelist = function (system, version, callB) {
            this.cl.system = system;
            this.cl.version = version;
            this.loadBranch(-1, callB);
        }

        CodesSelector.prototype.loadBranch = function (parentId, callB) {
            var conn = new Connector();
            var me = this;

            var filter = {};
            if (parentId == -1) {
                filter.levels = 2;
            }
            else {
                filter.levels = 3;
                filter.codes = [parentId];
            }
            conn.getCodelistWithFilter(this.cl.system, this.cl.version, filter, function (data) {
                if (parentId == -1)
                    me.treeSel.setChildren(parentId, codesToNodes(data));
                else
                    me.treeSel.setChildren(parentId, codesToNodes(data[0].children));
                if (callB)
                    callB();
            });
        }

        CodesSelector.prototype.getSelectedCodes = function () {
            var sel = this.treeSel.getCheckedItems();
            return nodesToCodes(sel);
        }
        CodesSelector.prototype.checkCodes = function (codes) {
            if (!codes)
                return;
            var toCheck = [];
            for (var i = 0; i < codes.length; i++)
                toCheck.push(codes[i].code);
            this.treeSel.checkItems(toCheck);
        }

        var codesToNodes = function (codes) {
            var lCode = localStorage.getItem('locale');
            if (lCode)
                lCode = lCode.toUpperCase();
            else
                lCode = 'EN';

            if (!codes)
                return null;
            var toRet = [];
            for (var i = 0; i < codes.length; i++) {
                //var node = { label: codes[i].title.EN, value: codes[i].code };
                var node = { value: codes[i].code };
                node.label = MLUtils_getAvailableString(codes[i].title, lCode);
                if (!codes[i].leaf)
                    node.items = [{ value: "...", label: "..." }];
                toRet.push(node);
            }
            return toRet;
        }

        var nodesToCodes = function (nodes) {
            if (!nodes)
                return null;
            var toRet = [];
            for (var i = 0; i < nodes.length; i++)
                toRet.push({ code: nodes[i].value });
            return toRet;
        }

        return CodesSelector;
    });