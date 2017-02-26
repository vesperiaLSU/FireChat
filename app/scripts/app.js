/*global angular,toastr,firebase*/
(function () {
    'use strict';

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC2tM3hbzyQjjUeZ5tboZAM6eaSKSxHMz0",
        authDomain: "firechat-d57d5.firebaseapp.com",
        databaseURL: "https://firechat-d57d5.firebaseio.com",
        storageBucket: "firechat-d57d5.appspot.com",
        messagingSenderId: "77056511474"
    };
    firebase.initializeApp(config);

    // initialize the duration time [milliseconds] of toastr
    toastr.options.timeOut = 3000;

    // initialize the configuration of app
    angular
        .module('angularfireChatApp', ['firebase', 'angular-md5', 'ui.router', 'angularFileUpload', 'ui.bootstrap', 'ngFileSaver'])
        .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

            // $locationProvider.html5Mode({
            //     enabled: true,
            //     requireBase: false
            // });

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
                        channels: function (Channels) {
                            return Channels.channels.$loaded();
                        },
                        profile: function ($state, Users, $firebaseAuthService) {
                            return $firebaseAuthService.$requireSignIn().then(user => {
                                if (user) {
                                    return Users.getProfile(user.uid).$loaded().then(profile => {
                                        if (profile.displayName) {
                                            return profile;
                                        }
                                        else {
                                            $state.go('profile');
                                            toastr.warning('A display name is required before chatting', 'Reminder!');
                                        }
                                    }, error => $state.go('home'));
                                }
                            }, error => {
                                $state.go('home');
                                toastr.warning('You need to sign in first', 'Oops!');
                            });
                        },
                        channelMessage: function (Channels) {
                            return Channels.channelMessage.$loaded();
                        }
                    }
                })
                .state('channels.messages', {
                    url: '/{channelId}/messages',
                    controller: 'MessageCtrl as message',
                    templateUrl: 'views/messageBoard.html',
                    resolve: {
                        messages: function ($stateParams, Message) {
                            return Message.forChannel($stateParams.channelId).$loaded();
                        },
                        channelName: function ($stateParams, channels) {
                            return '#' + channels.$getRecord($stateParams.channelId).name;
                        },
                        channelId: function ($stateParams) {
                            return $stateParams.channelId;
                        }
                    }
                })
                .state('channels.direct', {
                    url: '/{uid}/messages/direct',
                    templateUrl: 'views/messageBoard.html',
                    controller: 'MessageCtrl as message',
                    resolve: {
                        messages: function ($stateParams, Message, profile) {
                            return Message.forUser($stateParams.uid, profile.$id).$loaded();
                        },
                        channelName: function ($stateParams, Users) {
                            return Users.all.$loaded().then(function () {
                                return '@' + Users.getDisplayName($stateParams.uid);
                            });
                        },
                        channelId: function ($stateParams) {
                            return $stateParams.uid;
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
                        profile: function ($state, Users, $firebaseAuthService) {
                            // get a referece of the firebaseAuth
                            return $firebaseAuthService.$requireSignIn().then(user => {
                                if (user) {
                                    return Users.getProfile(user.uid).$loaded();
                                }
                                else {
                                    $state.go('home');
                                    toastr.warning('You need to sign in first', 'Oops!');
                                }
                            }, error => {
                                $state.go('home');
                                toastr.warning('You need to sign in first', 'Oops!');
                            });
                        },
                        currentUser: function ($state, $firebaseAuthService) {
                            return $firebaseAuthService.$requireSignIn().then(user => {
                                return user;
                            }, error => {
                                $state.go('home');
                                toastr.warning('You need to sign in first', 'Oops!');
                            });
                        }
                    }
                })
                .state('myFiles', {
                    url: '/myFiles',
                    templateUrl: 'views/myFiles.html',
                    controller: 'MyFilesCtrl as mf',
                    resolve: {
                        Files: 'Files',
                        myFiles: function ($state, Files, $firebaseAuthService) {
                            return $firebaseAuthService.$requireSignIn().then(user => {
                                if (user) {
                                    return Files(user.uid).$loaded();
                                }
                                else {
                                    $state.go('home');
                                    toastr.warning('You need to sign in first', 'Oops!');
                                }
                            }, error => {
                                $state.go('home');
                                toastr.warning('You need to sign in first', 'Oops!');
                            });
                        },
                        uid: function ($firebaseAuthService) {
                            return $firebaseAuthService.$requireSignIn().then(user => {
                                if (user) {
                                    return user.uid;
                                }
                            });
                        }
                    }
                });

            $urlRouterProvider.otherwise('/');
        }).filter('reverse', function () {
            return function (items) {
                if (items && items.length > 0) {
                    return items.slice().reverse();
                }
            };
        });
}());
