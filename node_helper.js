const NodeHelper = require('node_helper');
const interfaces = require('os').networkInterfaces();

module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_IP') {
            for(interface in interfaces){
                for(networkaddress in interfaces[interface]){
                    if((interfaces[interface][networkaddress].family === 'IPv4' || interfaces[interface][networkaddress].family === 'IPv6') && !interfaces[interface][networkaddress].internal) {
                        this.sendSocketNotification('IP', {
                            'type': interfaces[interface][networkaddress].family,
                            'ip': interfaces[interface][networkaddress].address
                        });
                    }
                }
            }
        }
    }
});