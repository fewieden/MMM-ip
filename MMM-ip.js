Module.register("MMM-ip",{
    defaults: {
        fontSize: 9,
        dimmed: true,
        show: 'both'
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.ip = {};
        this.sendSocketNotification('GET_IP', {});
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        var keys = Object.keys(this.ip);
        if(keys.length > 0){
            if(this.config.dimmed){
                wrapper.classList.add('dimmed');
            }
            wrapper.style.fontSize = this.config.fontSize + 'px';
            for(var i = 0; i < keys.length; i++){
                if(this.config.show === 'both' || this.config.show === keys[i]){
                    var div = document.createElement("div");
                    div.style.lineHeight = '1.2em';
                    div.innerHTML = keys[i] + ': ' + this.ip[keys[i]];
                    wrapper.appendChild(div);
                }
            }
        }
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "IP"){
            this.ip[payload.type] = payload.ip;
            this.updateDom();
        }
    }
});
