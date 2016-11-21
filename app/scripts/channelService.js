/*global angular,firebase*/

(function() {
    'use strict';

    angular.module('angularfireChatApp').factory('Channels', ["$firebaseArray", function($firebaseArray) {
        const channelsRef = firebase.database().ref().child('channels');
        return $firebaseArray(channelsRef);
    }]);
}());
