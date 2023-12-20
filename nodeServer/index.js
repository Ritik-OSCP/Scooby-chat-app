// Node server which will handle socket io connections

const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "X-Auth-Token", "Origin", "Authorization"],
  },
});

const users = {};

io.on("connection", (socket) => {
  // If any new user joins, let other users connected to the server know!
  socket.on("new-user-joined", (fname) => {
    users[socket.id] = fname;
    socket.broadcast.emit("user-joined", fname);
  });

  // If someone sends a message, broadcast it to other people
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      fname: users[socket.id],
    });
  });

  // If someone leaves the chat, let others know
  socket.on('disconnect', message => {
    socket.broadcast.emit('leave', users[socket.id])
    delete users[socket.id]
  })
});
