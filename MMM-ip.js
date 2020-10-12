/* global Module Log */

/* Magic Mirror
 * Module: MMM-ip
 *
 * By fewieden https://github.com/fewieden/MMM-ip
 * MIT Licensed.
 */

Module.register('MMM-ip', {

    ips: {},

    types: ['eth0', 'wlan0'],

    modals: {
        interfaces: false,
        help: false
    },

    voice: {
        mode: 'NETWORK',
        sentences: [
            'OPEN HELP',
            'CLOSE HELP',
            'SHOW INTERFACES',
            'HIDE INTERFACES'
        ]
    },

    getTranslations() {
        return {
            en: 'translations/en.json',
            de: 'translations/de.json'
        };
    },

    defaults: {
        fontSize: 9,
        voice: false,
        dimmed: true,
        showFamily: 'both',
        showType: 'both',
        startHidden: false
    },

    start() {
        Log.info(`Starting module: ${this.name}`);
        this.sendSocketNotification('GET_IPS', {});
    },

    getStyles() {
        return ['MMM-ip.css'];
    },

    notificationReceived(notification, payload, sender) {
        if (notification === 'ALL_MODULES_STARTED') {
            this.sendNotification('REGISTER_VOICE_MODULE', this.voice);
        } else if (notification === 'VOICE_NETWORK' && sender.name === 'MMM-voice') {
            this.checkCommands(payload);
        } else if (notification === 'VOICE_MODE_CHANGED' && sender.name === 'MMM-voice' && payload.old === this.voice.mode) {
            this.closeAllModals();
            this.updateDom(300);
        }
        if (notification === 'DOM_OBJECTS_CREATED' && this.config.startHidden === true) {
            this.hide();
        }
        if (this.config.startHidden === false){
            this.handleModals('SHOW INTERFACES', 'interfaces', /(SHOW)/g, /(HIDE)/g);
        }
    },

    closeAllModals() {
        const modals = Object.keys(this.modals);
        modals.forEach(modal => (this.modals[modal] = false));
    },

    isModalActive() {
        const modals = Object.keys(this.modals);
        return modals.some(modal => this.modals[modal] === true);
    },

    handleModals(data, modal, open, close) {
        if (close.test(data) || (this.modals[modal] && !open.test(data))) {
            this.closeAllModals();
            this.hide();
        } else if (open.test(data) || (!this.modals[modal] && !close.test(data))) {
            this.closeAllModals();
            this.show();
            this.modals[modal] = true;
        }
    },

    checkCommands(data) {
        if (/(HELP)/g.test(data)) {
            this.handleModals(data, 'help', /(OPEN)/g, /(CLOSE)/g);
        } else if (/(INTERFACES)/g.test(data)) {
            this.handleModals(data, 'interfaces', /(SHOW)/g, /(HIDE)/g);
        }

        this.updateDom(300);
    },


    getDom() {
        const wrapper = document.createElement('div');
        if (this.config.voice) {
            document.getElementById(this.identifier).classList.add('voice-mode');
        } else {
            wrapper.style.fontSize = `${this.config.fontSize}px`;
        }
        const typeKeys = Object.keys(this.ips);
        if (typeKeys.length > 0) {
            if (this.config.dimmed) {
                wrapper.classList.add('dimmed');
            }

            const modules = document.querySelectorAll('.module');
            for (let i = 0; i < modules.length; i += 1) {
                if (!modules[i].classList.contains('MMM-ip')) {
                    if (this.isModalActive()) {
                        modules[i].classList.add('MMM-ip-blur');
                    } else {
                        modules[i].classList.remove('MMM-ip-blur');
                    }
                }
            }

            if (this.modals.help) {
                this.appendHelp(wrapper);
            } else {
                this.appendInterfaces(typeKeys, wrapper);
            }
        } else {
            const text = document.createElement('div');
            text.innerHTML = this.translate('LOADING');
            wrapper.appendChild(text);
        }
        return wrapper;
    },

    socketNotificationReceived(notification, payload) {
        if (notification === 'IPS') {
            this.ips = payload;
            this.updateDom();
        }
    },

    appendInterfaces(typeKeys, appendTo) {
        if (this.config.voice) {
            appendTo.classList.add('modal', 'align-left');
            const header = document.createElement('div');
            header.classList.add('bright');
            header.innerHTML = this.translate('NETWORK_INTERFACES');
            appendTo.appendChild(header);
        }
        for (let i = 0; i < typeKeys.length; i += 1) {
            if ((this.config.showType === 'both' || this.config.showType === typeKeys[i]) && this.types.indexOf(typeKeys[i]) !== -1) {
                const familyKeys = Object.keys(this.ips[typeKeys[i]]);
                if (familyKeys.length > 0) {
                    let macAddress = null;
                    if (this.config.voice) {
                        const type = document.createElement('div');
                        type.classList.add('thin');
                        type.innerHTML = typeKeys[i].toUpperCase();
                        appendTo.appendChild(type);
                    }
                    for (let n = 0; n < familyKeys.length; n += 1) {
                        if (this.config.showFamily === 'both' || this.config.showFamily === this.ips[typeKeys[i]][familyKeys[n]].family) {
                            const ip = document.createElement('div');
                            if (this.config.voice) {
                                macAddress = this.ips[typeKeys[i]][familyKeys[n]].mac;
                                ip.innerHTML = `${this.ips[typeKeys[i]][familyKeys[n]].family}
                                    : ${this.ips[typeKeys[i]][familyKeys[n]].address}`;
                            } else {
                                ip.classList.add('line');
                                ip.innerHTML = `${typeKeys[i].toUpperCase()} \
                                    ${this.ips[typeKeys[i]][familyKeys[n]].family}: \
                                    ${this.ips[typeKeys[i]][familyKeys[n]].address}`;
                            }
                            appendTo.appendChild(ip);
                        }
                    }
                    if (this.config.voice && macAddress) {
                        const mac = document.createElement('div');
                        mac.innerHTML = `MAC: ${macAddress}`;
                        appendTo.appendChild(mac);
                    }
                }
            }
        }
    },

    appendHelp(appendTo) {
        appendTo.classList.add('modal', 'align-left');
        
        const title = document.createElement('h1');
        title.classList.add('medium', 'bright');
        title.innerHTML = `${this.name} - ${this.translate('COMMAND_LIST')}`;
        appendTo.appendChild(title);

        const mode = document.createElement('div');
        mode.innerHTML = `${this.translate('MODE')}: ${this.voice.mode}`;
        appendTo.appendChild(mode);

        const listLabel = document.createElement('div');
        listLabel.innerHTML = `${this.translate('VOICE_COMMANDS')}:`;
        appendTo.appendChild(listLabel);

        const list = document.createElement('ul');
        for (let i = 0; i < this.voice.sentences.length; i += 1) {
            const item = document.createElement('li');
            item.innerHTML = this.voice.sentences[i];
            list.appendChild(item);
        }
        appendTo.appendChild(list);
    }
});
