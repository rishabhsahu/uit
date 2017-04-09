//importing modules//
var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient

//main logic of the route//
router.get('/',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  console.log(cookies)
  if(!cookies){
    res.render('index',{message:""})
    db.close()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        res.render('index',{message:""})
      } else {
        console.log("JWT decoded:" + decoded.name)
        mongo.connect("mongodb://localhost:27018/uit",function(err,db){
          if(err){
            console.log(err)
            res.render('index',{message:"Internal Server Error"})
            db.close()
          } else {
            console.log("connected to mongodb for authentication using JWT")
            if(decoded.name.indexOf(".admin") === -1){
              db.collection("faculty").findOne({_id:decoded.name},function(err,item){
                if(err){
                  res.render('index',{message:"Interval Server Error"})
                  db.close()
                } else {
                  if(req.device.type === "desktop"){
                    res.render('faculty_mobile')

                  } else {
                    res.render('faculty_mobile')
                  }
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
