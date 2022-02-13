/**
 * @file MMM-ip.js
 *
 * @author fewieden
 * @license MIT
 *
 * @see  https://github.com/fewieden/MMM-ip
 */

/* global Module Log */

/**
 * @external Module
 * @see https://github.com/MichMich/MagicMirror/blob/master/js/module.js
 */

/**
 * @external Log
 * @see https://github.com/MichMich/MagicMirror/blob/master/js/logger.js
 */

/**
 * @module MMM-ip
 * @description Frontend for the module to display data.
 *
 * @requires external:Module
 * @requires external:Log
 */
Module.register('MMM-ip', {
    /** @member {?Object} interfaces - Network interfaces of the computer. */
    interfaces: null,

    /**
     * @member {Object} voice - Defines the voice recognition part.
     * @property {string} mode - MMM-voice mode of this module.
     * @property {string[]} sentences - All commands of this module.
     */
    voice: {
        mode: 'NETWORK',
        sentences: [
            'OPEN HELP',
            'CLOSE HELP',
            'SHOW INTERFACES',
            'HIDE INTERFACES'
        ]
    },

    /**
     * @member {Object} defaults - Defines the default config values.
     * @property {int} fontSize - Size of the text displayed in pixel.
     * @property {boolean} dimmed - Flag to enable/disable dimming of text.
     * @property {string[]} types - Network interface types.
     * @property {string[]} families - IP address families.
     */
    defaults: {
        fontSize: 9,
        dimmed: true,
        types: ['eth0', 'wlan0'],
        families: ['IPv4', 'IPv6'],
        updateInterval: 5 * 60 * 1000 // every 5 minutes
    },

    /**
     * @function getTranslations
     * @description Translations for this module.
     * @override
     *
     * @returns {Object.<string, string>} Available translations for this module (key: language code, value: filepath).
     */
    getTranslations() {
        return {
            en: 'translations/en.json',
            de: 'translations/de.json'
        };
    },

    /**
     * @function getTemplate
     * @description Nunjuck template.
     * @override
     *
     * @returns {string} Path to nunjuck template.
     */
    getTemplate() {
        return 'templates/MMM-ip.njk';
    },

    /**
     * @function getTemplateData
     * @description Data that is needed to render the nunjuck template.
     * @override
     *
     * @returns {Object} Data for the nunjuck template.
     */
    getTemplateData() {
        return {
            config: this.config,
            interfaces: this.interfaces,
        };
    },

    /**
     * @function start
     * @description Adds nunjuck globals and requests network interfaces from the node_helper.
     * @override
     *
     * @returns {void}
     */
    start() {
        Log.info(`Starting module: ${this.name}`);
        this.addGlobals();
        this.sendSocketNotification('CONFIG', this.config);
    },

    /**
     * @function notificationReceived
     * @description Handles incoming broadcasts from other modules or the MagicMirror core.
     * @override
     *
     * @param {string} notification - Notification name
     * @param {*} payload - Detailed payload of the notification.
     * @param {MM} [sender] - The sender of the notification. If sender is undefined the sender is the core.
     */
    notificationReceived(notification, payload, sender) {
        if (notification === 'ALL_MODULES_STARTED') {
            this.sendNotification('REGISTER_VOICE_MODULE', this.voice);
        } else if (notification === 'VOICE_NETWORK' && sender.name === 'MMM-voice') {
            this.executeVoiceCommands(payload);
        } else if (notification === 'VOICE_MODE_CHANGED' && sender.name === 'MMM-voice' && payload.old === this.voice.mode) {
            this.sendNotification('CLOSE_MODAL');
        }
    },

    /**
     * @function handleHelpModal
     * @description Opens/closes help modal based on voice commands.
     *
     * @param {string} data - Text with commands.
     *
     * @returns {void}
     */
    handleHelpModal(data) {
        if (/(CLOSE)/g.test(data) && !/(OPEN)/g.test(data)) {
            this.sendNotification('CLOSE_MODAL');
        } else if (/(OPEN)/g.test(data) && !/(CLOSE)/g.test(data)) {
            this.sendNotification('OPEN_MODAL', {
                template: 'templates/HelpModal.njk',
                data: {
                    ...this.voice,
                    fns: {
                        translate: this.translate.bind(this)
                    }
                }
            });
        }
    },

    /**
     * @function handleInterfaceModal
     * @description Opens/closes interface modal based on voice commands.
     *
     * @param {string} data - Text with commands.
     *
     * @returns {void}
     */
    handleInterfaceModal(data) {
        if (/(HIDE)/g.test(data) && !/(SHOW)/g.test(data)) {
            this.sendNotification('CLOSE_MODAL');
        } else if (/(SHOW)/g.test(data) && !/(HIDE)/g.test(data)) {
            this.sendNotification('OPEN_MODAL', {
                template: 'templates/InterfaceModal.njk',
                data: {
                    config: this.config,
                    interfaces: this.interfaces,
                    fns: {
                        translate: this.translate.bind(this),
                        includes: this.includes,
                        getMacAddress: this.getMacAddress
                    }
                },
            });
        }
    },

    /**
     * @function executeVoiceCommands
     * @description Executes the voice commands.
     *
     * @param {string} data - Text with commands.
     *
     * @returns {void}
     */
    executeVoiceCommands(data) {
        if (/(HELP)/g.test(data)) {
            return this.handleHelpModal(data);
        } else if (/(INTERFACES)/g.test(data)) {
            return this.handleInterfaceModal(data);
        }
    },

    /**
     * @function socketNotificationReceived
     * @description Handles incoming messages from node_helper.
     * @override
     *
     * @param {string} notification - Notification name
     * @param {*} payload - Detailed payload of the notification.
     */
    socketNotificationReceived(notification, payload) {
        if (notification === 'NETWORK_INTERFACES') {
            this.interfaces = payload;
            this.updateDom(300);
        }
    },

    /**
     * @function getMacAddress
     * @description Helper function to get mac adress from array item.
     *
     * @param {Object[]} array - Objects with property mac for the mac address.
     *
     * @returns {string} Mac address or empty string.
     */
    getMacAddress(array = []) {
        const itemWithMacAddress = array.find(item => item.mac);

        return itemWithMacAddress ? `(MAC: ${itemWithMacAddress.mac})` : '';
    },

    /**
     * @function addGlobals
     * @description Adds custom globals used by the nunjuck template.
     *
     * @returns {void}
     */
    addGlobals() {
        this.nunjucksEnvironment().addGlobal('includes', (array = [], item) => array.includes(item));
    }
});
