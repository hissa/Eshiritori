//let roomconnection = new Connections.Connection("http://localhost:11451");
//roomconnection.connect(new Connections.Player("hissa"));
//roomconnection.setEventListener(Connections.SocketEvent.GetRoomsResponse, data => console.log(data));
//roomconnection.getRooms();
//let rConnection = new Connections.Connection2();
//rConnection.EnterToNewRoom("testRoom", "hissa", data => {
//    console.log(data);
//    rConnection.GetRooms(data1 => console.log(data1));
//});
var card = new Components.CardPanel();
card.HeaderText = "ルーム一覧";
card.Generate($("#body"), "roomList");
var table = new Components.RoomList();
table.Rooms = [new Components.Room("testroom", [new Components.Player("aaa", "hissa")], false)];
table.Generate($("#cardpanelroomList"));
//# sourceMappingURL=rooms.js.map