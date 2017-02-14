/*global $,angular*/

(function () {
    'use strict';
    angular.module("angularfireChatApp").controller("previewImageCtrl", ["$uibModalInstance", "data", "FileSaver",
        function ($uibModalInstance, data, FileSaver) {
            var self = this,
                allFiles = data.files,
                currentFile = data.currentFile,
                fileName = '',
                currentindex = 0;

            $.each(allFiles, function (index, item) {
                if (item.id === currentFile.id) {
                    currentindex = index;
                    return false;
                }
            });

            // initialize the preview modal
            updatePreview(currentFile);

            self.close = function () {
                $uibModalInstance.dismiss('cancel');
            };

            // download the image from cloud to local
            self.download = function () {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function (event) {
                    var blob = xhr.response;
                    FileSaver.saveAs(blob, fileName);
                };
                xhr.open('GET', self.url);
                xhr.send();
            };

            // update the preview modal of there is a previous image
            self.prev = function () {
                if (currentindex > 0) {
                    currentFile = allFiles[--currentindex];
                    updatePreview(currentFile);
                }
            };

            // update the preview modal if there is a next image
            self.next = function () {
                if (currentindex < allFiles.length - 1) {
                    currentFile = allFiles[++currentindex];
                    updatePreview(currentFile);
                }
            };

            // show the comment section
            self.addComment = function () {
                if (self.showCommentSection) {
                    self.showCommentSection = false;
                }
                else {
                    self.showCommentSection = true;
                }
            };

            // close modal and post comment to the server
            self.postComment = function () {
                $uibModalInstance.close({
                    comment: self.commentTxt,
                    id: currentFile.id
                });
            };

            // helper to update preview modal
            function updatePreview(currentFile) {
                self.url = currentFile.downloadURL;
                self.showCommentSection = false;
                fileName = currentFile.name;
            }
        }
    ]);
}());
