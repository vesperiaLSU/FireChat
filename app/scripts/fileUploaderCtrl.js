/*global angular*/

(function () {
    'use strict';
    angular.module("angularfireChatApp").controller("fileUploaderCtrl", ["$uibModalInstance", "file", "isHTML5",
        function ($uibModalInstance, file, isHTML5) {
            var self = this;
            self.title = file.file.name;
            self.size = file.file.size;
            self.comments = "";
            self.data = file._file;
            self.isHTML5 = isHTML5;
            self.close = function () {
                $uibModalInstance.dismiss('cancel');
            };

            self.upload = function () {
                $uibModalInstance.close({
                    title: self.title
                });
            };
        }
    ]);
}());
