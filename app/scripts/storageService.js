/* global firebase, angular */

(function () {
    'use strict';
    angular.module('angularfireChatApp').factory('Storage', ['$firebaseArray', function ($firebaseArray) {
        var imagesRef = firebase.storage().ref().child('images');

        return {
            // fetch messages for specific channel
            forChannel: function (channelId) {
                return $firebaseArray(channelMessageRef.child(channelId));
            },

            // fetch direct messages between two users
            forUser: function (uid1, uid2) {
                var path = uid1 < uid2 ? uid1 + '/' + uid2 : uid2 + '/' + uid1;
                return $firebaseArray(userMessageRef.child(path));
            }
        };
    }]);
}());
