var router = require('express').Router()
var mongo = require('mongodb').MongoClient
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var fs = require('fs')
var request = require('request')

router.post('/add-test-score-manually/',function(req,res){
  console.log(req.body);
  var cookies = cookie.parse(req.headers.cookie || "")
  if(!cookies){
    res.status(401)
    res.end()
  } else {
    jwt.verify(cookies.user,"9aIkpJ5UdL+V73h9zoVNPb5LAEeRMiPVucw0q+cYJXK6wyOO+0VzkXR+w6mmU",function(err,decoded){
      if(!err){
        mongo.connect("mongodb://localhost:27018/data",function(err,db){
          if(!err){
            for(var std in req.body.scores){
              var obj = {}
              obj["student_data.$." + req.body.subject + ".scores"] = {
                test_name: req.body.testname,
                score: req.body.scores[std],
                max_score : req.body.maxscore,
                testdate : req.body.testdate
              }
              db.collection("classes").update({_id:req.body.selectedBatch,"student_data.enroll_number":std},{$addToSet:obj})
            }
            let onj = {}
            onj["tests." + req.body.testname] = req.body.subject
            db.collection("classes").update({_id:req.body.selectedBatch},{$addToSet:onj})
            db.close()
            request({
              url:"http://oniv.in/api/sendsms/scorereport",
              method:'POST',
              body:req.body,
              json: true
            },function(err,resp,body){
              if(!err && resp.statusCode === 200){
                res.status(200)
                res.end()
              } else {
                res.status(500)
                res.end()
              }
            })
            /*
            request({
              url:"http://localhost:80/sendsms/scorereport-admin",
              method:'POST',
              body:req.body,
              json: true
            },function(err,resp,body){
              if(!err){
                res.status(200)
                res.end()
              }
            })
            */
          } else {
            console.error(err)
            db.close()
            errRequest("http://oniv.in/report/error/mongoErr/admin","mongodb",err)
            res.status(500)
            res.end()
          }
        })
      } else {
        console.error(err)
        errRequest("http://oniv.in/report/error/nodejsErr/admin","jwt",err)
        res.status(401)
        res.end()
      }
    })
  }
})

module.exports = router
