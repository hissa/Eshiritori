class RoomsPage {
    // 普通の変数
    private connection: Connections.Connection2;
    private rooms: Components.Room[];
    // コンポーネント
    private card: Components.CardPanel;
    private newRoomButton: Components.Button;
    private table: Components.RoomList;
    private newRoomModal: Components.NewRoomModal;
    private EnterRoomModal: Components.RoomModal;

    constructor() {
        this.connection = new Connections.Connection2();
        this.connection.AddEventListener(Connections.Connection2Event.connect, () => {
            this.MakeComponents();
            this.AddEventListeners();
            this.connection.GetRooms(data => {
                this.setRooms(data);
                this.Update();
            });
        });
    }

    private MakeComponents() {
        this.card = new Components.CardPanel();
        this.card.HeaderText = "ルーム一覧";
        this.card.Generate($("#body"), "roomList");

        this.newRoomButton = new Components.Button();
        this.newRoomButton.Size = Components.ButtonSize.Block;
        this.newRoomButton.Style = Components.ButtonStyle.primary;
        this.newRoomButton.Text = "新しい部屋を作成";
        this.newRoomButton.Generate(this.card.BodyObject);

        this.table = new Components.RoomList();
        this.table.Generate(this.card.BodyObject);

        this.newRoomModal = new Components.NewRoomModal();
        this.newRoomModal.Generate($("body"));
    }

    private AddEventListeners() {
        this.connection.AddEventListener(Connections.Connection2Event.RoomsUpdated, data => {
            this.setRooms(data);
            this.Update();
        });

        this.newRoomModal.ClickedEnterRoomEvent = data => {
            RoomsPage.jumpNewRoom(data.roomName, data.password, data.playerName);
        };

        this.newRoomButton.ClickedEvent = () => {
            this.newRoomModal.Show();
        };

        this.table.ClickedEnterRoomEvent = sender => {
            this.EnterRoomModal = new Components.RoomModal(sender);
            this.EnterRoomModal.Generate($("body"));
            this.EnterRoomModal.Show();
            this.EnterRoomModal.ClickedEnterRoomEvent = data => {
                if (!data.room.HasPassword) {
                    RoomsPage.jump(data.room.Id, data.password, data.playerName);
                }
                this.connection.VerifyPassword(data.room.Id, data.password, success => {
                    if (success) {
                        RoomsPage.jump(data.room.Id, data.password, data.playerName);
                    } else {
                        this.EnterRoomModal.InvalidPassword();
                    }
                });
            };
        };
    }

    private setRooms(data) {
        this.rooms = [];
        data.forEach(value => {
            let members: Components.Player[] = [];
            value.members.forEach(player => {
                members.push(new Components.Player(player.id, player.name));
            });
            this.rooms.push(new Components.Room(
                value.id,
                value.name,
                members,
                value.hasPassword
            ));
        });
    }

    private Update() {
        this.table.Rooms = this.rooms;
    }

    static jumpNewRoom(roomName: string, password: string, playerName: string) {
        let query = `?roomName=${roomName}&password=${password}&playerName=${playerName}&newRoom=true`;
        window.location.href = "/index.html" + query;
    }

    static jump(roomId: string, password: string, playerName: string) {
        let query = `?roomId=${roomId}&password=${password}&playerName=${playerName}`;
        window.location.href = "/index.html" + query;
    }
}

let roompage = new RoomsPage();
