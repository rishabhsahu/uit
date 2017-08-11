//importing modules
var router = require('express').Router()
var mongo = require('mongodb').MongoClient
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
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

const errRequest = function(u,m,e){
  serverRequest.call({
    url:u + "/" + m,
    method: 'post',
    body: e,
    json: true
  },res)
}

//router logic
router.post('/',function(req,res){
  console.log(req.body) // req.body is an object
  var username = req.body.username
  var password = req.body.password
  mongo.connect('mongodb://localhost:27018/data',function(err,db){
    if(err){
      errRequest("http://oniv.in/report/errors/mongoErr","mongodb",err)
    } else {
      console.log("connected to mongodb for authentication")
      if(req.body.password.indexOf("T-") > -1){
        db.collection('faculty').findOne({_id:username,otp:password},{username:1},function(err,item){
          if(!err){
            res.status(200)
            res.setHeader('Set-cookie',cookie.serialize('user',jwt.sign({name:username},'uit attendance login')),{expiresIn: '1hr',httpOnly:true})
            serverRequest.call({
              url:'http://oniv.in/api/view/index/coaching/faculty_mobile',
              method: 'get'
            },res)
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
              errRequest("http://13.126.16.198:80/errors/mongoErr","mongodb",err)
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
                  serverRequest.call({
                    url:'http://oniv.in/api/view/index/coaching/faculty_mobile',
                    method: 'get'
                  },res)
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
              errRequest("http://oniv.in/report/errors/mongoErr","mongodb",err)
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
                  serverRequest.call({
                    url:'http://oniv.in/api/view/index/coaching/admin_home',
                    method: 'get'
                  },res)
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
