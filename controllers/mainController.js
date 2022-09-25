const response = require("../modules/response");
const userDb = require("../schemas/tinderUsersSchema");
const bcrypt = require("bcrypt");

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
    const users = await userDb.find();

    if (user) {
      const filteredArray = users.filter(
        (obj) =>
          obj.city === user.city &&
          obj.gender === user.preference &&
          obj.password !== user.password &&
          // removes from array already liked people
          !user.likes.includes(obj._id)
      );
      const compare = await bcrypt.compare(password, user.password);
      if (compare) {
        // saves user to session
        req.session.user = user;
        // sends current users to front and all users filtered by his intersts
        return res.send({
          message: "succsefully loged in",
          error: false,
          user,
          users: filteredArray,
        });
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
        // replaces 1 element at 0 index
        user.pictures.splice(0, 1, photo);
        await user.save();
      } else {
        user.pictures.push(photo);
        await user.save();
      }

      return response(res, "Photo saved", false, user);
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
        obj.password !== user.password &&
        // removes from array already liked people
        !user.likes.includes(obj._id)
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
    const likedUser = await userDb.findOne({ _id: likedUserId });
    // saves users to like array
    if (user.likes.includes(likedUserId)) {
      return response(res, "user already is liked", true);
    } else {
      // // pushes liked users to like arr
      user.likes.push(likedUserId);
      await user.save();
      // pushes user who liked you to likedBy arr
      likedUser.likedBy.push(myUserId);
      await likedUser.save();
      return response(res, "user likes list updated", false, user);
    }
  },
  dislike: async (req, res) => {
    const { myUserId, dislikedUserId } = req.body;
    const user = await userDb.findOne({ _id: myUserId });
    if (user.dislikes.includes(dislikedUserId)) {
      return response(res, "user already is disliked", true);
    } else {
      user.dislikes.push(dislikedUserId);
      await user.save();
      return response(res, "your user dislikes list is updated", false, user);
    }
  },
  showLikedUsers: async (req, res) => {
    // sends users to likes page, filtered users array by likes
    const { stateValue, likes, likedBy } = req.body;
    const users = await userDb.find();

    if (users) {
      // checks stateValue
      if (stateValue === "myLikes") {
        // filter users from db to show only liked users and sends array to front end
        const filteredLikesUsers = users.filter((x) => likes.includes(x.id));
        return response(
          res,
          "filtered by mylikes users was sent",
          false,
          filteredLikesUsers
        );
      } else if (stateValue === "likedBy") {
        const filteredLikedBy = users.filter((x) => likedBy.includes(x.id));
        return response(
          res,
          "filtered by likedBy users was sent",
          false,
          filteredLikedBy
        );
      }
    }
    return response(res, "something went wrong", true);
  },
};
