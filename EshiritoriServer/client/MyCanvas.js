var MyCanvas;
(function (MyCanvas) {
    // LineCapの値
    (function (LineCap) {
        LineCap[LineCap["butt"] = 0] = "butt";
        LineCap[LineCap["round"] = 1] = "round";
        LineCap[LineCap["square"] = 2] = "square";
    })(MyCanvas.LineCap || (MyCanvas.LineCap = {}));
    var LineCap = MyCanvas.LineCap;
    ;
    /**
     * お絵かきのキャンバスのクラス
     */
    var Canvas = (function () {
        /**
         * Canvasクラスのコンストラクター
         * @param canvas 対象のHTMLのCanvas要素
         */
        function Canvas(canvas) {
            // イベント
            this.lineDrawedEvent = function () { };
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.point = new Point();
            this.beforPoint = new Point();
            this.isDrawing = false;
            this.pen = new Pen();
            this.addEventListeners();
            this.outArea = false;
            this.Histories = [];
            this.BackCursor = 0;
        }
        Object.defineProperty(Canvas.prototype, "LineWidth", {
            // アクセサ
            get: function () {
                return this.pen.Width;
            },
            set: function (value) {
                this.pen.Width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas.prototype, "LineColor", {
            get: function () {
                return this.pen.Color;
            },
            set: function (value) {
                this.pen.Color = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas.prototype, "LineCap", {
            get: function () {
                return this.pen.Cap;
            },
            set: function (value) {
                this.pen.Cap = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas.prototype, "LineDrawedEvent", {
            set: function (func) {
                this.lineDrawedEvent = func;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas.prototype, "CanvasElement", {
            get: function () {
                return this.canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas.prototype, "CanDraw", {
            get: function () {
                return this.canDraw;
            },
            set: function (value) {
                this.canDraw = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 渡されたデータから描画します。
         * @param data データ
         */
        Canvas.prototype.DrawByData = function (data) {
            this.ctx.lineCap = LineCap[data.pen.cap];
            this.ctx.strokeStyle = data.pen.color;
            this.ctx.lineWidth = data.pen.width;
            this.ctx.beginPath();
            this.ctx.moveTo(data.befor.x, data.befor.y);
            this.ctx.lineTo(data.point.x, data.point.y);
            this.ctx.stroke();
            this.ctx.closePath();
        };
        /**
         * DataUrlから描画します。
         * @param image DataURL
         */
        Canvas.prototype.ShowImage = function (image, callback) {
            var _this = this;
            if (callback === void 0) { callback = function () { }; }
            var img = new Image();
            img.src = image;
            //img.onload = () => this.ctx.drawImage(img, 0, 0);
            img.onload = function () {
                _this.ctx.drawImage(img, 0, 0);
                callback();
            };
        };
        /**
         * キャンバスをクリアします。
         */
        Canvas.prototype.Clear = function () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
        Canvas.prototype.addEventListeners = function () {
            var _this = this;
            this.canvas.addEventListener("mousemove", function (e) { return _this.mouseMove(e); });
            this.canvas.addEventListener("mousedown", function (e) { return _this.mouseDown(e); });
            this.canvas.addEventListener("mouseup", function (e) { return _this.mouseUp(e); });
            // 枠外でイベントが発生した場合の対応
            document.addEventListener("mouseup", function (e) { return _this.mouseUp(e); });
            $("body").attr({ "onselectstart": "return false" });
            document.addEventListener("mousemove", function (e) { return _this.mouseMove(e); });
        };
        Canvas.prototype.isContainPoint = function (point) {
            var rect = this.CanvasElement.getBoundingClientRect();
            if (rect.top > point.Y) {
                return false;
            }
            if (rect.bottom < point.Y) {
                return false;
            }
            if (rect.left > point.X) {
                return false;
            }
            if (rect.right < point.X) {
                return false;
            }
            return true;
        };
        Canvas.prototype.mouseMove = function (e) {
            if (!this.isDrawing)
                return;
            if (!this.canDraw)
                return;
            if (this.outArea)
                return;
            var target = this.CanvasElement;
            var rect = target.getBoundingClientRect();
            this.point = new Point(e.clientX - rect.left, e.clientY - rect.top);
            if (!this.isContainPoint(new Point(e.clientX, e.clientY))) {
                this.outArea = true;
            }
            this.draw();
        };
        Canvas.prototype.mouseDown = function (e) {
            if (!this.isContainPoint(new Point(e.clientX, e.clientY))) {
                return;
            }
            this.outArea = false;
            this.isDrawing = true;
            var target = e.target;
            var rect = target.getBoundingClientRect();
            this.beforPoint = new Point(e.clientX - rect.left, e.clientY - rect.top);
        };
        Canvas.prototype.mouseUp = function (e) {
            if (this.isDrawing) {
                var img = this.CanvasElement.toDataURL();
                this.addHistory(img);
            }
            this.isDrawing = false;
        };
        Canvas.prototype.draw = function () {
            this.ctx.lineCap = LineCap[this.pen.Cap];
            this.ctx.strokeStyle = this.pen.Color;
            this.ctx.lineWidth = this.pen.Width;
            this.ctx.beginPath();
            this.ctx.moveTo(this.beforPoint.X, this.beforPoint.Y);
            this.ctx.lineTo(this.point.X, this.point.Y);
            this.ctx.stroke();
            this.ctx.closePath();
            // イベント発火
            this.lineDrawedEvent({
                pen: this.pen.ToHash(),
                befor: this.beforPoint.ToHash(),
                point: this.point.ToHash()
            });
            this.beforPoint = this.point;
        };
        Canvas.prototype.back = function (callback) {
            if (callback === void 0) { callback = function () { }; }
            this.BackCursor++;
            if (this.Histories[this.BackCursor] == undefined)
                return;
            var url = this.Histories[this.BackCursor];
            this.Clear();
            this.ShowImage(url, callback);
        };
        Canvas.prototype.addHistory = function (dataUrl) {
            if (this.BackCursor > 0) {
                this.Histories.splice(0, this.BackCursor);
            }
            dataUrl = dataUrl == undefined ? this.CanvasElement.toDataURL() : dataUrl;
            this.Histories.unshift(dataUrl);
            this.BackCursor = 0;
        };
        /**
         * 戻る機能の為の履歴をクリアします。
         */
        Canvas.prototype.clearHistories = function () {
            this.Histories = [];
            this.BackCursor = 0;
        };
        return Canvas;
    }());
    MyCanvas.Canvas = Canvas;
    /**
     * 二次元上の座標を表すクラス
     */
    var Point = (function () {
        /**
         * 任意の値がセットされたインスタンスを作成します。
         * @param x X座標の値
         * @param y Y座標の値
         */
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.X = x;
            this.Y = y;
        }
        Object.defineProperty(Point.prototype, "X", {
            get: function () {
                return this.x;
            },
            set: function (value) {
                this.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "Y", {
            get: function () {
                return this.y;
            },
            set: function (value) {
                this.y = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 保持している情報をハッシュテーブルとして返します。
         */
        Point.prototype.ToHash = function () {
            return {
                x: this.X,
                y: this.Y
            };
        };
        return Point;
    }());
    MyCanvas.Point = Point;
    /**
     * キャンバス上で描かれる線の情報を持つクラス
     */
    var Pen = (function () {
        /**
         * Penクラスのコンストラクター
         * @param width 線の幅(px)
         * @param color 色
         * @param cap   Capのタイプ
         */
        function Pen(width, color, cap) {
            if (width === void 0) { width = 10; }
            if (color === void 0) { color = "black"; }
            if (cap === void 0) { cap = LineCap.round; }
            this.Width = width;
            this.Color = color;
            this.Cap = cap;
        }
        Object.defineProperty(Pen.prototype, "Width", {
            get: function () {
                return this.width;
            },
            set: function (value) {
                this.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pen.prototype, "Color", {
            get: function () {
                return this.color;
            },
            set: function (value) {
                this.color = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pen.prototype, "Cap", {
            get: function () {
                return this.cap;
            },
            set: function (value) {
                this.cap = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 保持しているデータをハッシュテーブルとして返します。
         */
        Pen.prototype.ToHash = function () {
            return {
                width: this.Width,
                color: this.Color,
                cap: this.Cap
            };
        };
        return Pen;
    }());
})(MyCanvas || (MyCanvas = {}));
//# sourceMappingURL=MyCanvas.js.map