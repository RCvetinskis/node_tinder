const socket = require("socket.io");
const users = [];
module.exports = (http) => {
  const io = socket(http, { cors: { origin: "http://localhost:3000" } });

  io.on("connection", (socket) => {
    socket.on("login", (user) => {
      const newUser = {
        user,
        id: socket.id,
      };
      users.push(newUser);
    });
    socket.on("likedUser", (likedUserId) => {
      const userIndex = users.findIndex((x) => x.id === socket.id);
      const thisUser = users[userIndex];
      const likedUserIndex = users.findIndex((x) => x.user._id === likedUserId);
      const likedUser = users[likedUserIndex];
      if (thisUser) {
        // pushes liked users to like arr
        thisUser.user.likes.push(likedUserId);

        io.to(socket.id).emit("likedUser", thisUser.user);
      }

      if (likedUser) {
        // pushes likedby users to arr
        likedUser.user.likedBy.push(thisUser.user._id);
        io.to(likedUser.id).emit("likedUser", likedUser.user);
      }
    });
  });
};
