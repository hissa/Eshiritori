abstract class MainPage {
    // 普通の変数
    protected player: Components.Player = null;
    protected queryValues = null;
    protected connection: Connections.Connection2 = null;
    protected myRoom: Components.Room = null;
    protected doneLoad = false;
    protected defaultImage: string = null;
    // コンポーネント
    protected toolboxPanel: Components.CardPanel = null; // 未実装
    protected chatPanel: Components.CardPanel = null;
    protected playersPanel: Components.CardPanel = null;
    protected drawLogsPanel: Components.CardPanel = null;
    protected chatLog: Components.ChatLog = null;
    protected chatInput: Components.ChatInput = null;
    protected infoBar: Components.InfomationBar = null;
    protected playerList: Components.PlayerList = null;
    protected doneButton: Components.Button = null;
    protected canvas: MyCanvas.Canvas = null;
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
                this.addEventListeners();
            });
        });
    }

    protected abstract EnterRoom(callback: () => void);

    protected MakeComponents() {
        this.canvas = new MyCanvas.Canvas(<HTMLCanvasElement>document.getElementById("canvas"));

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
    }

    protected addEventListeners() {
        this.connection.AddEventListener(Connections.Connection2Event.Drawed, data => this.canvas.DrawByData(data));
        this.connection.AddEventListener(Connections.Connection2Event.ReportCanvas, (data, ack) => {
            ack({
                image: this.canvas.CanvasElement.toDataURL()
            });
        });
        this.connection.AddEventListener(Connections.Connection2Event.RoomUpdated, data => {
            this.MyRoom = Components.Room.Parse(data.room);
        });
        this.connection.AddEventListener(Connections.Connection2Event.TurnAdd, data => {
            this.MyRoom = Components.Room.Parse(data.room);
            this.canvas.Clear();
        });

        this.canvas.LineDrawedEvent = data => this.connection.SubmitDrawing(data, this.myRoom.Id);

        this.doneButton.ClickedEvent = () => {
            if (confirm("完了しますか？")) {
                this.connection.DoneDrawing(this.myRoom.Id);
            }
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
            this.MyRoom = Components.Room.Parse(data.room);
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
