/*global angular,firebase,toastr*/

(function() {
    angular.module('angularfireChatApp')
        .controller('ProfileCtrl', ["$state", "md5", "currentUser", "profile", "$firebaseAuth",
            function($state, md5, currentUser, profile, $firebaseAuth) {
                var self = this;
                const auth = $firebaseAuth();
                self.profile = profile;

                // if current user cannot be resolved, go back to home page
                if (!currentUser) {
                    $state.go('home');
                }

                // update the user profile
                self.updateProfile = function() {
                    self.profile.emailHash = md5.createHash(currentUser.email);
                    self.profile.$save().then(ref => {
                        if (ref.key === self.profile.$id) {
                            toastr.success('You updated your display name to: ' + self.profile.displayName, 'Succeed!');
                            $state.go('channels');
                        }
                    }, error => {
                        toastr.error(error.message, 'Update Failed!');
                    });
                };

                // sign off current user and then send back to home page
                self.loginWithDifferentUser = function() {
                    auth.$signOut();
                    $state.go('home');
                };

            }
        ]);
}());
