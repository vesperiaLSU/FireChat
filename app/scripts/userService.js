/*global angular,firebase*/

(function() {
    angular.module('angularfireChatApp').factory('Users', function($firebaseArray, $firebaseObject) {

        // get a reference of the firebase database with users object
        var usersRef = firebase.database().ref().child('users');
        var users = $firebaseArray(usersRef);

        var Users = {
            getProfile: function(uid) {
                return $firebaseObject(usersRef.child(uid));
            },
            getDisplayName: function(uid) {
                return users.$getRecord(uid).displayName;
            },
            getGravatar: function(uid) {
                return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
            },
            all: users
        };

        return Users;
    });
}());
