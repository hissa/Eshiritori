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
// 部屋リストの状況が更新された
function UpdateRooms() {
    var ret = [];
    Object.keys(rooms).forEach(function (key) { return ret.push(rooms[key].ToHash()); });
    io.sockets.emit("RoomsUpdated", ret);
}
// キャンバスの状態が欲しい
function SearchCanvas(roomId, callback) {
    var targetId = rooms[roomId].Members[0].Id;
    io.sockets.connected[targetId].emit("ReportCanvas", {}, function (data) {
        callback(data);
    });
}
// 部屋が更新された
function MyRoomUpdated(roomId) {
    io.in(roomId).emit("RoomUpdated", { room: rooms[roomId].ToHash() });
}
io.sockets.on("connection", function (socket) {
    console.log("Player connected.");
    //
    // Define Events
    //
    // 部屋の状況の問い合わせ
    socket.on("GetRooms", function (data, ack) {
        var ret = [];
        Object.keys(rooms).forEach(function (key) { return ret.push(rooms[key].ToHash()); });
        ack(ret);
        console.log(ret);
    });
    // 部屋の作成
    socket.on("NewRoom", function (data, ack) {
        var pass = data.password == "" ? null : data.password;
        rooms[socket.id] = (new Rooms.Room(socket.id, data.roomName, pass));
        rooms[socket.id].BeEmptyEvent = function () { return delete rooms[socket.id]; };
        ;
        ack({ roomId: rooms[socket.id].RoomId });
        UpdateRooms();
    });
    // 入室
    socket.on("EnterToRoom", function (data, ack) {
        if (rooms[data.roomId] == undefined) {
            ack({ isSuccess: false });
            return;
        }
        var canvasImage;
        rooms[data.roomId].AddPlayer(new Rooms.Player(socket.id, data.playerName));
        if (rooms[data.roomId].Members.length > 0) {
            SearchCanvas(data.roomId, function (canvasData) {
                //rooms[data.roomId].AddPlayer(new Rooms.Player(socket.id, data.playerName));
                socket.join(data.roomId);
                ack({
                    isSuccess: true,
                    room: rooms[data.roomId].ToHash(),
                    canvasImage: canvasData.image
                });
            });
        }
        else {
            //rooms[data.roomId].AddPlayer(new Rooms.Player(socket.id, data.playerName));
            socket.join(data.roomId);
            // TODO: 部屋の情報を返す
            ack({
                isSuccess: true,
                room: rooms[data.roomId].ToHash()
            });
            UpdateRooms();
        }
        MyRoomUpdated(data.roomId);
    });
    // パスワードの認証
    socket.on("VerifyPassword", function (data, ack) {
        if (rooms[data.roomId] == undefined) {
            console.log(data, rooms);
            if (!rooms[data.roomId].HasPassword) {
                ack({ success: true });
                return;
            }
            ack({ success: false });
            return;
        }
        ack({
            success: rooms[data.roomId].Password == data.inputPassword
        });
    });
    // 切断
    socket.on("disconnect", function () {
        // プレイヤーがいた部屋を特定して更新イベントを投げる
        var targetRoomId = null;
        Object.keys(rooms).forEach(function (key) {
            if (rooms[key].hasPlayer(socket.id)) {
                targetRoomId = key;
            }
        });
        // 全ての部屋に対して、このプレイヤーをRemoveするよう試みる。
        Object.keys(rooms).forEach(function (key) { return rooms[key].RemovePlayer(socket.id); });
        console.log("Player disconnected.");
        if (targetRoomId != null && rooms[targetRoomId] != undefined) {
            MyRoomUpdated(targetRoomId);
        }
        UpdateRooms();
    });
    // 線が描かれた
    socket.on("Draw", function (data) {
        socket.broadcast.to(data.roomId).emit("Drawed", data.data);
    });
    //// プレイヤーが接続
    //socket.on("Connected", name => {
    //    users[socket.id] = name;
    //    io.sockets.emit("PlayerConnected", {
    //        player: {
    //            name: name,
    //            id: socket.id
    //        }
    //    });
    //    console.log(`Connected: ${name}`);
    //});
    //// メッセージ投稿
    //socket.on("Publish", data => {
    //    io.sockets.emit("MessagePublished", {
    //        value: data.value,
    //        player: {
    //            name: users[socket.id],
    //            id: socket.id
    //        }
    //    });
    //    console.log(`Published: [${users[socket.id]}]${data.value}`);
    //});
    //// プレイヤーが切断
    //socket.on("disconnect", () => {
    //    //if (users[socket.id]) {
    //    //    let name = users[socket.id];
    //    //    delete users[socket.id];
    //    //    io.sockets.emit("PlayerDisconnected", {
    //    //        player: {
    //    //            name: name,
    //    //            id: socket.id
    //    //        }
    //    //    });
    //    //    console.log(`Disconnected: ${name}`);
    //    //}
    //    let room = io.sockets.manager.roomClients[socket.id];
    //    socket.leave(room);
    //    rooms[room].RemovePlayer(socket.id);
    //});
    //// 線の情報が到着
    //socket.on("Drawing", data => {
    //    io.sockets.emit("LineDrawed", {
    //        player: {
    //            name: users[socket.id],
    //            id: socket.id
    //        },
    //        data
    //    });
    //});
    //// 部屋の情報の問い合わせ
    //socket.on("GetRooms", data => {
    //    let ret = [];
    //    rooms.forEach(value => ret.push(value.ToHash()));
    //    io.to(socket.id).emit("GetRoomsResponse", ret);
    //});
    //// 部屋を作成
    //socket.on("NewRoom", data => {
    //    rooms[socket.id] = new Rooms.Room(socket.id, data.value.name);
    //});
    //// 部屋に接続
    //socket.on("ConnectToRoom", data => {
    //    rooms[data.id].AddPlayer(new Rooms.Player(data.value.player.id, data.value.player.name));
    //    socket.join(rooms[data.id].RoomId);
    //});
});
//# sourceMappingURL=app.js.map