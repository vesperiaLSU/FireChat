/*global angular,firebase*/

(function () {
    'use strict';
    angular.module('angularfireChatApp').controller('MessageCtrl', function (profile, channelName, messages, FileUploader, $uibModal) {
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

        // uploader.onAfterAddingFile = function (fileItem) {
        //     $uibModal.open({
        //         animation: true,
        //         templateUrl: '/app/views/uploaderModal.html',
        //         controller: 'userModalCtrl',
        //         size: 'md',
        //         backdrop: 'static',
        //         keyboard: false,
        //         windowClass: 'custom-modal',
        //         openedClass: 'always-scroll',
        //         resolve: {
        //             user: {
        //                 email: scope.email,
        //                 name: scope.displayName,
        //                 avatar_url: scope.avatar_url
        //             }
        //         }
        //     })
        // };

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
