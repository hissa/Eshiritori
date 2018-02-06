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
        }

        private addEventListeners() {
            this.canvas.addEventListener("mousemove", e => this.mouseMove(e));
            this.canvas.addEventListener("mousedown", e => this.mouseDown(e));
            this.canvas.addEventListener("mouseup", e => this.mouseUp(e));
        }

        private mouseMove(e: MouseEvent) {
            if (!this.isDrawing) return;
            let target = <HTMLElement>e.target;
            let rect = target.getBoundingClientRect();
            this.point = new Point(e.clientX - rect.left, e.clientY - rect.top);
            this.draw();
        }

        private mouseDown(e: MouseEvent) {
            this.isDrawing = true;
            let target = <HTMLElement>e.target;
            let rect = target.getBoundingClientRect();
            this.beforPoint = new Point(e.clientX - rect.left, e.clientY - rect.top);

        }

        private mouseUp(e: MouseEvent) {
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
            this.beforPoint = this.point;
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
    }
}