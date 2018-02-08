let roomconnection = new Connections.Connection("http://localhost:11451");
roomconnection.connect(new Connections.Player("hissa"));
roomconnection.setEventListener(Connections.SocketEvent.GetRoomsResponse, data => console.log(data));
roomconnection.getRooms();