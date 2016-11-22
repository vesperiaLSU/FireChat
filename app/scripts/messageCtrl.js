/*global angular,firebase,$*/

(function() {
    'use strict';
    angular.module('angularfireChatApp').controller('MessageCtrl', function(profile, channelName, messages) {
        var self = this;
        self.profile = profile;
        self.messages = messages;
        self.channelName = channelName;
        self.message = '';

        self.sendMessage = function() {
            if (self.message.length > 0) {
                self.messages.$add({
                    uid: self.profile.$id,
                    body: self.message,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    var objDiv = document.getElementById("messageBoard");
                    objDiv.scrollTop = objDiv.scrollHeight;
                    self.message = '';
                });
            }

        };
    });
}());
