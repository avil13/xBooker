var xApp = angular.module('Booker', ['ngRoute']);

xApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/spending', {
                templateUrl: 'pages/page_1.html',
                controller: 'spendingCtrl'
            })
            .when('/profit', {
                templateUrl: 'pages/page_2.html',
                controller: 'BodyCtrl'
            })
            .when('/plans', {
                templateUrl: 'pages/page_1.html',
                controller: 'BodyCtrl'
            })
            .when('/graphik', {
                templateUrl: 'pages/page_2.html',
                controller: 'BodyCtrl'
            })
            .otherwise({
                redirectTo: '/spending'
            });
    }
]);