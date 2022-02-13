/**
 * @file node_helper.js
 *
 * @author fewieden
 * @license MIT
 *
 * @see  https://github.com/fewieden/MMM-ip
 */

/**
 * @external os
 * @see https://nodejs.org/api/os.html
 */
const interfaces = require('os').networkInterfaces();

/**
 * @external node_helper
 * @see https://github.com/MichMich/MagicMirror/blob/master/modules/node_modules/node_helper/index.js
 */
const NodeHelper = require('node_helper');

/**
 * @external logger
 * @see https://github.com/MichMich/MagicMirror/blob/master/js/logger.js
 */
const Log = require('logger');

/**
 * @module node_helper
 * @description Backend for the module to get information about the network interfaces of the computer.
 *
 * @requires external:os
 * @requires external:node_helper
 * @requires external:logger
 */
module.exports = NodeHelper.create({
    /** @member {string} requiresVersion - Defines the minimum version of MagicMirror to run this node_helper. */
    requiresVersion: '2.15.0',

    /**
     * @function start
     * @description Logs a start message to the console.
     * @override
     *
     * @returns {void}
     */
    start() {
        Log.log(`Starting module helper: ${this.name}`);
        Log.log(`Available network interface types: ${Object.keys(interfaces).join(', ')}`);
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
