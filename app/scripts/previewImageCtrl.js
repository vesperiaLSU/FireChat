/*global $,angular*/

(function () {
    'use strict';
    angular.module("angularfireChatApp").controller("previewImageCtrl", [
        "$uibModalInstance",
        "data",
        "comments",
        "FileSaver",
        "$uibModal",
        "Comments",
        "$scope",
        function ($uibModalInstance, data, comments, FileSaver, $uibModal, Comments, $scope) {
            var self = this,
                allFiles = data.files,
                fileName = '',
                currentindex = 0;

            self.comments = comments;
            self.currentFile = data.currentFile;
            self.showDelete = false;
            self.commentCount = self.comments.length;

            $scope.$watch(function () {
                return self.currentFile;
            }, function (newValue, oldValue) {
                // update the preview modal
                updatePreview(newValue);
            });

            $.each(allFiles, function (index, item) {
                if (item.id === self.currentFile.id) {
                    currentindex = index;
                    return false;
                }
            });

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
                    self.currentFile = allFiles[--currentindex];
                }
            };

            // update the preview modal if there is a next image
            self.next = function () {
                if (currentindex < allFiles.length - 1) {
                    self.currentFile = allFiles[++currentindex];
                }
            };

            self.viewComments = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/comments.html',
                    controller: 'commentCtrl as cm',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'comment-modal',
                    resolve: {
                        data: {
                            currentFile: self.currentFile,
                            uid: data.uid
                        },
                        comments: Comments(self.currentFile.id).$loaded()
                    }
                });

                modalInstance.result.then(ret => {
                    self.commentCount = ret.commentCount;
                }, () => {
                    // modal dismissed
                });
            };

            // helper to update preview modal
            function updatePreview(currentFile) {
                self.url = currentFile.downloadURL;
                self.showDelete = currentFile.uid === data.uid;
                fileName = currentFile.name;
                Comments(currentFile.id).$loaded().then(ret => {
                    self.comments = ret;
                    self.commentCount = self.comments.length;
                });
            }
        }
    ]);
}());
