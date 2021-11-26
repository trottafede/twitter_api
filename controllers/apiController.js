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
      return res.status(200).json({ message: "Entraste correctamente", token });
    } catch (error) {
      return res.status(400).json({ message: "Explotó algo" });
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
      return res.status(400).json({ message: "Explotó algo" });
    }
    const token = jwt.sign({ newUser }, process.env.JWT_SECRET_TEXT);
    return res
      .status(200)
      .json({ message: "Create usuario correctamente", token });
  },

  index: async (req, res) => {
    const loggedUser = req.user;
    let tweets = [];
    let users = [];
    try {
      tweets = await Tweet.find().populate("User").sort({ createdAt: -1 });
      users = await User.find({
        _id: { $nin: loggedUser.user },
      }).sort({ createdAt: -1 });
    } catch (error) {
      return res.status(400).json({ message: "Explotó algo", error });
    }
    return res.status(200).json({ tweets, users });
  },

  update: async (req, res) => {
    const { tweetId } = req.params;
    try {
      let tweet = await Tweet.findById(tweetId);
      if (!tweet.Likes.includes(req.user._id)) {
        await tweet.Likes.push(req.user);
        await tweet.save();
      }
    } catch (error) {
      if (error) throw error;
    }
    res.redirect("/");
  },
  destroy: async (req, res) => {
    const { tweetId } = req.params;

    try {
      let tweet = await Tweet.findById(tweetId);
      let pos = await tweet.Likes.indexOf(req.user._id);
      await tweet.Likes.splice(pos, 1); // this is how to remove an item
      await tweet.save();
    } catch (error) {
      if (error) throw error;
    }

    res.redirect("/");
  },

  store: async (req, res) => {
    const Text = req.body.tweet;
    const User = req.user;

    try {
      const tweetCreated = await Tweet.create({ Text, User });
      await User.tweetsList.push(tweetCreated);
      await User.save();
    } catch (error) {
      if (error) throw error;
    }
    res.redirect("/");
  },

  show: async (req, res) => {
    const username = req.params.username;
    let userFound;
    try {
      userFound = await User.findOne({ username }).populate({
        path: "tweetsList",
        options: { limit: 20, sort: [{ createdAt: "DESC" }] },
      });
    } catch (error) {
      if (error) throw error;
    }

    res.render("profile", { passportUser: req.user, user: userFound });
  },
  update: async (req, res) => {
    const passportUser = req.user;
    const { firstname, lastname, age, description, image } = req.body;
    let updatedPassportUser;
    try {
      const options = { new: true };
      updatedPassportUser = await User.findOneAndUpdate(
        passportUser,
        { firstname, lastname, age, description, image },
        options
      ).populate({
        path: "tweetsList",
        options: { limit: 20, sort: [{ createdAt: "DESC" }] },
      });
    } catch (error) {
      if (error) throw error;
    }
    res.render("profile", {
      passportUser: updatedPassportUser,
      user: updatedPassportUser,
    });
  },
  destroyFriendship: async (req, res) => {
    const { username } = req.params;
    const loggedUser = req.user;
    try {
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
      if (error) throw error;
    }
    res.redirect("back");
  },
  storeFollow: async (req, res) => {
    const { username } = req.params;
    const loggedUser = req.user;
    try {
      const userIWillFollow = await User.findOne({ username });
      if (!loggedUser.following.includes(userIWillFollow._id)) {
        await loggedUser.following.push(userIWillFollow);
        await loggedUser.save();

        await userIWillFollow.followers.push(loggedUser);
        await userIWillFollow.save();
      }
    } catch (error) {
      if (error) throw error;
    }
    res.redirect("back");
  },
};
