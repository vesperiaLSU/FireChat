/*global angular,toastr*/

(function () {
    'use strict';
    angular.module('angularfireChatApp').controller('ChannelCtrl', [
        '$state',
        'Users',
        'profile',
        'channels',
        'channelMessage',
        '$firebaseAuth',
        '$firebaseObject',
        'Confirm',
        function ($state, Users, profile, channels, channelMessage, $firebaseAuth, $firebaseObject, Confirm) {

            // get a reference to the channelCtrl
            var self = this;

            // get a reference to the resolved data
            self.profile = profile;
            self.channels = channels;
            self.channelMessage = channelMessage;
            self.users = Users.all;
            self.emptyChannelError = false;

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
                self.profile.$save().then(() => {
                    auth.$signOut();
                    $state.go('home');
                    toastr.warning('You just signed out as ' + self.profile.displayName, 'Succeed!');
                }, error => {
                    toastr.error(error.message, 'Failed to sign out');
                });

            };

            self.nameChange = function () {
                if (self.newChannel.name && self.newChannel.name.length > 0) {
                    self.emptyChannelError = false;
                }
            };

            // create a new channel and then enter it
            self.createChannel = function () {
                if (self.newChannel.name) {
                    self.emptyChannelError = false;
                    self.channels.$add(self.newChannel).then(ref => {
                        $state.go('channels.messages', {
                            channelId: ref.key
                        });
                        toastr.success('You just created channel: ' + self.newChannel.name, 'Succeed!');
                    }, error => {
                        toastr.error(error.message, 'Failed to create channel: ' + self.newChannel.name);
                    });
                }
                else {
                    self.emptyChannelError = true;
                }
            };

            self.deleteChannel = function (channel) {
                var callback = function () {
                    self.channels.$remove(channel).then(ref => {
                        var deleted = self.channelMessage.$getRecord(channel.$id);
                        if (deleted) {
                            self.channelMessage.$remove(deleted).then(ref => {
                                toastr.success('You just deleted channel: ' + channel.name, 'Succeed!');
                                $state.go('channels');
                            }, error => {
                                toastr.error(error.message, 'Failed to delete messages for channel: ' + channel.name);
                            });
                        }
                    }, error => {
                        toastr.error(error.message, 'Failed to delete channel: ' + channel.name);
                    });
                };

                Confirm.openModal(
                    'Delete Channel: ' + channel.name + ' ?',
                    'Channel that has been deleted cannot be restored, and all conversations from this channel will ' +
                    'be deleted as well (pictures shared can still be retrieved under Options/MyFiles). Are you sure you want to delete?',
                    'Delete',
                    'Cancel',
                    callback
                );
            };
        }
    ]);
}());
