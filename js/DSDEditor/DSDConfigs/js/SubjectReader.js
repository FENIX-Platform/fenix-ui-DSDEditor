﻿define(['jquery',
    'text!fx-DSDEditor/js/DSDEditor/DSDConfigs/config/Subjects.json'
],
    function ($, Subjects) {
        var defConfig = {};

        function SubjectReader(config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
            this.subjs = JSON.parse(Subjects);
        };

        SubjectReader.prototype.getSubjects = function () {
            return this.subjs;
        }
        SubjectReader.prototype.getFilteredSubjects = function (subjsValues) {
            if (!subjsValues)
                return null;
            var toRet = [];
            var toAdd;
            for (var i = 0; i < subjsValues.length; i++) {
                {
                    toAdd = this.getSubject(subjsValues[i]);
                    if (toAdd)
                        toRet.push(toAdd);
                }
            }
            return toRet;
        };
        SubjectReader.prototype.getSubject = function (subj) {
            for (var i = 0; i < this.subjs.length; i++) {
                if (this.subjs[i].value == subj)
                    return this.subjs[i];
            }
            return null;
        }
        return SubjectReader;
    })