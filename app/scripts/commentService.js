/* global firebase,angular */

(function () {
    'use strict';
    angular.module('angularfireChatApp').factory('Comments', ['$firebaseArray',
        function ($firebaseArray) {
            const channelMessageRef = firebase.database().ref().child('comments');
            return function (fileId) {
                return $firebaseArray(channelMessageRef.child(fileId));
            };
        }
    ]);
}());
