//importing modules//
var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient
const request = require('request');
const passKey = '9aIkpJ5UdL+V73h9zoVNPb5LAEeRMiPVucw0q+cYJXK6wyOO+0VzkXR+w6mmU'

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

//main logic of the route//
router.get('/',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '') //Object with one key "user", whose value is a JWT
  console.log(cookies)
  if(!cookies){
    serverRequest.call({
      url:'http://localhost:80/api/static/index.html',
      method: 'get',
    },res)
  } else {
    jwt.verify(cookies.user,passKey,function(err,decoded){ //JWT is verified. If verified and true, then its decoded
      if(err){
        console.error(err)
        serverRequest.call({
          url:'http://localhost:80/api/static/index.html',
          method: 'get',
        },res)
      } else {
        console.log(true);
        console.log("JWT decoded:" + decoded.name) //decoded is Object with one key "name" whose value is "username" of client user
        mongo.connect("mongodb://localhost:27018/data",function(err,db){
          if(err){
            console.error(err)
            console.log(err)
            res.render('index',{message:"Internal Server Error"})
            db.close()
          } else {
            console.log("connected to mongodb for authentication using JWT")
            if(decoded.name.indexOf("admin") === -1){ //If admin, then username contains the string ".admin" at the end
              db.collection("faculty").findOne({_id:decoded.name},function(err,item){
                if(err){
                  console.error(err)
                    serverRequest.call({
                      url:'http://localhost:80/api/static/index.html',
                      method: 'get',
                    },res)
                  db.close()
                } else {
                  serverRequest.call({
                    url:'http://localhost:80/api/static/coaching/faculty_mobile.html',
                    method: 'get'
                  },res)

                  db.close()
                }
              })
            } else {
              db.collection("admin").findOne({_id:decoded.name},function(err,item){
                if(err){
                  console.error(err)
                  serverRequest.call({
                    url:'http://localhost:80/api/static/index.html',
                    method: 'get',
                  },res)
                  db.close()
                } else {
                  console.log(true);
                  serverRequest.call({
                    url:'http://localhost:80/api/static/coaching/admin_home.html',
                    method: 'get'
                  },res)
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
