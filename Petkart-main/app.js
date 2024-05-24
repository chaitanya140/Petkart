require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const findOrCreate = require("mongoose-find-or-create");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const _ = require("lodash");
const FacebookStrategy = require("passport-facebook");
const { use } = require("passport");
const Promise = require('promise');

const app = express();
let userName;
let profilePic = "img/profile.png";
let navCartIcon = "img/cart.jpg";

const carouselTitle = [
  ["Best", "Quality", "Pets", "carousel-1.jpg"],
  ["World’s", "Best", "Dogs and Cats", "carousel-2.jpg"],
  ["Fastest", "Order", "Delivery", "carousel-3.jpg"],
];

let userId = "null";
let noOfItem = 0;
let typeOfProduct = [];
let cartProductName = [];
let cartProductPrice = [];
let cartProductPic = [];
let cartProductId = [];
let items = [];
let dogsName = [];
let catsName = [];
let rabbitsName = [];
let birdsName = [];
let dogsId = [];
let catsId = [];
let rabbitsId = [];
let birdsId = [];
let dogsImage = [];
let catsImage = [];
let rabbitsImage = [];
let birdsImage = [];
let dogsPrice = [];
let catsPrice = [];
let rabbitsPrice = [];
let birdsPrice = [];
let selectedProductImage = [];
let selectedProductName = [];
let selectedProductPrice = [];
let productImage = [];
let productName = [];
let productPrice = [];
let productId = [];
let dogs, cats, birds, rabbits;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Oriental College Of Technology",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/petkartDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    require: true,
    index: true,
    unique: true,
    sparse: true,
  },
  password: String,
  mobileNo: String,
  dob: Date,
  lastLoginTime: Date,
  googleId: String,
  profilePicture: String,
  userCartItems: Array,
});
const cartSchema = new mongoose.Schema({
  productTitle: String,
  productName: String,
  productpics: Array,
  productPrice: Number,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);
const CartItem = mongoose.model("CartItem", cartSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/petkart",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.picture,
        },
        function (err, user) {
          profilePic = profile.photos[0].value;
          userName = profile.name.givenName;
          userId = user._id;
          return cb(err, user);
        }
      );
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/petkart",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          username: profile.displayName,
          facebookId: profile.id,
        },
        function (err, user) {
          profilePic = profile.photos[0].value;
          userName = profile.name.givenName;
          return cb(err, user);
        }
      );
    }
  )
);

if (items.length === 0) {
  CartItem.find({ productTitle: "Dogs" }, function (err, result) {
    items.push(result);
    dogs = items[0];
    dogs.forEach(function (item) {
      dogsName.push(item.productName);
      dogsImage.push(item.productpics);
      dogsPrice.push(item.productPrice);
      dogsId.push(item._id);
    });
  });
  CartItem.find({ productTitle: "Cats" }, function (err, result) {
    items.push(result);
    cats = items[1];
    cats.forEach(function (item) {
      catsName.push(item.productName);
      catsImage.push(item.productpics);
      catsPrice.push(item.productPrice);
      catsId.push(item._id);
    });
  });
  CartItem.find({ productTitle: "Rabbits" }, function (err, result) {
    items.push(result);
    rabbits = items[2];
    rabbits.forEach(function (item) {
      rabbitsName.push(item.productName);
      rabbitsImage.push(item.productpics);
      rabbitsPrice.push(item.productPrice);
      rabbitsId.push(item._id);
    });
  });
  CartItem.find({ productTitle: "Birds" }, function (err, result) {
    items.push(result);
    birds = items[3];
    birds.forEach(function (item) {
      birdsName.push(item.productName);
      birdsImage.push(item.productpics);
      birdsPrice.push(item.productPrice);
      birdsId.push(item._id);
    });
  });
  productName = [dogsName, catsName, rabbitsName, birdsName];
  productImage = [dogsImage, catsImage, rabbitsImage, birdsImage];
  productPrice = [dogsPrice, catsPrice, rabbitsPrice, birdsPrice];
  productId = [dogsId, catsId, rabbitsId, birdsId];
}

app.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/main-page");
  } else {
    res.render("home", {
      carouselTitle: carouselTitle,
      productTitle: ["Dogs", "Cats", "Rabbits", "Birds"],
      productImage: productImage,
      productName: productName,
      productPrice: productPrice,
      productId: productId,
      userDetail: userId,
      memberName: teamMembers,
      memberPic: teamMembersPic,
      memberWork: memberWork,
    });
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/petkart",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/main-page");
  }
);

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/petkart",
  passport.authenticate("facebook", {
    scope: ["public_profile"],
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/main-page");
  })
