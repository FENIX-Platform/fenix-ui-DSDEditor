define([
    'jquery',
    'text!fx-DSDEditor/templates/DSDEditor/simpleEditors/MLTextEditor.htm'
],
    function ($, MLTextEditorHTML) {
        function MLTextEditor() {
            this.$container;
            this.langs = ['EN', 'FR'];

            this.txtFields = [];
        };

        MLTextEditor.prototype.render = function (container, langCodes) {
            this.$container = container;
            if (langCodes)
                this.langs = langCodes;
            this.$container.html(MLTextEditorHTML);
            this.createGrid();
        }

        MLTextEditor.prototype.reset = function () {
            for (var i = 0; i < this.txtFields.length; i++)
                this.txtFields[i].txtArea.val("");
        }
        MLTextEditor.prototype.setLabels = function (labels) {
            this.reset();
            for (var i = 0; i < this.txtFields.length; i++) {
                if (this.txtFields[i].code in labels)
                    this.txtFields[i].txtArea.val(labels[this.txtFields[i].code]);
            }
        }
        MLTextEditor.prototype.getLabels = function () {
            var toRet = {};
            for (var i = 0; i < this.txtFields.length; i++) {
                var val = this.txtFields[i].txtArea.val().trim();
                if (val != "")
                    toRet[this.txtFields[i].code] = val;
            }
            if ($.isEmptyObject(toRet))
                return null;
            return toRet;
        }

        //Grid creation
        MLTextEditor.prototype.createGrid = function () {
            this.txtFields = [];
            var idPrefix = 'MLTextEditor_';
            var $tbody = this.$container.find('tbody');
            for (var i = 0; i < this.langs.length; i++) {
                var $row = $('<tr><td>' + this.langs[i] + '</td><td>' + '<input type="text" name="' + idPrefix + this.langs[i] + '" value=""' + '</td></tr>');
                $tbody.append($row);
                txtArea = $row.find('input[name=' + idPrefix + this.langs[i] + ']');
                this.txtFields.push({ code: this.langs[i], txtArea: txtArea });
            }
        }
        //END Grid creation
        return MLTextEditor;
    }
);