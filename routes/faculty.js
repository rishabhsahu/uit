var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient

var months = ["january","february","march"]
var d = new Date()

router.get('/requestFacultyData/:faculty',function(req,res){
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
            db.collection("faculty").findOne({_id:req.params.faculty},function(err,item){
              res.json(item)
            })
          }
        })
      }
    })
  }
})

router.get('/getStudentList/:batch/:branch',function(req,res){
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
            db.collection(req.params.batch).findOne({_id:req.params.branch},function(err,item){
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

router.post('/submitData/:batch/:branch',function(req,res){
  console.log(req.body)
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
                query._id = req.params.branch.toUpperCase()
                var x = "attendance.name"
                query[x] = name
                var final = {}
                var y = "attendance.$." + req.body.subject + "." + months[req.body.month]
                final[y] = req.body.date
                db.collection(req.params.batch).update(query,{$addToSet:final})
                db.collection(req.params.batch).update(query,{$inc:{"attendance.$.IE.count":1}})
                db.close
              })
              db.collection("faculty").update({"_id":decoded.name,"current_classes.batch":req.params.batch,"current_classes.branch":req.params.branch},{$addToSet:{"current_classes.$.classes_held": req.body.date + "," + months[req.body.month]}})
              db.close()
            }
          })
        }
    })
  }
})

router.get('/report/:batch/:branch',function(req,res){
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
            db.collection(req.params.batch).findOne({_id:req.params.branch},{"attendance":1},function(err,item){
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
fs.readFile("student_list.txt",function(err,data){
  data = data.toString()
  var list = data.split("\n")
  console.log(list)
  for(var i=0;i<list.length;i=i+2){
    var obj = {}
    obj.enroll_number = list[i].replace("\r","")
    obj.name = list[i+1].replace("\r","")
    std.push(obj)
  }
  db.collection("batch14").update({_id:"ec-a"},{$set:{"students":std}})
  console.log(std)
})
*/

//to include students to the attendance element

/*

  db.collection("batch14").findOne({_id:"ec-a"},function(err,item){
    var students = item.students
    students.forEach(function(student,i){
      db.collection("batch14").update({_id:"ec-a"},{$push:{"attendance.IE":{"name":student.name}}})
    })
  })
*/
