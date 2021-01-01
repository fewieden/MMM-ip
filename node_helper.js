/**
 * @file node_helper.js
 *
 * @author fewieden
 * @license MIT
 *
 * @see  https://github.com/fewieden/MMM-ip
 */

/**
 * @external node_helper
 * @see https://github.com/MichMich/MagicMirror/blob/master/modules/node_modules/node_helper/index.js
 */
const NodeHelper = require('node_helper');

/**
 * @external os
 * @see https://nodejs.org/api/os.html
 */
const interfaces = require('os').networkInterfaces();

/**
 * @module node_helper
 * @description Backend for the module to get information about the network interfaces of the computer.
 *
 * @requires external:os
 * @requires external:node_helper
 */
module.exports = NodeHelper.create({
    /**
     * @function start
     * @description Logs a start message to the console.
     * @override
     *
     * @returns {void}
     */
    start() {
        console.log(`Starting module helper: ${this.name}`);
        console.log(`Available network interface types: ${Object.keys(interfaces).join(', ')}`);
    },

    /**
     * @function socketNotificationReceived
     * @description Receives socket notifications from the module.
     * @override
     *
     * @param {string} notification - Notification name
     *
     * @returns {void}
     */
    socketNotificationReceived(notification) {
        if (notification === 'GET_NETWORK_INTERFACES') {
            this.sendSocketNotification('NETWORK_INTERFACES', interfaces);
        }
    }
});
