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
    /**
     * Bootstrap4のCardを表すクラス(Bootstrap3のPanel的な)
     */
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
    /**
     * 情報を表示するAlertを表すクラス
     */
    var InfomationBar = (function (_super) {
        __extends(InfomationBar, _super);
        /**
         * コンストラクタ
         * @param defaultInfomation 初期状態の情報
         */
        function InfomationBar(defaultInfomation) {
            if (defaultInfomation === void 0) { defaultInfomation = InformationType.None; }
            _super.call(this);
            this.isGenerated = false;
            this.informationType = InformationType.None;
            this.object = null;
            this.unique = null;
            this.InformationType = defaultInfomation;
        }
        Object.defineProperty(InfomationBar.prototype, "IsGenerated", {
            get: function () {
                return this.isGenerated;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfomationBar.prototype, "InformationType", {
            get: function () {
                return this.informationType;
            },
            set: function (value) {
                this.informationType = value;
                this.reload();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 指定された親要素にコンポーネントを追加します。
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        InfomationBar.prototype.Generate = function (parent, idName) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append("<div id=\"informationbar" + this.unique + "\" />");
            this.object = $("#informationbar" + this.unique);
            this.isGenerated = true;
            this.reload();
        };
        InfomationBar.prototype.reload = function () {
            if (!this.IsGenerated)
                return;
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
        };
        InfomationBar.prototype.clear = function () {
            this.object.removeClass();
            this.object.text("");
        };
        InfomationBar.prototype.yourTurn = function () {
            this.object.addClass("alert alert-danger");
            this.object.text("あなたの番です");
            this.object.show();
        };
        InfomationBar.prototype.none = function () {
            this.object.hide();
        };
        return InfomationBar;
    }(Component));
    Components.InfomationBar = InfomationBar;
    // InformationBarで表示する情報の種類
    (function (InformationType) {
        InformationType[InformationType["None"] = 0] = "None";
        InformationType[InformationType["YourTurn"] = 1] = "YourTurn";
    })(Components.InformationType || (Components.InformationType = {}));
    var InformationType = Components.InformationType;
    ;
    /**
     * Bootstrap4のtableで表示するPlayerList
     */
    var PlayerList = (function (_super) {
        __extends(PlayerList, _super);
        /**
         * コンストラクタ
         */
        function PlayerList() {
            _super.call(this);
            this.isGenerated = false;
            this.players = [];
            this.object = null;
            this.theadObject = null;
            this.tbodyObject = null;
            // playerIdをキーとした連想配列
            this.nameCellObjects = [];
            this.currentPlayerId = null;
            this.unique = null;
        }
        Object.defineProperty(PlayerList.prototype, "IsGenerated", {
            get: function () {
                return this.isGenerated;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerList.prototype, "Players", {
            get: function () {
                return this.players;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerList.prototype, "CurrentPlayer", {
            set: function (value) {
                this.currentPlayerId = value.Id;
                this.reload();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        PlayerList.prototype.Generate = function (parent, idName) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append("<table id=\"playerlist" + this.unique + "\" />");
            this.object = $("#playerlist" + this.unique);
            this.object.addClass("table");
            this.object.append("<thead id=\"playerlistHead" + this.unique + "\" />");
            this.theadObject = $("#playerlistHead" + this.unique);
            this.object.append("<tbody id=\"playerlistBody" + this.unique + "\" />");
            this.tbodyObject = $("#playerlistBody" + this.unique);
            this.isGenerated = true;
            this.reload();
        };
        /**
         * プレイヤーを追加します。
         * @param player 追加するプレイヤー
         */
        PlayerList.prototype.addPlayer = function (player) {
            this.players.push(player);
            this.reload();
        };
        PlayerList.prototype.reload = function () {
            var _this = this;
            if (!this.IsGenerated)
                return;
            this.tbodyObject.empty();
            this.nameCellObjects = [];
            this.players.forEach(function (player, index) {
                _this.tbodyObject.append("<tr id=\"playerlistRow" + _this.unique + "-" + index + "\" />");
                $("#playerlistRow" + _this.unique + "-" + index)
                    .append("<td id=\"playerlistNameCell" + _this.unique + "-" + index + "\" />");
                var current = $("#playerlistNameCell" + _this.unique + "-" + index);
                _this.nameCellObjects[player.Id] = current;
                current.text(player.Name);
                if (player.Id == _this.currentPlayerId) {
                    current.addClass("table-danger");
                }
            });
        };
        return PlayerList;
    }(Component));
    Components.PlayerList = PlayerList;
    /**
     * 主にPlayerListで使用するプレイヤーの情報
     */
    var Player = (function () {
        /**
         * コンストラクタ
         * @param id ソケットID
         * @param name 名前
         */
        function Player(id, name) {
            this.id = id;
            this.name = name;
        }
        Object.defineProperty(Player.prototype, "Id", {
            get: function () {
                return this.id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Name", {
            get: function () {
                return this.name;
            },
            enumerable: true,
            configurable: true
        });
        return Player;
    }());
    Components.Player = Player;
    var ChatLog = (function (_super) {
        __extends(ChatLog, _super);
        function ChatLog(maxDisplay) {
            if (maxDisplay === void 0) { maxDisplay = 10; }
            _super.call(this);
            this.isGenerated = false;
            this.messages = [];
            this.object = null;
            this.maxDisplayNumber = maxDisplay;
        }
        Object.defineProperty(ChatLog.prototype, "IsGenerated", {
            get: function () {
                return this.isGenerated;
            },
            enumerable: true,
            configurable: true
        });
        ChatLog.prototype.Generate = function (parent, idName) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append("<div id=\"chatlog" + this.unique + "\" />");
            this.object = $("#chatlog" + this.unique);
            this.isGenerated = true;
        };
        ChatLog.prototype.addMessage = function (message) {
            this.messages.push(message);
            this.reload();
        };
        ChatLog.prototype.reload = function () {
            if (!this.IsGenerated)
                return;
            this.object.empty();
            var start = this.messages.length - this.maxDisplayNumber;
            if (start < 0)
                start = 0;
            var end = this.messages.length - 1;
            for (var i = start; i <= end; i++) {
                this.object.append("<p>" + this.messages[i].Sender + ": " + this.messages[i].Message + "</p>");
            }
        };
        return ChatLog;
    }(Component));
    Components.ChatLog = ChatLog;
    /**
     * 主にChatLogで使用するチャットのメッセージを表すクラス
     */
    var ChatMessage = (function () {
        /**
         * コンストラクタ
         * @param sender 発信者
         * @param message メッセージ本文
         */
        function ChatMessage(sender, message) {
            this.sender = sender;
            this.message = message;
        }
        Object.defineProperty(ChatMessage.prototype, "Sender", {
            get: function () {
                return this.sender;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChatMessage.prototype, "Message", {
            get: function () {
                return this.message;
            },
            enumerable: true,
            configurable: true
        });
        return ChatMessage;
    }());
    Components.ChatMessage = ChatMessage;
})(Components || (Components = {}));
//# sourceMappingURL=Components.js.map