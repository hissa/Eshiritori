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
//# sourceMappingURL=script.js.map