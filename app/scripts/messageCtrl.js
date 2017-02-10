/*global angular,firebase*/

(function () {
    'use strict';
    angular.module('angularfireChatApp').controller('MessageCtrl',
        function (profile, channelName, messages, FileUploader, $uibModal, Storage, $timeout) {
            var self = this;
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

                modalInstance.result.then(update => {
                    self.isUploading = true;
                    Storage.upload(update).then(result => {
                        self.isSuccess = result.isSuccess;
                        self.isPaused = result.isPaused;
                        self.hasError = result.hasError;
                        if (self.isSuccess) {
                            self.type = 'success';
                            if (result.downloadURL) {
                                sendImageMessage(result.name, result.downloadURL, result.comment);
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
                    console.log("modal dismissed");
                });
            };

            self.viewImage = function (fileName, url) {
                $uibModal.open({
                    animation: false,
                    templateUrl: 'views/previewModal.html',
                    controller: 'previewImageCtrl as pi',
                    backdrop: true,
                    keyboard: true,
                    size: 'dynamic',
                    windowClass: 'pic-modal',
                    resolve: {
                        file: function () {
                            return {
                                link: url,
                                name: fileName
                            };
                        }
                    }
                });
            };

            // send a message to the database
            self.sendMessage = function () {
                sendMessage(self.profile.$id, self.message, null, null);
            };

            // send image as a message to canvas
            function sendImageMessage(name, url, comment) {
                sendMessage(self.profile.$id, comment, name, url);
            }

            // helper function for send message to firebase database
            function sendMessage(id, body, fileName, url) {
                if (body.length > 0 || url) {
                    self.messages.$add({
                        uid: id,
                        body: body,
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                        filename: fileName,
                        url: url
                    }).then(() => {
                        // automatically scroll down to the bottom of the page when a new message is received
                        var objDiv = document.getElementById("messageBoard");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        self.message = '';
                    });
                }
            }
        });
}());
