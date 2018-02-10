var Connections;
(function (Connections) {
    /**
     * プレイヤーの情報を持つクラス
     */
    var Player = (function () {
        /**
         * Playerクラスのコンストラクタ
         * @param name プレイヤー名
         */
        function Player(name) {
            this.Name = name;
        }
        Object.defineProperty(Player.prototype, "Name", {
            get: function () {
                return this.name;
            },
            set: function (value) {
                this.name = value;
            },
            enumerable: true,
            configurable: true
        });
        return Player;
    }());
    Connections.Player = Player;
    (function (SocketEvent) {
        SocketEvent[SocketEvent["PlayerConnected"] = 0] = "PlayerConnected";
        SocketEvent[SocketEvent["PlayerDisconnected"] = 1] = "PlayerDisconnected";
        SocketEvent[SocketEvent["MessagePublished"] = 2] = "MessagePublished";
        SocketEvent[SocketEvent["LineDrawed"] = 3] = "LineDrawed";
        SocketEvent[SocketEvent["GetRoomsResponse"] = 4] = "GetRoomsResponse";
    })(Connections.SocketEvent || (Connections.SocketEvent = {}));
    var SocketEvent = Connections.SocketEvent;
    ;
    var Connection = (function () {
        /**
         * Connectionクラスのコンストラクタ
         * @param url socket.ioのためのURL
         */
        function Connection(url) {
            this.socketio = io.connect(url);
            this.initEventListeners();
        }
        Object.defineProperty(Connection.prototype, "Id", {
            get: function () {
                return this.socketio.id;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 部屋に接続します。
         * @param player プレイヤーの情報
         */
        Connection.prototype.connect = function (player) {
            this.player = player;
            this.socketio.emit("Connected", player.Name);
        };
        /**
         * メッセージを発信します。
         * @param message メッセージ
         */
        Connection.prototype.publishMessage = function (message) {
            this.socketio.emit("Publish", { value: message });
        };
        /**
         * 線の情報を送信します。
         * @param data 線のデータ
         */
        Connection.prototype.draw = function (data) {
            this.socketio.emit("Drawing", data);
        };
        /**
         * 部屋一覧を取得します。
         * レスポンスはGetRoomsResponseイベントが発火されます。
         */
        Connection.prototype.getRooms = function () {
            this.socketio.emit("GetRooms", {});
        };
        /**
         * Socket.IOのイベントに対してイベントリスナーをセットします。
         * @param event イベントの種類
         * @param func 実行する処理
         */
        Connection.prototype.setEventListener = function (event, func) {
            this.socketio.off(SocketEvent[event]);
            this.socketio.on(SocketEvent[event], func);
        };
        Connection.prototype.initEventListeners = function () {
            this.socketio.on(SocketEvent[SocketEvent.MessagePublished], function () { });
            this.socketio.on(SocketEvent[SocketEvent.PlayerConnected], function () { });
            this.socketio.on(SocketEvent[SocketEvent.PlayerDisconnected], function () { });
            this.socketio.on(SocketEvent[SocketEvent.LineDrawed], function () { });
            this.socketio.on(SocketEvent[SocketEvent.GetRoomsResponse], function () { });
        };
        return Connection;
    }());
    Connections.Connection = Connection;
    (function (Connection2Event) {
        Connection2Event[Connection2Event["RoomsUpdated"] = 0] = "RoomsUpdated";
    })(Connections.Connection2Event || (Connections.Connection2Event = {}));
    var Connection2Event = Connections.Connection2Event;
    ;
    var Connection2 = (function () {
        function Connection2() {
            this.socket = null;
            this.playerName = null;
            this.socket = io.connect("/");
        }
        Object.defineProperty(Connection2.prototype, "PlayerName", {
            get: function () {
                return this.playerName;
            },
            set: function (value) {
                this.playerName = value;
            },
            enumerable: true,
            configurable: true
        });
        Connection2.prototype.EnterToNewRoom = function (roomName, playerName, password, callback) {
            var _this = this;
            if (password === void 0) { password = ""; }
            this.socket.emit("NewRoom", { roomName: roomName, password: password }, function (retData) {
                var roomId = retData.roomId;
                _this.socket.emit("EnterToRoom", { roomId: roomId, playerName: playerName, password: password }, function (retData2) {
                    callback(retData2);
                });
            });
        };
        Connection2.prototype.EnterToRoom = function (roomId, playerName, password, callback) {
            if (password === void 0) { password = ""; }
            this.socket.emit("EnterToRoom", { roomId: roomId, playerName: playerName, password: password }, function (data) { return callback(data); });
        };
        Connection2.prototype.GetRooms = function (callback) {
            this.socket.emit("GetRooms", {}, function (data) { return callback(data); });
        };
        Connection2.prototype.VerifyPassword = function (roomId, inputPassword, callback) {
            this.socket.emit("VerifyPassword", {
                inputPassword: inputPassword,
                roomId: roomId
            }, function (data) { return callback(data.success); });
        };
        Connection2.prototype.AddEventListener = function (event, func) {
            this.socket.on(Connection2Event[event], func);
        };
        return Connection2;
    }());
    Connections.Connection2 = Connection2;
})(Connections || (Connections = {}));
//# sourceMappingURL=Connection.js.map