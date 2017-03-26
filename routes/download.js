var router = require('express').Router()
var mongo = require('mongodb').MongoClient
var jwt = require('jsonwebtoken')
var cookie = require('cookie')
var fs = require('fs')

router.get('/attendanceReport/:college/:department/:batch/:subject',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("Class data requested.")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').findOne({_id:req.params.college + '/' + req.params.department + '/' + req.params.batch},function(err,itm){
            if(!err){
              var data = "Enrollment Number,Name,Attendance";
              atd = itm.attendance
              console.log(atd)
              for(var i=0;i<atd.length;i++){
                data += itm.attendance.enroll_number + "," + itm.attendance.name + "," + itm.attendance[req.params.subject].attendance.length + "\n"
              }
              fs.writeFile('attendance.txt',data,function(err){
                if(err){
                  console.log(err)
                }
              })

            } else {
              console.log("document not found")
              res.status(404)
              res.end()
            }
          })
        } else {
          console.log("failed to connect to db")
          res.status(500)
          res.end()
        }
      })
    } else {
      console.log("failed to verify")
      res.status(500)
      res.end()
    }
  })
})

module.exports = router
