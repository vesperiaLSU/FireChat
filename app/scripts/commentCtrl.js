/*global toastr,angular,firebase*/

(function () {
    'use strict';
    angular.module("angularfireChatApp").controller("commentCtrl", ["data", "comments", "Users", "$uibModalInstance",
        function (data, comments, Users, $uibModalInstance) {
            var self = this;
            self.downloadURL = data.currentFile.downloadURL;
            self.postedBy = data.currentFile.uid ? data.currentFile.uid : data.uid;
            self.postedDate = data.currentFile.timestamp;
            self.comments = comments;
            self.uid = data.uid;
            self.getGravatar = Users.getGravatar;
            self.getDisplayName = Users.getDisplayName;
            self.close = function () {
                $uibModalInstance.close({
                    commentCount: self.comments.length
                });
            };
            self.emptyComment = false;
            self.postComment = function () {
                if (self.commentTxt && self.commentTxt.length > 0) {
                    self.emptyComment = false;
                    self.comments.$add({
                        uid: self.uid,
                        body: self.commentTxt,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    }).then(ref => {
                        // comment posted successfully
                    }, error => {
                        toastr.error(error.message, 'Failed to post a comment');
                    });
                    self.commentTxt = '';
                }
                else {
                    self.emptyComment = true;
                }
            };

            self.commentChange = function () {
                if (self.commentTxt && self.commentTxt.length > 0 && self.emptyComment) {
                    self.emptyComment = false;
                }
            };
        }
    ]);
}());
