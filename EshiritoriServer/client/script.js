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
var queryStr = window.location.search;
var values = [];
var hash = queryStr.slice(1).split('&');
for (var i = 0; i < hash.length; i++) {
    var ary = hash[i].split("=");
    values[ary[0]] = ary[1];
}
// urlのクエリ文字列を消す
history.pushState(null, null, "/index.html");
var connection = new Connections.Connection2();
var myRoom = null;
var canvas = new MyCanvas.Canvas(document.getElementById("canvas"));
// 新しい部屋を作成しない場合
if (values["newRoom"] == undefined) {
    connection.EnterToRoom(values["roomId"], values["playerName"], values["password"], function (data) {
        console.log(data);
        myRoom = Components.Room.Parse(data.room);
        UpdateRoomStatus();
        canvas.ShowImage(data.canvasImage);
        console.log(myRoom);
    });
}
else {
    // 新しい部屋を作成する場合
    connection.EnterToNewRoom(values["roomName"], values["playerName"], values["password"], function (data) {
        console.log(data);
        myRoom = Components.Room.Parse(data.room);
        UpdateRoomStatus();
        console.log(myRoom);
    });
}
canvas.LineDrawedEvent = function (data) { return connection.SubmitDrawing(data, myRoom.Id); };
connection.AddEventListener(Connections.Connection2Event.Drawed, function (data) {
    canvas.DrawByData(data);
});
connection.AddEventListener(Connections.Connection2Event.ReportCanvas, function (data, ack) {
    ack({
        image: canvas.CanvasElement.toDataURL()
    });
});
connection.AddEventListener(Connections.Connection2Event.RoomUpdated, function (data) {
    myRoom = Components.Room.Parse(data.room);
    console.log(myRoom);
    UpdateRoomStatus();
});
function UpdateRoomStatus() {
    playerList.CurrentPlayer = myRoom.CurrentPlayer;
    playerList.replacePlayers(myRoom.Members);
}
//canvas.LineDrawedEvent = data => connection.draw(data);
//connection.setEventListener(SocketEvent.LineDrawed, data => {
//    if (data.player.id == connection.Id) return;
//    canvas.DrawByData(data.data);
//});
var toolbox = new Components.CardPanel();
toolbox.HeaderText = "パレット";
toolbox.Generate($("#toolBox"), "palet");
var chat = new Components.CardPanel();
chat.HeaderText = "チャット";
chat.Generate($("#chat"), "chat");
var playerListBox = new Components.CardPanel();
playerListBox.HeaderText = "プレイヤーリスト";
playerListBox.Generate($("#playerList"), "players");
var drawlog = new Components.CardPanel();
drawlog.HeaderText = "ログ";
drawlog.ContentText = "ここに過去の絵たちを表示";
drawlog.Generate($("#drawlog"), "drawlog");
var infoBar = new Components.InfomationBar();
infoBar.Generate($("#yourTurn"), "yourturn");
infoBar.InformationType = Components.InformationType.YourTurn;
var playerList = new Components.PlayerList();
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
var chatLog = new Components.ChatLog(10);
chatLog.Generate($("#cardpanelContentchat"), "chatlog");
for (var i_1 = 0; i_1 < 15; i_1++) {
    chatLog.addMessage(new Components.ChatMessage("hissa", "hello" + i_1.toString()));
}
var chatinput = new Components.ChatInput();
chatinput.Generate($("#cardpanelContentchat"), "chatinput");
chatinput.SendMessageEvent = function (msg) { return console.log(msg); };
var colorBox = new Components.ColorBox(100, 30, "red");
colorBox.Generate($("#cardpanelContentpalet"));
colorBox.ClickedEvent = function (e) { return console.log("clicked"); };
var penSizeSelector = new Components.PenSizeSelector([1, 5, 10, 20]);
var penSizeSample = new Components.PenSizeSample(100, 100);
penSizeSelector.Generate($("#cardpanelContentpalet"));
penSizeSample.Generate($("#cardpanelContentpalet"));
penSizeSelector.SelectedEvent = function (value) { return penSizeSample.PenSize = value; };
//# sourceMappingURL=script.js.map