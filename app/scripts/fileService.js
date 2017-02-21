/* global firebase,angular */

(function () {
    'use strict';
    angular.module('angularfireChatApp').factory('Files', ['$firebaseArray',
        function ($firebaseArray) {
            const fileRef = firebase.database().ref().child('files');
            return function (uid) {
                return $firebaseArray(fileRef.child(uid));
            };
        }
    ]);
}());
