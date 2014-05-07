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


var count_prs = function(obj) {
    var count = 0;
    for (var prs in obj) {
        // debugger;
        count++;
    }
    return count;
};

var sortObj = function(obj) {

    var sortedKeys = Object.keys(obj);
    var sortedObj = {};

    sortedKeys.sort();

    for (var i = 0; i < sortedKeys.length; i++) {
        sortedObj[sortedKeys[i]] = obj[sortedKeys[i]];
    }

    return sortedObj;
};