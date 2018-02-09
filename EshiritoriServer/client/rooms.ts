//let roomconnection = new Connections.Connection("http://localhost:11451");
//roomconnection.connect(new Connections.Player("hissa"));
//roomconnection.setEventListener(Connections.SocketEvent.GetRoomsResponse, data => console.log(data));
//roomconnection.getRooms();
let rConnection = new Connections.Connection2();
rConnection.EnterToNewRoom("testRoom", "hissa", data => {
    console.log(data);
    rConnection.GetRooms(data1 => console.log(data1));
});