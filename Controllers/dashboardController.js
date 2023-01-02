const express = require("express");
const dashbaordrouter = express.Router();
const connection=require('../config')
const isEmpty = require("lodash.isempty");
const cors = require("cors");
let mysql = require("mysql");
const { cookie } = require("request");


//////////////////////////////////////////////////////////
dashbaordrouter.options("/dashbaord", cors());
dashbaordrouter.get('/dashboard',(req,res)=>{
res.render('./admin/dashboard.html')
  })
  ///////////////////////////////////////////////////
  dashbaordrouter.options("/allusers", cors());
  dashbaordrouter.get('/allusers',cors(),(req,res)=>{
    var sql = "SELECT * FROM users";
    connection.query(sql, function (err, result) {
      res.send(result)
    })
  })
////////////////////////////
  dashbaordrouter.options("/user/delete", cors());
  dashbaordrouter.get('/user/delete/:id',cors(),(req,res)=>{
    const id=req.params.id;
    console.log(id)
    var sql = "DELETE FROM users where id="+id+"";
    connection.query(sql, function (err, result) {
      res.send(result)
    })
  })

  module.exports=dashbaordrouter;
