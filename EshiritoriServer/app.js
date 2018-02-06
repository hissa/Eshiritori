var fs = require("fs");
var http = require("http");
var socketio = require("socket.io");
var app = require("express")();
var server = http.Server(app);
server.listen(11451, function () {
    console.log("Server is running...");
});
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/client/index.html");
});
app.get("/script.js", function (req, res) {
    res.sendFile(__dirname + "/client/script.js");
});
app.get("/MyCanvas.js", function (req, res) {
    res.sendFile(__dirname + "/client/MyCanvas.js");
});
app.get("/style.css", function (req, res) {
    res.sendFile(__dirname + "/client/style.css");
});
var io = socketio.listen(server);
var users = {};
io.sockets.on("connection", function (socket) {
    socket.on("connected", function (name) {
        var msg = name + "\u3055\u3093\u304C\u5165\u5BA4\u3057\u307E\u3057\u305F\u3002";
        users[socket.id] = name;
        io.sockets.emit("publish", { value: msg });
    });
    socket.on("publish", function (data) {
        io.sockets.emit("publish", { value: data.value });
    });
    socket.on("disconnect", function () {
        if (users[socket.id]) {
            var msg = users[socket.id] + "\u3055\u3093\u304C\u9000\u5BA4\u3057\u307E\u3057\u305F\u3002";
            delete users[socket.id];
            io.sockets.emit("publish", { value: msg });
        }
    });
});
//# sourceMappingURL=app.js.map