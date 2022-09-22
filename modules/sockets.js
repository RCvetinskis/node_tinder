const socket = require("socket.io");

module.exports = (http) => {
  const io = socket(http, { cors: { origin: "http://localhost:3000" } });

  io.on("connection", (socket) => {
    socket.on("login");
  });
};
