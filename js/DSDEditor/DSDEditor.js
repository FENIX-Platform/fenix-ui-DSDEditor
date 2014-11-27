/*
config format:
{
subjects:'urlToSubjectsJSON'
datatypes:'urlToDatatypesJSON'
codelists:'urlToCodelistsJSON'
langs:['EN','FR']
}
*/
define([
        'jquery',
        'jqxall',
        'require',
        'fx-DSDEditor/js/DSDEditor/helpers/ColumnIDGenerator',
        'fx-DSDEditor/js/DSDEditor/simpleEditors/ColumnEditor',
        'fx-DSDEditor/js/DSDEditor/simpleEditors/DSDTable',
        'fx-DSDEditor/js/DSDEditor/helpers/DSDColumnValidator',
        'i18n!fx-DSDEditor/multiLang/DSDEditor/nls/ML_DSDEdit',
        'text!fx-DSDEditor/templates/DSDEditor/DSDEdit.htm'
],
    function ($, jqx, require, ColumnIDGenerator, ColumnEditor, DSDTable, DSDColumnValidator, mlRes, DSDEditHTML) {

        var widgetName = "DSDEditor";
        // var evtColumnsEditDone = "columnEditDone." + widgetName + ".fenix"

        var defConfig = {};
        defConfig["subjects"] = require.toUrl("fx-DSDEditor/config/DSDEditor/Subjects.json");
        defConfig["datatypes"] = require.toUrl("fx-DSDEditor/config/DSDEditor/Datatypes.json");
        defConfig["codelists"] = require.toUrl("fx-DSDEditor/config/DSDEditor/Codelists.json");

        var DSDEditor = function (config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);

            this.widgetName = "DSDEditor";
            this.$container;
            this.cols = [];

            this.$cntColEdit;
            this.colEditor;

            this.$cntDSDGrid;
            this.DSDTable;
        };

        //Render - creation
        DSDEditor.prototype.render = function (container, config, callB) {
            $.extend(true, this.config, config);

            this.$container = container;
            this.$container.html(DSDEditHTML);
            this.$cntColEdit = this.$container.find('#cntColEdit');

            this.colEditor = new ColumnEditor();
            this.colEditor.render(this.$cntColEdit);

            var me = this;
            this.$container.find('#bntColEditOk').click(function () {
                var newCol = me.colEditor.getColumn();

                var val = new DSDColumnValidator();
                var valRes = val.validateColumn(newCol);
                me.colEditor.showValidationResults(valRes);

                if (!valRes || valRes.length == 0) {
                    me.colEditor.reset();
                    if (newCol.id == "") {
                        //CreateID
                        me.cols.push(newCol);
                        var idGen = new ColumnIDGenerator();
                        me.cols[me.cols.length - 1].id = idGen.generate(me.cols, me.cols.length - 1);
                    }
                    else {
                        for (var i = 0; i < me.cols.length; i++)
                            if (me.cols[i].id == newCol.id)
                                me.cols[i] = newCol;
                    }
                    me.DSDTable.setColumns(me.cols);
                }
            });
            this.$container.find('#bntColReset').click(function () {
                me.colEditor.reset();
            });


            this.$cntDSDGrid = this.$container.find('#cntDSDGrid');
            this.DSDTable = new DSDTable();
            this.DSDTable.render(this.$cntDSDGrid);
            this.DSDTable.setColumns(this.cols);


            /*$('#btnColsEditDone').on('click', function () {
                me.ColsEditDone();
            });*/

            this.doML();

            var me = this;
            var subjErr = "Cannot find subjects definition at " + this.config.subjects;
            var datatypeErr = "Cannot find datatypes definition at " + this.config.datatypes;
            var codelistsErr = "Cannot find codelists definition at " + this.config.codelists;

            ajaxGET(me.config.subjects, function (data) {
                me.setSubjects(data);
                ajaxGET(me.config.datatypes, function (data) {
                    me.setDataTypes(data);
                    ajaxGET(me.config.codelists, function (data) {
                        me.setCodelists(data);
                        if (callB) callB();
                    }, codelistsErr);
                }, datatypeErr);
            }, subjErr);

            this.$cntDSDGrid.on("edit.DSDTable.fenix", function (evt, col) {
                for (var i = 0; i < me.cols.length; i++) {
                    if (me.cols[i].id == col.id) {
                        me.colEditor.setColumn(me.cols[i]);
                    }
                }
            });

            this.$cntDSDGrid.on("delete.DSDTable.fenix", function (evt, col) {
                if (confirm(mlRes.confirmDelete)) {
                    for (var i = 0; i < me.cols.length; i++) {
                        if (me.cols[i].id == col.id) {
                            me.cols.splice(i, 1);
                            me.DSDTable.setColumns(me.cols);
                        }
                    }
                }
            });
        }

        DSDEditor.prototype.setSubjects = function (subjects) {
            this.colEditor.setSubjects(subjects);
        }
        DSDEditor.prototype.setDataTypes = function (dataTypes) {
            this.colEditor.setDataTypes(dataTypes);
        }
        DSDEditor.prototype.setCodelists = function (codelists) {
            this.colEditor.setCodelists(codelists);
        }

        DSDEditor.prototype.getSubjects = function () {
            return this.colEditor.getSubjects();
        }
        DSDEditor.prototype.getDataTypes = function () {
            return this.colEditor.getDataTypes();
        }
        DSDEditor.prototype.getCodelists = function () {
            return this.colEditor.getCodelists();
        }

        //END Render - creation


        //Get/Set cols
        DSDEditor.prototype.setColumns = function (columns) {
            this.cols = columns;
            this.DSDTable.setColumns(this.cols);

            /*var val = new DSDColumnValidator();
            var valRes = val.validateColumns(this.cols);*/
            this.DSDTable.showValidationResults(this.validate());

        }
        DSDEditor.prototype.getColumns = function () {
            this.DSDTable.showValidationResults(this.validate());
            return this.cols;
        }

        DSDEditor.prototype.reset = function () {
            //this.colAddDelEnabled = true;
            this.cols.length = 0;
            this.refreshColumns();
        }
        DSDEditor.prototype.refreshColumns = function () {
            this.DSDTable.refreshColumns();
        }
        DSDEditor.prototype.newColumn = function () {
            var newCol = {};
            newCol.id = "";
            this.colEditor.setColumn(newCol);
        }
        DSDEditor.prototype.ColumnAddDeleteEnabled = function (enabled) {
            this.DSDTable.ColumnAddDeleteEnabled(enabled);
        }
        DSDEditor.prototype.validate = function () {
            var val = new DSDColumnValidator();
            return val.validateColumns(this.cols);
        }

        DSDEditor.prototype.doML = function () {
            this.$container.find('#bntColEditOk').html(mlRes.ok);
            this.$container.find('#bntColReset').html(mlRes.reset);
        }
        //END Multilang

        //AJAX
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

        return DSDEditor;
    });