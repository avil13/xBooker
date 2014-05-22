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
            .when('/chart2', {
                templateUrl: 'pages/page_chart2.html',
                controller: 'chart2Ctrl'
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



/****
                    _ ____          _______
 _   ______ _____  (_) / /___ _    / / ___/
| | / / __ `/ __ \/ / / / __ `/_  / /\__ \
| |/ / /_/ / / / / / / / /_/ / /_/ /___/ /
|___/\__,_/_/ /_/_/_/_/\__,_/\____//____/

*/
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

window.alert = function(str) {
    var el = document.getElementById('alert');
    document.getElementById('alert-text').innerHTML = str;
    el.classList.add('show-el');
    setTimeout(function() {
        el.classList.remove('show-el');
    }, 2000);
};

var Color = function() {
    var rand = 1100000 + Math.random() * 14899999;
    rand = Math.round(rand);
    return '#' + (rand).toString(16);
};


var similar_text = function(first, second, percent) {
    if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
        return 0;
    }

    first += '';
    second += '';

    var pos1 = 0,
        pos2 = 0,
        max = 0,
        firstLength = first.length,
        secondLength = second.length,
        p, q, l, sum;

    max = 0;

    for (p = 0; p < firstLength; p++) {
        for (q = 0; q < secondLength; q++) {
            for (l = 0;
                (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++);
            if (l > max) {
                max = l;
                pos1 = p;
                pos2 = q;
            }
        }
    }

    sum = max;

    if (sum) {
        if (pos1 && pos2) {
            sum += this.similar_text(first.substr(0, pos1), second.substr(0, pos2));
        }

        if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
            sum += this.similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max, secondLength - pos2 - max));
        }
    }

    if (!percent) {
        return sum;
    } else {
        return (sum * 200) / (firstLength + secondLength);
    }
};