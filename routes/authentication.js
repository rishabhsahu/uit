//importing modules//
var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient

//main logic of the route//
router.get('/',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '') //Object with one key "user", whose value is a JWT
  console.log(cookies)
  if(!cookies){
    res.render('index',{message:""})
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){ //JWT is verified. If verified and true, then its decoded
      if(err){
        res.render('index',{message:""})
      } else {
        console.log("JWT decoded:" + decoded.name) //decoded is Object with one key "name" whose value is "username" of client user
        mongo.connect("mongodb://localhost:27018/uit",function(err,db){
          if(err){
            console.log(err)
            res.render('index',{message:"Internal Server Error"})
            db.close()
          } else {
            console.log("connected to mongodb for authentication using JWT")
            if(decoded.name.indexOf(".admin") === -1){ //If admin, then username contains the string ".admin" at the end
              db.collection("faculty").findOne({_id:decoded.name},function(err,item){
                if(err){
                  res.render('index',{message:"Interval Server Error"})
                  db.close()
                } else {
                  res.render('faculty_mobile')

                  db.close()
                }
              })
            } else {
              db.collection("admin").findOne({_id:decoded.name},function(err,item){
                if(err){
                  res.render('index',{message:"Interval Server Error"})
                  db.close()
                } else {
                  res.render('admin_home',{title:"",user:decoded.name})
                  console.log("admin verified")
                  db.close()
                }
              })
            }
          }
        })
      }
      })

  }
})

module.exports = router
