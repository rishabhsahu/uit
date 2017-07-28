//importing modules
var router = require('express').Router()
var mongo = require('mongodb').MongoClient
var cookie = require('cookie')
var jwt = require('jsonwebtoken')

//router logic
router.post('/',function(req,res){
  console.log(req.body) // req.body is an object
  var username = req.body.username
  var password = req.body.password
  mongo.connect('mongodb://localhost:27018/data',function(err,db){
    if(err){
      errRequest("http://localhost:4000/errors/mongoErr","mongodb",err)
    } else {
      console.log("connected to mongodb for authentication")
      if(req.body.password.indexOf("T-") > -1){
        db.collection('faculty').findOne({_id:username,otp:password},{username:1},function(err,item){
          if(!err){
            res.status(200)
            res.setHeader('Set-cookie',cookie.serialize('user',jwt.sign({name:username},'uit attendance login')),{expiresIn: '1hr',httpOnly:true})
            res.render('faculty_mobile')
          } else {
            db.close()
            res.status(401)
            res.end()
          }
        })
      } else {
        if(req.body.username.indexOf(".admin") === -1){
          db.collection("faculty").findOne({_id:username},function(err,item){
            if(err){
              errRequest("http://localhost:4000/errors/mongoErr","mongodb",err)
              db.close()
            } else {
              if(item == null || item == undefined){
                db.close()
                res.status(401)
                res.end()
              } else {
                console.log(item)
                if(item.password == req.body.password){
                  res.status(200)
                  res.setHeader('Set-cookie',cookie.serialize('user',jwt.sign({name:username},'uit attendance login')),{expiresIn: '1hr',httpOnly:true})
                  res.render('faculty_mobile')
                  db.close()
                } else {
                  db.close()
                  res.status(401)
                  res.end()
                }
              }
            }
          })
        } else {
          db.collection("admin").findOne({_id:username},function(err,item){
            if(err){
              errRequest("http://localhost:4000/errors/mongoErr","mongodb",err)
              db.close()
            } else {
              if(item == null || item == undefined){
                res.send("invalid login")
                db.close()
              } else {
                console.log(item)
                if(item.password == req.body.password){
                  res.status(200)
                  res.setHeader('Set-cookie',cookie.serialize('user',jwt.sign({name:username},'uit attendance login')),{expiresIn: '1hr',httpOnly:true})
                  res.render('admin_home',{title:"",user:username})
                  db.close()
                } else {
                  db.close()
                  res.status(401)
                  res.end()
                }
              }
            }
          })
        }
      }

    }
  })
})

function errRequest(){}


module.exports = router
