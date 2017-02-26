/*global angular,toastr,$*/

(function () {
    'use strict';
    angular.module("angularfireChatApp").controller("MyFilesCtrl", ['myFiles', 'uid', 'Comments', '$uibModal', 'Message', '$state',
        function (myFiles, uid, Comments, $uibModal, Message, $state) {
            var self = this;
            self.myFiles = myFiles;

            self.close = function () {
                $state.go('channels');
            };

            self.viewImage = function (file) {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'views/previewModal.html',
                    controller: 'previewImageCtrl as pi',
                    backdrop: true,
                    keyboard: true,
                    size: 'dynamic',
                    windowClass: 'pic-modal',
                    resolve: {
                        data: {
                            uid: uid,
                            files: self.myFiles,
                            currentFile: file,
                            isMyFile: true
                        },
                        comments: Comments.forFile(file.id).$loaded()
                    }
                });

                modalInstance.result.then(ret => {
                    Message.forChannel(file.channelId).$loaded().then(messages => {
                        if (messages.length > 0) {
                            var toDelete = messages.find(msg => {
                                return msg.file && msg.file.id === ret.fileId;
                            });

                            if (toDelete) {
                                messages.$remove(toDelete).then(ref => {
                                    toastr.success('Picture deleted: ' + ret.name, 'Succeed!');
                                }, error => toastr.error(error.message, 'Failed to delete message: ' + toDelete.$id));
                            }
                        }
                    });

                    Message.forUser(uid, file.channelId).$loaded().then(messages => {
                        if (messages.length > 0) {
                            var toDelete = messages.find(msg => {
                                return msg.file && msg.file.id === ret.fileId;
                            });

                            if (toDelete) {
                                messages.$remove(toDelete).then(ref => {
                                    toastr.success('Picture deleted: ' + ret.name, 'Succeed!');
                                }, error => toastr.error(error.message, 'Failed to delete message: ' + toDelete.$id));
                            }
                        }
                    });
                }, () => {
                    // modal dismissed
                });
            };
        }
    ]);
}());
