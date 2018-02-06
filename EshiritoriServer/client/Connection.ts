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
        MessagePublished
    };

    export class Connection {
        private socketio: any;
        private player: Player;

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
         * Socket.IOのイベントに対してイベントリスナーをセットします。
         * @param event イベントの種類
         * @param func 実行する処理
         */
        public setEventListener(event: SocketEvent, func: (data: any) => void) {
            this.socketio.off(SocketEvent[event]);
            this.socketio.on(SocketEvent[event], func);
        }

        private initEventListeners() {
            this.socketio.on("MessagePublished", () => { });
            this.socketio.on("PlayerConnected", () => { });
        }
    }
}