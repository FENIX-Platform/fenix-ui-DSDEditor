define(['jquery',
    '../../html/comp/DynamicRadio.hbs',
    '../Events',
    'amplify-pubsub'
],
    function ($, DynamicRadioHTML, Evts, amplify) {
        var defConfig = {};
        var h = {
            idUID: '#txtUID',
            idVersion: '#txtVersion',
            idType: '#ddlType'
        };
        var evts = {
            radioChanged: Evts.DYNAMIC_RADIO_CHANGED
        };

        function DynamicRadio(config) {
            this.config = {};
            this.$container = null;
            $.extend(true, this.config, defConfig, config);
            this.groupName = null;
            this.radioSettings;
            this.$radioGroup;
            this._changed = false;
        };

        DynamicRadio.prototype.render = function (cnt, config) {
            $.extend(true, this.config, config);
            this.$container = cnt;
        };

        DynamicRadio.prototype.setRadios = function (group, radioSettings, checkedValue) {
            this.groupName = group;
            this.radioSettings = radioSettings;
            this.$container.html('');
            if (!radioSettings) return;
            if (radioSettings.length == 0) return;
            for (var i = 0; i < radioSettings.length; i++) {
                this.$container.append(createRadio(group, radioSettings[i], checkedValue));
            }

            this.$radioGroup = this.$container.find('input[name=' + group + ']:radio');
            this._bindEvents();
        };

        var createRadio = function (group, radioSetting, checkedValue) {
            var radioId = createRadioId(group, radioSetting.value);
            var $toRet = $('<span><input type="radio" name="" value="" style="display:none" /><label></label></span>');
            $toRet.find('label').text(radioSetting.text);
            $toRet.find('label').attr('for', radioId);
            $toRet.find('input').val(radioSetting.value);
            $toRet.find('input').attr('name', group);
            $toRet.find('input').attr('id', radioId);
            $toRet.prop('required', true);
            if (checkedValue && radioSetting.value == checkedValue) $toRet.find('input').attr('checked', 'checked');
            return $toRet;
        };
        var createRadioId = function (groupN, value) {
            return "rd" + groupN + "_" + value;
        };

        DynamicRadio.prototype.get = function () {
            if (!this.$radioGroup) return null;
            if (!this.$radioGroup.filter(':checked')) return null;
            return this.$radioGroup.filter(':checked').val();
        };

        DynamicRadio.prototype.set = function (toSet) {
            this.reset();
            if (!toSet) return;
            var r = this.$container.find("#" + createRadioId(this.groupName, toSet));
            r.prop('checked', true);
            amplify.publish(evts.radioChanged, toSet, this.groupName);
        };
        DynamicRadio.prototype.reset = function () {
            if (!this.$radioGroup) return;
            this.$radioGroup.prop('checked',false);
            this._changed = false;
        };
        DynamicRadio.prototype._bindEvents = function () {
            var me = this;
            $(this.$radioGroup.on('change', function () {
                var v = me.$container.find('input[name=' + me.groupName + ']:checked').val();
                amplify.publish(evts.radioChanged, v, me.groupName);
                me._changed = true;
            }));
        };
        DynamicRadio.prototype._unbindEvents = function () {
            if (this.$radioGroup) this.$radioGroup.off('change');
        };

        DynamicRadio.prototype.changed = function () {
            return this._changed;
        };

        DynamicRadio.prototype.destroy = function () {
            this._unbindEvents();
        };

        return DynamicRadio;
    })