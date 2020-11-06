var rootUrl = window.location.origin; // get the root URL, e.g. https://example.herokuapp.com

var app = new Vue({
    el: "#app",
    data: {
        connectionState_0: "unknown", // the state of the button on device 0
        connectionState_1: "unknown", // the state of the button on device 1
        connectionCounter: 0,    // how many times the buttons were pressed
        connnectionSync: false,       // true if the buttons were pressed within 1 second
        blinking_0: false,        // true if device 0 is blinking.
        blinking_1: false,        // true if device 0 is blinking.
        
        // add your own variables here ...
    },
    // This function is executed once when the page is loaded.
    mounted: function () {
        this.initSse();
    },
    methods: {
        // Initialise the Event Stream (Server Sent Events)
        // You don't have to change this function
        initSse: function () {
            if (typeof (EventSource) !== "undefined") {
                var url = rootUrl + "/api/events";
                var source = new EventSource(url);
                source.onmessage = (event) => {
                    this.updateVariables(JSON.parse(event.data));
                };
            } else {
                this.message = "Your browser does not support server-sent events.";
            }
        },
        // react on events: update the variables to be displayed
        updateVariables(ev) {
            // Event "buttonStateChanged"
            if (ev.eventName === "connectionStateBump") {
                this.connectionCounter = ev.eventData.counter;
                if (ev.eventData.message === "connected") {
                    this.connnectionSync = ev.eventData.pressedSync;
                }
            }
            // Event "blinkingStateChanged"
            else if (ev.eventName === "blinkingStateChanged") {
                if (ev.eventData.message === "started blinking") {
                    if (ev.deviceNumber === 0) {
                        this.blinking_0 = true;
                    }
                    else if (ev.deviceNumber === 1) {
                        this.blinking_1 = true;
                    }
                }
                if (ev.eventData.message === "stopped blinking") {
                    if (ev.deviceNumber === 0) {
                        this.blinking_0 = false;
                    }
                    else if (ev.deviceNumber === 1) {
                        this.blinking_1 = false;
                    }
                }
            }
        },
        // call the function "blinkRed" in your backend
        blinkRed: function (nr) {
            var duration = 2000; // blinking duration in milliseconds
            axios.post(rootUrl + "/api/device/" + nr + "/function/blinkRed", { arg: duration })
                .then(response => {
                    // Handle the response from the server
                    console.log(response.data); // we could to something meaningful with the return value here ... 
                })
                .catch(error => {
                    alert("Could not call the function 'blinkRed' of device number " + nr + ".\n\n" + error)
                })
        },
        // call the function "connectDevicesByButton" in your backend
        connectDevicesByButton: function (nr) {
            if(nr==0){
                var duration = 2000; // blinking duration in milliseconds
                axios.post(rootUrl + "/api/device/"+nr+"/function/connectDevicesByButton", { arg: duration })
                    .then(response => {
                        // Handle the response from the server
                        console.log("SUCCESS");
                        console.log(response.data); // we could to something meaningful with the return value here ... 
                    })
                    .catch(error => {
                        console.log("FAIL");
                        alert("Could not call the function 'connectDevicesByButton' of device number " + nr + ".\n\n" + error)
                    })
            }
            else{
                var duration = 2000; // blinking duration in milliseconds
                axios.post(rootUrl + "/api/device/"+nr+"/function/connectDevicesByButton", { arg: duration })
                .then(response => {
                    // Handle the response from the server
                        console.log("SUCCESS");
                    console.log(response.data); // we could to something meaningful with the return value here ... 
                })
                .catch(error => {
                    console.log("FAIL");
                    alert("Could not call the function 'connectDevicesByButton' of device number " + nr + ".\n\n" + error)
                })
            }
            
        },
        // call the function "disconnectDevicesByButton" in your backend
        disconnectDevicesByButton: function (nr) {
            var duration = 2000; // blinking duration in milliseconds
            if(nr == 0){
                axios.post(rootUrl + "/api/device/"+nr+"/function/disconnectDevicesByButton", { arg: duration })
                .then(response => {
                    // Handle the response from the server
                        console.log("SUCCESS");
                    console.log(response.data); // we could to something meaningful with the return value here ... 
                })
                .catch(error => {
                    console.log("FAIL");
                    alert("Could not call the function 'disconnectDevicesByButton' of device number " + nr + ".\n\n" + error)
                })
                //-------------------------
            }
            else{
                var duration = 2000; // blinking duration in milliseconds
                axios.post(rootUrl + "/api/device/"+nr+"/function/disconnectDevicesByButton", { arg: duration })
                    .then(response => {
                        // Handle the response from the server
                        console.log("SUCCESS");
                        console.log(response.data); // we could to something meaningful with the return value here ... 
                    })
                    .catch(error => {
                        console.log("FAIL");
                        alert("Could not call the function 'disconnectDevicesByButton' of device number" + nr + ".\n\n" + error)
                    }) 
            }

        },
        // get the value of the variable "connectionState" on the device with number "nr" from your backend
        getConnectionState: function (nr) {
            axios.get(rootUrl + "/api/device/" + nr + "/variable/connectionState")
                .then(response => {
                    // Handle the response from the server
                    var connectionState = response.data.result;
                    if (nr === 0) {
                        this.connectionState_0 = connectionState;
                    }
                    else if (nr === 1) {
                        this.connectionState_1 = connectionState;
                    }
                    else {
                        console.log("unknown device number: " + nr);
                    }
                    console.log(connectionState);
                })
                .catch(error => {
                    alert("Could not read the button state of device number " + nr + ".\n\n" + error)
                })
        }
    }
})
