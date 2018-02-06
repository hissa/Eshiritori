const fs = require("fs");
const http = require("http");
const socketio = require("socket.io");
const app = require("express")();


// Create Server
const server = http.Server(app);
server.listen(11451, () => {
    console.log("Server is running...");
});

// Routing
app.get("/:file", (req, res) => {
    if (req.params.file == "/") {
        res.sendFile(`${__dirname}/client/index.html`);
        return;
    }
    res.sendFile(`${__dirname}/client/${req.params.file}`);
});

// Use Socket.IO
const io = socketio.listen(server);

let users = {};
io.sockets.on("connection", socket => {

    // Define Events
    socket.on("Connected", name => {
        users[socket.id] = name;
        io.sockets.emit("PlayerConnected", {
            player: {
                name: name,
                id: socket.id
            }
        });
        console.log(`Connected: ${name}`);
    });
    socket.on("Publish", data => {
        io.sockets.emit("MessagePublished", {
            value: data.value,
            player: {
                name: users[socket.id],
                socketId: socket.id
            }
        });
        console.log(`Published: [${users[socket.id]}]${data.value}`);
    });
    socket.on("disconnect", () => {
        if (users[socket.id]) {
            let name = users[socket.id];
            delete users[socket.id];
            io.sockets.emit("PlayerDisconnected", {
                player: {
                    name: name,
                    socketId: socket.id
                }
            });
            console.log(`Disconnected: ${name}`);
        }
    });
});