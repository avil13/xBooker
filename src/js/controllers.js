// Контроллер меню
xApp.controller('menuCtrl', ['$scope', '$location', '$route',
    function($scope, $location, $route) {

        $scope.Menu = [{
            url: '#/spending',
            name: 'Расходы',
            img: 'img/minus.png'
        }, {
            url: '#/profit',
            name: 'Доходы',
            img: 'img/plus.png'
        }, {
            url: '#/plans',
            name: 'Планы',
            img: 'img/pencil.png'
        }, {
            url: '#/chart',
            name: 'График',
            img: 'img/chart-bar.png'
        }, {
            url: '#/chart2',
            name: 'График',
            img: 'img/chart-pie.png'
        }, {
            url: '#/sinchronize',
            name: 'Синх.',
            img: 'img/sinchronize.png'
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
        $scope.autocomplete = [];


        $scope.getData = function() {
            if ($scope.money === '') {
                navigator.notification.vibrate(1000);
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

            alert('Даныне сохранены');
        };


        $scope.autoComplete = function() {
            var name = $scope.comment;
            $scope.autocomplete = [];

            if (name.length > 1) {
                var flow = br.storage.get('flow'),
                    obj = {},
                    k;

                for (k in flow) {
                    if (flow[k].comment.indexOf(name) > -1) {
                        obj[flow[k].comment] = {
                            name: flow[k].comment,
                            similar: similar_text(name, flow[k].comment)
                        };
                    }
                }

                for (k in obj) {
                    $scope.autocomplete.push(obj[k]);
                }
            }
        };

        $scope.putName = function(name) {
            $scope.comment = name;
            $scope.autocomplete = [];
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

                var flow = br.storage.get('flow');
                var new_flow = {};

                for (var k in flow) {
                    if (flow[k].name !== name.name) {
                        new_flow[k] = flow[k];
                    }
                }

                br.storage.set('flow', new_flow);
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

            alert('Даныне сохранены');
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



// Контроллер графика 1
xApp.controller('chartCtrl', ['$scope',
    function($scope) {

        $scope.incomeSum = '';
        $scope.flowSum = '';
        $scope.incomes = [];
        $scope.showMoneySrc = false;
        $scope.checkDate = new Date();
        $scope.showListBtn = true;


        var width = (window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight;

        document.getElementById("myChart").width = width - 6;
        document.getElementById("myChart").height = width - 30;

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

            // список расходов
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
                    fillColor: "rgba(255, 18, 18, 0.8)",
                    strokeColor: "rgba(255, 118, 118, 1)",
                    data: flow
                }, {
                    fillColor: "rgba(73, 219, 120, 0.8)",
                    strokeColor: "rgba(202, 255, 219, 1)",
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


            $scope.checkDate = new Date($scope.$$childHead.currDate);
            $scope.showListBtn = false;


        }; // End showChart


        $scope.removeRecord = function(name, nameStorage) {
            if (confirm("Вы уверены, что вам больше не нужен\n" + name.name)) {
                var obj = br.storage.get(nameStorage);

                var toDel = JSON.stringify(name);

                for (var k in obj) {
                    if (JSON.stringify(obj[k]) === toDel) {
                        delete obj[k];
                        $scope[nameStorage + 's'] = obj;
                        break;
                    }
                }

                br.storage.set(nameStorage, $scope[nameStorage + 's']);
            }

        };

    }
]);



// контроллер графиков статистики   //////////////////////////////////////////////////////
xApp.controller('chart2Ctrl', ['$scope',
    function($scope) {

        $scope.flow = [];
        $scope.income = [];

        var width = (window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight;

        document.getElementById("myChartFlow").width = width - 6;
        document.getElementById("myChartFlow").height = width - 30;
        document.getElementById("myChartIncomes").width = width - 6;
        document.getElementById("myChartIncomes").height = width - 30;


        var ctx1 = document.getElementById("myChartFlow").getContext("2d");
        var chart1 = new Chart(ctx1);

        var ctx2 = document.getElementById("myChartIncomes").getContext("2d");
        var chart2 = new Chart(ctx2);



        $scope.showChart = function() {

            var date = new Date($scope.$$childHead.currDate);

            var time2 = date.getTime();
            date.setMonth(date.getMonth() - 1);
            var time1 = date.getTime();



            var flowPolar = getMonthArr('flow', time1, time2);
            var incomePolar = getMonthArr('income', time1, time2);

            var myNewChart1 = chart1.PolarArea(flowPolar);
            var myNewChart2 = chart2.Doughnut(incomePolar);

            $scope.flow = flowPolar;
            $scope.income = incomePolar;

        }; // End showCharts



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
                data = {},
                res = [],
                el_date,
                el_name;

            for (var el in storObj) {
                el_date = parseInt(el, 10);

                if (t1 < el_date && el_date < t2) {
                    el_name = storObj[el].name.toLowerCase();

                    if (!data[el_name])
                        data[el_name] = {};

                    data[el_name].name = el_name;
                    data[el_name].value = storObj[el].money + (data[el_name].value || 0);
                    data[el_name].color = Color();
                }
            }

            for (var d_el in data) {
                res.push(data[d_el]);
            }

            return res;
        };
    }
]);


// контроллер синхронизации
xApp.controller('sinchronizeCtrl', ['$scope', '$http',
    function($scope, $http) {
        $scope.title = 'Данный функционал в разработке';


        $scope.sendRequest = function() {

            var data = {
                action: 'Registration',
                email: 'a.1.3@mail.ru',
                password: 'x123',
                ob: {
                    sync: true,
                    date: 1404757998,
                    lorem: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum non impedit suscipit possimus, blanditiis nobis veniam inventore laudantium iure recusandae mollitia numquam odit, iusto repellat est ipsa ratione. Dignissimos, optio. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum delectus excepturi, corporis, culpa, nam sint eaque quasi voluptas qui cupiditate numquam quo earum vel commodi cumque molestias laboriosam fugit quisquam.  !!!!!!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis consectetur dignissimos vero enim temporibus quisquam amet molestiae velit neque veniam illum eum repellat sapiente, harum voluptatum ipsam! Alias distinctio, dolorum. !!!!!'
                }
            };

            // var URL = 'http://myproject.loc/xBooker-api/?callback=JSON_CALLBACK';
            var URL = 'http://myproject.loc/xBooker-api';
            // var URL = 'http://test.ru/cross-domain/index.php';

            $http({
                url: URL,
                method: "POST",
                data: serialize(data),
                responseType: 'json',
                headers: {
                    'Authorization': 'Basic dGVzdDp0ZXN0',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .success(function(data, status) {
                    console.log(data);
                })
                .error(function(data, status) {
                    console.log(data);
                    console.log(status);
                });



        };
    }
]);