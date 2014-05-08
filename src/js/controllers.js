// Контроллер меню
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
            url: '#/chart',
            name: 'График'
        }];

        $scope.activePath = null;

        $scope.$on('$routeChangeSuccess', function() {
            $scope.activePath = '#' + $location.path();
        });

    }
]);


// Контроллер расходов
xApp.controller('spendingCtrl', ['$scope', '$http',
    function($scope, $http) {
        $http.get('groups.json').success(function(data) {

            if (!br.storage.get('plans')) {
                br.storage.set('plans', []);
            }

            data = data.concat(br.storage.get('plans'));

            $scope.groups = data;
            $scope.select = $scope.groups[0];
        });

        $scope.money = '';
        $scope.comment = '';


        $scope.getData = function() {
            if ($scope.money === '') {
                alert('Вы забыли указать сумму');
                return false;
            }


            var plans = br.storage.get('plans');
            var select = JSON.stringify($scope.select);
            var i_plans = false;

            for (var i = 0; i < plans.length; i++) {
                if (JSON.stringify(plans[i]) === select) {
                    i_plans = i;
                }
            }

            if (i_plans !== false) {
                plans[i_plans]['money'] = plans[i_plans]['money'] + $scope.money;
                br.storage.set('plans', plans);
            }


            var flow = {};
            var date = $scope.$$childHead.currDate;

            if (!br.storage.get('flow')) {
                br.storage.set('flow', {});
            }

            var obj = br.storage.get('flow');

            flow[parseInt((date.getTime() + count_prs(obj)), 10) + ''] = {
                date: date,
                money: $scope.money,
                nead: ($scope.select.nead || ''),
                category: $scope.select.value,
                name: $scope.select.name,
                comment: $scope.comment
            };

            br.storage.extend('flow', flow);

            $scope.money = '';
            $scope.comment = '';
        };

    }
]);



// Контроллер планов
xApp.controller('plansCtrl', ['$scope',
    function($scope) {
        $scope.new_plan = false;

        if (!br.storage.get('plans')) {
            br.storage.set('plans', []);
        }

        $scope.plans = br.storage.get('plans');



        $scope.savePlan = function() {
            if ($scope.name === undefined || $scope.name === '') {
                alert('Вы забыли указать план');
                return false;
            }

            if ($scope.nead === undefined || parseInt($scope.nead, 10) <= 0) {
                alert('Сумма указана неверно');
                return false;
            }


            var plan = {
                grp: 'Планы',
                money: 0,
                name: $scope.name,
                nead: $scope.nead
            };

            $scope.plans = br.storage.append('plans', plan).get('plans');

            $scope.name = '';
            $scope.nead = '';
            $scope.new_plan = false;

        };



        $scope.removePlan = function(name) {
            if (confirm("Вы уверены, что вам больше не нужен\n" + name.name)) {
                var i = $scope.plans.indexOf(name);
                $scope.plans.splice(i, 1);
                br.storage.set('plans', $scope.plans);
            }

        };
    }
]);


// Контроллер доходов
xApp.controller('incomeCtrl', ['$scope',
    function($scope) {

        $scope.money = '';
        $scope.name = '';


        $scope.getData = function() {
            if ($scope.money === '') {
                alert('Вы забыли указать сумму');
                return false;
            }

            if ($scope.name === '') {
                alert('Вы забыли указать источник');
                return false;
            }

            var income = {};
            var date = $scope.$$childHead.currDate;

            if (!br.storage.get('income')) {
                br.storage.set('income', {});
            }

            var obj = br.storage.get('income');

            income[parseInt((date.getTime() + count_prs(obj)), 10) + ''] = {
                date: date,
                money: $scope.money,
                name: $scope.name
            };

            br.storage.extend('income', income);

            $scope.money = '';
            $scope.name = '';
        };


    }
]);


