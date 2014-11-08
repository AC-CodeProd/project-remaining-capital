'use strict';
var Remaining_Capital = angular.module('Remaining_Capital', ['ngRoute']);

/**
 * Factory & Directive
 **/
Remaining_Capital.directive('scrollOnClick', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, attrs) {
            $elm.on('click', function() {
                $("html, body").animate({
                    scrollTop: 0
                }, "slow");
            });
        }
    }
});
Remaining_Capital.directive('ngPaginate', function() {
    var pageSizeLabel = "Page size";
    return {
        priority: 0,
        restrict: 'A',
        scope: {
            items: '&'
        },
        template: '<nav>'
        + '<ul class="pagination">'
        + '<li><a href="#" ng-disabled="isFirstPage()" ng-click="previousPage()"><i class="fa fa-chevron-left"></i></a></li>'
        + '<li ng-repeat="page in pages()" ><a href="#" title="{{page+1}}" ng-click="goPage(page)">{{page+1}}</a></li>'
        + '<li><a href="#" ng-disabled="isLastPage()" ng-click="nextPage()"><i class="fa fa-chevron-right"></i></a></li>'
        + '</ul>'
        + '</nav>',
        replace: false,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    scope.pageSizeList = [5, 10, 20, 50, 100];
                    scope.paginate = {
                        pageSize: 5,
                        currentPage: 0
                    };

                    scope.isFirstPage = function() {
                        return scope.paginate.currentPage == 0;
                    };
                    scope.isCurrentPage=function(){
                        return scope.paginate.currentPage == 0;
                    }
                    scope.isLastPage = function() {
                        return scope.paginate.currentPage >= scope.items().length / scope.paginate.pageSize - 1;
                    };
                    scope.previousPage = function() {
                        if (!scope.isFirstPage()) {
                            scope.paginate.currentPage--;
                        }
                    };
                    scope.goPage = function(page) {
                        scope.paginate.currentPage = page;
                    }
                    scope.nextPage = function() {
                        if (!scope.isLastPage()) {
                            scope.paginate.currentPage++;
                        }
                    };
                    scope.firstPage = function() {
                        scope.paginate.currentPage = 0;
                    };
                    scope.pages = function() {
                        var pages = [];
                        for (var i = 0; i < Math.ceil(scope.items().length / scope.paginate.pageSize); i++) {
                            pages.push(i);
                        };
                        return pages;
                    };
                    scope.$watch('paginate.pageSize', function(newValue, oldValue) {
                        if (newValue != oldValue) {
                            scope.firstPage();
                        }
                    });

                    scope.$parent.firstPage = function() {
                        scope.firstPage();
                    };

                    scope.$parent.pageItems = function() {
                        var start = scope.paginate.currentPage * scope.paginate.pageSize;
                        var limit = scope.paginate.pageSize;
                        return scope.items().slice(start, start + limit);
                    };
                },
                post: function postLink(scope, iElement, iAttrs, controller) {}
            };
        }
    };
});


Remaining_Capital.service('CalculatePaymentsService', function() {
    var _self = this;

    _self.getPayments = function(outstandingCapital, annualRate, totalPayments) {
        var outstandingCapital = outstandingCapital;
        var annualRate = annualRate;
        var totalPayments = totalPayments;
        var t = annualRate / 12;
        var m = outstandingCapital * t * Math.pow(1 + t, totalPayments) / (Math.pow(1 + t, totalPayments) - 1);
        var g = m - (t * outstandingCapital);
        var monthly = m;
        var datas = [];
        var data = {
            maturity_number: 0,
            outstanding_capital: outstandingCapital,
            monthly: monthly,
            real_gain: g
        };
        datas.push(data);
        for (var i = 1, max = totalPayments; i <= max; i++) {
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
        return datas;
    }
});

Remaining_Capital.controller('PageCtrl', function($rootScope, $scope, $route, CalculatePaymentsService) {
    console.log('PageCtrl');

    $scope.outstandingCapital = 155000;
    $scope.annualRate = 0.035;
    $scope.totalPayments = 350;
    $scope.$watch("outstandingCapital + annualRate + totalPayments", function() {
        if (!angular.isUndefined($scope.outstandingCapital) && !angular.isUndefined($scope.annualRate) && !angular.isUndefined($scope.totalPayments))
            $scope.datas = CalculatePaymentsService.getPayments($scope.outstandingCapital, $scope.annualRate, $scope.totalPayments);
    });

    var top = angular.element(document.getElementById('scroll-top'));
    $(window).scroll(function() {
        var posScroll = $(document).scrollTop();
        if (posScroll >= 300) {
            top.fadeIn(600);
        } else {
            top.fadeOut(600);
        }
    });
});