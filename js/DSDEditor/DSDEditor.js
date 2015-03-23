define([
        'jquery',
        'jqxall',
        'require',
        'fx-DSDEditor/js/DSDEditor/helpers/ColumnIDGenerator',
        'fx-DSDEditor/js/DSDEditor/simpleEditors/ColumnEditor',
        'fx-DSDEditor/js/DSDEditor/simpleEditors/DSDTable',
        'fx-DSDEditor/js/DSDEditor/helpers/DSDColumnValidator',
        'i18n!fx-DSDEditor/multiLang/DSDEditor/nls/ML_DSDEdit',
        'text!fx-DSDEditor/templates/DSDEditor/DSDEdit.htm',
        'pnotify'
],
    function ($, jqx, require, ColumnIDGenerator, ColumnEditor, DSDTable, DSDColumnValidator, mlRes, DSDEditHTML, PNotify) {

        var widgetName = "DSDEditor";

        var defConfig = { columnEditor: {} };
        defConfig.columnEditor["subjects"] = require.toUrl("fx-DSDEditor/config/DSDEditor/Subjects.json");
        defConfig.columnEditor["datatypes"] = require.toUrl("fx-DSDEditor/config/DSDEditor/Datatypes.json");
        defConfig.columnEditor["codelists"] = require.toUrl("fx-DSDEditor/config/DSDEditor/Codelists.json");

        var DSDEditor = function (config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);

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

            this.colEditor = new ColumnEditor(this.config);
            this.colEditor.render(this.$cntColEdit);

            var me = this;
            this.$container.find('#bntColEditOk').on('click', function () {
                var newCol = me.colEditor.getColumn();

                var val = new DSDColumnValidator();
                var valRes = val.validateColumn(newCol);
                me.showValidationResults(valRes);
                //me.colEditor.showValidationResults(valRes);
                

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
            this.$container.find('#bntColReset').on('click', function () {
                me.colEditor.reset();
            });


            this.$cntDSDGrid = this.$container.find('#cntDSDGrid');
            this.DSDTable = new DSDTable();
            this.DSDTable.render(this.$cntDSDGrid);
            this.DSDTable.setColumns(this.cols);

            this.doML();

            var subjErr = "Cannot find subjects definition at " + this.config.columnEditor.subjects;
            var datatypeErr = "Cannot find datatypes definition at " + this.config.columnEditor.datatypes;
            var codelistsErr = "Cannot find codelists definition at " + this.config.columnEditor.codelists;

            ajaxGET(me.config.columnEditor.subjects, function (data) {
                me.setSubjects(data);
                ajaxGET(me.config.columnEditor.datatypes, function (data) {
                    me.setDataTypes(data);
                    ajaxGET(me.config.columnEditor.codelists, function (data) {
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
        DSDEditor.prototype.isEditable = function (editable) {
            if (typeof (editable) == 'undefined')
                return this.DSDTable.isEditable();

            var $divDSDGrid = this.$container.find('#divDSDGrid');
            //TODO: assign classes to make the DSDTable bigger/smaller
            if (editable) {
                this.$container.find('#divColEdit').show();
                $divDSDGrid.removeClass('col-md-12');
                $divDSDGrid.addClass('col-md-8');
            }
            else {
                this.$container.find('#divColEdit').hide();
                $divDSDGrid.removeClass('col-md-8');
                $divDSDGrid.addClass('col-md-12');
            }

            this.DSDTable.isEditable(editable);
        }
        //END Render - creation


        //Get/Set cols
        DSDEditor.prototype.setColumns = function (columns) {
            this.cols = columns;
            this.DSDTable.setColumns(this.cols);
            this.showValidationResults(this.validateColumns());
        }
        DSDEditor.prototype.getColumns = function () {
            var valRes = this.validateColumns();
            if (valRes  && valRes.length > 0) {
                this.showValidationResults(valRes);
                return false;
            }
            return this.cols;
        }

        DSDEditor.prototype.reset = function () {
            //this.colAddDelEnabled = true;
            this.cols = [];
            this.DSDTable.setColumns(this.cols);
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
        DSDEditor.prototype.validateColumns = function () {
            var valRes = new DSDColumnValidator().validateColumns(this.cols);
            return valRes;
        }
        DSDEditor.prototype.showValidationResults = function (valRes) {
            if (!valRes || valRes.length == 0)
                return;
            var errMsg = " ";
            for (var i = 0; i < valRes.length; i++) {
                if (!valRes[i].field)
                    errMsg = errMsg + mlRes[valRes[i].message] + "\n";
                else
                    errMsg = errMsg + valRes[i].field + " " + mlRes[valRes[i].message] + "\n";
            }
            new PNotify({
                title: '',
                text: errMsg,
                type: 'error'
            });
        }

        DSDEditor.prototype.doML = function () {
            this.$container.find('#bntColEditOk').html(mlRes.ok);
            this.$container.find('#bntColReset').html(mlRes.reset);
        }
        //END Multilang

        DSDEditor.prototype.destroy = function () {
            this.$container.find('#bntColEditOk').off('click');
            this.$container.find('#bntColReset').off('click');
            this.$cntDSDGrid.off("edit.DSDTable.fenix");
            this.$cntDSDGrid.off("delete.DSDTable.fenix");

            this.colEditor.destroy();
            this.DSDTable.destroy();
        }


        //AJAX
        //TODO: move the ajax call elsewhere
        var ajaxGET = function (url, callB, errorMessage) {
            $.ajax({
                url: url,
                crossDomain: true,
                dataType: 'json',
                success: function (data) {
                    if (callB) callB(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    throw new Error("Cannot find data at " + url);
                }
            });
        }

        return DSDEditor;
    });