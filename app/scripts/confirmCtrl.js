/*global angular*/

(function () {
    'use strict';
    angular.module("angularfireChatApp").controller("confirmCtrl", ["$uibModalInstance", "data",
        function ($uibModalInstance, data) {
            var self = this;
            self.title = data.title;
            self.description = data.description;
            self.yesBtn = data.yesBtn;
            self.noBtn = data.noBtn;
            self.confirm = function () {
                $uibModalInstance.close(true);
            };
            self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);
}());
