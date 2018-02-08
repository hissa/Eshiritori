"use strict";
var fs = require("fs");
var http = require("http");
var socketio = require("socket.io");
var app = require("express")();
var Rooms = require("./Room");
// Create Server
var server = http.Server(app);
server.listen(11451, function () {
    console.log("Server is running...");
});
// Routing
app.get("/:file", function (req, res) {
    res.sendFile(__dirname + "/client/" + req.params.file);
});
app.get("/", function (req, res) {
    // "/"の場合はトップページ
    res.sendFile(__dirname + "/client/rooms.html");
});
// Use Socket.IO
var io = socketio.listen(server);
var users = {};
var rooms = [];
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
        //if (users[socket.id]) {
        //    let name = users[socket.id];
        //    delete users[socket.id];
        //    io.sockets.emit("PlayerDisconnected", {
        //        player: {
        //            name: name,
        //            id: socket.id
        //        }
        //    });
        //    console.log(`Disconnected: ${name}`);
        //}
        var room = io.sockets.manager.roomClients[socket.id];
        socket.leave(room);
        rooms[room].RemovePlayer(socket.id);
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
    // 部屋の情報の問い合わせ
    socket.on("GetRooms", function (data) {
        var ret = [];
        rooms.forEach(function (value) { return ret.push(value.ToHash()); });
        io.to(socket.id).emit("GetRoomsResponse", ret);
    });
    // 部屋を作成
    socket.on("NewRoom", function (data) {
        rooms[socket.id] = new Rooms.Room(socket.id, data.value.name);
    });
    // 部屋に接続
    socket.on("ConnectToRoom", function (data) {
        rooms[data.id].AddPlayer(new Rooms.Player(data.value.player.id, data.value.player.name));
        socket.join(rooms[data.id].RoomId);
    });
});
//# sourceMappingURL=app.js.map