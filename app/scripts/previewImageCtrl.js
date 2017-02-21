/*global $,angular,toastr*/

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
        "Confirm",
        "Files",
        function ($uibModalInstance, data, comments, FileSaver, $uibModal, Comments, $scope, Confirm, Files) {
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
                        comments: Comments.forFile(self.currentFile.id).$loaded()
                    }
                });

                modalInstance.result.then(ret => {
                    self.commentCount = ret.commentCount;
                }, () => {
                    // modal dismissed
                });
            };

            self.deletePic = function () {
                var callback = function () {
                    // delete all comments associated with this file
                    Comments.forObj(self.currentFile.id).$loaded().then(ref => {
                        ref.$remove().then(ref => {
                            // comments removed for this file
                        }, error => toastr.error(error.message, 'Failed to delete comments for file: ' + self.currentFile.name));
                    }, error => toastr.error(error.message, 'Failed to load comments for file: ' + self.currentFile.name));

                    // delete current file from the user's file archive
                    Files(data.uid).$loaded().then(ref => {
                        var toDelete = ref.find(file => {
                            return file.id === self.currentFile.id;
                        });

                        ref.$remove(toDelete).then(ref => {
                            // file deleted
                        }, error => toastr.error(error.message, 'Failed to delete file: ' + self.currentFile.name));
                    }, error => toastr.error(error.message, 'Failed to load files for user'));

                    // send current file's id back to message ctrl to delete the message
                    // that contains this file
                    $uibModalInstance.close({
                        fileId: self.currentFile.id,
                        name: self.currentFile.name
                    });
                };

                Confirm.openModal(
                    'Delete Picture: ' + self.currentFile.name + ' ?',
                    'File that has been deleted cannot be restored, and all comments associated with this file will ' +
                    'be deleted as well. Are you sure you want to delete?',
                    'Delete',
                    'Cancel',
                    callback
                );
            };

            // helper to update preview modal
            function updatePreview(currentFile) {
                self.url = currentFile.downloadURL;
                self.showDelete = currentFile.uid === data.uid;
                fileName = currentFile.name;
                Comments.forFile(currentFile.id).$loaded().then(ret => {
                    self.comments = ret;
                    self.commentCount = self.comments.length;
                }, error => toastr.error(error.message, 'Failed to load comments for file: ' + currentFile.name));
            }
        }
    ]);
}());
