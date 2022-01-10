const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const logF = require("log-to-file");

const app = express();
const server = http.createServer(app); // io requires raw http
const io = socketio(server); // Setup Socket.io's server

// Logger Function
function log(data) {
	console.log(data);
	// logF(data);
}

app.use(express.static("public"));

// Actual project code
const rooms = {};
io.on("connection", socket => {
	console.log("New Connection!");

	socket.on("user-joined", data => {
		socket.username = data.username;
		socket.room = data.room;
		if (rooms[data.room]) {
			rooms[data.room] = [...rooms[data.room], socket.username];
		} else {
			rooms[data.room] = [socket.username];
		}
		socket.join(data.room);
		socket.to(data.room).emit("updated-user-data", rooms[socket.room]);
		socket.emit("remote-user-joined");
		console.log(rooms[socket.room]);
	});

	socket.on("request-user-data", () => {
		console.log("request incoming");
		socket.emit("updated-user-data", rooms[socket.room]);
	});

	socket.on("sync-all", values => {
		console.log("emit remote sync");
		socket.to(socket.room).emit("remote-sync", values);
	});

	socket.on("editor-model-content-change", data => {
		socket.to(socket.room).emit("remote-content-change", data);
	});

	socket.on("run-code", data => {
		console.log("Run Emitted");
		socket.to(socket.room).emit("remote-run-code");
	});
	socket.on("chat-message", data => {
		socket.to(socket.room).emit("remote-chat-message", data);
	});
	socket.on("disconnect", () => {
		console.log(`User "${socket.username}" disconnected`, rooms[socket.room]);
		const room = rooms[socket.room] || [];
		const index = room.indexOf(socket.username);
		delete room[index];
		socket.to(socket.room).emit("updated-user-data", rooms[socket.room]);
	});
});

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => log(`Server is running on *:${port}`));
