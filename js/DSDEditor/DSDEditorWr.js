define([
        'jquery',
        'fx-DSDEditor/js/DSDEditor/DSDEditor',
        'text!fx-DSDEditor/config/DSDEditor/Subjects.json',
        'text!fx-DSDEditor/config/DSDEditor/Datatypes.json',
        'text!fx-DSDEditor/config/DSDEditor/Codelists.json'
    ],
    function ($, DSDEditor, subjects, dataTypes, codelists) {
        var DSDEditorWr = function () {
            this.subjects;
            this.dataTypes;
            this.codelists;

            this.DSDEditor = new DSDEditor();
        };

        //Render - creation
        DSDEditorWr.prototype.render = function (container, callB) {
            this.DSDEditor.render(container, callB);
            this.DSDEditor.setSubjects(JSON.parse(subjects));
            this.DSDEditor.setDataTypes(JSON.parse(dataTypes));
            this.DSDEditor.setCodelists(JSON.parse(codelists));
        }

        //DSDEditorWr.prototype.validateDSD = function () { this.DSDEditor.validateDSD(); }

        //Get/Set cols
        DSDEditorWr.prototype.setColumns = function (columns) {
            this.DSDEditor.setColumns(columns);
        }
        DSDEditorWr.prototype.getColumns = function () {
            return this.DSDEditor.getColumns();
        }

        DSDEditorWr.prototype.load = function (metaAdapter) {
            var me = this;
            $.ajax({
                url: metaAdapter.serviceAddress,
                data: metaAdapter.data,
                crossDomain: true,
                dataType: "json",
                success: function (data) {
                    me.dataLoaded(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    throw new Error(jqXHR, textStatus, errorThrown);
                }
            });
        }
        DSDEditorWr.prototype.dataLoaded = function (data) {
            this.DSDEditor.setColumns(data.dsd.columns);
        }

        DSDEditorWr.prototype.reset = function () {
            this.DSDEditor.reset();
        }

        DSDEditorWr.prototype.ColumnAddDeleteEnabled = function (enabled) {
            this.DSDEditor.ColumnAddDeleteEnabled(enabled);
        }

        return DSDEditorWr;
    });