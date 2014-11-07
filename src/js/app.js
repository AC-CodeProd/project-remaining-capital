var Remaining_Capital = angular.module('Remaining_Capital', ['ngRoute']);


Remaining_Capital.factory('RemainingCapitalData', function() {
    return {
        getRemainingCapitalData: function() {
            return data;
        }
    };
});
var cal = function($scope) {
    if (angular.isDefined($scope.annualRate) && angular.isDefined($scope.outstandingCapital) && angular.isDefined($scope.totalPayments)) {
        var t = $scope.annualRate / 12;
        m = $scope.outstandingCapital * t * Math.pow(1 + t, $scope.totalPayments) / (Math.pow(1 + t, $scope.totalPayments) - 1);
        var outstandingCapital = $scope.outstandingCapital;
        var g = m - (t * outstandingCapital);
        var monthly = m;
        datas = [];
        var data = {
            maturity_number: 0,
            outstanding_capital: outstandingCapital,
            monthly: monthly,
            real_gain: g
        };
        datas.push(data);

        for (var i = 1, max = $scope.totalPayments; i <= max; i++) {
            outstandingCapital = (datas[i - 1].outstanding_capital - g);
            g = m - (t * outstandingCapital);
            data = {
                maturity_number: i,
                outstanding_capital: outstandingCapital,
                monthly: monthly,
                real_gain: g
            }
            datas.push(data);
        };
        $scope.datas = datas;
    }

};
Remaining_Capital.controller('PageCtrl', function($rootScope, $scope, $route, RemainingCapitalData) {
    console.log('PageCtrl');
    $scope.$watch("outstandingCapital", function(outstandingCapital) {
        if (!angular.isUndefined(outstandingCapital))
            cal($scope);
    });
    $scope.$watch("annualRate", function(annualRate) {
        if (!angular.isUndefined(annualRate))
            cal($scope);
    });
    $scope.$watch("totalPayments", function(totalPayments) {
        if (!angular.isUndefined(totalPayments))
            cal($scope);
    });
});