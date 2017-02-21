/*global angular*/

(function () {
    'use strict';

    angular.module('angularfireChatApp').factory('Confirm', ["$uibModal", function ($uibModal) {
        return {
            openModal: function (title, description, yesBtn, noBtn, confirmCallback) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/confirmModal.html',
                    controller: 'confirmCtrl as cf',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'confirm-modal',
                    resolve: {
                        data: {
                            title: title,
                            description: description,
                            yesBtn: yesBtn,
                            noBtn: noBtn
                        }
                    }
                });

                modalInstance.result.then(ret => {
                    if (ret) {
                        confirmCallback();
                    }
                }, () => {
                    console.log("cancel action");
                });
            }
        };
    }]);
}());
