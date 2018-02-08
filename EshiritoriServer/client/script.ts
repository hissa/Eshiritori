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
playerList.addPlayer(new Components.Player("aaa", "hissa"));
playerList.addPlayer(new Components.Player("bbb", "shieru"));
playerList.addPlayer(new Components.Player("ccc", "drizzle"));
playerList.CurrentPlayer = new Components.Player("bbb", "shieru");
playerList.Generate($("#cardpanelContentplayers"), "playerlist");
setTimeout(() => {
    playerList.addPlayer(new Components.Player("ddd", "alicia"));
}, 1000);
setTimeout(() => {
    playerList.CurrentPlayer = new Components.Player("aaa", "hissa");
}, 2000);
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