io.on("connection", (socket) => {

// basic emit
socket.emit(/* ... */);

// to all clients in the current namespace except the sender
socket.broadcast.emit(/* ... */);

// to all clients in room1 except the sender
socket.to("room1").emit(/* ... */);

// to all clients in room1 and/or room2 except the sender
socket.to(["room1", "room2"]).emit(/* ... */);

// to all clients in room1
io.in("room1").emit(/* ... */);

// to all clients in room1 and/or room2 except those in room3
io.to(["room1", "room2"]).except("room3").emit(/* ... */);

// to all clients in namespace "myNamespace"
io.of("myNamespace").emit(/* ... */);

// to all clients in room1 in namespace "myNamespace"
io.of("myNamespace").to("room1").emit(/* ... */);

// to individual socketid (private message)
io.to(socketId).emit(/* ... */);

// to all clients on this node (when using multiple nodes)
io.local.emit(/* ... */);

// to all connected clients
io.emit(/* ... */);

// WARNING: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone in the room
// named `socket.id` but the sender. Please use the classic `socket.emit()` instead.

// with acknowledgement
socket.emit("question", (answer) => {
    // ...
});
