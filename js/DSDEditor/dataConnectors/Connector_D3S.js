define([
    'jquery',
    'fx-DSDEditor/js/DSDEditor/dataConnectors/Connector'
],
    function ($, Connector) {
        var defConfig = {
           /* metadataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata",
            dsdUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/dsd",
            dataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources"*/
            metadataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/metadata",
            dsdUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/dsd",
            dataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources"
        };

        var Connector_D3S = function (config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);

            this.connector = new Connector();
        };

        Connector_D3S.prototype.getMetadata = function (uid, version, callB) {
            this.connector.getMetadata(this.config.metadataUrl, uid, version, callB)
        }

        /*Connector_D3S.prototype.getDSD = function (uid, version, callB) {
            this.connector.getDSD(this.confg.url,uid,version, callB)
        }*/

        Connector_D3S.prototype.updateDSD = function (uid, version, newDSD, datasource, contextSys, callB) {
            newDSD.datasource = datasource;
            newDSD.contextSystem = contextSys;

            var me = this;
            this.getMetadata(uid, version, function (meta) {
                if (meta.dsd && meta.dsd.rid) {
                    newDSD.rid = meta.dsd.rid;
                    me.connector.putDSD(me.config.dsdUrl, newDSD, callB);
                }
                else {
                    var toPatch = { uid: meta.uid };
                    if (meta.version)
                        toPatch.version = meta.version;
                    toPatch.dsd = newDSD;
                    me.connector.patchDSD(me.config.metadataUrl, toPatch, callB);
                }
            });
        }

        Connector_D3S.prototype.putData = function (uid, version, data, callB) {
            var me = this;
            this.getMetadata(uid, version, function (meta) {
                me.connector.putData(me.config.dataUrl, meta, data, callB);
            });
        }

        return Connector_D3S;
    });