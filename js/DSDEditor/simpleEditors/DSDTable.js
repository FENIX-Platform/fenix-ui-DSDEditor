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
            this.$container.on('initialized', function () {
                me.ColumnAddDeleteEnabled(me.colAddDelEnabled);
            });

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
                {
                    text: mlRes['edit'], dataField: 'edit', width: '10%', columntype: 'button', cellsrenderer: function () {
                        return mlRes['edit'];
                    }, buttonclick: function (row) {
                        me.rowClicked(row, 'edit');
                    }
                },
                { text: 'id', dataField: 'id', displayField: 'id', hidden: true },
                { text: mlRes['title'], dataField: 'MLTitle', width: '10%' },
                { text: mlRes['subject'], dataField: 'subject', width: '10%' },
                { text: mlRes['key'], dataField: 'key', columntype: 'checkbox', width: '10%' },
                { text: mlRes['datatype'], dataField: 'dataType', width: '10%' },
                { text: mlRes['domain'], dataField: 'tmp_domain', width: '10%' },
                { text: mlRes['supplemental'], dataField: 'MLSupplemental', width: '20%' },
                {
                    text: mlRes['delete'], dataField: 'delete', columntype: 'button', width: '20%', cellsrenderer: function () {
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
        //END Render - creation

        //Validation
        DSDTable.prototype.showValidationResults = function (valRes) {
            this.resetValidationResults();
            if (!valRes)
                return;
            if (valRes.length == 0)
                return;

            

            var rows = this.$container.jqxGrid('getdisplayrows');
            var htmlRows = this.$container.find("div[role='row']");
            for (var i = 0; i < valRes.length; i++) {
                if (valRes[i].colId) {
                    var rIdx = getRowIndexByID(rows, valRes[i].colId);
                    if (rIdx != -1)
                        changeRowBackgroundColor(htmlRows[rIdx], "Red");
                }
                else {
                    //TODO: show the validation results somewhere on the interface
                    alert(valRes[i].message);
                }
            }
        }
        DSDTable.prototype.resetValidationResults = function () {
            var htmlRows = this.$container.find("div[role='row']");
            if (htmlRows)
                for (var r = 0; r < htmlRows.length; r++)
                    changeRowBackgroundColor(htmlRows[r], "");
        }

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
            $(htmlCell).addClass("fx-red-cell");
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