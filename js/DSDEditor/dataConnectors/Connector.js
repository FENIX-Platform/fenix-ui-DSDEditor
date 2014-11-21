define(['jquery'],
    function ($) {
        var Connector = function () {
        };

        Connector.prototype.getMetadata = function (url, uid, version, callB) {
            var addr = url;
            if (!version)
                addr += "/uid/" + uid
            else
                addr += "/" + uid + "/" + version;
            var queryParam = { dsd: true };
            ajaxGET(addr, queryParam, callB, "Cannot find Metadata at " + url);
        }

        Connector.prototype.updateDSD = function (url, existingMeta, newDSD, callB) {
            if (!existingMeta)
                throw new Error("existing meta cannot be null");
            if (!newDSD)
                throw new Error("DSD cannot be null");
            if (!newDSD.contextSystem)
                throw new Error("DSD. contextSystem cannot be null");
            if (!newDSD.datasource)
                throw new Error("DSD. datasource cannot be null");

            //The existing meta has a dsd with a his rid
            if (existingMeta.dsd && existingMeta.dsd.rid) {
                newDSD.rid = existingMeta.dsd.rid;
                ajaxPUT(url, newDSD, "Error updating the DSD(PUT) with rid " + newDSD.rid);
            }
                //The existing meta does'ns have a rid for the DSD part
            else {
                var toPatch = { uid: existingMeta.uid };
                if (existingMeta.version)
                    toPatch.version = existingMeta.version;
                toPatch.DSD = newDSD;
                ajaxPATCH(url, toPatch, "Error updating the DSD(PATCH) with rid " + newDSD.rid);
            }
        }

        //DATA
        Connector.prototype.putData = function (url, existingMeta, data, callB) {

            var toPut = { metadata: { uid: existingMeta.uid } };
            if (existingMeta.version)
                toPut.metadata.version = existingMeta.version;
            toPut.data = data;
            ajaxPUT(url, toPut, "Error executing data update", callB);
        }


        //AJAX Methods
        var ajaxGET = function (url, queryParam, callB, errorMessage) {
            $.ajax({
                url: url,
                crossDomain: true,
                dataType: 'json',
                data: queryParam,
                success: function (data) {
                    if (callB) callB(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    throw new Error("Cannot find DSD at " + url);
                }
            });
        }
        var ajaxPUT = function (url, JSONToPut, errorMessage, callB) {
            ajaxPUT_PATCH(url, JSONToPut, errorMessage, 'PUT', callB);
        }
        var ajaxPATCH = function (url, JSONToPatch, errorMessage, callB) {
            ajaxPUT_PATCH(url, JSONToPatch, errorMessage, 'PATCH', callB);
        }

        var ajaxPUT_PATCH = function (url, JSONtoSend, errorMessage, method, callB) {
            console.log(JSONtoSend);
            $.ajax({
                contentType: "application/json",
                url: url,
                dataType: 'json',
                type: method,
                data: JSON.stringify(JSONtoSend),
                crossDomain: true,
                success: function (data, textStatus, jqXHR) {
                    if (callB) callB;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    throw new Error(errorMessage);
                }
            });
        }

        return Connector;
    });