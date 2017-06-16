var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient
var request = require('request')
var authkey = "155975ATpoRPi5h593ea16c"

router.post('/notifyclass',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').findOne({_id:req.body.batch_id},{"students.mobile":1},function(err,item){
            if(!err){
              var mobile = ""
              item.students.forEach(function(x,i){
                mobile += x.mobile + ","
              })
              var api_url = "http://api.msg91.com/api/sendhttp.php?"
              api_url += "authkey=" + authkey + "&"
              api_url += "mobiles=" + mobile + "&message=" + encodeURIComponent(req.body.text + "\nsent via oniv.in") + "&sender=onivin&route=4"
              request({
                method:'get',
                url: api_url
              },function(err,resp,body){
                if(!err){
                  db.collection("faculty").update({_id:decoded.name},{$inc:{"recent_messages":req.body.mobile.length}})
                  db.collection("admin").update({_id:"school.admin@" + decoded.name.split('@')[1]},{$inc:{"recent_messages":req.body.mobile.length}})
                  db.close()
                  res.status(200)
                  res.end()
                } else {
                  db.close()
                  res.status(504)
                  res.end()
                }
              })
            } else {
              console.err(err)
              db.close()
              res.status(504)
              res.end()
            }
          })
        } else {
          console.err(err)
          db.close()
          res.status(504)
          res.end()
        }
      })
    } else {
      console.error(err)
      db.close()
      res.status(200)
      res.end()
    }
  })
})

module.exports = router
