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

            if (!br.storage.get('plans')) {
                br.storage.set('plans', []);
            }

            data = data.concat(br.storage.get('plans'));

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

            flow[parseInt(($scope.spending_date.getTime() / 1000), 10) + ''] = {
                date: $scope.spending_date,
                money: $scope.money,
                nead: ($scope.select.nead || ''),
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

        };

    }
]);



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



xApp.controller('incomeCtrl', ['$scope',
    function($scope) {

    }
]);



xApp.controller('dateCtrl', ['$scope',
    function($scope) {

        $scope.currDate = new Date();

        var getWeeks = function() {
            var date = new Date($scope.currDate.getTime());

            var startMonth = date.getMonth(),
                startYear = date.getYear();
            date.setDate(1);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

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
        };

        $scope.chekDate = function(day, currDate) {
            return (day.getFullYear() === currDate.getFullYear()) &&
                (day.getMonth() === currDate.getMonth()) &&
                (day.getDate() === currDate.getDate());
        };



        $scope.weeks = getWeeks();
        $scope.weekdays = getDaysOfWeek();
    }


]);



/////