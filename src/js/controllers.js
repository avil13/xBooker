xApp.controller('BodyCtrl', function($scope) {
    $scope.list = [{
        name: 'jon',
        surname: 'Asmith',
        money: 1000
    }, {
        name: 'Alex',
        surname: 'Pi',
        money: 2000
    }, {
        name: 'Gektor',
        surname: 'xPo',
        money: 3000
    }];

    $scope.sortFilter = 'name';
    $scope.reverse = true;
});


xApp.controller('menuCtrl', ['$scope', '$location', '$route',
    function($scope, $location, $route) {

        $scope.Menu = [{
            url: '#/spending',
            name: 'Расходы'
        }, {
            url: '#/profit',
            name: 'Доходы'
        }, {
            url: '#/plans',
            name: 'Планы'
        }, {
            url: '#/graphik',
            name: 'Графики'
        }];

        $scope.activePath = null;

        $scope.$on('$routeChangeSuccess', function() {
            $scope.activePath = '#' + $location.path();
        });

    }
]);



xApp.controller('spendingCtrl', ['$scope', '$http',
    function($scope, $http) {
        $http.get('groups.json').success(function(data) {
            $scope.groups = data;
            $scope.select = $scope.groups[0];
        });

        $scope.spending_date = new Date();
        $scope.money = '';
        $scope.comment = '';


        $scope.getData = function() {
            if ($scope.money === '') {
                alert('Вы забыли указать сумму');
                return false;
            }

            var flow = {};

            flow[parseInt(($scope.spending_date.getTime() / 1000), 10) + ''] = {
                date: $scope.spending_date,
                money: $scope.money,
                category: $scope.select.value,
                name: $scope.select.name,
                comment: $scope.comment
            };

            $scope.spending_date = new Date();

            if (!br.storage.get('flow')) {
                br.storage.set('flow', {});
            }

            br.storage.extend('flow', flow);

            $scope.money = '';
            $scope.comment = '';

            console.log(br.storage.get('flow'));
        };

    }
]);



/////