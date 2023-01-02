const express = require("express");

const loginrouter = express.Router();
const connection = require("../config");
const isEmpty = require("lodash.isempty");
const cors = require("cors");
let mysql = require("mysql");
const { cookie } = require("request");
const jwt = require("jsonwebtoken");
const cheerio = require("cherio");
const request = require("request");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const alltogether = require("express-list-endpoints");
var alldata = [];
const http = require('http').createServer();
http.listen(8080, () => console.log('listening on http://localhost:8080') );
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});


loginrouter.get("/images", (req, res) => {
  const url = "https://polanderkempo.com/";
  downloadImages(url);
  async function downloadImages(url) {
    if (url) {
      request(url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          if (url !== "#" || url !== undefined || url !== "") {
            const images = $("img");

            images.each((i, image) => {
              const fileName = `IMAGE_NAME-${i}.jpg`;
              const src = $(image).attr("src");
              const imgPath = `${src}`;
              console.log(imgPath)
              var pattern = /^((http|https|ftp):\/\/)/;
              if (pattern.test(imgPath)) {
                if (imgPath.length < 500) {
                  var logger = fs.createWriteStream("log.txt", {
                    flags: "a", // 'a' means appending (old data will be preserved)
                  });

                  logger.write(imgPath+ "\n");
                 
                } else {
                  const imgPath1 = `${url}${src}`;
                             
                    var logger = fs.createWriteStream("log.txt", {
                      flags: "a", // 'a' means appending (old data will be preserved)
                    });
  
                    logger.write(imgPath1+ "\n");


                }
              }
            });
          }

          const links = $("a");

          links.each((i, link) => {
            const href = $(link).attr("href");
            downloadImages(href);
          });
        }
      });
    }
  }
});

loginrouter.options("/imagePage", cors());
loginrouter.get("/imagePage", cors(), (req, res) => {
  res.render("./admin/images.html");
});


// loginrouter.get("/getImages", cors(), (req, res) => {
//   var sql = " SELECT urls FROM `images`";

//   connection.query(sql, function (err, result) {
//     if (!err) {
//       var exampleSocket = new WebSocket("wss://localhost:8000", "dummyProtocol");
//       res.send(result);
//     } else {
//       res.send(err);
//     }
//   });
// });
io.on('connection', (socket,req,res) => {
  res.send("hiiii")
})

///////////////////////////////////////////////////////
loginrouter.options("/getImages", cors());
loginrouter.get('/getImages',cors(),(req,res)=>{
  
  var array = fs.readFileSync('log.txt').toString().split("\n");
 for(i in array) {
    var sql = "INSERT into images (urls) values ('"+array[i]+"')";
    connection.query(sql, function (err, result) {
      if (err){return next(err)}; 
      if(!err) {
        
        var sql1 = " SELECT urls FROM `images`";
        connection.query(sql1, function(err, result1) {
          if (err) {return next(err)}  
          res.json( { result1 } );
        });
      }
      else {
        res.json( {result: null, result1: null} );
      }

      })
  }
 
})


  

///////////////////////////////////////////////////////////////////
function generateAccessToken(email) {
  return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

loginrouter.options("/login", cors());
loginrouter.post("/login", cors(), (req, res) => {
  console.log("hii");
  const email = req.body.email;
  const password = req.body.password;
  var sql =
    "SELECT * FROM users WHERE email=" +
    mysql.escape(email) +
    "AND password=" +
    mysql.escape(password) +
    "";
  connection.query(sql, function (err, result) {
    if (!isEmpty(result)) {
      const token = generateAccessToken({ email: req.body.email });
      res.cookie("id", token, (expiresIn = "1800s"));
      res.send(token);
    } else {
      res.json({
        status: "failed",
        text: "Incorrect email or password",
      });
    }
  });
});
module.exports = loginrouter;
