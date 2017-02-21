/*global $,angular,firebase*/

(function () {
    'use strict';
    angular.module('angularfireChatApp').controller('MessageCtrl',
        function (profile, channelName, messages, FileUploader, $uibModal, Storage, $timeout, $scope, Comments, Files) {
            var self = this,
                files = [];

            self.profile = profile;
            self.messages = messages;
            self.channelName = channelName;
            self.message = '';
            self.type = "info";
            self.isUploading = false;
            self.isSuccess = false;
            self.isPaused = false;
            self.hasError = false;
            var uploader = self.uploader = new FileUploader({
                filters: [{
                    name: 'fileType',
                    fn: function (item) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                }, {
                    name: 'fileSize',
                    fn: function (item) {
                        return item.size < 5000000;
                    }
                }, {
                    queueLimit: 5
                }]
            });

            uploader.onAfterAddingFile = function (fileItem) {
                var isHtml5 = uploader.isHTML5;

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/uploaderModal.html',
                    controller: 'fileUploaderCtrl as fu',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'custom-modal',
                    resolve: {
                        file: fileItem,
                        isHTML5: isHtml5
                    }
                });

                modalInstance.result.then(file => {
                    self.isUploading = true;
                    Storage.upload(self.profile.$id, file).then(result => {
                        self.isSuccess = result.isSuccess;
                        self.isPaused = result.isPaused;
                        self.hasError = result.hasError;
                        if (self.isSuccess) {
                            self.type = 'success';
                            if (result.file) {
                                sendImageMessage(result.file);
                            }
                        }
                        $timeout(() => {
                            self.isUploading = false;
                            self.isPaused = false;
                            self.isSuccess = false;
                            self.hasError = false;
                            self.type = "info";
                        }, 1000);
                    });
                }, () => {
                    // modal dismissed
                });
            };

            // subscribe to messages changes, and update the files whenever a new one is posted
            $scope.$watchCollection(function () {
                return self.messages;
            }, function (newValue, oldValue) {
                var messageContainingFile = $.grep(newValue, msg => msg.file != null);
                files = $.map(messageContainingFile, msg => msg.file);
            });

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
                            uid: self.profile.$id,
                            files: files,
                            currentFile: file
                        },
                        comments: Comments(file.id).$loaded()
                    }
                });

                modalInstance.result.then(result => {
                    var currentMessage = self.messages.find(msg => {
                        return msg.file && msg.file.id === result.id;
                    });

                    if (!currentMessage.file.comments) {
                        currentMessage.file.comments = [];
                        currentMessage.body = '"' + result.comment + '"';
                    }

                    currentMessage.file.comments.push({
                        uid: self.profile.$id,
                        value: result.comment,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    });

                    self.messages.$save(currentMessage).then(ref => {
                        console.log(ref);
                    });
                }, () => {
                    // modal dismissed
                });
            };

            // send a message to the database
            self.sendMessage = function () {
                sendMessage(self.profile.$id, self.message, null);
            };

            // send image as a message to canvas
            function sendImageMessage(file) {
                sendMessage(self.profile.$id, file.comment ? '"' + file.comment.body + '"' : '', file);
            }

            // helper function for send message to firebase database
            function sendMessage(id, body, file) {
                if (body.length > 0 || file) {
                    self.messages.$add({
                        uid: id,
                        body: body,
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                        file: file ? {
                            id: file.id,
                            downloadURL: file.downloadURL,
                            name: file.name,
                            likes: file.likes,
                            uid: file.uid,
                            timestamp: file.timestamp
                        } : null
                    }).then(ref => {
                        // automatically scroll down to the bottom of the page when a new message is received
                        var objDiv = document.getElementById("messageBoard");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        self.message = '';
                        if (file) {
                            // save comments for a particular file id
                            Comments(file.id).$loaded().then(comments => {
                                comments.$add(file.comment).then(ref => {
                                    // comments added
                                });
                            });
                            // save files for a particular uid
                            Files(file.uid).$loaded().then(myFiles => {
                                myFiles.$add({
                                    id: file.id,
                                    downloadURL: file.downloadURL,
                                    name: file.name,
                                    likes: file.likes,
                                    timestamp: file.timestamp
                                }).then(ref => {
                                    // files added
                                });
                            });
                        }
                    });
                }
            }
        });
}());
