var roomconnection = new Connections.Connection("http://localhost:11451");
roomconnection.connect(new Connections.Player("hissa"));
roomconnection.setEventListener(Connections.SocketEvent.GetRoomsResponse, function (data) { return console.log(data); });
roomconnection.getRooms();
//# sourceMappingURL=rooms.js.map