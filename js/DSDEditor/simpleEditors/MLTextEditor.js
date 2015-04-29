/*
config format:
{langs:['EN','FR']}
*/
define([
    'jquery',
    'text!fx-DSDEditor/templates/DSDEditor/simpleEditors/MLTextEditor.htm'
],
    function ($, MLTextEditorHTML) {

        var defConfig = { langs: ['EN', 'FR'] };

        function MLTextEditor(config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
            this.$container;
            this.txtFields = [];
        };

        MLTextEditor.prototype.render = function (container, config) {
            $.extend(true, this.config, config);

            for (var i = 0; i < this.config.langs.length; i++)
                this.config.langs[i] = this.config.langs[i].toUpperCase();

            this.$container = container;
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
            for (var i = 0; i < this.config.langs.length; i++) {
                var $row = $('<tr><td>' + this.config.langs[i] + '</td><td>' + '<input type="text" name="' + idPrefix + this.config.langs[i] + '" value=""' + '</td></tr>');
                $tbody.append($row);
                txtArea = $row.find('input[name=' + idPrefix + this.config.langs[i] + ']');
                this.txtFields.push({ code: this.config.langs[i], txtArea: txtArea });
            }
        }
        //END Grid creation
        return MLTextEditor;
    }
);