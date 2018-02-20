namespace MyCanvas {
    // LineCapの値
    export enum LineCap { butt, round, square };

    /**
     * お絵かきのキャンバスのクラス
     */
    export class Canvas {

        // プロパティ
        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;
        private beforPoint: Point;
        private point: Point;
        private isDrawing: boolean;
        private pen: Pen;
        private canDraw: boolean;
        private outArea: boolean;
        private Histories: string[];
        private BackCursor: number;
        // イベント
        private lineDrawedEvent: (data: any) => void = () => { };

        // アクセサ
        get LineWidth(): number {
            return this.pen.Width;
        }
        set LineWidth(value: number) {
            this.pen.Width = value;
        }

        get LineColor(): string {
            return this.pen.Color;
        }
        set LineColor(value: string) {
            this.pen.Color = value;
        }

        get LineCap(): LineCap {
            return this.pen.Cap;
        }
        set LineCap(value: LineCap) {
            this.pen.Cap = value;
        }

        set LineDrawedEvent(func: (data: any) => void) {
            this.lineDrawedEvent = func;
        }

        get CanvasElement(): HTMLCanvasElement {
            return this.canvas;
        }

        get CanDraw(): boolean {
            return this.canDraw;
        }
        set CanDraw(value: boolean) {
            this.canDraw = value;
        }

        /**
         * Canvasクラスのコンストラクター
         * @param canvas 対象のHTMLのCanvas要素
         */
        constructor(canvas: HTMLCanvasElement) {
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

        /**
         * 渡されたデータから描画します。
         * @param data データ
         */
        public DrawByData(data: any) {
            this.ctx.lineCap = LineCap[data.pen.cap];
            this.ctx.strokeStyle = data.pen.color;
            this.ctx.lineWidth = data.pen.width;
            this.ctx.beginPath();
            this.ctx.moveTo(data.befor.x, data.befor.y);
            this.ctx.lineTo(data.point.x, data.point.y);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        /**
         * DataUrlから描画します。
         * @param image DataURL
         */
        public ShowImage(image: string, callback = () => { }) {
            let img = new Image();
            img.src = image;
            //img.onload = () => this.ctx.drawImage(img, 0, 0);
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
                callback();
            }
        }

        /**
         * キャンバスをクリアします。
         */
        public Clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        private addEventListeners() {
            this.canvas.addEventListener("mousemove", e => this.mouseMove(e));
            this.canvas.addEventListener("mousedown", e => this.mouseDown(e));
            this.canvas.addEventListener("mouseup", e => this.mouseUp(e));
            // 枠外でイベントが発生した場合の対応
            document.addEventListener("mouseup", e => this.mouseUp(e));
            $("body").attr({ "onselectstart": "return false" });
            document.addEventListener("mousemove", e => this.mouseMove(e));
        }

        private isContainPoint(point: Point): boolean {
            let rect = this.CanvasElement.getBoundingClientRect();
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
        }

        private mouseMove(e: MouseEvent) {
            if (!this.isDrawing) return;
            if (!this.canDraw) return;
            if (this.outArea) return;
            let target = this.CanvasElement;
            let rect = target.getBoundingClientRect();
            this.point = new Point(e.clientX - rect.left, e.clientY - rect.top);
            if (!this.isContainPoint(new Point(e.clientX, e.clientY))) {
                this.outArea = true;
            }
            this.draw();
        }

        private mouseDown(e: MouseEvent) {
            if (!this.isContainPoint(new Point(e.clientX, e.clientY))) {
                return;
            }
            this.outArea = false;
            this.isDrawing = true;
            let target = <HTMLElement>e.target;
            let rect = target.getBoundingClientRect();
            this.beforPoint = new Point(e.clientX - rect.left, e.clientY - rect.top);
        }

        private mouseUp(e?: MouseEvent) {
            if (this.isDrawing) {
                let img = this.CanvasElement.toDataURL();
                this.addHistory(img);
            }
            this.isDrawing = false;
        }

        private draw() {
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
        }

        public back(callback = () => { }) {
            this.BackCursor++;
            if (this.Histories[this.BackCursor] == undefined) return;
            let url = this.Histories[this.BackCursor];
            this.Clear();
            this.ShowImage(url, callback);
        }

        public addHistory(dataUrl?: string) {
            if (this.BackCursor > 0) {
                this.Histories.splice(0, this.BackCursor);
            }
            dataUrl = dataUrl == undefined ? this.CanvasElement.toDataURL() : dataUrl;
            this.Histories.unshift(dataUrl);
            this.BackCursor = 0;
        }

        /**
         * 戻る機能の為の履歴をクリアします。
         */
        public clearHistories() {
            this.Histories = [];
            this.BackCursor = 0;
        }
    }

    /**
     * 二次元上の座標を表すクラス
     */
    export class Point {
        private x: number;
        private y: number;

        get X(): number {
            return this.x;
        }
        set X(value: number) {
            this.x = value;
        }

        get Y(): number {
            return this.y;
        }
        set Y(value: number) {
            this.y = value;
        }

        /**
         * 任意の値がセットされたインスタンスを作成します。
         * @param x X座標の値
         * @param y Y座標の値
         */
        constructor(x: number = 0, y: number = 0) {
            this.X = x;
            this.Y = y;
        }

        /**
         * 保持している情報をハッシュテーブルとして返します。
         */
        public ToHash(): any {
            return {
                x: this.X,
                y: this.Y
            };
        }
    }

    /**
     * キャンバス上で描かれる線の情報を持つクラス
     */
    class Pen {
        private width: number;
        private color: string;
        private cap: LineCap;

        get Width(): number {
            return this.width;
        }
        set Width(value: number) {
            this.width = value;
        }

        get Color(): string {
            return this.color;
        }
        set Color(value: string) {
            this.color = value;
        }

        get Cap(): LineCap {
            return this.cap;
        }
        set Cap(value: LineCap) {
            this.cap = value;
        }

        /**
         * Penクラスのコンストラクター
         * @param width 線の幅(px)
         * @param color 色   
         * @param cap   Capのタイプ
         */
        constructor(width: number = 10, color: string = "black", cap: LineCap = LineCap.round) {
            this.Width = width;
            this.Color = color;
            this.Cap = cap;
        }

        /**
         * 保持しているデータをハッシュテーブルとして返します。
         */
        public ToHash(): any {
            return {
                width: this.Width,
                color: this.Color,
                cap: this.Cap
            };
        }
    }
}