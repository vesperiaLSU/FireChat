/* global firebase, angular */

(function() {
    'use strict';
    angular.module('angularfireChatApp').factory('Message', ['$firebaseArray', function($firebaseArray) {
        var channelMessageRef = firebase.database().ref().child('channelMessage');

        return {
            forChannel: function(channelId) {
                return $firebaseArray(channelMessageRef.child(channelId));
            }
        };
    }]);
}());
