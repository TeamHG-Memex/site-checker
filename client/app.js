angular
    .module('site-checker', ['angular-meteor'])
    .controller('SitesController', ['$scope', '$meteor', function($scope, $meteor) {
        $scope.sites = $meteor.collection(Sites);
        $scope.adding = false;
        $scope.newSites = '';
        $scope.toggleAdding = function() {
            $scope.adding = !$scope.adding;
        }
        var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        $scope.addSites = function() {
            var urls = $scope.newSites.match(urlRegex);
            if(urls !== null) {
                angular.forEach(urls, function(url) {
                    Sites.insert({url: url});
                });
                alert('Added ' + urls.length + ' new URLs');
                $scope.adding = false;
                $scope.newSites = '';
            } else {
                alert('No URLs found!')
            }
        }
        $scope.removeSite = function(site) {
            if(confirm('Are you sure?')) {
                $scope.sites.remove(site);
            }
        }
        $scope.upRatio = function(site, interval) {
            var now = Math.floor(new Date());
            var sum = 0;
            var total = 0;
            angular.forEach(site.history, function(state, timestamp) {
                if(now - timestamp < interval) {
                    if(state) {
                        sum++;
                    }
                    total++;
                }
            });
            return sum / total * 100;
        }

        $scope.upRatioClass = function(site, interval) {
            var ratio = $scope.upRatio(site, interval);
            if(ratio < 25) {
                return 'danger';
            }
            if(ratio < 50) {
                return 'warning';
            }
            return 'success';
        }
    }])