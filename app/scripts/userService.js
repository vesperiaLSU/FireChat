/*global angular,firebase*/

(function () {
    angular.module('angularfireChatApp').factory('Users', function ($firebaseArray, $firebaseObject) {

        // get a reference of the firebase database with users object
        var usersRef = firebase.database().ref().child('users');

        // get a reference of the firebase's internal info data
        var connectedRef = firebase.database().ref().child('.info/connected');
        var users = $firebaseArray(usersRef);

        var Users = {
            getProfile: function (uid) {
                return $firebaseObject(usersRef.child(uid));
            },
            getDisplayName: function (uid) {
                if (users.$getRecord(uid)) {
                    return users.$getRecord(uid).displayName;
                }
                else {
                    return '';
                }
            },
            getGravatar: function (uid) {
                return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
            },
            setOnline: function (uid) {
                var connected = $firebaseObject(connectedRef);
                var online = $firebaseObject(usersRef.child(uid + '/online'));

                connected.$watch(function () {
                    if (connected.$value === true && !online.$value) {
                        online.$value = true;
                        online.$save().then(function (connectedRef) {
                            connectedRef.onDisconnect().remove();
                        });
                    }
                });
            },
            all: users
        };

        return Users;
    });
}());
