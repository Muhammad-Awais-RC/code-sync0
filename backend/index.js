import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server);

const socketUsersMap = {};

function getAllConnectedClients(roomID) {
	return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map(
		(socketId) => {
			return {
				socketId,
				username: socketUsersMap[socketId],
			};
		}
	);
}

io.on("connection", (socket) => {
	socket.on("join", ({ roomId, username }) => {
		socketUsersMap[socket.id] = username;
		socket.join(roomId);
		const clients = getAllConnectedClients(roomId);
		// console.log(clients)
		clients.forEach(({ socketId }) =>
			io.to(socketId).emit("joined", {
				clients,
				username,
				socketId: socket.id,
			})
		);
	});

	socket.on("code-change", ({ roomId, code }) => {
		socket.in(roomId).emit("code-change", {
			code,
		});
	});

	socket.on("code-sync", ({ socketId, code }) => {
		io.to(socketId).emit("code-change", { code });
	});

	socket.on("disconnecting", () => {
		const rooms = [...socket.rooms];
		rooms.forEach((roomId) => {
			socket.in(roomId).emit("disconnected", {
				socketId: socket.id,
				username: socketUsersMap[socket.id],
			});
		});
		delete socketUsersMap[socket.id];
		socket.leave();
	});
});

server.listen(PORT, () => console.log("App is listening on 3000"));
