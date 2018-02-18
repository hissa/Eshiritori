namespace Connections {
    /**
     * プレイヤーの情報を持つクラス
     */
    export class Player {
        private name: string;

        get Name(): string {
            return this.name;
        }
        set Name(value: string) {
            this.name = value;
        }

        /**
         * Playerクラスのコンストラクタ
         * @param name プレイヤー名
         */
        constructor(name: string) {
            this.Name = name;
        }
    }

    export enum SocketEvent {
        PlayerConnected,
        PlayerDisconnected,
        MessagePublished,
        LineDrawed,
        GetRoomsResponse
    };

    export class Connection {
        private socketio: any;
        private player: Player;

        get Id(): string {
            return this.socketio.id;
        }

        /**
         * Connectionクラスのコンストラクタ
         * @param url socket.ioのためのURL
         */
        constructor(url: string) {
            this.socketio = io.connect(url);
            this.initEventListeners();
        }

        /**
         * 部屋に接続します。
         * @param player プレイヤーの情報
         */
        public connect(player: Player) {
            this.player = player;
            this.socketio.emit("Connected", player.Name);
        }

        /**
         * メッセージを発信します。
         * @param message メッセージ
         */
        public publishMessage(message: string) {
            this.socketio.emit("Publish", { value: message });
        }

        /**
         * 線の情報を送信します。
         * @param data 線のデータ
         */
        public draw(data: any) {
            this.socketio.emit("Drawing", data);
        }

        /**
         * 部屋一覧を取得します。
         * レスポンスはGetRoomsResponseイベントが発火されます。
         */
        public getRooms() {
            this.socketio.emit("GetRooms", {});
        }

        /**
         * Socket.IOのイベントに対してイベントリスナーをセットします。
         * @param event イベントの種類
         * @param func 実行する処理
         */
        public setEventListener(event: SocketEvent, func: (data: any) => void) {
            this.socketio.off(SocketEvent[event]);
            this.socketio.on(SocketEvent[event], func);
        }

        private initEventListeners() {
            this.socketio.on(SocketEvent[SocketEvent.MessagePublished], () => { });
            this.socketio.on(SocketEvent[SocketEvent.PlayerConnected], () => { });
            this.socketio.on(SocketEvent[SocketEvent.PlayerDisconnected], () => { });
            this.socketio.on(SocketEvent[SocketEvent.LineDrawed], () => { });
            this.socketio.on(SocketEvent[SocketEvent.GetRoomsResponse], () => { });
        }
    }

    export enum Connection2Event {
        RoomsUpdated,
        Drawed,
        ReportCanvas,
        RoomUpdated,
        TurnAdd,
        connect,
        ChatReceive
    };

    export class Connection2 {
        private socket: SocketIOClient.Socket = null;
        private playerName: string = null;

        get PlayerName(): string {
            return this.playerName;
        }
        set PlayerName(value: string) {
            this.playerName = value;
        }

        get SocketId(): string {
            return this.socket.id;
        }

        constructor() {
            this.socket = io.connect("/");
        }

        public EnterToNewRoom(roomName: string, playerName: string, password = "", callback: (data) => void) {
            this.socket.emit("NewRoom", { roomName: roomName, password: password}, retData => {
                let roomId = retData.roomId;
                this.socket.emit("EnterToRoom", { roomId: roomId, playerName: playerName, password: password }, retData2 => {
                    this.PlayerName = playerName;
                    callback(retData2);
                });
            });
        }

        public EnterToRoom(roomId: string, playerName: string, password = "", callback: (data) => void) {
            this.socket.emit("EnterToRoom", { roomId: roomId, playerName: playerName, password: password }, data => {
                this.PlayerName = playerName;
                callback(data);
            });
        }

        public GetRooms(callback: (data) => void){
            this.socket.emit("GetRooms", {}, data => callback(data));
        }

        public VerifyPassword(roomId: string, inputPassword: string, callback: (success: boolean) => void) {
            this.socket.emit("VerifyPassword", {
                inputPassword: inputPassword,
                roomId: roomId
            }, data => callback(data.success));
        }

        public SubmitDrawing(data, roomId: string) {
            this.socket.emit("Draw", {
                data: data,
                roomId: roomId
            });
        }

        public DoneDrawing(roomId: string) {
            this.socket.emit("DoneDrawing", { roomId: roomId });
        }

        public ChatEmit(roomId: string, playerName: string, message: string) {
            this.socket.emit("ChatEmit", {
                roomId: roomId,
                playerName: playerName,
                message: message
            });
        }

        public AddEventListener(event: Connection2Event, func: (data, ack?) => void) {
            this.socket.on(Connection2Event[event], func);
        }
    }
}