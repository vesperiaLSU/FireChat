/*global angular,firebase*/

(function () {
    'use strict';

    angular.module('angularfireChatApp').factory('Channels', ["$firebaseArray", function ($firebaseArray) {
        const channelsRef = firebase.database().ref().child('channels');
        const channelMessageRef = firebase.database().ref().child('channelMessage');
        return {
            channels: $firebaseArray(channelsRef),
            channelMessage: $firebaseArray(channelMessageRef)
        };
    }]);
}());
