const response = require("../modules/response");
const userDb = require("../schemas/tinderUsersSchema");
const bcrypt = require("bcrypt");

let filteredUsers = [];
let deletedUsers = [];

module.exports = {
  register: async (req, res) => {
    const { username, passOne, age, city, gender, preference } = req.body;
    const password = await bcrypt.hash(passOne, 10);
    const user = new userDb({
      username,
      password,
      age,
      city,
      gender,
      preference,
    });
    await user.save();

    response(res, "Registration complete", false, user);
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    const user = await userDb.findOne({ username });
    if (user) {
      const compare = await bcrypt.compare(password, user.password);
      if (compare) {
        // saves user to session
        req.session.user = user;

        return response(res, "You are loggedin", false, user);
      }
      return response(res, "password do not match", true);
    }
    return response(res, "user not found", true);
  },

  stayLogedin: async (req, res) => {
    // checks if session user exists, if does sends user to front
    if (req.session.user) {
      const { username } = req.session.user;
      const user = await userDb.findOne({ username });
      return response(res, "autologin is on", false, user);
    }
    return response(res, "no user in session", true);
  },

  logOut: async (req, res) => {
    req.session.user = null;
    return response(res, "autologin is off", true);
  },

  addPicutres: async (req, res) => {
    const { photo, _id } = req.body;
    const user = await userDb.findOne({ _id });

    if (user) {
      // remove default picture when pic is added
      if (
        user.pictures.includes(
          "https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360"
        )
      ) {
        user.pictures.shift();
      }
      user.pictures.push(photo);
      await user.save();
      return response(res, "Photo saved", false, user);
    }
    return response(res, "something went wrong", true);
  },

  allUsers: async (req, res) => {
    const users = await userDb.find();
    allUsers = users;
    if (users) {
      return response(res, "all users", false, users);
    }
    return response(res, "something went wrong", true);
  },

  filterMatches: async (req, res) => {
    // filters users by user choise
    const { city, preference, age, _id } = req.body;
    const users = await userDb.find();
    const user = await userDb.findOne({ _id });
    const filteredArray = users.filter(
      (obj) =>
        obj.city === city &&
        obj.gender === preference &&
        obj.age <= age &&
        obj.password !== user.password
    );
    filteredUsers = filteredArray;
    if (users) {
      if (filteredArray.length === 0) {
        return response(res, "users by filter criteria was not found", true);
      }

      // sends filtered users to frond end
      return response(res, "filtered users sent", false, filteredArray);
    }
    return response(res, "can't get any users", true);
  },
  like: async (req, res) => {
    const { myUserId, likedUserId } = req.body;
    // finds current user
    const user = await userDb.findOne({ _id: myUserId });
    // finds likedUser
    const likedUser = await userDb.findOne({ _id: likedUserId });
    // // pushes liked users to like arr
    user.likes.push(likedUser);
    await user.save();
    // checks if user has filtered users
    if (filteredUsers.length === 0) {
      const users = await userDb.find();

      const userIndex = users.findIndex(
        (x) => x.password === likedUser.password
      );
      // deletes liked users from users array and sends updated arr to front
      const deletedUsersArr = users.slice(userIndex);
      // deleted users clone
      deletedUsers = deletedUsersArr;
      return response(
        res,
        "liked user removed from array",
        false,
        deletedUsers
      );
    }

    // response(res, "there is no more users", true);
  },
};
