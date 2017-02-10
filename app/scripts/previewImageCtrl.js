/*global angular*/

(function () {
    'use strict';
    angular.module("angularfireChatApp").controller("previewImageCtrl", ["$uibModalInstance", "file", "FileSaver",
        function ($uibModalInstance, file, FileSaver) {
            var self = this;
            self.url = file.link;
            self.close = function () {
                $uibModalInstance.dismiss('cancel');
            };
            self.download = function () {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function (event) {
                    var blob = xhr.response;
                    FileSaver.saveAs(blob, file.name);
                };
                xhr.open('GET', self.url);
                xhr.send();
            };
        }
    ]);
}());
