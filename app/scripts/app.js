/*global angular, firebase*/
(function() {
    'use strict';

    //Initialize Firebase
    const config = {
        apiKey: "AIzaSyA7Mm36tHp86SpUE95FR9_O__kOlFtZ-Ug",
        authDomain: "web-quickstart-ff1a5.firebaseapp.com",
        databaseURL: "https://web-quickstart-ff1a5.firebaseio.com",
        storageBucket: "",
        messagingSenderId: "233474151972"
    };
    firebase.initializeApp(config);

    angular
        .module('angularfireChatApp', ['firebase', 'angular-md5', 'ui.router'])
        .config(function($stateProvider, $urlRouterProvider, $firebaseRefProvider) {
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'views/home.html',
                    controller: 'HomeCtrl as home'
                });

            $urlRouterProvider.otherwise('/');

            $firebaseRefProvider.registerUrl({
                default: config.databaseURL,
                object: config.databaseURL + '/angular/object'
            });
        })
        .factory('rootRef', function($firebaseObject, $firebaseRef) {
            return $firebaseObject($firebaseRef.object);
        });
}());
