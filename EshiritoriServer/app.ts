const fs = require("fs");
const http = require("http");
const socketio = require("socket.io");
const app = require("express")();

const server = http.Server(app);
server.listen(11451, () => {
    console.log("Server is running...");
});

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/client/index.html`);
});
app.get("/script.js", (req, res) => {
    res.sendFile(`${__dirname}/client/script.js`);
});
app.get("/MyCanvas.js", (req, res) => {
    res.sendFile(`${__dirname}/client/MyCanvas.js`);
});
app.get("/style.css", (req, res) => {
    res.sendFile(`${__dirname}/client/style.css`);
});

const io = socketio.listen(server);

let users = {};
io.sockets.on("connection", socket => {
    socket.on("connected", name => {
        let msg = `${name}さんが入室しました。`;
        users[socket.id] = name;
        io.sockets.emit("publish", { value: msg });
    });
    socket.on("publish", data => {
        io.sockets.emit("publish", { value: data.value });
    });
    socket.on("disconnect", () => {
        if (users[socket.id]) {
            let msg = `${users[socket.id]}さんが退室しました。`;
            delete users[socket.id];
            io.sockets.emit("publish", { value: msg });
        }
    });
});