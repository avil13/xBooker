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
])
    .filter('checkDate', function() {
        return function(incomes, checkDate) {

            var FilteredList = [],
                date2 = checkDate || new Date();

            date2.setHours(23);
            date2.setMinutes(59);
            date2.setSeconds(59);

            var date1 = new Date(date2.getTime()),
                idate;

            date1.setHours(0);
            date1.setMinutes(0);
            date1.setSeconds(10);

            date1.setMonth(date1.getMonth() - 1);


            for (var k in incomes) {
                idate = new Date(incomes[k].date);
                if (idate >= date1 && idate <= date2) {
                    FilteredList.push(incomes[k]);
                }
            }

            return FilteredList;
        };
    });



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