//const socketioc = io.connect("http://localhost:11451");
//socketioc.on("connected", name => { });
//socketioc.on("publish", data => addMessage(data.value));
//socketioc.on("disconnect", () => { });

//const start = (name) => {
//    socketioc.emit("connected", name);
//};

//const publishMessage = (name, message) => {
//    let msg = `[${name}] ${message}`;
//    socketioc.emit("publish", { value: msg });
//};

//const addMessage = (msg) => {
//    console.log(msg);
//}

//let myName = "default";
//addMessage(`${myName}として入室しました。`);
//start(myName);

import Canvas = MyCanvas;
let canvas = new Canvas.Canvas(<HTMLCanvasElement>document.getElementById("canvas"));
console.log(canvas);