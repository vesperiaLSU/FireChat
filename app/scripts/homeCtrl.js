/*global angular, $*/
(function() {
    "use strict";

    angular.module("angularfireChatApp").controller("HomeCtrl", ["$state", "$firebaseAuth", "rootRef",
        function($state, $firebaseAuth, rootRef) {

            // tes test
            // get a reference of the $scope
            const self = this;

            // get a referece of the firebaseAuth
            const auth = $firebaseAuth();

            // listener added for when auth state changed
            auth.$onAuthStateChanged(firebaseUser => {
                if (firebaseUser) {
                    console.log("Already signed in as: ", firebaseUser.uid);
                }
                else {
                    console.log("Signed out");
                }
            });

            // store auth info
            self.user = {
                email: '',
                password: ''
            };

            // flag to indicate whether the login or register btn is clicked
            self.clicked = false;

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
            };

            // login the user
            self.login = function() {
                auth.$signInWithEmailAndPassword(self.user.email, self.user.password)
                    .then(firebaseUser => console.log("signed in as: ", firebaseUser.uid))
                    .catch(error => console.log("Authentication failed: ", error));
            };

            // create and login the user
            self.register = function() {
                auth.$createUserWithEmailAndPassword(self.user.email, self.user.password)
                    .then(firebaseUser => console.log("User " + firebaseUser.uid + " create successfully"))
                    .catch(error => console.log("Error: ", error));
            };
        }
    ]);
}());
