var xApp = angular.module('Booker', ['ngRoute']);

xApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/spending', {
                templateUrl: 'pages/page_spending.html',
                controller: 'spendingCtrl'
            })
            .when('/profit', {
                templateUrl: 'pages/page_income.html',
                controller: 'incomeCtrl'
            })
            .when('/plans', {
                templateUrl: 'pages/page_plans.html',
                controller: 'plansCtrl'
            })
            .when('/chart', {
                templateUrl: 'pages/page_chart.html',
                controller: 'chartCtrl'
            })
            .otherwise({
                redirectTo: '/spending'
            });
    }
]);
