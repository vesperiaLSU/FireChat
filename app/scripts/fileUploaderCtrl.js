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

            // disable the upload button if the file is being uploaded or is already uploaded
            self.disabled = file.isUploading || file.isUploaded || file.isSuccess;

            self.upload = function () {
                $uibModalInstance.close({
                    name: self.title,
                    size: self.size,
                    comment: self.comments,
                    data: self.data
                });
            };
        }
    ]);
}());
