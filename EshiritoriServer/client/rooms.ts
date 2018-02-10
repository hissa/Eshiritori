//let roomconnection = new Connections.Connection("http://localhost:11451");
//roomconnection.connect(new Connections.Player("hissa"));
//roomconnection.setEventListener(Connections.SocketEvent.GetRoomsResponse, data => console.log(data));
//roomconnection.getRooms();
//let rConnection = new Connections.Connection2();
//rConnection.EnterToNewRoom("testRoom", "hissa", data => {
//    console.log(data);
//    rConnection.GetRooms(data1 => console.log(data1));
//});

function show() {
    let card = new Components.CardPanel();
    card.HeaderText = "ルーム一覧";
    card.Generate($("#body"), "roomList");
    let table = new Components.RoomList();
    table.Rooms = rooms;
    table.Generate($("#cardpanelroomList"));
}

let rooms: Components.Room[] = [];
let rconnection = new Connections.Connection2();
rconnection.GetRooms(data => {
    data.forEach(value => {
        let members: Components.Player[] = [];
        value.members.forEach(player => {
            members.push(new Components.Player(player.id, player.name));
        });
        rooms.push(new Components.Room(
            value.name,
            members,
            value.hasPassword
        ));
    });
    show();
});
let modal = new Components.RoomModal(new Components.Room("TestRoom", [new Components.Player("aaa", "hissa")], false));
modal.Generate($("body"));
modal.ClickedEnterRoomEvent = data => console.log(data);
modal.Show();