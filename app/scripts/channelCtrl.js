/*global angular,toastr*/

(function () {
    'use strict';
    angular.module('angularfireChatApp').controller('ChannelCtrl', ['$state', 'Users', 'profile', 'channels', '$firebaseAuth',
        function ($state, Users, profile, channels, $firebaseAuth) {

            // get a reference to the channelCtrl
            var self = this;

            // get a reference to the resolved data
            self.profile = profile;
            self.channels = channels;
            self.users = Users.all;

            self.newChannel = {
                name: '',
                admin: self.profile.$id
            };

            // get a reference to the user service methods
            self.getDisplayName = Users.getDisplayName;
            self.getGravatar = Users.getGravatar;

            // change the status of the user to 'online' in the chat room
            Users.setOnline(self.profile.$id);

            // log out the user and return to home page
            self.logout = function () {
                const auth = $firebaseAuth();

                // change the user's status to offline and then save it before signing out
                self.profile.online = null;
                self.profile.$save().then(function () {
                    auth.$signOut();
                    $state.go('home');
                });
                toastr.warning('You just signed out as ' + self.profile.displayName, 'Succeed!');
            };

            // create a new channel and then enter it
            self.createChannel = function () {
                self.channels.$add(self.newChannel).then(ref => {
                    $state.go('channels.messages', {
                        channelId: ref.key
                    });
                });
            };
        }
    ]);
}());
