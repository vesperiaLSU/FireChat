/* global firebase, angular */

(function () {
    'use strict';
    angular.module('angularfireChatApp').factory('Storage', ['$firebaseArray', function ($firebaseArray) {
        var imagesRef = firebase.storage().ref().child('images');
    }]);
}());
