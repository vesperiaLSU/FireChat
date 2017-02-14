/* global firebase,angular,toastr */

(function () {
    'use strict';
    angular.module('angularfireChatApp').factory('Storage', ['$q', function ($q) {
        var imagesRef = firebase.storage().ref().child('images');
        return {
            upload: function (uid, file) {
                var deferred = $q.defer();
                var ref = imagesRef.child(file.name);
                var uploadTask = ref.put(file.data);
                uploadTask.on('state_changed', snapshot => {
                    if (snapshot.state === firebase.storage.TaskState.PAUSED) {
                        deferred.resolve({
                            isPaused: true,
                            isSuccess: false,
                            hasError: false
                        });
                    }
                }, error => {
                    // callback when erro occurs
                    deferred.resolve({
                        isPaused: false,
                        isSuccess: false,
                        hasError: true
                    });
                    switch (error.code) {
                    case 'storage/unauthorized':
                        toastr.error(error.message, 'Failed to upload');
                        break;
                    case 'storage/canceled':
                        toastr.error(error.message, 'Failed to upload');
                        break;
                    case 'storage/unknown':
                        toastr.error(error.message, 'Failed to upload');
                        break;
                    }
                }, () => {
                    // callback when completed
                    // resolve the uploading task 1111
                    deferred.resolve({
                        isPaused: false,
                        isSuccess: true,
                        hasError: false,
                        file: {
                            id: uploadTask.snapshot.metadata.generation,
                            downloadURL: uploadTask.snapshot.downloadURL,
                            comments: file.comment ? [{
                                uid: uid,
                                value: file.comment
                            }] : [],
                            name: file.name
                        }
                    });
                });

                return deferred.promise;
            }
        };
    }]);
}());
