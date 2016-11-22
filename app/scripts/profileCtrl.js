/*global angular,toastr*/

(function() {
    angular.module('angularfireChatApp')
        .controller('ProfileCtrl', ["$state", "md5", "currentUser", "profile",
            function($state, md5, currentUser, profile) {
                var self = this;
                self.profile = profile;
                self.btnTxt = self.profile.displayName ? 'Update display name' : 'Create a display name for chat';

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
            }
        ]);
}());
