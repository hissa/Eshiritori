import Canvas = MyCanvas.Canvas;
import Connection = Connections.Connection;
import SocketEvent = Connections.SocketEvent;
import Player = Connections.Player;
let canvas = new Canvas(<HTMLCanvasElement>document.getElementById("canvas"));
let connection = new Connection("http://localhost:11451");
connection.setEventListener(SocketEvent.PlayerConnected, data => {
    console.log(`${data.player.name}が入室`);
});
connection.setEventListener(SocketEvent.PlayerDisconnected, data => {
    console.log(`${data.player.name}が退室`);
});
connection.setEventListener(SocketEvent.MessagePublished, data => {
    console.log(`[${data.player.name}]${data.value}`);
});
connection.connect(new Player("hissa"));
connection.publishMessage("hello");
canvas.LineDrawedEvent = data => connection.draw(data);
connection.setEventListener(SocketEvent.LineDrawed, data => {
    if (data.player.id == connection.Id) return;
    canvas.DrawByData(data.data);
});

let toolbox = new Components.CardPanel();
toolbox.HeaderText = "パレット";
toolbox.ContentText = "テスト";
toolbox.Generate($("#toolBox"), "palet");
let chat = new Components.CardPanel();
chat.HeaderText = "チャット";
chat.ContentText = "チャットとか";
chat.Generate($("#chat"), "chat");
let playerListBox = new Components.CardPanel();
playerListBox.HeaderText = "プレイヤーリスト";
playerListBox.ContentText = "プレイヤーリストとか";
playerListBox.Generate($("#playerList"), "players");
let drawlog = new Components.CardPanel();
drawlog.HeaderText = "ログ";
drawlog.ContentText = "ここに過去の絵たちを表示";
drawlog.Generate($("#drawlog"), "drawlog");