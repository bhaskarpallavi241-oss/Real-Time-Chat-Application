const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("set username", (username) => {
        socket.username = username;
        io.emit("user joined", `${username} joined the chat`);
    });

    socket.on("chat message", (msg) => {
        io.emit("chat message", { user: socket.username, text: msg });
    });

    socket.on("typing", () => {
        socket.broadcast.emit("typing", socket.username);
    });

    socket.on("stop typing", () => {
        socket.broadcast.emit("stop typing", socket.username);
    });

    socket.on("disconnect", () => {
        if (socket.username) {
            io.emit("user left", `${socket.username} left the chat`);
        }
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
