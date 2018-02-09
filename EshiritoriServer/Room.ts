export class Room {
    private roomName: string = null;
    private members: Player[] = [];
    private password: string = null;
    private roomId: string = null;
    private beEmptyEvent: (sender: Room) => void = () => { };

    get RoomName(): string {
        return this.roomName;
    }
    set RoomName(value: string) {
        this.roomName = value;
    }

    get Members(): Player[] {
        return this.members;
    }

    get Password(): string {
        return this.password;
    }
    set Password(value: string) {
        this.password = value;
    }

    get HasPassword(): boolean {
        return this.password != null;
    }

    get RoomId(): string {
        return this.roomId;
    }

    set BeEmptyEvent(func: (sender: Room) => void) {
        this.beEmptyEvent = func;
    }

    constructor(roomId: string, roomName: string) {
        this.RoomName = roomName;
        this.roomId = roomId;
    }

    public AddPlayer(player: Player) {
        this.members.push(player);
    }

    public RemovePlayer(playerId: string) {
        let remIndex: number = null;
        this.Members.forEach((value, index) => {
            if (value.Id == playerId) {
                remIndex = index;
            }
        });
        if (remIndex != null) {
            this.members.splice(remIndex, 1);
        }
        if (this.Members.length <= 0) {
            this.beEmptyEvent(this);
        }
    }

    public ToHash() {
        let membersHash = [];
        this.members.forEach(value => {
            membersHash.push(value.ToHash());
        });
        return {
            name: this.RoomName,
            members: membersHash,
            hasPassword: this.HasPassword,
            id: this.RoomId
        };
    }
}

export class Player {
    private id: string = null;
    private name: string = null;

    get Id(): string {
        return this.id;
    }

    get Name(): string {
        return this.name;
    }

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public ToHash() {
        return {
            id: this.id,
            name: this.name
        };
    }

    public static Parse(data: any) {
        return new Player(data.id, data.name);
    }
}
