var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId

var months = ["january","february","march"]
var dt = new Date()

router.get('/requestFacultyData',function(req,res){
  console.log(req.device)
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    console.log(err)
    res.status(401)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        console.log(err)
        res.status(401)
        res.end()
      } else {
        console.log(decoded.name)
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
            res.status(500)
            res.end()
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

router.get('/classesheld/:college/:department/:batch',function(req,res){
  console.log(req.device)
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    console.log(err)
    res.status(401)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        console.log(err)
        res.status(401)
        res.end()
      } else {
        console.log(decoded.name)
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
            res.status(500)
            res.end()
          } else {
            db.collection("faculty").findOne({_id:decoded.name,"current_classes._id": req.params.college + '/' + req.params.department + '/' + req.params.batch},{"current_classes.$.classes_held":1},function(err,item){
              if(!err){
                res.json(item)
              } else {
                console.log(err)
                db.close()
                res.status(500)
                res.end()
              }
            })
          }
        })
      }
    })
  }
})


router.get('/getStudentList/:college/:department/:batch',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    console.log(err)
    res.status(401)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        console.log(err)
        res.status(401)
        res.end()
      } else {
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
            res.status(500)
            res.end()
          } else {
            db.collection("classes").findOne({_id:req.params.college + '/' + req.params.department + '/' + req.params.batch},function(err,item){
              if(err){
                console.log(err)
                db.close()
                res.status(404)
                res.end()
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

router.post('/submitData/:college/:department/:batch',function(req,res){
  console.log(req.body)
  var d = req.body.date
  console.log(d)
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    console.log(err)
    res.status(401)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        console.log(err)
        res.status(401)
        res.end()
      } else {
        console.log('report submission')
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
            res.status(500)
            res.end()
          } else {
              data = req.body
              console.log(data)
              data.students.forEach(function(name,x){
                var final1 = {}
                var y1 = "student_data.$." + req.body.subject + ".attendance"
                final1[y1] = d
                console.log(final1)
                db.collection("classes").update({_id:req.params.college + '/' + req.params.department + '/' + req.params.batch,"student_data.enroll_number":name},{$addToSet:final1})
              })
              db.collection("faculty").update({_id:decoded.name,"current_classes._id": req.params.college + '/' + req.params.department + '/' + req.params.batch},{$addToSet:{"current_classes.$.classes_held":d}})
              db.close()
              res.writeHead(200)
              res.end()
            }
          })
        }
    })
  }
})

router.get('/report/:college/:department/:batch/:subject',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    console.log(err)
    res.status(401)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        console.log(err)
        res.status(401)
        res.end()
      } else {
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
            res.status(500)
            res.end()
          } else {
            db.collection("classes").findOne({_id:req.params.college + '/' + req.params.department + '/' + req.params.batch},function(err,item){
              console.log(item)
              res.json(item)
              db.close()
            })
          }
          })
        }
    })
  }
})

router.post('/submitscores/:college/:branch/:batch/:subject',function(req,res){
  console.log(req.body)
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    console.log(err)
    res.status(401)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        console.log(err)
        res.status(401)
        res.end()
      } else {
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
            res.status(500)
            res.end()
          } else {
            req.body.scores.forEach(function(student,i){
              var obj = {}
              var score
              var enroll_number
              for(var props in student){
                score = student[props]
                enroll_number = props
              }
              console.log(score)
              var xyz = {
                test_name: req.body.test_name,
                score: score
              }
              var str = "student_data.$." + req.params.subject + '.scores'
              obj[str] = xyz
              console.log(obj)
              db.collection("classes").update({_id:req.params.college + '/' + req.params.branch + '/' + req.params.batch,"student_data.enroll_number":enroll_number},{$addToSet:obj})
              res.status(200)
              res.end()
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
      db.collection("classes").update({_id:"uit-rgpv/ec-a/14"},{$addToSet:{"student_data.IE":{"name":student.name}}})
    })
  })
*/
