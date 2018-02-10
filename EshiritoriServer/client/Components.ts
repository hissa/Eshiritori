/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
namespace Components {
    /**
     * コンポーネントの基底クラス
     */
    abstract class Component {
        abstract get IsGenerated(): boolean;
        abstract Generate(parent: JQuery): void;
    }

    /**
     * 一意なIDを生成します。
     */
    class UniqueIdGenerater {
        static number = 0;

        /**
         * 一意なIDを取得します。
         */
        static Get() {
            let ret = this.number;
            this.number++;
            return ret;
        }
    }

    /**
     * Bootstrap4のCardを表すクラス(Bootstrap3のPanel的な)
     */
    export class CardPanel extends Component{
        private headerText: string = "";
        private contentText: string = "";
        private footerText: string = "";
        private isGenerated: boolean = false;
        private object: JQuery = null;
        private headerObject: JQuery = null;
        private contentObject: JQuery = null;
        private footerObject: JQuery = null;
        private unique: string = null;
        private hasFooter: boolean;

        get HeaderText(): string {
            return this.headerText;
        }
        set HeaderText(value: string) {
            this.headerText = value;
            this.reloadTexts();
        }

        get ContentText(): string {
            return this.contentText;
        }
        set ContentText(value: string) {
            this.contentText = value;
            this.reloadTexts();
        }

        get FooterText(): string {
            return this.footerText;
        }
        set FooterText(value: string) {
            this.footerText = value;
            this.reloadTexts();
        }

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        get HasFooter(): boolean {
            return this.hasFooter;
        }

        /**
         * コンストラクター
         * @param header ヘッダーのテキスト
         * @param content 内容のテキスト
         * @param footer フッターのテキスト
         */
        constructor(header: string = "", content: string = "", footer: string = "") {
            super();
            this.HeaderText = header;
            this.ContentText = content;
            this.FooterText = footer;
            this.hasFooter = this.FooterText != "";
        }

        /**
         * 指定された親要素にコンポーネントを追加します。
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        public Generate(parent: JQuery, idName?: string): void {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            this.hasFooter = this.FooterText != "";
            parent.append(`<div id="cardpanel${this.unique}" />`);
            this.object = $(`#cardpanel${this.unique}`);
            this.object.append(`<div id="cardpanelHeader${this.unique}" />`);
            this.object.append(`<div id="cardpanelContent${this.unique}" />`);
            this.headerObject = $(`#cardpanelHeader${this.unique}`);
            this.contentObject = $(`#cardpanelContent${this.unique}`);
            this.object.addClass("card");
            this.headerObject.addClass("card-header");
            this.contentObject.addClass("card-body");
            if (this.hasFooter) {
                this.object.append(`<div id="cardpanelFooter${this.unique}" />`);
                this.footerObject = $(`#cardpanelFooter${this.unique}`);
                this.footerObject.addClass("card-footer");
            }
            this.isGenerated = true;
            this.reloadTexts();
        }

        private reloadTexts() {
            if (!this.IsGenerated) return;
            this.headerObject.text(this.HeaderText);
            this.contentObject.text(this.ContentText);
            if (this.HasFooter) this.footerObject.text(this.FooterText);
        }
    }

    /**
     * 情報を表示するAlertを表すクラス
     */
    export class InfomationBar extends Component {
        private isGenerated = false;
        private informationType = InformationType.None;
        private object: JQuery = null;
        private unique: string = null;

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        get InformationType(): InformationType {
            return this.informationType;
        }
        set InformationType(value: InformationType) {
            this.informationType = value;
            this.reload();
        }

        /**
         * コンストラクタ  
         * @param defaultInfomation 初期状態の情報
         */
        constructor(defaultInfomation = InformationType.None) {
            super();
            this.InformationType = defaultInfomation;
        }

