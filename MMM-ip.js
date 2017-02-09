/* Magic Mirror
 * Module: MMM-ip
 *
 * By fewieden https://github.com/fewieden/MMM-ip
 * MIT Licensed.
 */

Module.register("MMM-ip",{

    ips: {},

    types: ["eth0", "wlan0"],

    interfaces: false,

    help: false,

    voice: {
        mode: "NETWORK",
        sentences: [
            "OPEN HELP",
            "CLOSE HELP",
            "SHOW INTERFACES",
            "HIDE INTERFACES"
        ]
    },

    getTranslations: function () {
        return {
            en: "translations/en.json",
            de: "translations/de.json"
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

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('GET_IPS', {});
    },

    getStyles: function () {
        return ["MMM-ip.css"];
    },

    notificationReceived: function (notification, payload, sender) {
        if(notification === "ALL_MODULES_STARTED"){
            this.sendNotification("REGISTER_VOICE_MODULE", this.voice);
        } else if(notification === "VOICE_INTERFACES" && sender.name === "MMM-voice"){
            this.checkCommands(payload);
        } else if(notification === "VOICE_MODE_CHANGED" && sender.name === "MMM-voice" && payload.old === this.voice.mode){
            this.help = false;
            this.interfaces = false;
            this.updateDom(300);
        }
        if (notification === 'DOM_OBJECTS_CREATED' && this.config.startHidden === true) {
            this.hide();
        }
    },

    checkCommands: function(data){
        if(/(HELP)/g.test(data)){
            if(/(CLOSE)/g.test(data) || this.help && !/(OPEN)/g.test(data)){
                this.help = false;
            } else if(/(OPEN)/g.test(data) || !this.help && !/(CLOSE)/g.test(data)){
                this.interfaces = false;
                this.help = true;
            }
        } else if(/(INTERFACES)/g.test(data)){
            if(/(HIDE)/g.test(data) || this.help && !/(SHOW)/g.test(data)){
                this.interfaces = false;
            } else if(/(SHOW)/g.test(data) || !this.help && !/(HIDE)/g.test(data)){
                this.help = false;
                this.interfaces = true;
            }
        }
        this.updateDom(300);
    },



    getDom: function() {
        var wrapper = document.createElement("div");
        if(this.config.voice){
            document.getElementById(this.identifier).classList.add("voice-mode");
        } else {
            wrapper.style.fontSize = this.config.fontSize + 'px';
        }
        var typeKeys = Object.keys(this.ips);
        if(typeKeys.length > 0){
            if(this.config.dimmed){
                wrapper.classList.add('dimmed');
            }

            var modules = document.querySelectorAll(".module");
            for (var i = 0; i < modules.length; i++) {
                if(!modules[i].classList.contains("MMM-ip")){
                    if(this.interfaces || this.help){
                        modules[i].classList.add("MMM-ip-blur");
                    } else {
                        modules[i].classList.remove("MMM-ip-blur");
                    }
                }
            }

            if(this.help){
                this.appendHelp(wrapper);
            } else {
                this.appendInterfaces(typeKeys, wrapper);
            }
        } else {
            var text = document.createElement("div");
            text.innerHTML = this.translate("LOADING");
            wrapper.appendChild(text);
        }
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "IPS"){
            this.ips = payload;
            this.updateDom();
        }
    },

    appendInterfaces: function(typeKeys, appendTo){
        if(this.config.voice){
            appendTo.classList.add("modal", "align-left");
            var header = document.createElement("div");
            header.classList.add("bright");
            header.innerHTML = this.translate("NETWORK_INTERFACES");
            appendTo.appendChild(header);
        }
        for(var i = 0; i < typeKeys.length; i++){
            if((this.config.showType === 'both' || this.config.showType === typeKeys[i]) && this.types.indexOf(typeKeys[i]) !== -1){
                var familyKeys = Object.keys(this.ips[typeKeys[i]]);
                if(familyKeys.length > 0){
                    if(this.config.voice){
                        var type = document.createElement("div");
                        type.classList.add("thin");
                        type.innerHTML = typeKeys[i].toUpperCase();
                        appendTo.appendChild(type);
                        var mac_address = null;
                    }
                    for(var n = 0; n < familyKeys.length; n++){
                        if(this.config.showFamily === 'both' || this.config.showFamily === this.ips[typeKeys[i]][familyKeys[n]].family){
                            var ip = document.createElement("div");
                            if(this.config.voice){
                                mac_address = this.ips[typeKeys[i]][familyKeys[n]].mac;
                                ip.innerHTML = this.ips[typeKeys[i]][familyKeys[n]].family + ": " + this.ips[typeKeys[i]][familyKeys[n]].address;
                            } else {
                                ip.classList.add("line");
                                ip.innerHTML = typeKeys[i].toUpperCase() + " " + this.ips[typeKeys[i]][familyKeys[n]].family + ": " + this.ips[typeKeys[i]][familyKeys[n]].address;
                            }
                            appendTo.appendChild(ip);
                        }
                    }
                    if(this.config.voice && mac_address){
                        var mac = document.createElement("div");
                        mac.innerHTML = "MAC: " + mac_address;
                        appendTo.appendChild(mac);
                    }
                }
            }
        }
    },

    appendHelp: function(appendTo){
        var title = document.createElement("h1");
        title.classList.add("medium");
        title.innerHTML = this.name + " - " + this.translate("COMMAND_LIST");
        appendTo.appendChild(title);

        var mode = document.createElement("div");
        mode.innerHTML = this.translate("MODE") + ": " + this.voice.mode;
        appendTo.appendChild(mode);

        var listLabel = document.createElement("div");
        listLabel.innerHTML = this.translate("VOICE_COMMANDS") + ":";
        appendTo.appendChild(listLabel);

        var list = document.createElement("ul");
        for(var i = 0; i < this.voice.sentences.length; i++){
            var item = document.createElement("li");
            item.innerHTML = this.voice.sentences[i];
            list.appendChild(item);
        }
        appendTo.appendChild(list);
    }
});
