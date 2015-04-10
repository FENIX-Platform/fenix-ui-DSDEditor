define([
        'jquery',
        'jqxall',
        'i18n!fx-DSDEditor/multiLang/DSDEditor/nls/ML_DSDEdit'
],
    function ($, jqx, mlRes) {
        var widgetName = 'DSDTable';
        var evtEditClicked = "edit." + widgetName + ".fenix";
        var evtDeleteClicked = "delete." + widgetName + ".fenix";

        var DSDTable = function (config) {
            this.$container;
            this.cols = [];
            this.editEnabled = true;
        };

        //Render - creation
        DSDTable.prototype.render = function (container) {
            this.$container = container;

            this.dataSource = createDSDGridDataSource(this.cols);
            this.dataAdapter = createDSDGridDataAdapter(this.dataSource, this.cols);

            var me = this;
            this.$container.jqxGrid({
                source: this.dataAdapter,
                theme: 'fenix',
                editable: false,
                autorowheight: true,
                autoheight: true,
                columns: this.createDSDGridCols(),
                width: '100%',
                rendered: function () {
                    //me.validateDSD();
                }
            });
            //this.$container.on('initialized', function () {});

            this.doML();
        }

        var createDSDGridDataSource = function (data) {
            var toRet = { localdata: data };
            toRet.datafields = [
                { name: 'id', type: 'string' },
                { name: 'MLTitle', type: 'string' },
                { name: 'subject', type: 'string' },
                { name: 'key', type: 'bool' },
                { name: 'dataType', type: 'string' },
                { name: 'tmp_domain', type: 'string' },
                { name: 'MLSupplemental', type: 'string' }
            ];
            return toRet;
        }

        var createDSDGridDataAdapter = function (datasource, cols) {
            var toRet = new $.jqx.dataAdapter(datasource,
                {
                    beforeLoadComplete: function (rec) {
                        for (var i = 0; i < rec.length; i++) {
                            var col = findColById(cols, rec[i].id);
                            if (col) {
                                rec[i].MLTitle = mlLabelToString(col.title);

                                if (col.domain) {
                                    if (col.domain.codes && col.domain.codes[0]) {
                                        rec[i].tmp_domain = col.domain.codes[0].idCodeList;
                                        if (col.domain.codes[0].version)
                                            rec[i].tmp_domain += col.domain.codes[0].version;
                                    }
                                    else if (col.domain.period)
                                        rec[i].tmp_domain = periodToString(col.domain.period);
                                } else
                                    rec[i].tmp_domain = "";
                                rec[i].MLSupplemental = mlLabelToString(col.supplemental);
                            }
                            else {
                                rec[i].MLTitle = "";
                                rec[i].MLSupplemental = "";
                                rec[i].tmp_domain = "";
                            }
                        }
                        return rec;
                    }
                });

            return toRet;
        }

        DSDTable.prototype.createDSDGridCols = function () {
            var me = this;
            var toRet = [
                { text: 'id', dataField: 'id', displayField: 'id', hidden: true },
                {
                    /*text: '', dataField: 'err', width: '4%', cellsrenderer: function (row, datafield, value) {
                        if (value)
                            return '<img style="margin-left: 5px;" height="60" width="50" src="../../images/' + value + '"/>';
                        return '';
                    }*/
                    text: '', dataField: 'err', width: '4%', cellclassname: function (row, column, value, data) {
                        if (value == 'e')
                            return 'fx-dsdedit-errIcon';
                        else return '';
                        /*if (value)
                            return 'red';
                        return '';*/
                    },
                    cellsrenderer: function (row, datafield, value) { return ''; }
                },
                { text: mlRes['title'], dataField: 'MLTitle', width: '20%' },
                { text: mlRes['subject'], dataField: 'subject', width: '10%' },
                {
                    text: mlRes['key'], dataField: 'key', columntype: 'checkbox', width: '10%', cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                        if (value)
                            return "Yes"
                        else 
                            return "No"
                    }
                },
                { text: mlRes['datatype'], dataField: 'dataType', width: '10%' },
                { text: mlRes['domain'], dataField: 'tmp_domain', width: '10%' },
                { text: mlRes['supplemental'], dataField: 'MLSupplemental', width: '20%' },
                {
                    text: mlRes['edit'], dataField: 'edit', width: '8%', columntype: 'button', cellsrenderer: function () {
                        return mlRes['edit'];
                    }, buttonclick: function (row) {
                        me.rowClicked(row, 'edit');
                    }
                },
                {
                    text: mlRes['delete'], dataField: 'delete', columntype: 'button', width: '8%', cellsrenderer: function () {
                        return mlRes['delete'];
                    }, buttonclick: function (row) {
                        me.rowClicked(row, 'delete');
                    }
                }
            ];

            return toRet;
        }
        DSDTable.prototype.rowClicked = function (rowIdx, action) {
            var row = this.$container.jqxGrid('getRows')[rowIdx];
            var colId = row.id;
            if (action == 'edit') {
                var col = findColById(this.cols, colId);
                this.$container.trigger(evtEditClicked, col);
            }
            else if (action == 'delete') {
                var col = findColById(this.cols, colId);
                this.$container.trigger(evtDeleteClicked, col);
            }
        }

        DSDTable.prototype.isEditable = function (editable) {
            if (typeof (editable) == 'undefined')
                return this.editEnabled;

            var action = 'hidecolumn';
            if (editable) {
                this.$container.jqxGrid('setcolumnproperty', 'MLTitle', 'width', '20%');
                action = 'showcolumn';
            }
            else {
                this.$container.jqxGrid('setcolumnproperty', 'MLTitle', 'width', '40%');
            }
            this.$container.jqxGrid(action, 'edit');
            this.$container.jqxGrid(action, 'delete');
            this.editEnabled = editable;
        }
        //END Render - creation

        //Validation
       /* DSDTable.prototype.showValidationResults = function (valRes) {
            this.resetValidationResults();
            if (!valRes)
                return;
            if (valRes.length == 0)
                return;

            var rows = this.$container.jqxGrid('getdisplayrows');
            var htmlRows = this.$container.find("div[role='row']");

            var errMsg = " ";
            for (var i = 0; i < valRes.length; i++) {*/



                /*
                UNCOMMENT THIS WHEN A WORKING CLASS IS ASSIGNED TO THE CELL
                */
                /*if (valRes[i].colId) {//has a col ID (the error is in a column)
                    var rIdx = getRowIndexByID(rows, valRes[i].colId);
                    this.$container.jqxGrid('setcellvalue', rIdx, "err", 'e');
                }*/


                /*

                OR

                UNCOMMENT THIS WHEN THE ERROR COLOR IS WORKING AGAIN
                if (valRes[i].colId) {
                    var rIdx = getRowIndexByID(rows, valRes[i].colId);
                    if (rIdx != -1)
                        changeRowBackgroundColor(htmlRows[rIdx], "error");
                }
                else {
                    //TODO: show the validation results somewhere on the interface


                    //alert(valRes[i].message);
                    alert(mlRes[valRes[i].message]);
                }*/



        /*
                if (!valRes[i].field)
                    errMsg = errMsg + mlRes[valRes[i].message] + "\n";
                else
                    errMsg = errMsg + valRes[i].field + " " + mlRes[valRes[i].message] + "\n";
            }

            //alert(errMsg);
        }*/

        /*DSDTable.prototype.resetValidationResults = function () {
            var htmlRows = this.$container.find("div[role='row']");
            if (htmlRows)
                for (var r = 0; r < htmlRows.length; r++)
                    changeRowBackgroundColor(htmlRows[r], "normal");
        }*/

        var getRowIndexByID = function (rows, id) {
            if (!rows)
                return -1;
            for (var i = 0; i < rows.length; i++)
                if (rows[i].id == id)
                    return i;
            return -1;
        }

        function changeRowBackgroundColor(htmlRow, color) {
            var tds = $(htmlRow).find("div[role='gridcell']");
            for (var i = 0; i < tds.length; i++)
                changeCellBackgroundColor(tds[i], color);
        }

        function changeCellBackgroundColorByColId(htmlRow, colId, color) {
            var index = $tblValues.jqxGrid('getcolumnindex', colId);
            var tds = $(htmlRow).find("div[role='gridcell']");
            changeCellBackgroundColor(tds[index], color);
        }

        function changeCellBackgroundColor(htmlCell, color) {
            if (color == "error")
                $(htmlCell).addClass("fx-red-cell");
            else if (color == "normal")
                $(htmlCell).removeClass("fx-red-cell");
        }

        //END Validation


        //Get/Set cols
        DSDTable.prototype.setColumns = function (columns) {
            this.cols.length = 0;
            if (columns)
                for (var i = 0; i < columns.length; i++)
                    this.cols.push(columns[i]);
            this.refreshColumns();
        }
        DSDTable.prototype.getColumns = function () {
            //VALIDATE
            return this.cols;
        }

        DSDTable.prototype.reset = function () {
            this.colAddDelEnabled = true;
            this.cols.length = 0;
            this.refreshColumns();
        }
        DSDTable.prototype.refreshColumns = function () {
            this.$container.jqxGrid({ source: this.dataAdapter });
        }

        DSDTable.prototype.ColumnAddDeleteEnabled = function (enabled) {
            this.colAddDelEnabled = enabled;
            if (enabled)
                this.$container.jqxGrid('showcolumn', 'delete');
            else
                this.$container.jqxGrid('hidecolumn', 'delete');
        }
        DSDTable.prototype.destroy = function () {
            this.$container.jqxGrid('destroy');
        }

        //Helpers
        var findColById = function (cols, id) {
            var idx = findColIndexById(cols, id)
            if (idx == -1)
                return null;
            return cols[idx];
        }
        var findColIndexById = function (cols, id) {
            if (!cols)
                return -1;
            for (var i = 0; i < cols.length; i++)
                if (cols[i].id == id)
                    return i;
            return -1;
        }

        var mlLabelToString = function (mlLabel) {
            if (!mlLabel)
                return "";
            var toRet = "";
            for (l in mlLabel)
                toRet += l + ": " + mlLabel[l] + "</br>";
            toRet = toRet.substring(0, toRet.length - ("</br>").length);
            return toRet;
        }
        var periodToString = function (p) {
            //LOCALIZE!
            var toRet;
            switch (p.from.length) {
                case 8:
                    toRet = p.from.substring(6, 8) + "/" + p.from.substring(4, 6) + "/" + p.from.substring(0, 4) + " - " + p.to.substring(6, 8) + "/" + p.to.substring(4, 6) + "/" + p.to.substring(0, 4);
                    break;
                case 6:
                    toRet = p.from.substring(4, 6) + "/" + p.from.substring(0, 4) + " - " + p.to.substring(4, 6) + "/" + p.to.substring(0, 4);
                    break;
                case 4:
                    toRet = p.from + " - " + p.to;
                    break;
            }
            return toRet;
        }

        DSDTable.prototype.doML = function () {
        }
        //END Multilang

        return DSDTable;
    });