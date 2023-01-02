const express = require("express");
const signuprouter = express.Router();
const isEmpty = require("lodash.isempty");
const cors = require("cors");
var nodemailer = require("nodemailer");
let mysql = require("mysql");
const { requires } = require("consolidate");
const userDataValidateChainMethod=require('../Middlewares/signupMiddleware')
const { validationResult } = require("express-validator");
const connection=require('../config')

const { ifError } = require("assert");


/////////////////////////////////////////////////////////////////////////
signuprouter.options("/signup", cors());
signuprouter.get("/signup", (req, res) => {
  res.render("signup.html");
});




var myData = [];
//////////////////////////////////////User Data/////////////////////////////////////////
signuprouter.options("/signup", cors());
signuprouter.post("/signup",userDataValidateChainMethod,cors(), (req, res) => {
  const errors = validationResult(req);
  if(errors.isEmpty()){
const email = req.body.email;
  if (req.body.password === req.body.retype) {
    var sql = "SELECT * FROM users WHERE email=" + mysql.escape(email) + "";
    connection.query(sql, function (err, result) {
      if (!isEmpty(result)) {
        res.json("Email aready been taken");
      } else {
        $name = req.body.name;
        $email = req.body.email;
        $password = req.body.password;
        $cpassword = req.body.retype;
        $Contact = req.body.number;
        var sql =
          "INSERT INTO `users` (`name`, `email`, `password`, `cpassword`, `Contact`) VALUES ('" +
          $name +
          "', '" +
          $email +
          "','" +
          $password +
          "', '" +
          $cpassword +
          "','" +
          $Contact +
          "')";
        connection.query(sql, function (err, result) {
          if (err) res.send(err);
          else {
            var transport = nodemailer.createTransport({
              host: "smtp.mailtrap.io",
              port: 2525,
              auth: {
                user: "3619daa3d21b6f",
                pass: "b37d9047fe4db6",
              },
            });

            const mailData = {
              from: "yz255849@gmail.com", // sender address
              to: req.body.email, // list of receivers
              subject: "Registered Successfully",
              text: "That was easy!" + req.body.email,
              html:
                req.body.email +
                "<br>" +
                "<b>We wish you the best of luck with the app</b>",
            };
            transport.sendMail(mailData, (err, info) => {
              if (err) console.log(err);
              else
                res.status(200).json({
                  message: "Successfully Registered",
                  mail: "Mail has been sent successfully",
                });
            });
          }
        });
      }
    });
    res.render('login')
  } else {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  }
  else{
    res.send(errors)
  }
  
});

module.exports = signuprouter;
