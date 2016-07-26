Module.register("MMM-ip",{
    defaults: {
        fontSize: 9,
        dimmed: true
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('GET_IP', {});
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        if(this.ip){
            wrapper.innerHTML = "MagicMirror: " + this.ip;
            if(this.config.dimmed){
                wrapper.classList.add('dimmed');
            }
            wrapper.style.fontSize = this.config.fontSize + 'px';
        }
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "IP"){
            this.ip = payload;
            this.updateDom();
        }
    }
});