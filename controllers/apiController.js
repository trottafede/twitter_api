const User = require("../models/User");
const Tweet = require("../models/Tweet");
const jwt = require("jsonwebtoken");

module.exports = {
  storeLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Incorrect email." });
      }
      if (!(await user.validatePassword(password))) {
        return res.status(401).json({ message: "Incorrect password." });
      }
      const token = jwt.sign({ user }, process.env.JWT_SECRET_TEXT);
      return res
        .status(200)
        .json({ message: "Entraste correctamente", token, user });
    } catch (error) {
      let message = error.toString().split("\n")[0];

      return res.status(400).json({ message });
    }
  },
  storeSignup: async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;

    try {
      const user = new User({
        firstname,
        lastname,
        username,
        email,
        password,
      });

      const isUserInDB = await User.findOne({ email });
      if (isUserInDB) {
        return res.status(401).json({ message: "Ya existe ese usuario" });
      }
      const newUser = await user.save();
    } catch (error) {
      let message = error.toString().split("\n")[0];
      return res.status(400).json({ message });
    }
    const token = jwt.sign({ newUser }, process.env.JWT_SECRET_TEXT);
    return res
      .status(200)
      .json({ message: "Create usuario correctamente", token });
  },
  index: async (req, res) => {
    const { user } = req.user;
    let tweets = [];
    let users = [];
    try {
      tweets = await Tweet.find().populate("User").sort({ createdAt: -1 });
      users = await User.find({
        _id: { $nin: user },
      }).sort({ createdAt: -1 });
    } catch (error) {
      let message = error.toString().split("\n")[0];

      return res.status(400).json({ message: "Explotó algo", message });
    }
    return res.status(200).json({ tweets, users });
  },

  updateLike: async (req, res) => {
    const { tweetId } = req.params;
    const { user } = req.user;
    try {
      let tweet = await Tweet.findById(tweetId);

      if (!tweet.Likes.includes(user._id)) {
        await tweet.Likes.push(user);
        await tweet.save();
        return res.status(200).json({ message: "added like" });
      }
    } catch (error) {
      let message = error.toString().split("\n")[0];

      return res
        .status(400)
        .json({ message: "Explotó algo al intentar likear", message });
    }
    return res
      .status(400)
      .json({ message: "No se pudo completar agregar like" });
  },
  destroyLike: async (req, res) => {
    const { tweetId } = req.params;
    const { user } = req.user;

    try {
      let tweet = await Tweet.findById(tweetId);
      if (tweet.Likes.includes(user._id)) {
        let pos = await tweet.Likes.indexOf(user._id);
        await tweet.Likes.splice(pos, 1); // this is how to remove an item
        await tweet.save();
        return res.status(200).json({ message: "deleted like" });
      }
    } catch (error) {
      let message = error.toString().split("\n")[0];
      return res
        .status(400)
        .json({ message: "Explotó algo al intentar destruir like", message });
    }
    return res
      .status(400)
      .json({ message: "No se pudo completar destruir like" });
  },

  storeTweet: async (req, res) => {
    const { tweetContent } = req.body;
    const { user } = req.user;

    console.log(tweetContent);
    console.log(user);
    try {
      const tweetCreated = await Tweet.create({
        Text: tweetContent,
        User: user,
      });
      userInDB = await User.findById(user._id);
      if (userInDB) {
        await userInDB.tweetsList.push(tweetCreated);
        await userInDB.save();
        return res.status(200).json({ message: "Se agregó un tweet" });
      }
    } catch (error) {
      let message = error.toString().split("\n")[0];
      return res
        .status(400)
        .json({ message: "Explotó algo al intentar postear tweet", message });
    }
    return res
      .status(400)
      .json({ message: "No se pudo completar agregar tweet" });
  },

  show: async (req, res) => {
    const username = req.params.username;
    let userFound;
    try {
      userFound = await User.findOne({ username }).populate({
        path: "tweetsList",
        options: { limit: 20, sort: [{ createdAt: "DESC" }] },
      });
      if (userFound) {
        return res.status(200).json(userFound);
      }
    } catch (error) {
      let message = error.toString().split("\n")[0];
      return res.status(400).json({ message: "Explotó algo", message });
    }

    return res
      .status(400)
      .json({ message: "No se pudo completar mostrar user" });
  },
  updateUser: async (req, res) => {
    const { user } = req.user;

    const { firstname, lastname, age, description, image } = req.body;
    try {
      const options = { new: true };
      const patchedUser = await User.findOneAndUpdate(
        user,
        { firstname, lastname, age, description, image },
        options
      ).populate({
        path: "tweetsList",
        options: { limit: 20, sort: [{ createdAt: "DESC" }] },
      });

      if (patchedUser) {
        return res.status(200).json(patchedUser);
      }
    } catch (error) {
      let message = error.toString().split("\n")[0];
      return res.status(400).json({ message: "Explotó algo", message });
    }

    return res
      .status(400)
      .json({ message: "No se pudo completar update user" });
  },
  destroyFriendship: async (req, res) => {
    const { username } = req.params;
    const { user } = req.user;

    try {
      loggedUser = await User.findById(user._id);

      const userIWillFollow = await User.findOne({ username });
      if (loggedUser.following.includes(userIWillFollow._id)) {
        let pos = await loggedUser.following.indexOf(userIWillFollow._id);
        await loggedUser.following.splice(pos, 1); // this is how to remove an item
        await loggedUser.save();

        pos = await userIWillFollow.followers.indexOf(loggedUser._id);
        await userIWillFollow.followers.splice(pos, 1); // this is how to remove an item
        await userIWillFollow.save();
      }
    } catch (error) {
      let message = error.toString().split("\n")[0];
      return res.status(400).json({ message: "Explotó algo", message });
    }
    return res.status(200).json({ message: "Friendship destroyed" });
  },
  storeFollow: async (req, res) => {
    const { username } = req.params;
    const { user } = req.user;

    try {
      loggedUser = await User.findById(user._id);

      const userIWillFollow = await User.findOne({ username });
      if (!loggedUser.following.includes(userIWillFollow._id)) {
        await loggedUser.following.push(userIWillFollow);
        await loggedUser.save();

        await userIWillFollow.followers.push(loggedUser);
        await userIWillFollow.save();
      }
    } catch (error) {
      let message = error.toString().split("\n")[0];
      return res.status(400).json({ message: "Explotó algo", message });
    }
    return res.status(200).json({ message: "Follow exitoso" });
  },
};
