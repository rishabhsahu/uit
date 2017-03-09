var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient

var months = ["january","february","march"]
var d = new Date()

router.get('/requestFacultyData',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    console.log(err)
    db.close()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        console.log(err)
      } else {
        console.log(decoded.name)
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
          } else {
            db.collection("faculty").findOne({_id:decoded.name},function(err,item){
              res.json(item)
            })
          }
        })
      }
    })
  }
})

router.get('/getStudentList/:college/:branch/:batch',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    console.log(err)
    db.close()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        console.log(err)
        db.close()
      } else {
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
          } else {
            db.collection("classes").findOne({_id:req.params.college + "/" + req.params.batch + "/" + req.params.branch},function(err,item){
              if(err){
                console.log(err)
                db.close()
              } else {
                res.json(item.students)
                db.close()
              }
            })
          }
        })
      }
    })
  }
})

router.post('/submitData/:college/:batch/:branch',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    console.log(err)
    db.close()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        console.log(err)
        db.close()
      } else {
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
          } else {
              data = req.body
              console.log(data)
              data.students.forEach(function(name,x){
                var query = {}
                query._id = req.params.college + "/" + req.params.batch + "/" + req.params.branch.toLowerCase()
                var x = "attendance.name"
                query[x] = name
                var final1 = {}
                var y1 = "attendance.$." + req.body.subject + "." + months[req.body.month]
                final1[y1] = req.body.date
                console.log(query)
                console.log(final1)
                db.collection("classes").update(query,{$addToSet:final1})
              })
              db.collection("faculty").update({"_id":req.params.user,"current_classes.batch":req.params.batch,"current_classes.branch":req.params.branch.toUpperCase()},{$addToSet:{"current_classes.$.classes_held": req.body.date + "," + months[req.body.month]}})
              db.close()
              res.writeHead(200)
              res.end()
            }
          })
        }
    })
  }
})

router.get('/report/:college/:branch/:batch/:subject',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    console.log(err)
    db.close()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        console.log(err)
        db.close()
      } else {
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
          } else {
            var obj = {}
            var str = "attendance." + req.params.subject
            obj[str] = 1
            obj['attendance.name'] = 1
            console.log(obj)
            db.collection("classes").findOne({_id:req.params.college + "/" + req.params.branch + "/" + req.params.batch},obj,function(err,item){
              console.log(item)
              res.json(item)
            })
          }
          })
        }
    })
  }
})

module.exports = router

//to upload student names

/*
var std = []
fs.readFile("student_list1.txt",function(err,data){
  data = data.toString()
  var list = data.split("\n")
  console.log(list)
  for(var i=0;i<list.length;i=i+2){
    var obj = {}
    obj.enroll_number = list[i].replace("\r","")
    obj.name = list[i+1].replace("\r","")
    std.push(obj)
  }
  mongo.connect("mongodb://localhost:27018/data",function(err,db){
    db.collection("uit.batch14").update({_id:"ec-a"},{$set:{"students":std}})
  console.log(std)
})
})
*/

//to include students to the attendance element

/*

  db.collection("classes").findOne({_id:"uit-rgpv/ec-a/14"},function(err,item){
    var students = item.students
    students.forEach(function(student,i){
      db.collection("classes").update({_id:"uit-rgpv/ec-a/14"},{$addToSet:{"attendance.IE":{"name":student.name}}})
    })
  })
*/
