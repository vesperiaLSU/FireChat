/* global firebase,angular */

(function () {
    'use strict';
    angular.module('angularfireChatApp').factory('Comments', ['$firebaseArray', '$firebaseObject',
        function ($firebaseArray, $firebaseObject) {
            const commentRef = firebase.database().ref().child('comments');
            return {
                forFile: function (fileId) {
                    return $firebaseArray(commentRef.child(fileId));
                },
                forObj: function (fileId) {
                    return $firebaseObject(commentRef.child(fileId));
                }
            };
        }
    ]);
}());
