"use strict";
var fs = require("fs");
var http = require("http");
var socketio = require("socket.io");
var app = require("express")();
var Rooms = require("./Room");
// エラーで落ちないように
process.on('uncaughtException', function (err) { return console.log(err); });
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
    try {
        var ret_1 = [];
        Object.keys(rooms).forEach(function (key) { return ret_1.push(rooms[key].ToHash()); });
        io.sockets.emit("RoomsUpdated", ret_1);
    }
    catch (e) {
        ShowError(e);
    }
}
// キャンバスの状態が欲しい
function SearchCanvas(roomId, callback) {
    try {
        var targetId = rooms[roomId].Members[0].Id;
        io.sockets.connected[targetId].emit("ReportCanvas", {}, function (data) {
            callback(data);
        });
    }
    catch (e) {
        ShowError(e);
    }
}
// 部屋が更新された
function MyRoomUpdated(roomId) {
    try {
        if (rooms[roomId] == undefined)
            return;
        io.in(roomId).emit("RoomUpdated", { room: rooms[roomId].ToHash() });
    }
    catch (e) {
        ShowError(e);
    }
}
// ターンが更新された
function TurnUpdate(roomId) {
    try {
        io.in(roomId).emit("TurnAdd", { room: rooms[roomId].ToHash() });
    }
    catch (e) {
        ShowError(e);
    }
}
try {
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
            if (rooms[data.roomId].Members.length > 0) {
                SearchCanvas(data.roomId, function (canvasData) {
                    socket.join(data.roomId);
                    rooms[data.roomId].AddPlayer(new Rooms.Player(socket.id, data.playerName));
                    ack({
                        isSuccess: true,
                        room: rooms[data.roomId].ToHash(),
                        canvasImage: canvasData.image,
                        logs: canvasData.logs
                    });
                    UpdateRooms();
                    MyRoomUpdated(data.roomId);
                });
            }
            else {
                socket.join(data.roomId);
                rooms[data.roomId].AddPlayer(new Rooms.Player(socket.id, data.playerName));
                // TODO: 部屋の情報を返す
                ack({
                    isSuccess: true,
                    room: rooms[data.roomId].ToHash()
                });
                UpdateRooms();
                MyRoomUpdated(data.roomId);
            }
            //UpdateRooms();
            //MyRoomUpdated(data.roomId);
        });
        // パスワードの認証
        socket.on("VerifyPassword", function (data, ack) {
            if (rooms[data.roomId] == undefined) {
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
            // そのプレイヤーの手番だった場合手番更新イベントも投げる
            var targetRoomId = null;
            var turnUpdate = false;
            Object.keys(rooms).forEach(function (key) {
                if (rooms[key].hasPlayer(socket.id)) {
                    targetRoomId = key;
                    if (rooms[key].TurnPlayer.Id == socket.id) {
                        turnUpdate = true;
                    }
                }
            });
            // 全ての部屋に対して、このプレイヤーをRemoveするよう試みる。
            Object.keys(rooms).forEach(function (key) { return rooms[key].RemovePlayer(socket.id); });
            if (targetRoomId != null && rooms[targetRoomId] != undefined) {
                MyRoomUpdated(targetRoomId);
                if (turnUpdate) {
                    TurnUpdate(targetRoomId);
                }
            }
            UpdateRooms();
        });
        // 線が描かれた
        socket.on("Draw", function (data) {
            socket.broadcast.to(data.roomId).emit("Drawed", data.data);
        });
        // お絵かき完了、手番進む
        socket.on("DoneDrawing", function (data) {
            rooms[data.roomId].addTurn();
            TurnUpdate(data.roomId);
        });
        // チャットを受信
        socket.on("ChatEmit", function (data) {
            io.in(data.roomId).emit("ChatReceive", { playerName: data.playerName, message: data.message });
        });
    });
}
catch (e) {
    ShowError(e);
}
function ShowError(e) {
    console.log("Error:", e);
    console.log(rooms);
}
//# sourceMappingURL=app.js.map