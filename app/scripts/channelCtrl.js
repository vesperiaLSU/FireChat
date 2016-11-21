/*global angular,firebase*/

(function() {
    'use strict';
    angular.module('angularfireChatApp').controller('ChannelCtrl', ['$state', 'Users', 'profile', 'channels', '$firebaseAuth',
        function($state, Users, profile, channels, $firebaseAuth) {
            var self = this;
            self.profile = profile;
            self.channels = channels;
            self.getDisplayName = Users.getDisplayName;
            self.getGravatar = Users.getGravatar;

            // log out the user and return to home page
            self.logout = function() {
                const auth = $firebaseAuth();
                auth.$signOut();
                $state.go('home');
            };

            self.newChannel = {
                name: ''
            };

            self.createChannel = function() {
                self.channels.$add(self.newChannel).then(ref => {
                    $state.go('channels.messages', {
                        channelId: ref.key
                    });
                });
            };
        }
    ]);


}());
