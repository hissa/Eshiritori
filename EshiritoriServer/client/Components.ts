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
}