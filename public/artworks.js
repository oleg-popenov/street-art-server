(function() {
    var app = angular.module('myApp', ['ngMaterial']);
    //---------------
    // Controllers
    //---------------
    app.controller('ListController', ['$scope', '$http', '$mdDialog', '$mdMedia', function($scope, $http, $mdDialog, $mdMedia) {
        $scope.reloadData = function() {
            $http.get("/artworks/").then(function(response) {
                $scope.artworks = response.data.slice(100, 150);
            });
        };
        
        $scope.reloadData();

        // this.openDetails = (artwork) => {
        //     this.modalInstance = $uibModal.open({
        //         animation: true,
        //         templateUrl: '/details.html',
        //         controller: 'DetailController as details',
        //         size: 'lg',
        //         resolve: {
        //             art: function (){
        //                 return angular.copy(artwork);
        //             }
        //         }
        //     });
        // };

        this.openDetails = function(art) {
            $mdDialog.show({
                    controller: 'DetailController as details',
                    templateUrl: '/details.html',
                    parent: angular.element(document.body),
                    targetEvent: angular.copy(art),
                    clickOutsideToClose: true,
                    locals: {
                        art: angular.copy(art)
                    }
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                    $scope.reloadData();
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                    $scope.reloadData();
                });
        };

    }]);

    // modal   
    app.controller('DetailController', ['art', '$mdDialog', '$scope', '$http', function(art, $mdDialog, $scope, $http) {
        this.artwork = art;
        this.isRendered = false;
        this.statuses = [{
            id: 0,
            name: "Artwork is Available"
        }, {
            id: 1,
            name: "Artwork is Stolen"
        }, {
            id: 2,
            name: "Artwork is Destroyed"
        }];
        this.cancel = function() {
            $mdDialog.cancel();
        };

        this.delete = function() {
            $http.delete("/artworks/" + this.artwork.id)
            .then(function(response) {});
            $mdDialog.hide('update');
        }

        $scope.uploadImage = function(file) {

            if (!file) return;
            alert(file);
            var reader = new FileReader();
        };

        // $uibModalInstance.rendered.then(function(){
        //     this.rendered = true;
        // });
    }]);

    app.decorator('mdButtonDirective', ['$delegate',
        function($delegate) {
            var getTemplate = $delegate[0].template;
            $delegate[0].template = function($element, $attrs) {
                if ($attrs.type === 'file') {
                    return '<label class="md-button" ng-transclude></label>';
                }
                else {
                    return getTemplate($element, $attrs);
                }
            };
            return $delegate;
        }
    ]);

})();
