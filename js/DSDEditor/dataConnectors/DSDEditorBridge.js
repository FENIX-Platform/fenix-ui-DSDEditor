define(['jquery'],
    function ($) {
        var DSDEditorBridge = function () {
        };

        DSDEditorBridge.prototype.getSubjects = function (url, callB) {
            ajaxCall(url, callB, "Cannot find subjects definition at " + url);
        }
        DSDEditorBridge.prototype.getDataTypes = function (url, callB) {
            ajaxCall(url, callB, "Cannot find data types definition at " + url);
        }
        DSDEditorBridge.prototype.getCodelists = function (url, callB) {
            ajaxCall(url, callB, "Cannot find code lists definition at " + url);
        }

        DSDEditorBridge.prototype.getDSD = function (url, uid, version, callB)
        {
            var addr = url;
            if (!version)
                addr += "/uid/" + uid
            else
                addr += "/" + uid + "/" + version;

            $.ajax({
                url: addr,
                crossDomain: true,
                dataType: "json",
                success: function (data) {
                    if (callB)
                        callB(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    throw new Error("Cannot find DSD at " + url);
                }
            });
        }
       /* DSDEditorBridge.prototype.getDSD = function (url, data, callB)
        {
            $.ajax({
                url: url,
                data: data,
                crossDomain: true,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (callB)
                        callB(JSON.parse(data))
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    throw new Error("Cannot find DSD at " + url);
                }
            });
        }*/

        var ajaxCall = function (url, callB, errorMessage) {
            $.get(url, function (data, textStatus, jqXHR) {
                if (callB)
                    callB(data);
            }, 'json').fail(function (xhr, ajaxOptions, thrownError) {
                throw new Error(errorMessage);
            });
        }

        return DSDEditorBridge;
    });