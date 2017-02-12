/* Magic Mirror
 * Module: MMM-ip
 *
 * By fewieden https://github.com/fewieden/MMM-ip
 * MIT Licensed.
 */

/* eslint-env node */
/* eslint-disable no-console */

const NodeHelper = require('node_helper');
const interfaces = require('os').networkInterfaces();

module.exports = NodeHelper.create({
    socketNotificationReceived(notification) {
        if (notification === 'GET_IPS') {
            this.sendSocketNotification('IPS', interfaces);
        }
    }
});
