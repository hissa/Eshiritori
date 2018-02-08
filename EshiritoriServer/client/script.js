var Canvas = MyCanvas.Canvas;
var Connection = Connections.Connection;
var SocketEvent = Connections.SocketEvent;
var Player = Connections.Player;
var canvas = new Canvas(document.getElementById("canvas"));
var connection = new Connection("http://localhost:11451");
connection.setEventListener(SocketEvent.PlayerConnected, function (data) {
    console.log(data.player.name + "\u304C\u5165\u5BA4");
});
connection.setEventListener(SocketEvent.PlayerDisconnected, function (data) {
    console.log(data.player.name + "\u304C\u9000\u5BA4");
});
connection.setEventListener(SocketEvent.MessagePublished, function (data) {
    console.log("[" + data.player.name + "]" + data.value);
});
connection.connect(new Player("hissa"));
connection.publishMessage("hello");
canvas.LineDrawedEvent = function (data) { return connection.draw(data); };
connection.setEventListener(SocketEvent.LineDrawed, function (data) {
    if (data.player.id == connection.Id)
        return;
    canvas.DrawByData(data.data);
});
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
playerList.addPlayer(new Components.Player("aaa", "hissa"));
playerList.addPlayer(new Components.Player("bbb", "shieru"));
playerList.addPlayer(new Components.Player("ccc", "drizzle"));
playerList.CurrentPlayer = new Components.Player("bbb", "shieru");
playerList.Generate($("#cardpanelContentplayers"), "playerlist");
setTimeout(function () {
    playerList.addPlayer(new Components.Player("ddd", "alicia"));
}, 1000);
setTimeout(function () {
    playerList.CurrentPlayer = new Components.Player("aaa", "hissa");
}, 2000);
var chatLog = new Components.ChatLog(10);
chatLog.Generate($("#cardpanelContentchat"), "chatlog");
for (var i = 0; i < 15; i++) {
    chatLog.addMessage(new Components.ChatMessage("hissa", "hello" + i.toString()));
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