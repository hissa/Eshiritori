"use strict";
var Room = (function () {
    function Room(roomId, roomName, password) {
        if (password === void 0) { password = null; }
        this.roomName = null;
        this.members = [];
        this.password = null;
        this.roomId = null;
        this.beEmptyEvent = function () { };
        // membersのインデックス
        this.turn = 0;
        this.RoomName = roomName;
        this.roomId = roomId;
        this.password = password;
    }
    Object.defineProperty(Room.prototype, "RoomName", {
        get: function () {
            return this.roomName;
        },
        set: function (value) {
            this.roomName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "Members", {
        get: function () {
            return this.members;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "Password", {
        get: function () {
            return this.password;
        },
        set: function (value) {
            this.password = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "HasPassword", {
        get: function () {
            return this.password != null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "RoomId", {
        get: function () {
            return this.roomId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "BeEmptyEvent", {
        set: function (func) {
            this.beEmptyEvent = func;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "Turn", {
        get: function () {
            return this.turn;
        },
        set: function (value) {
            this.turn = value % this.members.length - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "TurnPlayer", {
        get: function () {
            return this.Members[this.Turn];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "TurnPlayerId", {
        set: function (id) {
            var _this = this;
            var success = false;
            this.members.forEach(function (value, index) {
                if (value.Id == id) {
                    _this.Turn = index;
                    success = true;
                }
            });
            if (!success) {
                // やめて
                console.log("has error at set TurnPlayerId().");
            }
        },
        enumerable: true,
        configurable: true
    });
    Room.prototype.AddPlayer = function (player) {
        this.members.push(player);
    };
    Room.prototype.RemovePlayer = function (playerId) {
        var remIndex = null;
        this.Members.forEach(function (value, index) {
            if (value.Id == playerId) {
                remIndex = index;
            }
        });
        if (remIndex != null) {
            this.members.splice(remIndex, 1);
        }
        if (this.Members.length <= 0) {
            this.beEmptyEvent(this);
        }
    };
    Room.prototype.ToHash = function () {
        var membersHash = [];
        this.members.forEach(function (value) {
            membersHash.push(value.ToHash());
        });
        return {
            name: this.RoomName,
            members: membersHash,
            hasPassword: this.HasPassword,
            id: this.RoomId,
            turnPlayer: this.members.length > 0 ? this.TurnPlayer.ToHash() : null
        };
    };
    Room.prototype.addTurn = function () {
        this.Turn = this.Turn + 1;
    };
    Room.prototype.hasPlayer = function (id) {
        var ret = false;
        this.members.forEach(function (value) {
            if (value.Id == id) {
                ret = true;
            }
        });
        return ret;
    };
    return Room;
}());
exports.Room = Room;
var Player = (function () {
    function Player(id, name) {
        this.id = null;
        this.name = null;
        this.id = id;
        this.name = name;
    }
    Object.defineProperty(Player.prototype, "Id", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "Name", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.ToHash = function () {
        return {
            id: this.id,
            name: this.name
        };
    };
    Player.Parse = function (data) {
        return new Player(data.id, data.name);
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=Room.js.map