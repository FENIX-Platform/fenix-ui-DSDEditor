define(['jquery',
    '../html/DSDDisplay.html',
    './comp/AddColButton',
    './comp/ColsDisplay',
    '../../../../nls/labels'
],

    function ($, DSDDisplayHTML, AddColButton, ColsDisplay, MLRes) {
        var defConfig = {};
        var h = {
            idTDAddDim: '#tdAddDim',
            idTDAddVal: '#tdAddVal',
            idTDAddOther: '#tdAddOther',
            idColsDisplay: '#colsDisplay',
            idTblAddCol:'#tblAddCol'
        };

        function DSDDisplay(config) {
            this.config = {};
            this.$container = null;
            $.extend(true, this.config, defConfig, config);

            this.$tdAddDim = null;
            this.$tdAddVal = null;
            this.$tdAddOther = null;
            this.$colsDisplay = null;

            this.lang = this.config.lang.toLowerCase();

            this.addColBtnDim = new AddColButton(this.config);
            this.addColBtnVal = new AddColButton(this.config);
            this.addColBtnOther = new AddColButton(this.config);
            this.colsDisplay = new ColsDisplay(this.config);

        };

        DSDDisplay.prototype.render = function (cnt, config) {
            $.extend(true, this.config, config);
            this.$container = cnt;
            this.$container.html(DSDDisplayHTML);

            this.$tdAddDim = this.$container.find(h.idTDAddDim);
            this.$tdAddVal = this.$container.find(h.idTDAddVal);
            this.$tdAddOther = this.$container.find(h.idTDAddOther);
            this.$colsDisplay = this.$container.find(h.idColsDisplay);

            this.addColBtnDim.render(this.$tdAddDim);
            this.addColBtnVal.render(this.$tdAddVal);
            this.addColBtnOther.render(this.$tdAddOther);

            this.addColBtnDim.set({
                title: MLRes[this.lang]['dimension'],
                help: MLRes[this.lang]['helpDim'],
                evtId: 'addDim',
                headerClass:'bg-dim'
            });
            this.addColBtnVal.set({
                title: MLRes[this.lang]['value'],
                help: MLRes[this.lang]['helpVal'],
                evtId: 'addVal',
                headerClass: 'bg-val'
            });
            this.addColBtnOther.set({
                title: MLRes[this.lang]['other'],
                help: MLRes[this.lang]['helpOther'],
                evtId: 'addOther',
                headerClass: 'bg-other'
            });

            this.colsDisplay.render(this.$colsDisplay);
            this._bindEvents();
        };

        DSDDisplay.prototype.setCols = function (cols) {
            this.reset();
            this.colsDisplay.set(cols);
        };
        DSDDisplay.prototype.reset = function () {
            this.colsDisplay.reset();
        };

        DSDDisplay.prototype._bindEvents = function () {};
        DSDDisplay.prototype._unbindEvents = function () { };
        DSDDisplay.prototype.destroy = function () {
            this.addColBtnDim.destroy();
            this.addColBtnVal.destroy();
            this.addColBtnOther.destroy();
            this.colsDisplay.destroy();
        };
        DSDDisplay.prototype.isEditable = function (editable) {
            // return a boolean if the dsd is editable
            if (typeof (editable) == 'boolean') {
                console.log("colsDisplay " + typeof (this.colsDisplay.editable));
                if (editable) {
                    this.$container.find(h.idTblAddCol).show();
                   // if (typeof (this.colsDisplay) == 'function') this.colsDisplay.editable(editable);
                } else {
                    this.$container.find(h.idTblAddCol).hide();
                }
                return editable;
            }
            /*
            this.colsDisplay.editable(editable);
            if (editable) {
                this.$container.find(h.idTblAddCol).show();
            } else {
                this.$container.find(h.idTblAddCol).hide();
            }
            */
        };

        return DSDDisplay;
    })