﻿/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
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
}