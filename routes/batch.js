var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient()

router.get("/:school/:batch/:section/:index",function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '' )
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').findOne({_id:req.params.school + "/" + req.params.batch + "/" + req.params.section},{"student_data":1,"current_faculties":1},function(err,item){
            if(!err){
              db.close()
              res.status(200)
              const obj = item.student_data[req.params.index]
              obj["current_faculties"] = item.current_faculties
              res.json(obj)
            } else {
              db.close()
              res.status(404)
              res.end()
            }
          })
        } else {
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      res.status(500)
      res.end()
    }
  })
})

module.exports = router
