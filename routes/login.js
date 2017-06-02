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
      console.log("err hai bc")
      console.log(err)
    } else {
      console.log("connected to mongodb for authentication")
      if(req.body.username.indexOf(".admin") === -1){
        db.collection("faculty").findOne({_id:username},function(err,item){
          if(err){
            console.log(err)
            db.close()
          } else {
            if(item == null || item == undefined){
              res.send("invalid login")
              db.close()
            } else {
              console.log(item)
              if(item.password == req.body.password){
                res.setHeader('Set-cookie',cookie.serialize('user',jwt.sign({name:username},'uit attendance login')),{expiresIn: '1hr',httpOnly:true})
                res.render('faculty_mobile')
                db.close()
              } else {
                res.send("invalid login")
                db.close()
              }
            }
          }
        })
      } else {
        db.collection("admin").findOne({_id:username},function(err,item){
          if(err){
            console.log(err)
            db.close()
          } else {
            if(item == null || item == undefined){
              res.send("invalid login")
              db.close()
            } else {
              console.log(item)
              if(item.password == req.body.password){
                res.setHeader('Set-cookie',cookie.serialize('user',jwt.sign({name:username},'uit attendance login')),{expiresIn: '1hr',httpOnly:true})
                res.render('admin_home',{title:"",user:username})
                db.close()
              } else {
                res.send("invalid login")
                db.close()
              }
            }
          }
        })
      }

    }
  })
})


router.get('/logout',function(req,res){
  console.log('logout')
  res.setHeader('Set-cookie',cookie.serialize('user','',{expires: new Date(1),httpOnly:true}))
  res.status(200)
  res.end()
})

module.exports = router
