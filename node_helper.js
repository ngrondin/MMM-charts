const NodeHelper = require("node_helper");
var request = require('request');


module.exports = NodeHelper.create({

    socketNotificationReceived: function(notification, payload) {
        if(notification == 'chart-getdata') {
            this.getData(payload.id, payload.url);
        }
    },

    getData: function(id, url) {
        console.log("Getting Chart data from " + url);
        var self = this;
        request({ url: url, method: 'GET' }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                self.sendSocketNotification('chart-data', {id: id, data: data});
            } else {
                console.log("Error getting chart data: " + error);
            }
        });
    }
});
