/*global angular,firebase*/

(function () {
    'use strict';

    angular.module('angularfireChatApp').factory('Comments', ["$firebaseArray", function ($firebaseArray) {
        const commentRef = firebase.database().ref().child('comments');
        return $firebaseArray(commentRef);
    }]);
}());
