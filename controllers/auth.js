/* eslint-disable prefer-destructuring */
const express = require('express');
// const bcrypt = require('bcrypt');
const bcrypt = require("bcrypt");

const User = require('../models/user.js');

const router = express.Router();


router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const username = req.body.username;

    const userInDatabase = await User.findOne({ username })
    if( userInDatabase) {
        return res.send('Username is already taken');
    }

    if(password !== confirmPassword){

        return res.send('Passwords do not match');
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}`)    
    


    // res.send("Form submission accepted!");
});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});
router.post("/sign-in", async (req, res) => {
    // res.send("Request to sign in received!");
    const userInDatabase = await User.findOne({ username: req.body.username });
    
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
      );

    
    if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
    }
    if (!validPassword) {
        return res.send("Login failed. Please try again.");
    }
    req.session.user = {
        // username: userInDatabase.username,
        username: userInDatabase.username,
        _id: userInDatabase._id
    };
    req.session.save(() => {
        res.redirect('/');
    })

});


router.get("/sign-out", (req,res) =>{
    // res.send("The user wants out!");
    
    req.session.destroy(()=>{
        res.redirect("/");
    })
    
})

module.exports = router;