        /**
         * 指定された親要素にコンポーネントを追加します。
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        public Generate(parent: JQuery, idName?: string) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append(`<div id="informationbar${this.unique}" />`);
            this.object = $(`#informationbar${this.unique}`);
            this.isGenerated = true;
            this.reload();
        }

        private reload() {
            if (!this.IsGenerated) return;
            this.clear();
            switch (this.InformationType) {
                case InformationType.None:
                    this.none();
                    break;
                case InformationType.YourTurn:
                    this.yourTurn();
                    break;
                default:
                    break;
            }
        }

        private clear() {
            this.object.removeClass();
            this.object.text("");
        }

        private yourTurn() {
            this.object.addClass("alert alert-danger");
            this.object.text("あなたの番です");
            this.object.show();
        }

        private none() {
            this.object.hide();
        }

    }

    // InformationBarで表示する情報の種類
    export enum InformationType {
        None,
        YourTurn
    };

    /**
     * Bootstrap4のtableで表示するPlayerList
     */
    export class PlayerList extends Component {
        private isGenerated = false;
        private players: Player[] = [];
        private object: JQuery = null;
        private theadObject: JQuery = null;
        private tbodyObject: JQuery = null;
        // playerIdをキーとした連想配列
        private nameCellObjects: JQuery[] = [];
        private currentPlayerId: string = null;
        private unique: string = null;

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        get Players(): Player[] {
            return this.players;
        }

        set CurrentPlayer(value: Player) {
            this.currentPlayerId = value.Id;
            this.reload();
        }

        /**
         * コンストラクタ
         */
        constructor() {
            super();
        }

        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        public Generate(parent: JQuery, idName?: string) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append(`<table id="playerlist${this.unique}" />`);
            this.object = $(`#playerlist${this.unique}`);
            this.object.addClass("table");
            this.object.append(`<thead id="playerlistHead${this.unique}" />`);
            this.theadObject = $(`#playerlistHead${this.unique}`);
            this.object.append(`<tbody id="playerlistBody${this.unique}" />`);
            this.tbodyObject = $(`#playerlistBody${this.unique}`);
            this.isGenerated = true;
            this.reload();
        }

        /**
         * プレイヤーを追加します。
         * @param player 追加するプレイヤー
         */
        public addPlayer(player: Player) {
            this.players.push(player);
            this.reload();
        }

        private reload() {
            if (!this.IsGenerated) return;
            this.tbodyObject.empty();
            this.nameCellObjects = [];
            this.players.forEach((player, index) => {
                this.tbodyObject.append(`<tr id="playerlistRow${this.unique}-${index}" />`);
                $(`#playerlistRow${this.unique}-${index}`)
                    .append(`<td id="playerlistNameCell${this.unique}-${index}" />`);
                let current = $(`#playerlistNameCell${this.unique}-${index}`);
                this.nameCellObjects[player.Id] = current;
                current.text(player.Name);
                if (player.Id == this.currentPlayerId) {
                    current.addClass("table-danger");
                }
            });
        }
    }

    /**
     * 主にPlayerListで使用するプレイヤーの情報
     */
    export class Player {
        private id: string;
        private name: string;

        get Id(): string {
            return this.id;
        }

        get Name(): string {
            return this.name;
        }

        /**
         * コンストラクタ
         * @param id ソケットID
         * @param name 名前
         */
        constructor(id: string, name: string) {
            this.id = id;
            this.name = name;
        }
    }

    /**
     * チャットログを表示する枠のクラス
     */
    export class ChatLog extends Component {
        private isGenerated = false;
        private messages: ChatMessage[] = [];
        private maxDisplayNumber: number;
        private object: JQuery = null;
        private unique: string;

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        /**
         * コンストラクタ
         * @param maxDisplay メッセージの最大表示数
         */
        constructor(maxDisplay = 10) {
            super();
            this.maxDisplayNumber = maxDisplay;
        }

        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        public Generate(parent: JQuery, idName?: string) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append(`<div id="chatlog${this.unique}" />`);
            this.object = $(`#chatlog${this.unique}`);
            this.isGenerated = true;
        }

        /**
         * メッセージを追加します。
         * @param message 追加するメッセージ
         */
        public addMessage(message: ChatMessage) {
            this.messages.push(message);
            this.reload();
        }

        private reload() {
            if (!this.IsGenerated) return;
            this.object.empty();
            let start = this.messages.length - this.maxDisplayNumber;
            if (start < 0) start = 0;
            let end = this.messages.length - 1;
            for (let i = start; i <= end; i++) {
                this.object.append(`<p>${this.messages[i].Sender}: ${this.messages[i].Message}</p>`);
            }
        }
    }

