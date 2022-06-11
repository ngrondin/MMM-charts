const NodeHelper = require("node_helper");
var request = require('request');


module.exports = NodeHelper.create({

    socketNotificationReceived: function(notification, payload) {
        if(notification == 'getdata') {
            this.getData(payload.url);
        }
    },

    getData: function(url) {
        console.log("Getting Chart data from " + url);
        var self = this;
        request({ url: url, method: 'GET' }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                self.sendSocketNotification('data', JSON.parse(body));
            } else {
                console.log("Error getting chart data: " + error);
            }
        });
    }
});
