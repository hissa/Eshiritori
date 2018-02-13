export class Room {
    private roomName: string = null;
    private members: Player[] = [];
    private password: string = null;
    private roomId: string = null;
    private beEmptyEvent: (sender: Room) => void = () => { };
    // membersのインデックス
    private turn: number = 0;

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

    get Turn(): number {
        return this.turn;
    }
    set Turn(value: number) {
        this.turn = value % this.members.length;
    }

    get TurnPlayer(): Player {
        return this.Members[this.Turn];
    }
    set TurnPlayerId(id: string) {
        let success = false;
        this.members.forEach((value, index) => {
            if (value.Id == id) {
                this.Turn = index;
                success = true;
            }
        });
        if (!success) {
            // やめて
            console.log("has error at set TurnPlayerId().");
        }
    }

    constructor(roomId: string, roomName: string, password: string = null) {
        this.RoomName = roomName;
        this.roomId = roomId;
        this.password = password;
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
        if (this.members.length - 1 > this.Turn) {
            this.Turn = 0;
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
            id: this.RoomId,
            turnPlayer: this.members.length > 0 ? this.TurnPlayer.ToHash() : null
        };
    }

    public addTurn() {
        this.Turn = this.Turn + 1;
    }

    public hasPlayer(id: string) {
        let ret = false;
        this.members.forEach(value => {
            if (value.Id == id) {
                ret = true;
            }
        });
        return ret;
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
