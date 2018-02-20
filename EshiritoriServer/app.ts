const fs = require("fs");
const http = require("http");
const socketio = require("socket.io");
const app = require("express")();
import Rooms = require("./Room");

// エラーで落ちないように
process.on('uncaughtException', err => console.log(err));

// Create Server
const server = http.Server(app);
server.listen(11451, () => {
    console.log("Server is running...");
});

// Routing
app.get("/:file", (req, res) => {
    res.sendFile(`${__dirname}/client/${req.params.file}`);
});
app.get("/", (req, res) => {
    // "/"の場合はトップページ
    res.sendFile(`${__dirname}/client/rooms.html`);    
});

// Use Socket.IO
const io = socketio.listen(server);

let users = {};
let rooms: Rooms.Room[] = [];
// 部屋リストの状況が更新された
function UpdateRooms() {
    try {
        let ret = [];
        Object.keys(rooms).forEach(key => ret.push(rooms[key].ToHash()));
        io.sockets.emit("RoomsUpdated", ret);
    } catch (e) {
        ShowError(e);
    }
}

// キャンバスの状態が欲しい
function SearchCanvas(roomId: string, callback: (data) => void) {
    try {
        let targetId = rooms[roomId].Members[0].Id;
        io.sockets.connected[targetId].emit("ReportCanvas", {}, data => {
            callback(data);
        });
    } catch (e) {
        ShowError(e);
    }
}

// 部屋が更新された
function MyRoomUpdated(roomId) {
    try {
        if (rooms[roomId] == undefined) return;
        io.in(roomId).emit("RoomUpdated", { room: rooms[roomId].ToHash() });
    } catch (e) {
        ShowError(e);
    }
}

// ターンが更新された
function TurnUpdate(roomId) {
    try {
        io.in(roomId).emit("TurnAdd", { room: rooms[roomId].ToHash() });
    } catch (e) {
        ShowError(e);
    }
}

try {
    io.sockets.on("connection", socket => {
        console.log("Player connected.");

        //
        // Define Events
        //

        // 部屋の状況の問い合わせ
        socket.on("GetRooms", (data, ack) => {
            let ret = [];
            Object.keys(rooms).forEach(key => ret.push(rooms[key].ToHash()));
            ack(ret);
        });

        // 部屋の作成
        socket.on("NewRoom", (data, ack) => {
            let pass = data.password == "" ? null : data.password;
            rooms[socket.id] = (new Rooms.Room(socket.id, data.roomName, pass));
            rooms[socket.id].BeEmptyEvent = () => delete rooms[socket.id];;
            ack({ roomId: rooms[socket.id].RoomId });
            UpdateRooms();
        });

        // 入室
        socket.on("EnterToRoom", (data, ack) => {
            if (rooms[data.roomId] == undefined) {
                ack({ isSuccess: false });
                return;
            }
            if (rooms[data.roomId].Members.length > 0) {
                SearchCanvas(data.roomId, (canvasData) => {
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
            } else {
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
        socket.on("VerifyPassword", (data, ack) => {
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
        socket.on("disconnect", () => {
            // プレイヤーがいた部屋を特定して更新イベントを投げる
            // そのプレイヤーの手番だった場合手番更新イベントも投げる
            let targetRoomId: string = null;
            let turnUpdate: boolean = false;
            Object.keys(rooms).forEach(key => {
                if (rooms[key].hasPlayer(socket.id)) {
                    targetRoomId = key;
                    if (rooms[key].TurnPlayer.Id == socket.id) {
                        turnUpdate = true;
                    }
                }
            });
            // 全ての部屋に対して、このプレイヤーをRemoveするよう試みる。
            Object.keys(rooms).forEach(key => rooms[key].RemovePlayer(socket.id));

            if (targetRoomId != null && rooms[targetRoomId] != undefined) {
                MyRoomUpdated(targetRoomId);
                if (turnUpdate) {
                    TurnUpdate(targetRoomId);
                }
            }
            UpdateRooms();
        });

        // 線が描かれた
        socket.on("Draw", data => {
            socket.broadcast.to(data.roomId).emit("Drawed", data.data);
        });

        // お絵かき完了、手番進む
        socket.on("DoneDrawing", data => {
            rooms[data.roomId].addTurn();
            TurnUpdate(data.roomId);
        });

        // チャットを受信
        socket.on("ChatEmit", data => {
            io.in(data.roomId).emit("ChatReceive", { playerName: data.playerName, message: data.message });
        });

        // キャンバスの状態が更新
        socket.on("CanvasUpdate", data => {
            socket.broadcast.to(data.roomId).emit("CanvasUpdated", { image: data.image });
        });
    });
} catch (e) {
    ShowError(e);
}

function ShowError(e: Error) {
    console.log("Error:", e);
    console.log(rooms);
}