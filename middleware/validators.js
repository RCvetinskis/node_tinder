const response = require("../modules/response");
const userDb = require("../schemas/tinderUsersSchema");
module.exports = {
  validateRegistration: async (req, res, next) => {
    const { username, passOne, passTwo, age } = req.body;
    // finds user to check if user name is taken
    const user = await userDb.findOne({ username });
    if (age < 18 || age >= 100)
      return response(
        res,
        "to use Cvetinder you must be 18+ and can't overexceed 100",
        true
      );

    if (passOne.length < 4)
      return response(res, "password minimum length 4", true);

    if (passOne !== passTwo)
      return response(res, "passwords should match", true);

    if (username.length < 3)
      return response(res, "username minimum length 3", true);

    if (user) {
      if (user.username === username)
        return response(res, "user already exists", true);
    }
    next();
  },
  validatePicture: async (req, res, next) => {
    const { photo } = req.body;
    if (!photo.match("http")) return response(res, "image format is bad", true);
    next();
  },
};
