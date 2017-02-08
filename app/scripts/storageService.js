/* global firebase, angular */

(function () {
    'use strict';
    angular.module('angularfireChatApp').factory('Storage', ['$firebaseArray', function ($firebaseArray) {
        var imagesRef = firebase.storage().ref().child('images');
        var api = {
            upload: function (file) {
                var ref = imagesRef.child(file.name);
                var uploadTask = ref.put(file.data);
                uploadTask.on('state_changed', snapshot => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        console.log('upload is running');
                        break;
                    }
                }, error => {
                    console.log("there is an error: " + error);
                }, () => {
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    console.log('download at: ' + downloadURL);
                    var metaData = uploadTask.snapshot.metadata;
                });
            }
        };

        return api;
    }]);
}());
