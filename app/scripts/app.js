/*global angular,toastr,firebase*/
(function() {
    'use strict';

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC2tM3hbzyQjjUeZ5tboZAM6eaSKSxHMz0",
        authDomain: "firechat-d57d5.firebaseapp.com",
        databaseURL: "https://firechat-d57d5.firebaseio.com",
        storageBucket: "",
        messagingSenderId: "77056511474"
    };
    firebase.initializeApp(config);

    // initialize the duration time [milliseconds] of toastr
    toastr.options.timeOut = 5000;

    // initialize the configuration of app
    angular
        .module('angularfireChatApp', ['firebase', 'angular-md5', 'ui.router'])
        .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'views/home.html',
                    controller: 'HomeCtrl as home'
                })
                .state('channels', {
                    url: '/channel',
                    controller: 'ChannelCtrl as channel',
                    templateUrl: 'views/channel.html',
                    resolve: {
                        Users: 'Users',
                        Channels: 'Channels',
                        channels: function(Channels) {
                            return Channels.$loaded();
                        },
                        profile: function($state, Users) {
                            var firebaseUser = firebase.auth().currentUser;
                            if (!firebaseUser) {
                                $state.go('home');
                            }

                            return Users.getProfile(firebaseUser.uid).$loaded().then(profile => {
                                if (profile.displayName) {
                                    return profile;
                                }
                                else {
                                    $state.go('profile');
                                }
                            }, error => $state.go('home'));
                        }
                    }
                })
                .state('channels.messages', {
                    url: '/{channelId}/messages',
                    controller: 'MessageCtrl as message',
                    templateUrl: 'views/messageBoard.html',
                    resolve: {
                        messages: function($stateParams, Message) {
                            return Message.forChannel($stateParams.channelId).$loaded();
                        },
                        channelName: function($stateParams, channels) {
                            return '#' + channels.$getRecord($stateParams.channelId).name;
                        }
                    }
                })
                .state('channels.direct', {
                    url: '/{uid}/messages/direct',
                    templateUrl: 'views/messageBoard.html',
                    controller: 'MessageCtrl as message',
                    resolve: {
                        messages: function($stateParams, Message, profile) {
                            return Message.forUser($stateParams.uid, profile.$id).$loaded();
                        },
                        channelName: function($stateParams, Users) {
                            return Users.all.$loaded().then(function() {
                                return '@' + Users.getDisplayName($stateParams.uid);
                            });
                        }
                    }
                })
                .state('channels.create', {
                    url: '/create',
                    templateUrl: 'views/create.html',
                    controller: 'ChannelCtrl as channel'
                })
                .state('profile', {
                    url: '/profile',
                    templateUrl: 'views/profile.html',
                    controller: 'ProfileCtrl as profile',
                    resolve: {
                        Users: 'Users',
                        profile: function($state, Users) {
                            // get a referece of the firebaseAuth
                            var firebaseUser = firebase.auth().currentUser;
                            if (!firebaseUser) {
                                $state.go('home');
                            }

                            return Users.getProfile(firebaseUser.uid).$loaded();
                        },
                        currentUser: function() {
                            return firebase.auth().currentUser;
                        }
                    }

                });

            $urlRouterProvider.otherwise('/');
        });
}());
