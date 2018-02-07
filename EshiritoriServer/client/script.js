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
toolbox.ContentText = "テスト";
toolbox.Generate($("#toolBox"), "palet");
var chat = new Components.CardPanel();
chat.HeaderText = "チャット";
chat.ContentText = "チャットとか";
chat.Generate($("#chat"), "chat");
var playerListBox = new Components.CardPanel();
playerListBox.HeaderText = "プレイヤーリスト";
playerListBox.ContentText = "プレイヤーリストとか";
playerListBox.Generate($("#playerList"), "players");
var drawlog = new Components.CardPanel();
drawlog.HeaderText = "ログ";
drawlog.ContentText = "ここに過去の絵たちを表示";
drawlog.Generate($("#drawlog"), "drawlog");
//# sourceMappingURL=script.js.map