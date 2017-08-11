//importing modules//
var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient
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
                  serverRequest.call({
                    url:'http://oniv.in/api/view/index/coaching/faculty_mobile',
                    method: 'get'
                  },res)

                  db.close()
                }
              })
            } else {
              db.collection("admin").findOne({_id:decoded.name},function(err,item){
                if(err){
                  res.render('index',{message:"Interval Server Error"})
                  db.close()
                } else {
                  serverRequest.call({
                    url:'http://oniv.in/api/view/index/coaching/admin_home/' + decoded.name,
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
