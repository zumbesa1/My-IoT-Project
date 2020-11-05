
var app = new Vue({
    el: "#app",
    data: {
        messages: [],
        lastMessage: "",
        lengthOfMessages: messages.length
    },
    mounted: function () {
        this.initSse();
    },
    methods: {
        initSse: function () {
            if (typeof (EventSource) !== "undefined") {
                var url = window.location.origin + "/api/events";
                var source = new EventSource(url);
                source.onmessage = (event) => { 
                    this.messages.push(event.data);
                    this.lastMessage = event.data;
                    console.log("event is: " + event);
                    console.log("event Data is: " + event.data);
                    console.log("the message is: " + this.message);
                };
            } else {
                this.message = "Your browser does not support server-sent events.";
            }
        }
    }
})
