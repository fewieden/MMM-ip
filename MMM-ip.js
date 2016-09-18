Module.register("MMM-ip",{

    ips: {},

    types: ["eth0", "wlan0"],

    defaults: {
        fontSize: 9,
        dimmed: true,
        showFamily: 'both',
        showType: 'both'
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('GET_IPS', {});
    },

    getStyles: function () {
        return ["MMM-ip.css"];
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        var typeKeys = Object.keys(this.ips);
        if(typeKeys.length > 0){
            if(this.config.dimmed){
                wrapper.classList.add('dimmed');
            }
            wrapper.style.fontSize = this.config.fontSize + 'px';
            for(var i = 0; i < typeKeys.length; i++){
                if((this.config.showType === 'both' || this.config.showType === typeKeys[i]) && this.types.indexOf(typeKeys[i]) !== -1){
                    var familyKeys = Object.keys(this.ips[typeKeys[i]]);
                    if(familyKeys.length > 0){
                        if(this.config.dimmed){
                            wrapper.classList.add('dimmed');
                        }
                        wrapper.style.fontSize = this.config.fontSize + 'px';
                        for(var n = 0; n < familyKeys.length; n++){
                            if(this.config.showFamily === 'both' || this.config.showFamily === this.ips[typeKeys[i]][familyKeys[n]].family){
                                var div = document.createElement("div");
                                div.classList.add("line");
                                div.innerHTML = typeKeys[i].toUpperCase() + " " + this.ips[typeKeys[i]][familyKeys[n]].family + ": " + this.ips[typeKeys[i]][familyKeys[n]].address;
                                wrapper.appendChild(div);
                            }
                        }
                    }
                }
            }
        }
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "IPS"){
            this.ips = payload;
            this.updateDom();
        }
    }
});
