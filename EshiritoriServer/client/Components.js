var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
var Components;
(function (Components) {
    /**
     * コンポーネントの基底クラス
     */
    var Component = (function () {
        function Component() {
        }
        Object.defineProperty(Component.prototype, "IsGenerated", {
            get: function () { },
            enumerable: true,
            configurable: true
        });
        return Component;
    }());
    /**
     * 一意なIDを生成します。
     */
    var UniqueIdGenerater = (function () {
        function UniqueIdGenerater() {
        }
        /**
         * 一意なIDを取得します。
         */
        UniqueIdGenerater.Get = function () {
            var ret = this.number;
            this.number++;
            return ret;
        };
        UniqueIdGenerater.number = 0;
        return UniqueIdGenerater;
    }());
    var CardPanel = (function (_super) {
        __extends(CardPanel, _super);
        /**
         * コンストラクター
         * @param header ヘッダーのテキスト
         * @param content 内容のテキスト
         * @param footer フッターのテキスト
         */
        function CardPanel(header, content, footer) {
            if (header === void 0) { header = ""; }
            if (content === void 0) { content = ""; }
            if (footer === void 0) { footer = ""; }
            _super.call(this);
            this.headerText = "";
            this.contentText = "";
            this.footerText = "";
            this.isGenerated = false;
            this.object = null;
            this.headerObject = null;
            this.contentObject = null;
            this.footerObject = null;
            this.unique = null;
            this.HeaderText = header;
            this.ContentText = content;
            this.FooterText = footer;
            this.hasFooter = this.FooterText != "";
        }
        Object.defineProperty(CardPanel.prototype, "HeaderText", {
            get: function () {
                return this.headerText;
            },
            set: function (value) {
                this.headerText = value;
                this.reloadTexts();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CardPanel.prototype, "ContentText", {
            get: function () {
                return this.contentText;
            },
            set: function (value) {
                this.contentText = value;
                this.reloadTexts();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CardPanel.prototype, "FooterText", {
            get: function () {
                return this.footerText;
            },
            set: function (value) {
                this.footerText = value;
                this.reloadTexts();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CardPanel.prototype, "IsGenerated", {
            get: function () {
                return this.isGenerated;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CardPanel.prototype, "HasFooter", {
            get: function () {
                return this.hasFooter;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 指定された親要素にコンポーネントを追加します。
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        CardPanel.prototype.Generate = function (parent, idName) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            this.hasFooter = this.FooterText != "";
            parent.append("<div id=\"cardpanel" + this.unique + "\" />");
            this.object = $("#cardpanel" + this.unique);
            this.object.append("<div id=\"cardpanelHeader" + this.unique + "\" />");
            this.object.append("<div id=\"cardpanelContent" + this.unique + "\" />");
            this.headerObject = $("#cardpanelHeader" + this.unique);
            this.contentObject = $("#cardpanelContent" + this.unique);
            this.object.addClass("card");
            this.headerObject.addClass("card-header");
            this.contentObject.addClass("card-body");
            if (this.hasFooter) {
                this.object.append("<div id=\"cardpanelFooter" + this.unique + "\" />");
                this.footerObject = $("#cardpanelFooter" + this.unique);
                this.footerObject.addClass("card-footer");
            }
            this.isGenerated = true;
            this.reloadTexts();
        };
        CardPanel.prototype.reloadTexts = function () {
            if (!this.IsGenerated)
                return;
            this.headerObject.text(this.HeaderText);
            this.contentObject.text(this.ContentText);
            if (this.HasFooter)
                this.footerObject.text(this.FooterText);
        };
        return CardPanel;
    }(Component));
    Components.CardPanel = CardPanel;
})(Components || (Components = {}));
//# sourceMappingURL=Components.js.map