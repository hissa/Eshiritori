//let roomconnection = new Connections.Connection("http://localhost:11451");
//roomconnection.connect(new Connections.Player("hissa"));
//roomconnection.setEventListener(Connections.SocketEvent.GetRoomsResponse, data => console.log(data));
//roomconnection.getRooms();
var rConnection = new Connections.Connection2();
rConnection.EnterToNewRoom("testRoom", "hissa", function (data) {
    console.log(data);
    rConnection.GetRooms(function (data1) { return console.log(data1); });
});
//# sourceMappingURL=rooms.js.map