/// Контроллер календаря
xApp.controller('dateCtrl', ['$scope',
    function($scope) {

        $scope.currDate = new Date();

        $scope.typeView = false;


        var getWeeks = function() {
            var date = new Date($scope.currDate.getTime());

            var startMonth = date.getMonth(),
                startYear = date.getYear();
            date.setDate(1);
            date.setHours(0);
            date.setMinutes(1);
            date.setSeconds(0);
            date.setMilliseconds(1);

            if (date.getDay() === 0) {
                date.setDate(-5);
            } else {
                date.setDate(date.getDate() - (date.getDay() - 1));
            }
            if (date.getDate() === 1) {
                date.setDate(-6);
            }

            var weeks = [];
            while (weeks.length < 6) {
                /*jshint -W116 */
                if (date.getYear() === startYear && date.getMonth() > startMonth) break;
                var week = [];
                for (var i = 0; i < 7; i++) {
                    week.push(new Date(date));
                    date.setDate(date.getDate() + 1);
                }
                weeks.push(week);
            }

            return weeks;
        };



        var getDaysOfWeek = function(date) {
            date = new Date(date || new Date());
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            date.setDate(date.getDate() - (date.getDay() - 1));
            var days = [];
            for (var i = 0; i < 7; i++) {
                days.push(new Date(date));
                date.setDate(date.getDate() + 1);
            }
            return days;
        };



        $scope.next = function(delta) {
            delta = delta || 1;

            var month = $scope.currDate.getMonth() + delta;

            $scope.currDate.setMonth(month);
            $scope.weeks = getWeeks();
        };

        $scope.prev = function() {
            $scope.next(-1);
        };

        $scope.setDate = function(day) {
            $scope.currDate = day;
            $scope.typeView = false;
        };

        $scope.chekDate = function(day, currDate) {
            return (day.getFullYear() === currDate.getFullYear()) &&
                (day.getMonth() === currDate.getMonth()) &&
                (day.getDate() === currDate.getDate());
        };

        $scope.changeView = function() {
            $scope.typeView = true;
        };



        $scope.weeks = getWeeks();
        $scope.weekdays = getDaysOfWeek();
    }


]);



// Контроллер графиков
xApp.controller('chartCtrl', ['$scope',
    function($scope) {

        $scope.incomeSum = '';
        $scope.flowSum = '';
        $scope.incomes = [];


        var width = (window.innerWidth > window.innerHeight) ? window.innerWidth : window.innerHeight;

        document.getElementById("myChart").width = width - 120;
        document.getElementById("myChart").height = width - 200;

        var ctx = document.getElementById("myChart").getContext("2d");
        var chart = new Chart(ctx);

        var getDayArr = function(Obj, t1, t2) {
            var nead_date = {},
                d;

            for (var k in Obj) {
                d = parseInt(k, 10);
                if (d > t2) break;
                if (d >= t1) {
                    nead_date[d] = Obj[k].money;
                }
            }

            return nead_date;
        };

        var sumDate = function(Obj, tt1, tt2) {
            var Sum = 0,
                d;

            for (var k in Obj) {
                d = parseInt(k, 10);

                if (d > tt2) break;

                if (d >= tt1) {
                    Sum += Obj[k];
                }
            }

            return Sum;
        };


        var getMonthArr = function(nameStorage, t1, t2) {

            t1 = new Date(t1);
            t1.setHours(0);
            t1.setMinutes(0);
            t1.setSeconds(10);
            t1.setMilliseconds(0);
            t1 = t1.getTime();

            t2 = new Date(t2);
            t2.setHours(23);
            t2.setMinutes(59);
            t2.setSeconds(59);
            t2.setMilliseconds(999);
            t2 = t2.getTime();

            var storObj = br.storage.get(nameStorage),
                nead_date = sortObj(getDayArr(storObj, t1, t2)),
                dt = new Date(t1),
                day = [],
                d1, d2;

            $scope[nameStorage + 's'] = storObj;

            dt.setDate(dt.getDate() + 1);

            while (dt.getTime() < t2) {

                d1 = dt.getTime();
                dt.setDate(dt.getDate() + 1);
                d2 = dt.getTime();

                day.push(sumDate(nead_date, d1, d2));
            }

            return day;
        };


        $scope.showChart = function() {

            var date = new Date($scope.$$childHead.currDate);

            var m = date.getMonth(),
                d = date.getDate();

            var time2 = date.getTime();
            date.setMonth(date.getMonth() - 1);
            var time1 = date.getTime();

            var days = [];
            while (m > date.getMonth() || d > date.getDate()) {
                date.setDate(date.getDate() + 1);
                days.push(date.getDate());
            }

            var flow = getMonthArr('flow', time1, time2);
            var income = getMonthArr('income', time1, time2);

            var data = {
                labels: days,
                datasets: [{
                    fillColor: "rgba(255, 18, 18, 0.5)",
                    strokeColor: "rgba(255, 118, 118, 0.8)",
                    data: flow
                }, {
                    fillColor: "rgba(73, 219, 120, 0.5)",
                    strokeColor: "rgba(202, 255, 219, 0.8)",
                    data: income
                }]
            };

            var myNewChart = chart.Bar(data);

            $scope.incomeSum = income.reduce(function(pv, cv) {
                return pv + cv;
            }, 0);

            $scope.flowSum = flow.reduce(function(pv, cv) {
                return pv + cv;
            }, 0);


        };


    }
]);


/////