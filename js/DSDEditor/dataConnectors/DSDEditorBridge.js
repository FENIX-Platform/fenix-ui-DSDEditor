define(['jquery'],
    function ($) {

        var DSDEditorBridge = function () {
        };

        DSDEditorBridge.prototype.getDSD = function (url, uid, version, callB) {
            var addr = url;
            if (!version)
                addr += "/uid/" + uid
            else
                addr += "/" + uid + "/" + version;
            ajaxGET(addr, callB, "Cannot find DSD at " + url);
        }

        DSDEditorBridge.prototype.updateDSD = function (url, existingMeta, newDSD, callB) {
            if (!existingMeta)
                throw new Error("existing meta cannot be null");
            if (!newDSD)
                throw new Error("DSD cannot be null");
            if (!newDSD.contextSystem)
                throw new Error("DSD. contextSystem cannot be null");
            if (!newDSD.dataSource)
                throw new Error("DSD. dataSource cannot be null");

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

        var ajaxGET = function (url, callB, errorMessage) {
            $.ajax({
                url: url,
                crossDomain: true,
                dataType: 'json',
                success: function (data) {
                    if (callB) callB(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    throw new Error("Cannot find DSD at " + url);
                }
            });
        }
        var ajaxPUT = function (url, JSONToPut, errorMessage) {
            ajaxPUT_PATCH(url, JSONToPut, errorMessage, 'PUT');
        }
        var ajaxPATCH = function (url, JSONToPatch, errorMessage) {
            ajaxPUT_PATCH(url, JSONToPut, errorMessage, 'PATCH');
        }

        var ajaxPUT_PATCH = function (url, JSONtoSend, errorMessage, method) {
            $.ajax({
                contentType: "application/json",
                url: url,
                dataType: 'json',
                type: method,
                data: JSON.stringify(JSONtoSend),
                crossDomain: true,
                success: function (data, textStatus, jqXHR) {
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    throw new Error(errorMessage);
                }
            });
        }

        return DSDEditorBridge;
    });