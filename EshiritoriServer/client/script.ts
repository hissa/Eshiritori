abstract class MainPage {
    // 普通の変数
    protected player: Components.Player = null;
    protected queryValues = null;
    protected connection: Connections.Connection2 = null;
    protected myRoom: Components.Room = null;
    protected doneLoad = false;
    protected defaultImage: string = null;
    protected defaultLogs: string[] = [];
    // コンポーネント
    protected toolboxPanel: Components.CardPanel = null;
    protected chatPanel: Components.CardPanel = null;
    protected playersPanel: Components.CardPanel = null;
    protected drawLogsPanel: Components.CardPanel = null;
    protected chatLog: Components.ChatLog = null;
    protected chatInput: Components.ChatInput = null;
    protected infoBar: Components.InfomationBar = null;
    protected playerList: Components.PlayerList = null;
    protected doneButton: Components.Button = null;
    protected imageLogs: Components.ImageLog = null;
    protected canvas: MyCanvas.Canvas = null;
    protected colorPalette: JQuery = null;
    protected penSizeSelector: Components.PenSizeSelector = null;
    protected penSizeSample: Components.PenSizeSample = null;
    protected returnRoomListButton: Components.Button = null;
    // イベント
    protected onload: () => void = () => { };

    // イベントのアクセサ
    set Onload(func: () => void) {
        this.onload = func;
    }

    // アクセサ
    set MyRoom(value: Components.Room) {
        this.myRoom = value;
        this.Update();
    }

    static Factory(): MainPage {
        let ret = null;
        let values = MainPage.getQueryValues();
        if (values["newRoom"] != undefined) {
            ret = new NewRoomPage();
        } else {
            ret = new ExistingRoomPage();
        }
        return ret;
    }

    constructor() {
        this.queryValues = MainPage.getQueryValues();
        MainPage.removeQueryString();        
        this.connection = new Connections.Connection2();
        this.connection.AddEventListener(Connections.Connection2Event.connect, () => {
            this.player = new Components.Player(this.connection.SocketId, this.queryValues["playerName"]);
            this.EnterRoom(() => {
                this.MakeComponents();
                if (this.defaultImage != null) {
                    this.canvas.ShowImage(this.defaultImage);
                }
                this.imageLogs.LoadDataUrlArray(this.defaultLogs);
                this.addEventListeners();
                this.onload();
            });
        });
    }

    protected abstract EnterRoom(callback: () => void);

    protected MakeComponents() {
        this.canvas = new MyCanvas.Canvas(<HTMLCanvasElement>document.getElementById("canvas"));
        this.canvas.LineWidth = 5;

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
            change: (color) => this.canvas.LineColor = color.toRgbString()
        });

        this.penSizeSelector = new Components.PenSizeSelector([
            5, 10, 20, 30, 50, 80, 100
        ]);
        this.penSizeSelector.Generate(this.toolboxPanel.BodyObject);

        this.penSizeSample = new Components.PenSizeSample(100, 100, 5);
        this.penSizeSample.Generate(this.toolboxPanel.BodyObject);

        this.returnRoomListButton = new Components.Button();
        this.returnRoomListButton.Style = Components.ButtonStyle.danger;
        this.returnRoomListButton.Text = "退室";
        this.returnRoomListButton.ClickedEvent = () => {
            if (!confirm("退室しますか？")) return;
            MainPage.returnRoomList();
        };
        this.returnRoomListButton.Generate(this.playersPanel.FooterObject, "return");

        this.doneLoad = true;
        this.Update();
    }

    protected addEventListeners() {
        this.connection.AddEventListener(Connections.Connection2Event.Drawed, data => this.canvas.DrawByData(data));
        this.connection.AddEventListener(Connections.Connection2Event.ReportCanvas, (data, ack) => {
            ack({
                image: this.canvas.CanvasElement.toDataURL(),
                logs: this.imageLogs.toDataUrlArray()
            });
        });
        this.connection.AddEventListener(Connections.Connection2Event.RoomUpdated, data => {
            console.log(data);
            this.MyRoom = Components.Room.Parse(data.room);
        });
        this.connection.AddEventListener(Connections.Connection2Event.TurnAdd, data => {
            this.MyRoom = Components.Room.Parse(data.room);
            this.imageLogs.AddImage(this.canvas.CanvasElement.toDataURL());
            this.canvas.Clear();
        });
        this.connection.AddEventListener(Connections.Connection2Event.ChatReceive, data => {
            this.chatLog.addMessage(new Components.ChatMessage(data.playerName, data.message));
        });

        this.canvas.LineDrawedEvent = data => this.connection.SubmitDrawing(data, this.myRoom.Id);

        this.doneButton.ClickedEvent = () => {
            if (!confirm("完了しますか？")) return;
            this.connection.DoneDrawing(this.myRoom.Id);
        }

        this.penSizeSelector.SelectedEvent = size => {
            this.penSizeSample.PenSize = size;
            this.canvas.LineWidth = size;
        };

        this.chatInput.SendMessageEvent = msg => {
            this.connection.ChatEmit(
                this.myRoom.Id,
                this.player.Name,
                msg
            );
        }
    }

    private Update() {
        if (!this.doneLoad) return;
        this.playerList.CurrentPlayer = this.myRoom.CurrentPlayer;
        this.playerList.replacePlayers(this.myRoom.Members);
        if (this.myRoom.CurrentPlayer.Id == this.player.Id) {
            this.infoBar.InformationType = Components.InformationType.YourTurn;
            this.doneButton.Show();
            this.canvas.CanDraw = true;
        } else {
            this.infoBar.InformationType = Components.InformationType.None;
            this.doneButton.Hide();
            this.canvas.CanDraw = false;
        }
    }

    static getQueryValues() {
        let queryStr = window.location.search;
        let values = [];
        let hash = queryStr.slice(1).split('&');
        for (var i = 0; i < hash.length; i++) {
            let ary = hash[i].split("=");
            values[ary[0]] = ary[1];
        }
        return values;
    }

    static removeQueryString() {
        history.pushState(null, null, "/index.html");
    }

    static returnRoomList() {
        window.location.href = "/";
    }
}

class ExistingRoomPage extends MainPage {
    private roomId = "";
    private password = "";

    constructor() {
        super();
    }

    protected EnterRoom(callback = () => { }) {
        this.roomId = this.queryValues["roomId"];
        this.password = this.queryValues["password"];
        this.connection.EnterToRoom(this.roomId, this.player.Name, this.password, data => {
            if (!data.isSuccess) {
                alert("入室に失敗しました。ルーム一覧に戻ります。");
                MainPage.returnRoomList();
            }
            this.MyRoom = Components.Room.Parse(data.room);
            this.defaultImage = data.canvasImage;
            this.defaultLogs = data.logs;
            callback();
        });
    }
}

class NewRoomPage extends MainPage {
    private roomName = "";
    private password = "";
    private roomId = "";

    constructor() {
        super();
    }

    protected EnterRoom(callback = () => { }) {
        this.roomName = this.queryValues["roomName"];
        this.password = this.queryValues["password"];
        this.connection.EnterToNewRoom(this.roomName, this.player.Name, this.password, data => {
            this.MyRoom = Components.Room.Parse(data.room);
            callback();
        });
    }
}

let page = MainPage.Factory();
