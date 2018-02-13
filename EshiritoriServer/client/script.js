var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MainPage = (function () {
    function MainPage() {
        var _this = this;
        // 普通の変数
        this.player = null;
        this.queryValues = null;
        this.connection = null;
        this.myRoom = null;
        this.doneLoad = false;
        this.defaultImage = null;
        // コンポーネント
        this.toolboxPanel = null; // 未実装
        this.chatPanel = null;
        this.playersPanel = null;
        this.drawLogsPanel = null;
        this.chatLog = null;
        this.chatInput = null;
        this.infoBar = null;
        this.playerList = null;
        this.doneButton = null;
        this.canvas = null;
        // イベント
        this.onload = function () { };
        this.queryValues = MainPage.getQueryValues();
        MainPage.removeQueryString();
        this.connection = new Connections.Connection2();
        this.connection.AddEventListener(Connections.Connection2Event.connect, function () {
            _this.player = new Components.Player(_this.connection.SocketId, _this.queryValues["playerName"]);
            _this.EnterRoom(function () {
                _this.MakeComponents();
                if (_this.defaultImage != null) {
                    _this.canvas.ShowImage(_this.defaultImage);
                }
                _this.addEventListeners();
            });
        });
    }
    Object.defineProperty(MainPage.prototype, "Onload", {
        // イベントのアクセサ
        set: function (func) {
            this.onload = func;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainPage.prototype, "MyRoom", {
        // アクセサ
        set: function (value) {
            this.myRoom = value;
            this.Update();
        },
        enumerable: true,
        configurable: true
    });
    MainPage.Factory = function () {
        var ret = null;
        var values = MainPage.getQueryValues();
        if (values["newRoom"] != undefined) {
            ret = new NewRoomPage();
        }
        else {
            ret = new ExistingRoomPage();
        }
        return ret;
    };
    MainPage.prototype.MakeComponents = function () {
        this.canvas = new MyCanvas.Canvas(document.getElementById("canvas"));
        this.toolboxPanel = new Components.CardPanel();
        this.toolboxPanel.HeaderText = "パレット";
        this.toolboxPanel.Generate($("#toolBox"), "palet");
        this.chatPanel = new Components.CardPanel();
        this.chatPanel.HeaderText = "チャット";
        this.chatPanel.Generate($("#chat"), "chat");
        this.playersPanel = new Components.CardPanel();
        this.playersPanel.HeaderText = "プレイヤー";
        this.playersPanel.Generate($("#playerList"), "players");
        this.drawLogsPanel = new Components.CardPanel();
        this.drawLogsPanel.HeaderText = "ログ";
        this.drawLogsPanel.ContentText = "ここに過去の絵を表示";
        this.drawLogsPanel.Generate($("#drawlog"), "drawlog");
        this.infoBar = new Components.InfomationBar();
        this.infoBar.Generate($("#yourTurn"), "yourturn");
        this.playerList = new Components.PlayerList();
        this.playerList.Generate(this.playersPanel.BodyObject, "playerlist");
        this.chatLog = new Components.ChatLog(10);
        this.chatLog.Generate(this.chatPanel.BodyObject, "chatlog");
        this.chatInput = new Components.ChatInput();
        this.chatInput.Generate(this.chatPanel.BodyObject, "chatinput");
        this.doneButton = new Components.Button();
        this.doneButton.Style = Components.ButtonStyle.primary;
        this.doneButton.Size = Components.ButtonSize.Large;
        this.doneButton.Text = "完了";
        this.doneButton.Generate($("#yourTurn"), "done");
        this.doneLoad = true;
        this.Update();
    };
    MainPage.prototype.addEventListeners = function () {
        var _this = this;
        this.connection.AddEventListener(Connections.Connection2Event.Drawed, function (data) { return _this.canvas.DrawByData(data); });
        this.connection.AddEventListener(Connections.Connection2Event.ReportCanvas, function (data, ack) {
            ack({
                image: _this.canvas.CanvasElement.toDataURL()
            });
        });
        this.connection.AddEventListener(Connections.Connection2Event.RoomUpdated, function (data) {
            _this.MyRoom = Components.Room.Parse(data.room);
        });
        this.connection.AddEventListener(Connections.Connection2Event.TurnAdd, function (data) {
            _this.MyRoom = Components.Room.Parse(data.room);
            _this.canvas.Clear();
        });
        this.canvas.LineDrawedEvent = function (data) { return _this.connection.SubmitDrawing(data, _this.myRoom.Id); };
    };
    MainPage.prototype.Update = function () {
        if (!this.doneLoad)
            return;
        this.playerList.CurrentPlayer = this.myRoom.CurrentPlayer;
        this.playerList.replacePlayers(this.myRoom.Members);
        console.log(this.myRoom, this.player);
        if (this.myRoom.CurrentPlayer.Id == this.player.Id) {
            this.infoBar.InformationType = Components.InformationType.YourTurn;
            this.doneButton.Show();
        }
        else {
            this.infoBar.InformationType = Components.InformationType.None;
            this.doneButton.Hide();
        }
    };
    MainPage.getQueryValues = function () {
        var queryStr = window.location.search;
        var values = [];
        var hash = queryStr.slice(1).split('&');
        for (var i = 0; i < hash.length; i++) {
            var ary = hash[i].split("=");
            values[ary[0]] = ary[1];
        }
        return values;
    };
    MainPage.removeQueryString = function () {
        history.pushState(null, null, "/index.html");
    };
    return MainPage;
}());
var ExistingRoomPage = (function (_super) {
    __extends(ExistingRoomPage, _super);
    function ExistingRoomPage() {
        _super.call(this);
        this.roomId = "";
        this.password = "";
    }
    ExistingRoomPage.prototype.EnterRoom = function (callback) {
        var _this = this;
        if (callback === void 0) { callback = function () { }; }
        this.roomId = this.queryValues["roomId"];
        this.password = this.queryValues["password"];
        this.connection.EnterToRoom(this.roomId, this.player.Name, this.password, function (data) {
            _this.MyRoom = Components.Room.Parse(data.room);
            callback();
        });
    };
    return ExistingRoomPage;
}(MainPage));
var NewRoomPage = (function (_super) {
    __extends(NewRoomPage, _super);
    function NewRoomPage() {
        _super.call(this);
        this.roomName = "";
        this.password = "";
        this.roomId = "";
    }
    NewRoomPage.prototype.EnterRoom = function (callback) {
        var _this = this;
        if (callback === void 0) { callback = function () { }; }
        this.roomName = this.queryValues["roomName"];
        this.password = this.queryValues["password"];
        this.connection.EnterToNewRoom(this.roomName, this.player.Name, this.password, function (data) {
            _this.MyRoom = Components.Room.Parse(data.room);
            callback();
        });
    };
    return NewRoomPage;
}(MainPage));
var page = MainPage.Factory();
//# sourceMappingURL=script.js.map