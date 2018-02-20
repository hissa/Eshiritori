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
        this.defaultLogs = [];
        // コンポーネント
        this.toolboxPanel = null;
        this.chatPanel = null;
        this.playersPanel = null;
        this.drawLogsPanel = null;
        this.chatLog = null;
        this.chatInput = null;
        this.infoBar = null;
        this.playerList = null;
        this.doneButton = null;
        this.imageLogs = null;
        this.canvas = null;
        this.colorPalette = null;
        this.penSizeSelector = null;
        this.penSizeSample = null;
        this.returnRoomListButton = null;
        this.clearCanvasButton = null;
        this.backCanvasButton = null;
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
                _this.imageLogs.LoadDataUrlArray(_this.defaultLogs);
                _this.addEventListeners();
                _this.onload();
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
        var _this = this;
        this.canvas = new MyCanvas.Canvas(document.getElementById("canvas"));
        this.canvas.LineWidth = 5;
        this.canvas.addHistory();
        this.toolboxPanel = new Components.CardPanel();
        this.toolboxPanel.HeaderText = "パレット";
        this.toolboxPanel.Generate($("#toolBox"), "palet");
        this.chatPanel = new Components.CardPanel();
        this.chatPanel.HeaderText = "チャット";
        this.chatPanel.Generate($("#chat"), "chat");
        this.playersPanel = new Components.CardPanel();
        this.playersPanel.HeaderText = "プレイヤー";
        this.playersPanel.FooterText = " ";
        this.playersPanel.Generate($("#playerList"), "players");
        this.drawLogsPanel = new Components.CardPanel();
        this.drawLogsPanel.HeaderText = "ログ";
        this.drawLogsPanel.Generate($("#drawlog"), "drawlog");
        this.infoBar = new Components.InfomationBar();
        this.infoBar.Generate($("#yourTurn"), "yourturn");
        this.playerList = new Components.PlayerList();
        this.playerList.Generate(this.playersPanel.BodyObject, "playerlist");
        this.chatLog = new Components.ChatLog(30);
        this.chatLog.Generate(this.chatPanel.BodyObject, "chatlog");
        this.chatInput = new Components.ChatInput();
        this.chatInput.Generate(this.chatPanel.BodyObject, "chatinput");
        this.doneButton = new Components.Button();
        this.doneButton.Style = Components.ButtonStyle.primary;
        this.doneButton.Size = Components.ButtonSize.Large;
        this.doneButton.Text = "完了";
        this.doneButton.Generate($("#yourTurn"), "done");
        this.imageLogs = new Components.ImageLog(5);
        this.imageLogs.Generate(this.drawLogsPanel.BodyObject, "log");
        this.toolboxPanel.BodyObject.append("<input type=\"text\" id=\"colorPicker\">");
        this.colorPalette = $("#colorPicker");
        this.colorPalette.spectrum({
            color: "#000000",
            togglePaletteOnly: true,
            showPalette: true,
            hideAfterPaletteSelect: true,
            palette: [
                ["#000000", "#ffffff"],
                ["#7d00ff", "#ff0000"],
                ["#0000ff", "#ff8500"],
                ["#33ff00", "#f2ff00"]
            ],
            change: function (color) { return _this.canvas.LineColor = color.toRgbString(); }
        });
        this.penSizeSelector = new Components.PenSizeSelector([
            5, 10, 20, 30, 50, 80, 100
        ]);
        this.penSizeSelector.Generate(this.toolboxPanel.BodyObject);
        this.penSizeSample = new Components.PenSizeSample(100, 100, 5);
        this.penSizeSample.Generate(this.toolboxPanel.BodyObject);
        this.backCanvasButton = new Components.Button();
        this.backCanvasButton.Text = "戻る";
        this.backCanvasButton.Generate(this.toolboxPanel.BodyObject);
        this.clearCanvasButton = new Components.Button();
        this.clearCanvasButton.IsOutline = true;
        this.clearCanvasButton.Style = Components.ButtonStyle.danger;
        this.clearCanvasButton.Text = "全消し";
        this.clearCanvasButton.Generate(this.toolboxPanel.BodyObject, "delete");
        this.returnRoomListButton = new Components.Button();
        this.returnRoomListButton.Style = Components.ButtonStyle.danger;
        this.returnRoomListButton.Text = "退室";
        this.returnRoomListButton.ClickedEvent = function () {
            if (!confirm("退室しますか？"))
                return;
            MainPage.returnRoomList();
        };
        this.returnRoomListButton.Generate(this.playersPanel.FooterObject, "return");
        this.doneLoad = true;
        this.Update();
    };
    MainPage.prototype.addEventListeners = function () {
        var _this = this;
        this.connection.AddEventListener(Connections.Connection2Event.Drawed, function (data) { return _this.canvas.DrawByData(data); });
        this.connection.AddEventListener(Connections.Connection2Event.ReportCanvas, function (data, ack) {
            ack({
                image: _this.canvas.CanvasElement.toDataURL(),
                logs: _this.imageLogs.toDataUrlArray()
            });
        });
        this.connection.AddEventListener(Connections.Connection2Event.RoomUpdated, function (data) {
            console.log(data);
            _this.MyRoom = Components.Room.Parse(data.room);
        });
        this.connection.AddEventListener(Connections.Connection2Event.TurnAdd, function (data) {
            _this.MyRoom = Components.Room.Parse(data.room);
            _this.imageLogs.AddImage(_this.canvas.CanvasElement.toDataURL());
            _this.canvas.Clear();
            _this.canvas.clearHistories();
            _this.canvas.addHistory();
        });
        this.connection.AddEventListener(Connections.Connection2Event.ChatReceive, function (data) {
            _this.chatLog.addMessage(new Components.ChatMessage(data.playerName, data.message));
        });
        this.connection.AddEventListener(Connections.Connection2Event.CanvasUpdated, function (data) {
            _this.canvas.Clear();
            _this.canvas.ShowImage(data.image);
        });
        this.canvas.LineDrawedEvent = function (data) { return _this.connection.SubmitDrawing(data, _this.myRoom.Id); };
        this.doneButton.ClickedEvent = function () {
            if (!confirm("完了しますか？"))
                return;
            _this.connection.DoneDrawing(_this.myRoom.Id);
        };
        this.penSizeSelector.SelectedEvent = function (size) {
            _this.penSizeSample.PenSize = size;
            _this.canvas.LineWidth = size;
        };
        this.chatInput.SendMessageEvent = function (msg) {
            _this.connection.ChatEmit(_this.myRoom.Id, _this.player.Name, msg);
        };
        this.clearCanvasButton.ClickedEvent = function () {
            if (_this.myRoom.CurrentPlayer.Id != _this.player.Id)
                return;
            if (!confirm("キャンバスを全消ししますか？"))
                return;
            _this.canvas.Clear();
            var img = _this.canvas.CanvasElement.toDataURL();
            _this.connection.CanvasUpdate(_this.myRoom.Id, img);
            _this.canvas.addHistory();
        };
        this.backCanvasButton.ClickedEvent = function () {
            if (_this.myRoom.CurrentPlayer.Id != _this.player.Id)
                return;
            _this.canvas.back(function () {
                var img = _this.canvas.CanvasElement.toDataURL();
                _this.connection.CanvasUpdate(_this.myRoom.Id, img);
            });
        };
        $(document).on("keydown", function (e) {
            // Ctrl + Z
            if (e.ctrlKey && e.keyCode == 90) {
                _this.canvas.back(function () {
                    var img = _this.canvas.CanvasElement.toDataURL();
                    _this.connection.CanvasUpdate(_this.myRoom.Id, img);
                });
            }
        });
    };
    MainPage.prototype.Update = function () {
        if (!this.doneLoad)
            return;
        this.playerList.CurrentPlayer = this.myRoom.CurrentPlayer;
        this.playerList.replacePlayers(this.myRoom.Members);
        if (this.myRoom.CurrentPlayer.Id == this.player.Id) {
            this.infoBar.InformationType = Components.InformationType.YourTurn;
            this.doneButton.Show();
            this.canvas.CanDraw = true;
        }
        else {
            this.infoBar.InformationType = Components.InformationType.None;
            this.doneButton.Hide();
            this.canvas.CanDraw = false;
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
    MainPage.returnRoomList = function () {
        window.location.href = "/";
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
            if (!data.isSuccess) {
                alert("入室に失敗しました。ルーム一覧に戻ります。");
                MainPage.returnRoomList();
            }
            _this.MyRoom = Components.Room.Parse(data.room);
            _this.defaultImage = data.canvasImage;
            _this.defaultLogs = data.logs;
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