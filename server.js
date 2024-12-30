const dotenv = require("dotenv").config();
require('./config/database')
https://git.generalassemb.ly/
const express = require("express");
const session = require('express-session');
const app = express();

const methodOverride = require("method-override");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");


// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
const authController = require("./controllers/auth.js");
const router = require("./controllers/auth.js");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

//middlewares

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(passUserToView);
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
    })
  );

app.use(
    "/vip-lounge",
    (req, res, next) => {
        if(req.session.user) {
            res.locals.user = req.session.user;
            next();
        }else{
            res.redirect("/")
        }
    },
    vipsController
);

// Public Routes

// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs", {
        user: req.session.user,
    });
  });
app.use("/auth", authController);




app.get("/vip-lounge", isSignedIn,(req, res) => {
    if (req.session.user) {
      res.send(`Welcome to the party ${req.session.user.username}.`);
    } else {
      res.send("Sorry, no guests allowed.");
    }
  });
  


// Private Routers



app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
