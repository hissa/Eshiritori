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
    let newRoomButton = new Components.Button();
    newRoomButton.Size = Components.ButtonSize.Block;
    newRoomButton.Style = Components.ButtonStyle.primary;
    newRoomButton.Text = "新しい部屋を作成";
    newRoomButton.ClickedEvent = () => {
        let newRoomModal = new Components.NewRoomModal();
        newRoomModal.ClickedEnterRoomEvent = data => {
            jumpNewRoom(data.roomName, data.password, data.playerName);
        };
        newRoomModal.Generate($("body"));
        newRoomModal.Show();
    };
    newRoomButton.Generate($("#cardpanelroomList"));
    let table = new Components.RoomList();
    table.Rooms = rooms;
    table.ClickedEnterRoomEvent = sender => {
        modal = new Components.RoomModal(sender);
        modal.Generate($("body"));
        modal.ClickedEnterRoomEvent = data => {
            if (!data.room.HasPassword) {
                jump(data.room.Id, data.password, data.playerName);
            }
            rconnection.VerifyPassword(data.room.Id, data.password, success => {
                if (success) {
                    jump(data.room.Id, data.password, data.playerName);
                } else {
                    modal.InvalidPassword();
                }
            });
        };
        modal.Show();
    };
    table.Generate($("#cardpanelroomList"));
    rconnection.AddEventListener(Connections.Connection2Event.RoomsUpdated, data => {
        UpdateRooms(data);
        table.Rooms = rooms;
    })
}

function jump(roomId: string, password: string, playerName: string) {
    let query = `?roomId=${roomId}&password=${password}&playerName=${playerName}`;
    window.location.href = "/index.html" + query;
}

function jumpNewRoom(roomName: string, password: string, playerName: string) {
    let query = `?roomName=${roomName}&password=${password}&playerName=${playerName}&newRoom=true`;
    window.location.href = "/index.html" + query;
}

function UpdateRooms(data) {
    rooms = [];
    data.forEach(value => {
        let members: Components.Player[] = [];
        value.members.forEach(player => {
            members.push(new Components.Player(player.id, player.name));
        });
        rooms.push(new Components.Room(
            value.id,
            value.name,
            members,
            value.hasPassword
        ));
    });
}

let rooms: Components.Room[] = [];
let rconnection = new Connections.Connection2();
let modal: Components.RoomModal = null;
//rconnection.EnterToNewRoom("Testroom", "hissa", "",() => {
//    rconnection.GetRooms(data => {
//        data.forEach(value => {
//            let members: Components.Player[] = [];
//            value.members.forEach(player => {
//                members.push(new Components.Player(player.id, player.name));
//            });
//            rooms.push(new Components.Room(
//                value.id,
//                value.name,
//                members,
//                value.hasPassword
//            ));
//        });
//        show();
//    });
//});
rconnection.GetRooms(data => {
    //data.forEach(value => {
    //    let members: Components.Player[] = [];
    //    value.members.forEach(player => {
    //        members.push(new Components.Player(player.id, player.name));
    //    });
    //    // constructor(roomId: string, name: string, members: Player[], hasPassword: boolean) {
    //    rooms.push(new Components.Room(
    //        value.id,
    //        value.name,
    //        members,
    //        value.hasPassword
    //    ));
    //});
    //show();
    UpdateRooms(data);
    show();
});