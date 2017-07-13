var router = require('express').Router()
var mongo = require('mongodb').MongoClient
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var fs = require('fs')
var request = require('request')

router.post('/add-test-score-manually/',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || "")
  if(!cookies){
    errRequest("http://localhost:3000/error/nodejsErr/admin","cookies",err)
    res.status(401)
    res.end()
  } else {
    jwt.verify(cookies.user,"uit attendance login",function(err,decoded){
      if(!err){
        mongo.connect("mongodb://localhost:27018/data",function(err,db){
          if(!err){
            var testid = req.body.selectedBatch + "/" + req.body.testdate + "/" + req.body.testname
            for(var std in req.body.scores){
              var obj = {}
              obj["student_data.$." + req.body.subject + ".scores"] = {
                test_name: req.body.testname,
                score: req.body.scores[std],
                max_score : req.body.maxscore,
                test_id : testid
              }
              db.collection("classes").update({_id:req.body.selectedBatch,"student_data.enroll_number":std},{$addToSet:obj})
            }
            db.close()
            res.status(200)
            res.end()
            request({
              url:"http://localhost:3000/sendsms/scorereport-admin",
              method:'POST',
              body:req.body,
              json: true
            },function(err,resp,body){
              if(!err){
                res.status(200)
                res.end()
              }
            })
          } else {
            db.close()
            errRequest("http://localhost:3000/error/mongoErr/admin","mongodb",err)
            res.status(500)
            res.end()
          }
        })
      } else {
        errRequest("http://localhost:3000/error/nodejsErr/admin","jwt",err)
        res.status(401)
        res.end()
      }
    })
  }
})

module.exports = router
