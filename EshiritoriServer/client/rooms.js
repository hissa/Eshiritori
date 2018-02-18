var RoomsPage = (function () {
    function RoomsPage() {
        var _this = this;
        this.connection = new Connections.Connection2();
        this.connection.AddEventListener(Connections.Connection2Event.connect, function () {
            _this.MakeComponents();
            _this.AddEventListeners();
            _this.connection.GetRooms(function (data) {
                _this.setRooms(data);
                _this.Update();
            });
        });
    }
    RoomsPage.prototype.MakeComponents = function () {
        this.card = new Components.CardPanel();
        this.card.HeaderText = "ルーム一覧";
        this.card.Generate($("#body"), "roomList");
        this.newRoomButton = new Components.Button();
        this.newRoomButton.Size = Components.ButtonSize.Block;
        this.newRoomButton.Style = Components.ButtonStyle.primary;
        this.newRoomButton.Text = "新しい部屋を作成";
        this.newRoomButton.Generate(this.card.BodyObject);
        this.table = new Components.RoomList();
        this.table.Generate(this.card.BodyObject);
        this.newRoomModal = new Components.NewRoomModal();
        this.newRoomModal.Generate($("body"));
    };
    RoomsPage.prototype.AddEventListeners = function () {
        var _this = this;
        this.connection.AddEventListener(Connections.Connection2Event.RoomsUpdated, function (data) {
            _this.setRooms(data);
            _this.Update();
        });
        this.newRoomModal.ClickedEnterRoomEvent = function (data) {
            RoomsPage.jumpNewRoom(data.roomName, data.password, data.playerName);
        };
        this.newRoomButton.ClickedEvent = function () {
            _this.newRoomModal.Show();
        };
        this.table.ClickedEnterRoomEvent = function (sender) {
            _this.EnterRoomModal = new Components.RoomModal(sender);
            _this.EnterRoomModal.Generate($("body"));
            _this.EnterRoomModal.Show();
            _this.EnterRoomModal.ClickedEnterRoomEvent = function (data) {
                if (!data.room.HasPassword) {
                    RoomsPage.jump(data.room.Id, data.password, data.playerName);
                }
                _this.connection.VerifyPassword(data.room.Id, data.password, function (success) {
                    if (success) {
                        RoomsPage.jump(data.room.Id, data.password, data.playerName);
                    }
                    else {
                        _this.EnterRoomModal.InvalidPassword();
                    }
                });
            };
        };
    };
    RoomsPage.prototype.setRooms = function (data) {
        var _this = this;
        this.rooms = [];
        data.forEach(function (value) {
            var members = [];
            value.members.forEach(function (player) {
                members.push(new Components.Player(player.id, player.name));
            });
            _this.rooms.push(new Components.Room(value.id, value.name, members, value.hasPassword));
        });
    };
    RoomsPage.prototype.Update = function () {
        this.table.Rooms = this.rooms;
    };
    RoomsPage.jumpNewRoom = function (roomName, password, playerName) {
        var query = "?roomName=" + roomName + "&password=" + password + "&playerName=" + playerName + "&newRoom=true";
        window.location.href = "/index.html" + query;
    };
    RoomsPage.jump = function (roomId, password, playerName) {
        var query = "?roomId=" + roomId + "&password=" + password + "&playerName=" + playerName;
        window.location.href = "/index.html" + query;
    };
    return RoomsPage;
}());
var roompage = new RoomsPage();
//# sourceMappingURL=rooms.js.map