var Fiber = Npm.require('fibers');
var request = Meteor.npmRequire('request');
var checkRunning = false;


var check = function() {
    Fiber(function() {
        Sites.find().forEach(function(site) {
            request({
                timeout: 8000,
                url: site.url,
                proxy: 'http://tor-proxy-prod.elasticbeanstalk.com:8118'
            }, Meteor.bindEnvironment(function(error, response, body) {
                var now = Math.floor(new Date());
                var status = !error && response.statusCode < 400;
                var history = site.history || {};
                // Purge old entries
                for(var ts in history) {
                    if(now - ts > 86400000) {
                        delete history[ts];
                    }
                }
                // Add new entry
                history[now] = status;
                site.history = history;
                Sites.update({_id: site._id}, site);
            }))
        })    
    }).run();
    console.log('check');
}

setInterval(check, 10000);