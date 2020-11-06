
// remember the last event so that we can check if two buttons were pressed within 1 second
var lastBumpEvent = {
    deviceId: "",
    timestamp: 0
}

// remember how many times the buttons were pressed
var connectionCounter = 0;

// react on the "blinkingStateChanged" Event
function handleBlinkingStateChanged (event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    let evData = ev.data; // the data from the argon event: "started blinking" or "stopped blinking"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event

    // the data we want to send to the clients
    let data = {
        message: evData, // just forward "started blinking" or "stopped blinking"
    }
    console.log("Data:");
    console.log(data);

    // send data to all connected clients
    sendData("blinkingStateChanged", data, evDeviceId, evTimestamp );
}
// react on the "connectionStateBump" Event
function handleConnectionStateBumpChanged(event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    let evData = ev.data; // the data from the argon event: "pressed" or "released"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event

    // helper variables that we need to build the message to be sent to the clients
    let sync = false;
    let msg = "";

    if (evData === "connected") {
        connectionCounter++; // increase the connectionCounter by 1
        msg = "connected";

        // check if the last two button press events were whithin 1 second
        if (evTimestamp - lastBumpEvent.timestamp < 1000) {
            if (evDeviceId !== lastBumpEvent.deviceId) {
                sync = true;
            }
        }
        lastBumpEvent.timestamp = evTimestamp;
        lastBumpEvent.deviceId = evDeviceId;
    } 
    else if (evData === "disconnected") {
        msg = "disconnected";
    }
    else {
        msg = "unknown state";
    }

    // the data we want to send to the clients
    let data = {
        message: msg,
        counter: connectionCounter,
        pressedSync: sync
    }
    console.log("Data:");
    console.log(data);

    // send data to all connected clients
    sendData("connectionStateBump", data, evDeviceId, evTimestamp );
}

// react on the "blinkingStateChanged" Event
function handleAlreadyConnected (event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    let evData = ev.data; // the data from the argon event: message
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event

    // the data we want to send to the clients
    let data = {
        message: evData, // just forward "started blinking" or "stopped blinking"
    }
    console.log("Data:");
    console.log(data);
    // send data to all connected clients
    sendData("alreadyConnectetMessage", data, evDeviceId, evTimestamp );
    
}
// react on the "blinkingStateChanged" Event
function handleAlreadyDisconnected (event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    let evData = ev.data; // the data from the argon event: message
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event

    // the data we want to send to the clients
    let data = {
        message: evData, // just forward "started blinking" or "stopped blinking"
    }
    console.log("Data:");
    console.log(data);
    // send data to all connected clients
    sendData("alreadyDisconnectedMessage", data, evDeviceId, evTimestamp );
}


// send data to the clients.
// You don't have to change this function
function sendData(evName, evData, evDeviceId, evTimestamp ) {
    
    // map device id to device nr
    let nr = exports.deviceIds.indexOf(evDeviceId)

    // the message that we send to the client
    let data = {
        eventName: evName,
        eventData: evData,
        deviceNumber: nr,
        timestamp: evTimestamp,
    };

    // send the data to all connected clients
    exports.sse.send(data)
}

exports.deviceIds = [];
exports.sse = null;

// export your own functions here as well
exports.handleBlinkingStateChanged = handleBlinkingStateChanged;
exports.handleConnectionStateBumpChanged = handleConnectionStateBumpChanged;
exports.handleAlreadyConnected = handleAlreadyConnected;
exports.handleAlreadyDisconnected = handleAlreadyDisconnected;
