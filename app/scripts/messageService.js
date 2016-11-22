/* global firebase, angular */

(function() {
    'use strict';
    angular.module('angularfireChatApp').factory('Message', ['$firebaseArray', function($firebaseArray) {
        var channelMessageRef = firebase.database().ref().child('channelMessage');
        var userMessageRef = firebase.database().ref().child('userMessage');

        return {
            forChannel: function(channelId) {
                return $firebaseArray(channelMessageRef.child(channelId));
            },
            forUser: function(uid1, uid2) {
                var path = uid1 < uid2 ? uid1 + '/' + uid2 : uid2 + '/' + uid1;
                return $firebaseArray(userMessageRef.child(path));
            }
        };
    }]);
}());
