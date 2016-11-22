/*global angular,toastr,$*/
(function() {
    "use strict";

    // define the controller for Home state
    angular.module("angularfireChatApp").controller("HomeCtrl", ["$state", "$firebaseAuth", "Users",
        function($state, $firebaseAuth, Users) {

            // get a reference of the $scope
            const self = this;

            // get a referece of the firebaseAuth
            const auth = $firebaseAuth();

            // store auth info
            self.user = {
                email: '',
                password: ''
            };

            // flag to indicate whether the login or register btn is clicked
            self.clicked = false;

            auth.$onAuthStateChanged(firebaseUser => {
                if (firebaseUser) {
                    self.user.email = firebaseUser.email;
                    self.clicked = true;
                    $('#loginSection').addClass('in');
                }
            });

            // hide the login and register btn if either one is clicked
            self.hideBtn = function() {
                self.clicked = true;
            };

            // change all states of btn back to default
            self.toDefault = function() {
                self.clicked = false;
                if ($('#loginSection').hasClass('in')) {
                    $('#loginSection').removeClass('in');
                }
                if ($('#registerSection').hasClass('in')) {
                    $('#registerSection').removeClass('in');
                }

                // store auth info
                self.user = {
                    email: '',
                    password: ''
                };
            };

            // login the user
            self.login = function() {
                auth.$signInWithEmailAndPassword(self.user.email, self.user.password)
                    .then(firebaseUser => {
                        if (firebaseUser) {
                            var displayName = '';
                            Users.all.$loaded().then(function() {
                                displayName = Users.getDisplayName(firebaseUser.uid);
                                if (displayName) {
                                    toastr.success('You just signed in as: ' + displayName, 'Succeed!');
                                    $state.go('channels');
                                }
                                else {
                                    toastr.success('You just signed in as: ' + firebaseUser.email, 'Succeed!');
                                    $state.go('profile');
                                }
                            });
                        }
                        else {
                            toastr.error("Either your email or password is incorrect", 'Login Failed!');
                        }
                    })
                    .catch(error => {
                        toastr.error(error.message, 'Login Failed!');
                    });
            };

            // create and login the user
            self.register = function() {
                auth.$createUserWithEmailAndPassword(self.user.email, self.user.password)
                    .then(firebaseUser => {
                        toastr.success('You just created and signed in as: ' + firebaseUser.email, 'Succeed!');
                        $state.go('profile');
                    })
                    .catch(error => {
                        toastr.error(error.message, 'Registration Failed!');
                    });
            };
        }
    ]);
}());