    /**
     * 主にChatLogで使用するチャットのメッセージを表すクラス
     */
    export class ChatMessage {
        private sender: string;
        private message: string;

        get Sender(): string {
            return this.sender;
        }

        get Message(): string {
            return this.message;
        }

        /**
         * コンストラクタ
         * @param sender 発信者
         * @param message メッセージ本文
         */
        constructor(sender: string, message: string) {
            this.sender = sender;
            this.message = message;
        }
    }

    /**
     * チャットの入力欄のクラス
     */
    export class ChatInput extends Component {
        private isGenerated = false;
        private sendMessageEvent: (message: string) => void = () => { };
        private object: JQuery = null;
        private unique: string = null;

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        set SendMessageEvent(func: (message: string) => void) {
            this.sendMessageEvent = func;
        }

        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        public Generate(parent: JQuery, idName?: string) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append(`<input id="chatinput${this.unique}" />`);
            this.object = $(`#chatinput${this.unique}`);
            this.object.attr({ "type": "text" });
            this.object.addClass("form-control");
            this.object.on("keydown", (e) => {
                // keyCode13: Enter
                if (e.keyCode == 13) this.send();
            });
            this.isGenerated = true;
        }

        private send() {
            this.sendMessageEvent(this.object.val());
            this.object.val("");
        }
    }

    /**
     * 色を表示するCanvasのクラス
     */
    export class ColorBox extends Component {
        private isGenerated = false;
        private colorName: string = null;
        private unique: string = null;
        private object: JQuery = null;
        private canvas: HTMLCanvasElement = null;
        private ctx: CanvasRenderingContext2D = null;
        private height: number = null;
        private width: number = null;
        private clickedEvent: (e: JQueryMouseEventObject) => void = () => { };

        get ColorName(): string {
            return this.colorName;
        }
        set ColorName(value: string) {
            this.colorName = value;
        }

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        get Height(): number {
            return this.height;
        }

        get Width(): number {
            return this.width;
        }

        set ClickedEvent(func: (e: JQueryMouseEventObject) => void) {
            this.clickedEvent = func;
        }

        /**
         * コンストラクタ  
         * @param width 幅
         * @param height 高さ
         * @param colorName 色の名前
         */
        constructor(width: number, height: number, colorName = "black") {
            super();
            this.width = width;
            this.height = height;
            this.ColorName = colorName;
        }

        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        public Generate(parent: JQuery, idName?: string) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append(`<canvas id="colorbox${this.unique}" />`);
            this.object = $(`#colorbox${this.unique}`);
            this.object.attr({
                "width": this.width,
                "height": this.height
            });
            this.canvas = <HTMLCanvasElement>document.getElementById(`colorbox${this.unique}`);
            this.ctx = this.canvas.getContext("2d");
            this.object.on("click", e => this.clickedEvent(e));
            this.isGenerated = true;
            this.reload();
        }

        private reload() {
            if (!this.IsGenerated) return;
            this.clear();
            this.ctx.fillStyle = this.ColorName;
            this.ctx.fillRect(0, 0, this.Width, this.Height);
        }

        private clear() {
            this.ctx.clearRect(0, 0, this.Width, this.Height);
        }
    }

    /**
     * ペンのサイズを選択するSelectBox
     */
    export class PenSizeSelector extends Component {
        private isGenerated = false;
        private sizes: number[] = [];
        private unique: string = null;
        private object: JQuery = null;
        private selectedEvent: (value: number) => void = () => { };

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        get Sizez(): number[] {
            return this.sizes;
        }

        set SelectedEvent(func: (value: number) => void) {
            this.selectedEvent = func;
        }

        /**
         * コンストラクタ
         * @param sizes ペンの太さの配列
         */
        constructor(sizes: number[]) {
            super();
            this.sizes = sizes;
        }

        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        public Generate(parent: JQuery, idName?: string) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append(`<select id="pensizeselector${this.unique}" />`);
            this.object = $(`#pensizeselector${this.unique}`);
            this.object.addClass("custom-select");
            this.Sizez.forEach((value, index) => {
                this.object.append(`<option value="${index}">${value}</option>`);
            });
            this.object.on("change", e => this.selectedEvent(this.Sizez[this.object.val()]));
            this.isGenerated = true;
        }
    }

    /**
     * ペンのサイズのサンプルを表示するCanvas
     */
    export class PenSizeSample extends Component {
        private isGenerated = false;
        private unique: string = null;
        private object: JQuery = null;
        private canvas: HTMLCanvasElement = null;
        private ctx: CanvasRenderingContext2D = null;
        private penSize: number = null;
        private width: number = null;
        private height: number = null;

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        get PenSize(): number {
            return this.penSize;
        }
        set PenSize(value: number) {
            this.penSize = value;
            this.reload();
        }

        get Width(): number {
            return this.width;
        }

        get Height(): number {
            return this.height;
        }

        get CenterX(): number {
            return this.Width / 2;
        }

        get CenterY(): number {
            return this.Height / 2;
        }

        /**
         * コンストラクタ
         * @param width 幅
         * @param height 高さ
         * @param defaultSize サイズの初期値
         */
        constructor(width: number, height: number, defaultSize = 10) {
            super();
            this.width = width;
            this.height = height;
            this.PenSize = defaultSize;
        }

        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        public Generate(parent: JQuery, idName?: string) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append(`<canvas id="pensizesample${this.unique}" />`);
            this.object = $(`#pensizesample${this.unique}`);
            this.object.attr({
                "width": this.width,
                "height": this.height
            });
            this.canvas = <HTMLCanvasElement>document.getElementById(`pensizesample${this.unique}`);
            this.ctx = this.canvas.getContext("2d");
            this.isGenerated = true;
            this.reload();
        }

        private reload() {
            if (!this.IsGenerated) return;
            this.clear();
            this.ctx.lineCap = "round";
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = this.PenSize;
            this.ctx.beginPath();
            this.ctx.moveTo(this.CenterX, this.CenterY);
            this.ctx.lineTo(this.CenterX, this.CenterY);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        private clear() {
            this.ctx.clearRect(0, 0, this.Width, this.Height);
        }
    }

    /**
     * ルームリストのクラス
     */
    export class RoomList extends Component {
        private isGenerated = false;
        private object: JQuery = null;
        private theadObject: JQuery = null;
        private tbodyObject: JQuery = null;
        private unique: string = null;
        private rooms: Room[] = [];
        private clickedEnterRoomEvent: (sender: Room) => void = () => { };

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        get Rooms(): any[] {
            return this.rooms;
        }
        set Rooms(value: any[]) {
            this.rooms = value;
            this.reload();
        }

        set ClickedEnterRoomEvent(func: (sender: Room) => void) {
            this.clickedEnterRoomEvent = func;
        }

        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        public Generate(parent: JQuery, idName?: string) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append(`<table id="roomlist${this.unique}" />`);
            this.object = $(`#roomlist${this.unique}`);
            this.object.addClass("table");
            this.object.append(`<thead id="roomlistThead${this.unique}" />`);
            this.theadObject = $(`#roomlistThead${this.unique}`);
            this.object.append(`<tbody id="roomlistTbody${this.unique}" />`);
            this.tbodyObject = $(`#roomlistTbody${this.unique}`);
            this.theadObject.append(`<tr id="roomlistHeadTr${this.unique}" />`);
            let tr = $(`#roomlistHeadTr${this.unique}`);
            tr.append("<th>ルーム名</th>");
            tr.append("<th>在室人数</th>");
            tr.append("<th>パスワード</th>");
            tr.append("<th>入室</th>");
            this.isGenerated = true;
            this.reload();
        }

        private reload() {
            if (!this.IsGenerated) return;
            this.clear();
            this.Rooms.forEach((value: Room, index: number) => {
                this.tbodyObject.append(`<tr id="roomlist${this.unique}Row${index}"></tr>`);
                let tr = $(`#roomlist${this.unique}Row${index}`);
                tr.append(`<td>${value.Name}</td>`);
                tr.append(`<td id="roomlist${this.unique}Row${index}member">${value.Members.length}</td>`);
                tr.append(`<td>${value.HasPassword ? "有" : "無"}</td>`);
                tr.append(`<td><span id=\"roomlist${this.unique}Row${index}enterButton\" /></td>`);
                let enterButton = new Button();
                enterButton.Style = ButtonStyle.primary;
                enterButton.Text = "入室";
                enterButton.ClickedEvent = () => this.clickedEnterRoomEvent(value);
                enterButton.Generate($(`#roomlist${this.unique}Row${index}enterButton`));
                let member = $(`#roomlist${this.unique}Row${index}member`);
                let memberStr = "";
                value.Members.forEach((player, index) => {
                    memberStr += player.Name;
                    // 最後の要素はカンマなどを付けない
                    if (value.Members.length - 1 > index) {
                        memberStr += ", ";
                    }
                });
                member.attr({
                    "data-toggle": "tooltip",
                    "data-placement": "bottom",
                    "title": memberStr
                });
            });
            (<any>$('[data-toggle="tooltip"]')).tooltip();
        }

        private clear() {
            this.tbodyObject.empty();
        }
    }

    export enum ButtonStyle {
        none, primary, secondary, success, info, warning, danger, link
    }

    export enum ButtonSize {
        Default, Large, Small, Block
    }

    export enum ButtonStatus {
        Default, Disabled, Toggle
    }

    /**
     * Bootstrap4のボタンのクラス
     */
    export class Button extends Component {
        private isGenerated = false;
        private object: JQuery = null;
        private unique: string = null;
        private text: string = null;
        private style: ButtonStyle = ButtonStyle.none;
        private isOutline: boolean = false;
        private size: ButtonSize = ButtonSize.Default;
        private isPressed: boolean = false;
        private status: ButtonStatus = ButtonStatus.Default;
        private clickedEvent: (e: JQueryMouseEventObject) => void = () => { };

        get Text(): string {
            return this.text;
        }
        set Text(value: string) {
            this.text = value;
            this.reload();
        }

        get Style(): ButtonStyle {
            return this.style;
        }
        set Style(value: ButtonStyle) {
            this.style = value;
            this.reload();
        }

        get IsOutline(): boolean {
            return this.isOutline;
        }
        set IsOutline(value: boolean) {
            this.isOutline = value;
            this.reload();
        }

        get Size(): ButtonSize {
            return this.size;
        }
        set Size(value: ButtonSize) {
            this.size = value;
            this.reload();
        }

        get IsPressed(): boolean {
            return this.isPressed;
        }
        set IsPressed(value: boolean) {
            this.isPressed = value;
            this.reload();
        }

        get Status(): ButtonStatus {
            return this.status;
        }
        set Status(value: ButtonStatus) {
            this.status = value;
            this.reload();
        }

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        set ClickedEvent(func: (e: JQueryMouseEventObject) => void) {
            this.clickedEvent = func;
            if (this.IsGenerated) {
                this.object.off("click");
                this.object.on("click", this.clickedEvent);
            }
        }

        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        public Generate(parent: JQuery, idName?: string) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append(`<button id="button${this.unique}" />`);
            this.object = $(`#button${this.unique}`);
            this.object.on("click", e => this.clickedEvent(e));
            this.isGenerated = true;
            this.reload();
        }

        private reload() {
            if (!this.isGenerated) return;
            this.clear();
            this.object.addClass("btn");
            if (this.Style != ButtonStyle.none) {
                this.object.addClass(`btn-${this.IsOutline ? "outline-" : ""}${ButtonStyle[this.Style]}`);
            }
            let size = "";
            switch (this.Size) {
                default:
                    size = "";
                    break;
                case ButtonSize.Large:
                    size = "btn-lg";
                    break;
                case ButtonSize.Small:
                    size = "btn-sm";
                    break;
                case ButtonSize.Block:
                    size = "btn-lg btn-block";
                    break;
            }
            if (this.Size != ButtonSize.Default) {
                this.object.addClass(size);
            }
            if (this.IsPressed) {
                this.object.addClass("active");
                this.object.attr({ "role": "button" });
                this.object.attr({ "aria-pressed": "true" });
            }
            if (this.Status == ButtonStatus.Disabled){
                this.object.prop("disabled");
            }
            if (this.Status == ButtonStatus.Toggle) {
                this.object.attr({
                    "data-toggle": "button",
                    "aria-pressed": "false",
                    "autocomplete": "off"
                });
            }
            this.object.text(this.Text);
        }

        private clear() {
            this.object.removeClass();
            this.object.removeAttr("aria-pressed");
            this.object.removeAttr("autocomplete");
            this.object.removeAttr("role");
            this.object.removeProp("disabled");
            this.object.text("");
        }
    }

    export class Room {
        private name: string = null;
        private members: Player[] = [];
        private id: string = null;
        private hasPassword: boolean = null;

        get Name(): string {
            return this.name;
        }

        get Members(): Player[] {
            return this.members;
        }

        get HasPassword(): boolean {
            return this.hasPassword;
        }

        get Id(): string {
            return this.id;
        }

        constructor(roomId: string, name: string, members: Player[], hasPassword: boolean) {
            this.id = roomId;
            this.name = name;
            this.members = members;
            this.hasPassword = hasPassword;
        }

        public static Parse(roomData) {
            let members = [];
            roomData.members.forEach(value => members.push(new Player(value.id, value.name)));
            return new Room(
                roomData.id,
                roomData.name,
                members,
                roomData.hasPassword
            );
        }
    }

    export enum TextboxType {
        text,
        email,
        password
    };

    export class Textbox extends Component {
        private isGenerated = false;
        private unique: string = null;
        private placeholder: string = "";
        private default: string = "";
        private type: TextboxType = TextboxType.text;
        private label: string = "";
        private isInvalid = false;
        private isDisable = false;
        private groupObject: JQuery = null;
        private inputObject: JQuery = null;
        private labelObject: JQuery = null;

        get Label(): string {
            return this.label;
        }
        set Label(value: string) {
            this.label = value;
            if (!this.IsGenerated) return;
            this.labelObject.text(this.label);
        }

        get IsDisable(): boolean {
            return this.isDisable;
        }
        set IsDisable(value: boolean) {
            this.isDisable = value;
            if (!this.IsGenerated) return;
            if (this.IsDisable) {
                this.inputObject.prop("disabled", true);
            } else {
                this.inputObject.removeProp("disabled");
            }
        }

        get IsInvalid(): boolean {
            return this.isInvalid;
        }
        set IsInvalid(value: boolean) {
            this.isInvalid = value;
            this.reloadStatus();
        }

        get Value(): string {
            return this.inputObject.val();
        }
        set Value(value: string) {
            this.inputObject.val(value);
        }

        get Placeholder(): string {
            return this.placeholder;
        }

        get Default(): string {
            return this.default;
        }

        get Type(): TextboxType {
            return this.type;
        }

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        constructor(type = TextboxType.text, defaultText = "", placeholder = "") {
            super();
            this.placeholder = placeholder;
            this.default = defaultText;
            this.type = type;
        }

        public Generate(parent: JQuery, idName?: string) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append(`<div id="textbox${this.unique}group" />`);
            this.groupObject = $(`#textbox${this.unique}group`);
            this.groupObject.append(`<label id="textbox${this.unique}label" />`);
            this.labelObject = $(`#textbox${this.unique}label`);
            this.groupObject.append(`<input id="textbox${this.unique}input" />`);
            this.inputObject = $(`#textbox${this.unique}input`);
            this.groupObject.addClass("form-group");
            this.labelObject.attr({ "for": `textbox${this.unique}input` });
            this.labelObject.text(this.label);
            this.labelObject.addClass("form-control-label");
            this.inputObject.addClass("form-control");
            this.inputObject.attr({ "type": TextboxType[this.type] });
            this.inputObject.attr({ "placeholder": this.placeholder });
            this.inputObject.val(this.default);
            if (this.IsDisable) {
                this.inputObject.prop("disabled", true);
            }
            this.isGenerated = true;
            this.reloadStatus();
        }

        private reloadStatus() {
            if (!this.IsGenerated) return;
            this.inputObject.removeClass("is-invalid");
            if (!this.IsInvalid) return;
            this.inputObject.addClass("is-invalid");
        }
    }

    export class Modal extends Component {
        private isGenerated = false;
        private unique: string = null;
        private title = "";
        private content = "";
        private footer = "";
        private object: JQuery = null;
        private dialogObject: JQuery = null;
        private contentObject: JQuery = null;
        private headerObject: JQuery = null;
        private bodyObject: JQuery = null;
        private footerObject: JQuery = null;

        get Title(): string {
            return this.title;
        }
        set Title(value: string) {
            this.title = value;
            if (!this.IsGenerated) return;
            this.headerObject.empty();
            this.headerObject.html(this.title);
            this.headerObject.append(
                `<button class="close" data-dismiss="modal" aria-label="Close">` +
                `<span aria-hidden="true">&times;</span></button>`
            );
        }

        get Content(): string {
            return this.content;
        }
        set Content(value: string) {
            this.content = value;
            if (!this.IsGenerated) return;
            this.bodyObject.html(this.content);
        }

        get Footer(): string {
            return this.footer;
        }
        set Footer(value: string) {
            this.footer = value;
            if (!this.IsGenerated) return;
            this.footerObject.html(this.footer);
        }

        get HeaderObject(): JQuery {
            return this.headerObject;
        }

        get BodyObject(): JQuery {
            return this.bodyObject;
        }

        get FooterObject(): JQuery {
            return this.footerObject;
        }

        get IsGenerated(): boolean {
            return this.isGenerated;
        }

        public Generate(parent: JQuery, idName?: string) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append(`<div id="modal${this.unique}" />`);
            this.object = $(`#modal${this.unique}`);
            this.object.append(`<div id="modal${this.unique}dialog" />`);
            this.dialogObject = $(`#modal${this.unique}dialog`);
            this.dialogObject.append(`<div id="modal${this.unique}content" />`);
            this.contentObject = $(`#modal${this.unique}content`);
            this.contentObject.append(`<div id="modal${this.unique}head" />`);
            this.contentObject.append(`<div id="modal${this.unique}body" />`);
            this.contentObject.append(`<div id="modal${this.unique}foot" />`);
            this.headerObject = $(`#modal${this.unique}head`);
            this.bodyObject = $(`#modal${this.unique}body`);
            this.footerObject = $(`#modal${this.unique}foot`);
            this.object.addClass("modal fade");
            this.object.attr({
                "tabindex": "-1",
                "role": "dialog",
                "aria-hidden": "true"
            });
            this.dialogObject.addClass("modal-dialog");
            this.dialogObject.attr({ "role": "document" });
            this.contentObject.addClass("modal-content");
            this.headerObject.addClass("modal-header");
            this.bodyObject.addClass("modal-body");
            this.footerObject.addClass("modal-footer");
            this.isGenerated = true;
            this.reload();
        }

        public Show() {
            (<any>this.object).modal("show");
        }

        public Hide() {
            (<any>this.object).modal("hide");
        }

        private reload() {
            if (!this.IsGenerated) return;
            this.headerObject.empty();
            this.headerObject.html(this.title);
            this.headerObject.append(
                `<button class="close" data-dismiss="modal" aria-label="Close">` +
                `<span aria-hidden="true">&times;</span></button>`
            );
            this.bodyObject.html(this.content);
            this.footerObject.html(this.footer);
        }
    }

    export class RoomModal extends Component {
        private room: Room = null;
        private modal: Modal = null;
        private unique: string = null;
        private enterButton: Button = null;
        private closeButton: Button = null;
        private playerNameForm: Textbox = null;
        private passwordForm: Textbox = null;
        private playerlist: PlayerList = null;
        private clickedEnterRoomEvent: (data) => void = () => { };

        get RoomName(){
            return this.room.Name;
        }

        get HasPassword(){
            return this.room.HasPassword;
        }

        get Players() {
            return this.room.Members;
        }

        get IsGenerated(): boolean {
            return this.modal.IsGenerated;
        }

        set ClickedEnterRoomEvent(func: (data) => void) {
            this.clickedEnterRoomEvent = func;
        }

        constructor(room: Room) {
            super();
            this.room = room;
            this.unique = UniqueIdGenerater.Get().toString();
            this.modal = new Modal();
        }

        public Generate(parent: JQuery) {
            this.modal.Generate(parent);
            this.reload();
        }

        public Show() {
            this.modal.Show();
        }

        public Hide() {
            this.modal.Hide();
        }

        private reload() {
            this.modal.Title = this.RoomName;
            // footer
            this.closeButton = new Button();
            this.closeButton.Text = "キャンセル";
            this.closeButton.ClickedEvent = () => this.modal.Hide();
            this.closeButton.Generate(this.modal.FooterObject);
            this.enterButton = new Button();
            this.enterButton.Style = ButtonStyle.primary;
            this.enterButton.Text = "入室";
            this.enterButton.ClickedEvent = () => this.clickedEnter();
            this.enterButton.Generate(this.modal.FooterObject);
            // body
            this.playerNameForm = new Textbox(TextboxType.text, "", "プレイヤー名を入力してください。");
            this.playerNameForm.Label = "プレイヤー名";
            this.passwordForm = new Textbox(TextboxType.password, "", "パスワードを入力してください。");
            this.passwordForm.Label = "パスワード";
            if (!this.HasPassword) {
                this.passwordForm.IsDisable = true;
            }
            this.playerNameForm.Generate(this.modal.BodyObject);
            this.passwordForm.Generate(this.modal.BodyObject);
            this.playerlist = new PlayerList();
            this.room.Members.forEach(value => this.playerlist.addPlayer(value));
            this.modal.BodyObject.append("在室プレイヤー");
            this.playerlist.Generate(this.modal.BodyObject);
        }

        public InvalidPassword() {
            this.passwordForm.IsInvalid = true;
        }

        private clickedEnter() {
            this.playerNameForm.IsInvalid = false;
            if (this.playerNameForm.Value.length <= 0) {
                this.playerNameForm.IsInvalid = true;
                return;
            }
            this.clickedEnterRoomEvent({
                playerName: this.playerNameForm.Value,
                password: this.passwordForm.Value,
                room: this.room
            });
        }
    }

    export class NewRoomModal extends Component {
        private modal: Modal = null;
        private unique: string = null;
        private enterButton: Button = null;
        private closeButton: Button = null;
        private roomNameForm: Textbox = null;
        private playerNameForm: Textbox = null;
        private passwordForm: Textbox = null;;
        private clickedEnterRoomEvent: (data) => void = () => { };

        get IsGenerated(): boolean {
            return this.modal.IsGenerated;
        }

        set ClickedEnterRoomEvent(func: (data) => void) {
            this.clickedEnterRoomEvent = func;
        }

        constructor() {
            super();
            this.unique = UniqueIdGenerater.Get().toString();
            this.modal = new Modal();
        }

        public Generate(parent: JQuery) {
            this.modal.Generate(parent);
            this.reload();
        }

        public Show() {
            this.modal.Show();
        }

        public Hide() {
            this.modal.Hide();
        }

        private reload() {
            this.modal.Title = "新しい部屋の作成";
            // footer
            this.closeButton = new Button();
            this.closeButton.Text = "キャンセル";
            this.closeButton.ClickedEvent = () => this.modal.Hide();
            this.closeButton.Generate(this.modal.FooterObject);
            this.enterButton = new Button();
            this.enterButton.Style = ButtonStyle.primary;
            this.enterButton.Text = "作成";
            this.enterButton.ClickedEvent = () => this.clickedEnter();
            this.enterButton.Generate(this.modal.FooterObject);
            // body
            this.roomNameForm = new Textbox(TextboxType.text, "", "部屋名を入力してください。");
            this.roomNameForm.Label = "部屋名";
            this.playerNameForm = new Textbox(TextboxType.text, "", "あなたのプレイヤー名を入力してください。");
            this.playerNameForm.Label = "プレイヤー名";
            this.passwordForm = new Textbox(TextboxType.password, "", "パスワードを設定する場合は入力してください。");
            this.passwordForm.Label = "パスワードを設定";
            this.roomNameForm.Generate(this.modal.BodyObject);
            this.playerNameForm.Generate(this.modal.BodyObject);
            this.passwordForm.Generate(this.modal.BodyObject);
        }

        private clickedEnter() {
            this.playerNameForm.IsInvalid = false;
            this.roomNameForm.IsInvalid = false;
            if (this.playerNameForm.Value.length <= 0) {
                this.playerNameForm.IsInvalid = true;
                return;
            }
            if (this.roomNameForm.Value.length <= 0) {
                this.roomNameForm.IsInvalid = true;
            }
            this.clickedEnterRoomEvent({
                playerName: this.playerNameForm.Value,
                password: this.passwordForm.Value,
                roomName: this.roomNameForm.Value
            });
        }
    }
}