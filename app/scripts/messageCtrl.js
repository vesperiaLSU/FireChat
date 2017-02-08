/*global angular,firebase*/

(function () {
    'use strict';
    angular.module('angularfireChatApp').controller('MessageCtrl', function (profile, channelName, messages, FileUploader, $uibModal, Storage) {
        var self = this;
        self.profile = profile;
        self.messages = messages;
        self.channelName = channelName;
        self.message = '';
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
            }]
        });

        uploader.filters.push({
            queueLimit: 5
        });

        uploader.onAfterAddingFile = function (fileItem) {
            var isHtml5 = uploader.isHTML5;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/app/views/uploaderModal.html',
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
                Storage.upload(update);
            }, () => {
                console.log("modal dismissed");
            });
        };

        // send a message to the database
        self.sendMessage = function () {
            if (self.message.length > 0) {
                self.messages.$add({
                    uid: self.profile.$id,
                    body: self.message,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    // automatically scroll down to the bottom of the page when a new message is received
                    var objDiv = document.getElementById("messageBoard");
                    objDiv.scrollTop = objDiv.scrollHeight;
                    self.message = '';
                });
            }
        };

        // post a pic to the server for downlaod
        self.addPic = function () {

        };
    });
}());
