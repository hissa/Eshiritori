var fs = require("fs");
var http = require("http");
var socketio = require("socket.io");
var app = require("express")();
// Create Server
var server = http.Server(app);
server.listen(11451, function () {
    console.log("Server is running...");
});
// Routing
app.get("/:file", function (req, res) {
    if (req.params.file == "/") {
        res.sendFile(__dirname + "/client/index.html");
        return;
    }
    res.sendFile(__dirname + "/client/" + req.params.file);
});
// Use Socket.IO
var io = socketio.listen(server);
var users = {};
io.sockets.on("connection", function (socket) {
    // Define Events
    // プレイヤーが接続
    socket.on("Connected", function (name) {
        users[socket.id] = name;
        io.sockets.emit("PlayerConnected", {
            player: {
                name: name,
                id: socket.id
            }
        });
        console.log("Connected: " + name);
    });
    // メッセージ投稿
    socket.on("Publish", function (data) {
        io.sockets.emit("MessagePublished", {
            value: data.value,
            player: {
                name: users[socket.id],
                id: socket.id
            }
        });
        console.log("Published: [" + users[socket.id] + "]" + data.value);
    });
    // プレイヤーが切断
    socket.on("disconnect", function () {
        if (users[socket.id]) {
            var name_1 = users[socket.id];
            delete users[socket.id];
            io.sockets.emit("PlayerDisconnected", {
                player: {
                    name: name_1,
                    id: socket.id
                }
            });
            console.log("Disconnected: " + name_1);
        }
    });
    // 線の情報が到着
    socket.on("Drawing", function (data) {
        io.sockets.emit("LineDrawed", {
            player: {
                name: users[socket.id],
                id: socket.id
            },
            data: data
        });
    });
});
//# sourceMappingURL=app.js.map