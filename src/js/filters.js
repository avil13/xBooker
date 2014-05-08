angular.module('DateFilters', []).filter('dateFilter', function() {

    return false;

    // var date = new Date($scope.$$childHead.currDate);
    var date = new Date();

    var time2 = date.getTime();
    date.setMonth(date.getMonth() - 1);
    var time1 = date.getTime();

    return function(input) {
        var valDate = new Date(input.date);
        valDate = valDate.getTime();

        return (valDate > time1 && valDate < time2);
    };
});