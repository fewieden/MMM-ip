/* Magic Mirror
 * Module: MMM-ip
 *
 * By fewieden https://github.com/fewieden/MMM-ip
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const interfaces = require('os').networkInterfaces();

module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_IPS') {
            this.sendSocketNotification('IPS', interfaces);
        }
    }
});