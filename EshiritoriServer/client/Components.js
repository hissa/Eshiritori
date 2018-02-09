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
    /**
     * チャットログを表示する枠のクラス
     */
    var ChatLog = (function (_super) {
        __extends(ChatLog, _super);
        /**
         * コンストラクタ
         * @param maxDisplay メッセージの最大表示数
         */
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
        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        ChatLog.prototype.Generate = function (parent, idName) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append("<div id=\"chatlog" + this.unique + "\" />");
            this.object = $("#chatlog" + this.unique);
            this.isGenerated = true;
        };
        /**
         * メッセージを追加します。
         * @param message 追加するメッセージ
         */
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
    /**
     * チャットの入力欄のクラス
     */
    var ChatInput = (function (_super) {
        __extends(ChatInput, _super);
        function ChatInput() {
            _super.apply(this, arguments);
            this.isGenerated = false;
            this.sendMessageEvent = function () { };
            this.object = null;
            this.unique = null;
        }
        Object.defineProperty(ChatInput.prototype, "IsGenerated", {
            get: function () {
                return this.isGenerated;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChatInput.prototype, "SendMessageEvent", {
            set: function (func) {
                this.sendMessageEvent = func;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        ChatInput.prototype.Generate = function (parent, idName) {
            var _this = this;
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append("<input id=\"chatinput" + this.unique + "\" />");
            this.object = $("#chatinput" + this.unique);
            this.object.attr({ "type": "text" });
            this.object.addClass("form-control");
            this.object.on("keydown", function (e) {
                // keyCode13: Enter
                if (e.keyCode == 13)
                    _this.send();
            });
            this.isGenerated = true;
        };
        ChatInput.prototype.send = function () {
            this.sendMessageEvent(this.object.val());
            this.object.val("");
        };
        return ChatInput;
    }(Component));
    Components.ChatInput = ChatInput;
    /**
     * 色を表示するCanvasのクラス
     */
    var ColorBox = (function (_super) {
        __extends(ColorBox, _super);
        /**
         * コンストラクタ
         * @param width 幅
         * @param height 高さ
         * @param colorName 色の名前
         */
        function ColorBox(width, height, colorName) {
            if (colorName === void 0) { colorName = "black"; }
            _super.call(this);
            this.isGenerated = false;
            this.colorName = null;
            this.unique = null;
            this.object = null;
            this.canvas = null;
            this.ctx = null;
            this.height = null;
            this.width = null;
            this.clickedEvent = function () { };
            this.width = width;
            this.height = height;
            this.ColorName = colorName;
        }
        Object.defineProperty(ColorBox.prototype, "ColorName", {
            get: function () {
                return this.colorName;
            },
            set: function (value) {
                this.colorName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorBox.prototype, "IsGenerated", {
            get: function () {
                return this.isGenerated;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorBox.prototype, "Height", {
            get: function () {
                return this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorBox.prototype, "Width", {
            get: function () {
                return this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorBox.prototype, "ClickedEvent", {
            set: function (func) {
                this.clickedEvent = func;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        ColorBox.prototype.Generate = function (parent, idName) {
            var _this = this;
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append("<canvas id=\"colorbox" + this.unique + "\" />");
            this.object = $("#colorbox" + this.unique);
            this.object.attr({
                "width": this.width,
                "height": this.height
            });
            this.canvas = document.getElementById("colorbox" + this.unique);
            this.ctx = this.canvas.getContext("2d");
            this.object.on("click", function (e) { return _this.clickedEvent(e); });
            this.isGenerated = true;
            this.reload();
        };
        ColorBox.prototype.reload = function () {
            if (!this.IsGenerated)
                return;
            this.clear();
            this.ctx.fillStyle = this.ColorName;
            this.ctx.fillRect(0, 0, this.Width, this.Height);
        };
        ColorBox.prototype.clear = function () {
            this.ctx.clearRect(0, 0, this.Width, this.Height);
        };
        return ColorBox;
    }(Component));
    Components.ColorBox = ColorBox;
    /**
     * ペンのサイズを選択するSelectBox
     */
    var PenSizeSelector = (function (_super) {
        __extends(PenSizeSelector, _super);
        /**
         * コンストラクタ
         * @param sizes ペンの太さの配列
         */
        function PenSizeSelector(sizes) {
            _super.call(this);
            this.isGenerated = false;
            this.sizes = [];
            this.unique = null;
            this.object = null;
            this.selectedEvent = function () { };
            this.sizes = sizes;
        }
        Object.defineProperty(PenSizeSelector.prototype, "IsGenerated", {
            get: function () {
                return this.isGenerated;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PenSizeSelector.prototype, "Sizez", {
            get: function () {
                return this.sizes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PenSizeSelector.prototype, "SelectedEvent", {
            set: function (func) {
                this.selectedEvent = func;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        PenSizeSelector.prototype.Generate = function (parent, idName) {
            var _this = this;
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append("<select id=\"pensizeselector" + this.unique + "\" />");
            this.object = $("#pensizeselector" + this.unique);
            this.object.addClass("custom-select");
            this.Sizez.forEach(function (value, index) {
                _this.object.append("<option value=\"" + index + "\">" + value + "</option>");
            });
            this.object.on("change", function (e) { return _this.selectedEvent(_this.Sizez[_this.object.val()]); });
            this.isGenerated = true;
        };
        return PenSizeSelector;
    }(Component));
    Components.PenSizeSelector = PenSizeSelector;
    /**
     * ペンのサイズのサンプルを表示するCanvas
     */
    var PenSizeSample = (function (_super) {
        __extends(PenSizeSample, _super);
        /**
         * コンストラクタ
         * @param width 幅
         * @param height 高さ
         * @param defaultSize サイズの初期値
         */
        function PenSizeSample(width, height, defaultSize) {
            if (defaultSize === void 0) { defaultSize = 10; }
            _super.call(this);
            this.isGenerated = false;
            this.unique = null;
            this.object = null;
            this.canvas = null;
            this.ctx = null;
            this.penSize = null;
            this.width = null;
            this.height = null;
            this.width = width;
            this.height = height;
            this.PenSize = defaultSize;
        }
        Object.defineProperty(PenSizeSample.prototype, "IsGenerated", {
            get: function () {
                return this.isGenerated;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PenSizeSample.prototype, "PenSize", {
            get: function () {
                return this.penSize;
            },
            set: function (value) {
                this.penSize = value;
                this.reload();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PenSizeSample.prototype, "Width", {
            get: function () {
                return this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PenSizeSample.prototype, "Height", {
            get: function () {
                return this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PenSizeSample.prototype, "CenterX", {
            get: function () {
                return this.Width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PenSizeSample.prototype, "CenterY", {
            get: function () {
                return this.Height / 2;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 指定された親要素にコンポーネントを追加
         * @param parent 追加する親要素
         * @param idName 一意なidに使われる文字列を指定できます。（省略可）
         */
        PenSizeSample.prototype.Generate = function (parent, idName) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append("<canvas id=\"pensizesample" + this.unique + "\" />");
            this.object = $("#pensizesample" + this.unique);
            this.object.attr({
                "width": this.width,
                "height": this.height
            });
            this.canvas = document.getElementById("pensizesample" + this.unique);
            this.ctx = this.canvas.getContext("2d");
            this.isGenerated = true;
            this.reload();
        };
        PenSizeSample.prototype.reload = function () {
            if (!this.IsGenerated)
                return;
            this.clear();
            this.ctx.lineCap = "round";
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = this.PenSize;
            this.ctx.beginPath();
            this.ctx.moveTo(this.CenterX, this.CenterY);
            this.ctx.lineTo(this.CenterX, this.CenterY);
            this.ctx.stroke();
            this.ctx.closePath();
        };
        PenSizeSample.prototype.clear = function () {
            this.ctx.clearRect(0, 0, this.Width, this.Height);
        };
        return PenSizeSample;
    }(Component));
    Components.PenSizeSample = PenSizeSample;
    var RoomList = (function (_super) {
        __extends(RoomList, _super);
        function RoomList() {
            _super.apply(this, arguments);
            this.isGenerated = false;
            this.object = null;
            this.theadObject = null;
            this.tbodyObject = null;
            this.unique = null;
            this.rooms = [];
            this.clickedEnterRoomEvent = function () { };
        }
        Object.defineProperty(RoomList.prototype, "IsGenerated", {
            get: function () {
                return this.isGenerated;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RoomList.prototype, "Rooms", {
            get: function () {
                return this.rooms;
            },
            set: function (value) {
                this.rooms = value;
                this.reload();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RoomList.prototype, "ClickedEnterRoomEvent", {
            set: function (func) {
                this.clickedEnterRoomEvent = func;
            },
            enumerable: true,
            configurable: true
        });
        RoomList.prototype.Generate = function (parent, idName) {
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append("<table id=\"roomlist" + this.unique + "\" />");
            this.object = $("#roomlist" + this.unique);
            this.object.addClass("table");
            this.object.append("<thead id=\"roomlistThead" + this.unique + "\" />");
            this.theadObject = $("#roomlistThead" + this.unique);
            this.object.append("<tbody id=\"roomlistTbody" + this.unique + "\" />");
            this.tbodyObject = $("#roomlistTbody" + this.unique);
            this.theadObject.append("<tr id=\"roomlistHeadTr" + this.unique + "\" />");
            var tr = $("#roomlistHeadTr" + this.unique);
            tr.append("<th>ルーム名</th>");
            tr.append("<th>在室人数</th>");
            tr.append("<th>パスワード</th>");
            tr.append("<th>入室</th>");
            this.isGenerated = true;
            this.reload();
        };
        RoomList.prototype.reload = function () {
            var _this = this;
            if (!this.IsGenerated)
                return;
            this.clear();
            this.Rooms.forEach(function (value, index) {
                console.log(value);
                _this.tbodyObject.append("<tr id=\"roomlist" + _this.unique + "Row" + index + "\"></tr>");
                var tr = $("#roomlist" + _this.unique + "Row" + index);
                tr.append("<td>" + value.Name + "</td>");
                tr.append("<td>" + value.Members.length + "</td>");
                tr.append("<td>" + (value.HasPassword ? "有" : "無") + "</td>");
                tr.append("<td><span id=\"roomlist" + _this.unique + "Row" + index + "enterButton\" /></td>");
                var enterButton = new Button();
                enterButton.Style = ButtonStyle.primary;
                enterButton.Text = "入室";
                enterButton.ClickedEvent = function () { return _this.clickedEnterRoomEvent(value); };
                enterButton.Generate($("#roomlist" + _this.unique + "Row" + index + "enterButton"));
            });
        };
        RoomList.prototype.clear = function () {
            this.tbodyObject.empty();
        };
        return RoomList;
    }(Component));
    Components.RoomList = RoomList;
    (function (ButtonStyle) {
        ButtonStyle[ButtonStyle["none"] = 0] = "none";
        ButtonStyle[ButtonStyle["primary"] = 1] = "primary";
        ButtonStyle[ButtonStyle["secondary"] = 2] = "secondary";
        ButtonStyle[ButtonStyle["success"] = 3] = "success";
        ButtonStyle[ButtonStyle["info"] = 4] = "info";
        ButtonStyle[ButtonStyle["warning"] = 5] = "warning";
        ButtonStyle[ButtonStyle["danger"] = 6] = "danger";
        ButtonStyle[ButtonStyle["link"] = 7] = "link";
    })(Components.ButtonStyle || (Components.ButtonStyle = {}));
    var ButtonStyle = Components.ButtonStyle;
    (function (ButtonSize) {
        ButtonSize[ButtonSize["Default"] = 0] = "Default";
        ButtonSize[ButtonSize["Large"] = 1] = "Large";
        ButtonSize[ButtonSize["Small"] = 2] = "Small";
        ButtonSize[ButtonSize["Block"] = 3] = "Block";
    })(Components.ButtonSize || (Components.ButtonSize = {}));
    var ButtonSize = Components.ButtonSize;
    (function (ButtonStatus) {
        ButtonStatus[ButtonStatus["Default"] = 0] = "Default";
        ButtonStatus[ButtonStatus["Disabled"] = 1] = "Disabled";
        ButtonStatus[ButtonStatus["Toggle"] = 2] = "Toggle";
    })(Components.ButtonStatus || (Components.ButtonStatus = {}));
    var ButtonStatus = Components.ButtonStatus;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button() {
            _super.apply(this, arguments);
            this.isGenerated = false;
            this.object = null;
            this.unique = null;
            this.text = null;
            this.style = ButtonStyle.none;
            this.isOutline = false;
            this.size = ButtonSize.Default;
            this.isPressed = false;
            this.status = ButtonStatus.Default;
            this.clickedEvent = function () { };
        }
        Object.defineProperty(Button.prototype, "Text", {
            get: function () {
                return this.text;
            },
            set: function (value) {
                this.text = value;
                this.reload();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "Style", {
            get: function () {
                return this.style;
            },
            set: function (value) {
                this.style = value;
                this.reload();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "IsOutline", {
            get: function () {
                return this.isOutline;
            },
            set: function (value) {
                this.isOutline = value;
                this.reload();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "Size", {
            get: function () {
                return this.size;
            },
            set: function (value) {
                this.size = value;
                this.reload();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "IsPressed", {
            get: function () {
                return this.isPressed;
            },
            set: function (value) {
                this.isPressed = value;
                this.reload();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "Status", {
            get: function () {
                return this.status;
            },
            set: function (value) {
                this.status = value;
                this.reload();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "IsGenerated", {
            get: function () {
                return this.isGenerated;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "ClickedEvent", {
            set: function (func) {
                this.clickedEvent = func;
                if (this.IsGenerated) {
                    this.object.off("click");
                    this.object.on("click", this.clickedEvent);
                }
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.Generate = function (parent, idName) {
            var _this = this;
            this.unique = idName != undefined ? idName : UniqueIdGenerater.Get().toString();
            parent.append("<button id=\"button" + this.unique + "\" />");
            this.object = $("#button" + this.unique);
            this.object.on("click", function (e) { return _this.clickedEvent(e); });
            this.isGenerated = true;
            this.reload();
        };
        Button.prototype.reload = function () {
            if (!this.isGenerated)
                return;
            this.clear();
            this.object.addClass("btn");
            if (this.Style != ButtonStyle.none) {
                this.object.addClass("btn-" + (this.IsOutline ? "outline-" : "") + ButtonStyle[this.Style]);
            }
            var size = "";
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
            if (this.Status == ButtonStatus.Disabled) {
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
        };
        Button.prototype.clear = function () {
            this.object.removeClass();
            this.object.removeAttr("aria-pressed");
            this.object.removeAttr("autocomplete");
            this.object.removeAttr("role");
            this.object.removeProp("disabled");
            this.object.text("");
        };
        return Button;
    }(Component));
    Components.Button = Button;
    var Room = (function () {
        function Room(name, members, hasPassword) {
            this.name = null;
            this.members = [];
            this.id = null;
            this.hasPassword = null;
            this.name = name;
            this.members = members;
            this.hasPassword = hasPassword;
        }
        Object.defineProperty(Room.prototype, "Name", {
            get: function () {
                return this.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Room.prototype, "Members", {
            get: function () {
                return this.members;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Room.prototype, "HasPassword", {
            get: function () {
                return this.hasPassword;
            },
            enumerable: true,
            configurable: true
        });
        return Room;
    }());
    Components.Room = Room;
})(Components || (Components = {}));
//# sourceMappingURL=Components.js.map