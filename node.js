const http = require("http");

const path = require("path");
var cons = require("consolidate");
const express = require("express");
const app = express();
const server = http.createServer(app);
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config();
const signuprouter = require("./Controllers/signUpController");
const loginrouter = require("./Controllers/loginController");
const dashbaordrouter = require("./Controllers/dashboardController");
const cors = require("cors");
const swig = require("swig");
// global.db = mongojs("mongodb://127.0.0.1/ecommerce");



////////////////////////////////setting front end template engine to HTML//////////////////////////
app.engine("html", cons.swig);
app.set("views", path.join(__dirname, "pages/front-end"));
app.set("view engine", "html");
app.use(express.static(path.join(__dirname, "/public")));

///////////////////////////////////////Mongo DB connection with Project/////////////////////////////////

// mongoose.set('strictQuery', true);

app.use("/", signuprouter);
app.use("/", loginrouter);
app.use("/", dashbaordrouter);
app.get('/login',(req,res)=>{
  console.log("goooo")
})



/////////////////////////////////////Check Server//////////////////////////////////////
server.listen(process.env.PORT, (req, res) => {
  console.log(`Server active on http://localhost:${process.env.PORT}!`);
});
module.exports=server;
