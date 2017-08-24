//importing modules
const router = require('express').Router()
const mongo = require('mongodb').MongoClient
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const request = require('request');

const serverRequest = function(res){
  request(this,function(err,resp,body){
		if(!err && resp.statusCode === 200){
			res.status(200)
			res.end(body)
		} else {
			console.log(err)
			res.status(504)
			res.end()
		}
	})
}

const errRequest = function(u,m,e,res){
  serverRequest.call({
    url:u + "/" + m,
    method: 'post',
    body: e,
    json: true
  },res)
}

//router logic
router.post('/',function(req,res){
  var username = req.body.username
  var password = req.body.password
  mongo.connect('mongodb://localhost:27018/data',function(err,db){
    if(err){
      console.error(err)
      errRequest("http://oniv.in/report/errors/mongoErr","mongodb",err,res)
    } else {
      console.log("connected to mongodb for authentication")
      if(req.body.password.indexOf("T-") > -1){
        db.collection('faculty').findOne({_id:username,otp:password},{username:1},function(err,item){
          if(!err){
            res.status(200)
            res.setHeader('Set-cookie',cookie.serialize('user',jwt.sign({name:username},passKey)),{expiresIn: '1hr',httpOnly:true})
            serverRequest.call({
              url:'http://oniv.in/api/view/index/coaching/faculty_mobile/' + username + "/" + ips,
              method: 'get'
            },res)
          } else {
            console.error(err)
            db.close()
            res.status(401)
            res.end()
          }
        })
      } else {
        if(req.body.username.indexOf("admin") === -1){
          db.collection("faculty").findOne({_id:username},function(err,item){
            if(err){
              console.error(err)
              errRequest("http://oniv.in/errors/mongoErr","mongodb",err,res)
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
                  res.setHeader('Set-cookie',cookie.serialize('user',jwt.sign({name:username},passKey)),{expiresIn: '1hr',httpOnly:true})
                  res.end()
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
          console.log(req.body);
          db.collection("admin").findOne({_id:username},function(err,item){
            if(err){
              console.error(err)
              errRequest("http://oniv.in/report/errors/mongoErr","mongodb",err,res)
              db.close()
            } else {
              if(item == null || item == undefined){
                res.send("invalid login")
                db.close()
              } else {
                console.log(item)
                if(item.password == req.body.password){
                  res.status(200)
                  res.setHeader('Set-cookie',cookie.serialize('user',jwt.sign({name:username},passKey)),{expiresIn: '1hr',httpOnly:true})
                  res.end()
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

module.exports = router
