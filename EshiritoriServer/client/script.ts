//import Connection = Connections.Connection;
//import SocketEvent = Connections.SocketEvent;
//import Player = Connections.Player;
//let canvas = new MyCanvas.Canvas(<HTMLCanvasElement>document.getElementById("canvas"));
//let connection = new Connection("http://localhost:11451");
//connection.setEventListener(SocketEvent.PlayerConnected, data => {
//    console.log(`${data.player.name}が入室`);
//});
//connection.setEventListener(SocketEvent.PlayerDisconnected, data => {
//    console.log(`${data.player.name}が退室`);
//});
//connection.setEventListener(SocketEvent.MessagePublished, data => {
//    console.log(`[${data.player.name}]${data.value}`);
//});
//connection.connect(new Player("hissa"));
//connection.publishMessage("hello");
//canvas.LineDrawedEvent = data => connection.draw(data);
//connection.setEventListener(SocketEvent.LineDrawed, data => {
//    if (data.player.id == connection.Id) return;
//    canvas.DrawByData(data.data);
//});

// クエリ文字列から変数を取得
let queryStr = window.location.search;
let values = [];
let hash = queryStr.slice(1).split('&');
for (var i = 0; i < hash.length; i++) {
    let ary = hash[i].split("=");
    values[ary[0]] = ary[1];
}
// urlのクエリ文字列を消す
history.pushState(null, null, "/index.html");

let connection = new Connections.Connection2();

let myRoom: Components.Room = null;
let canvas = new MyCanvas.Canvas(<HTMLCanvasElement>document.getElementById("canvas"));

// 新しい部屋を作成しない場合
if (values["newRoom"] == undefined) {
    connection.EnterToRoom(values["roomId"], values["playerName"], values["password"], data => {
        console.log(data);
        myRoom = Components.Room.Parse(data.room);
        UpdateRoomStatus();
        canvas.ShowImage(data.canvasImage);
        console.log(myRoom);
    });
} else {
    // 新しい部屋を作成する場合
    connection.EnterToNewRoom(values["roomName"], values["playerName"], values["password"], data => {
        console.log(data);
        myRoom = Components.Room.Parse(data.room);
        UpdateRoomStatus();
        console.log(myRoom);
    });
}
canvas.LineDrawedEvent = data => connection.SubmitDrawing(data, myRoom.Id);
connection.AddEventListener(Connections.Connection2Event.Drawed, data => {
    canvas.DrawByData(data);
});
connection.AddEventListener(Connections.Connection2Event.ReportCanvas, (data, ack) => {
    ack({
        image: canvas.CanvasElement.toDataURL()
    });
});
connection.AddEventListener(Connections.Connection2Event.RoomUpdated, data => {
    myRoom = Components.Room.Parse(data.room);
    console.log(myRoom);
    UpdateRoomStatus();
});
connection.AddEventListener(Connections.Connection2Event.TurnAdd, data => {
    console.log(data.room);
    myRoom = Components.Room.Parse(data.room);
    UpdateRoomStatus();
    this.canvas.Clear();
});

function UpdateRoomStatus() {
    playerList.CurrentPlayer = myRoom.CurrentPlayer;
    playerList.replacePlayers(myRoom.Members);
    //infoBar.InformationType =
    //    myRoom.CurrentPlayer.Id == connection.SocketId ?
    //        Components.InformationType.YourTurn : Components.InformationType.None;
    if (myRoom.CurrentPlayer.Id == connection.SocketId) {
        infoBar.InformationType = Components.InformationType.YourTurn;
        doneButton.Show();     
    } else {
        infoBar.InformationType = Components.InformationType.None;
        doneButton.Hide();
    }
}
//canvas.LineDrawedEvent = data => connection.draw(data);
//connection.setEventListener(SocketEvent.LineDrawed, data => {
//    if (data.player.id == connection.Id) return;
//    canvas.DrawByData(data.data);
//});

let toolbox = new Components.CardPanel();
toolbox.HeaderText = "パレット";
toolbox.Generate($("#toolBox"), "palet");
let chat = new Components.CardPanel();
chat.HeaderText = "チャット";
chat.Generate($("#chat"), "chat");
let playerListBox = new Components.CardPanel();
playerListBox.HeaderText = "プレイヤーリスト";
playerListBox.Generate($("#playerList"), "players");
let drawlog = new Components.CardPanel();
drawlog.HeaderText = "ログ";
drawlog.ContentText = "ここに過去の絵たちを表示";
drawlog.Generate($("#drawlog"), "drawlog");
let infoBar = new Components.InfomationBar();
infoBar.Generate($("#yourTurn"), "yourturn");
infoBar.InformationType = Components.InformationType.YourTurn;
let playerList = new Components.PlayerList();
//playerList.addPlayer(new Components.Player("aaa", "hissa"));
//playerList.addPlayer(new Components.Player("bbb", "shieru"));
//playerList.addPlayer(new Components.Player("ccc", "drizzle"));
//playerList.CurrentPlayer = new Components.Player("bbb", "shieru");
playerList.Generate($("#cardpanelContentplayers"), "playerlist");
//setTimeout(() => {
//    playerList.addPlayer(new Components.Player("ddd", "alicia"));
//}, 1000);
//setTimeout(() => {
//    playerList.CurrentPlayer = new Components.Player("aaa", "hissa");
//}, 2000);
let chatLog = new Components.ChatLog(10);
chatLog.Generate($("#cardpanelContentchat"), "chatlog");
for (let i = 0; i < 15; i++) {
    chatLog.addMessage(new Components.ChatMessage("hissa", "hello" + i.toString()));
}
let chatinput = new Components.ChatInput();
chatinput.Generate($("#cardpanelContentchat"), "chatinput");
chatinput.SendMessageEvent = msg => console.log(msg);
let colorBox = new Components.ColorBox(100, 30, "red");
colorBox.Generate($("#cardpanelContentpalet"));
colorBox.ClickedEvent = e => console.log("clicked");
let penSizeSelector = new Components.PenSizeSelector([1, 5, 10, 20]);
let penSizeSample = new Components.PenSizeSample(100, 100);
penSizeSelector.Generate($("#cardpanelContentpalet"));
penSizeSample.Generate($("#cardpanelContentpalet"));
penSizeSelector.SelectedEvent = value => penSizeSample.PenSize = value;
let doneButton = new Components.Button();
doneButton.Style = Components.ButtonStyle.primary;
doneButton.Size = Components.ButtonSize.Large;
doneButton.Text = "完了";
doneButton.Generate($("#yourTurn"), "done");
doneButton.ClickedEvent = () => {
    let res = confirm("完了しますか？");
    if (res) {
        connection.DoneDrawing(myRoom.Id);
    }
}