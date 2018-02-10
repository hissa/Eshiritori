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
    var card = new Components.CardPanel();
    card.HeaderText = "ルーム一覧";
    card.Generate($("#body"), "roomList");
    var table = new Components.RoomList();
    table.Rooms = rooms;
    table.ClickedEnterRoomEvent = function (sender) {
        modal = new Components.RoomModal(sender);
        modal.Generate($("body"));
        modal.ClickedEnterRoomEvent = function (data) {
            if (!data.room.HasPassword) {
                jump(data.room.Id, data.password, data.playerName);
            }
            rconnection.VerifyPassword(data.room.Id, data.password, function (success) {
                if (success) {
                    jump(data.room.Id, data.password, data.playerName);
                }
            });
        };
        modal.Show();
    };
    table.Generate($("#cardpanelroomList"));
}
function jump(roomId, password, playerName) {
    var query = "?roomId=" + roomId + "&password=" + password + "&playerName=" + playerName;
    window.location.href = "/index.html" + query;
}
var rooms = [];
var rconnection = new Connections.Connection2();
var modal = null;
rconnection.EnterToNewRoom("Testroom", "hissa", "hey", function () {
    rconnection.GetRooms(function (data) {
        data.forEach(function (value) {
            var members = [];
            value.members.forEach(function (player) {
                members.push(new Components.Player(player.id, player.name));
            });
            rooms.push(new Components.Room(value.id, value.name, members, value.hasPassword));
        });
        show();
    });
});
//rconnection.GetRooms(data => {
//    data.forEach(value => {
//        let members: Components.Player[] = [];
//        value.members.forEach(player => {
//            members.push(new Components.Player(player.id, player.name));
//        });
//        rooms.push(new Components.Room(
//            value.name,
//            members,
//            value.hasPassword
//        ));
//    });
//    show();
//}); 
//# sourceMappingURL=rooms.js.map