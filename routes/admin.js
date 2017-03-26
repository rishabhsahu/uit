var router = require('express').Router()
var mongo = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')
var root = __dirname

router.get('/getDepartmentData',function(req,res){
  console.log("admin connected")
  var cookies = cookie.parse(req.headers.cookie || '')
  console.log(cookies)
  if(!cookie){
    console.log(err)
    res.status(500)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(!err){
        console.log(decoded.name)
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(!err){
            db.collection('admin').update({_id:decoded.name},{$inc:{"access":1}})
            db.collection('admin').findOne({_id:decoded.name},function(err,item){
              console.log(JSON.stringify(item))
              res.setHeader('Content-type','application/json')
              res.json(item)
            })
          } else {
            console.log(err)
            res.status(500)
            res.end()
          }
        })
      } else {
        console.log(err)
        res.status(500)
        res.end()
      }
    })
  }
})

router.get('/getFacultyData/:id',function(req,res){
  console.log('ajax request');
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("faculty data requested.")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('faculty').findOne({_id:req.params.id},function(err,item){
            if(!err){
              res.json(item)
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

router.get('/getBatchData/:college/:department/:batch',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("Class data requested.")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').findOne({_id:req.params.college + '/' + req.params.department + '/' + req.params.batch},function(err,item){
            if(!err){
              res.json(item)
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

router.post('/addnewbatch/:college/:department/:batch/:sem',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      var std = []
      var form = formidable.IncomingForm()
      form.encoding = 'utf-8'
      form.uploadDir = root + "/data"
      form.parse(req,function(err,fields,files){
        if(err){
          console.log(err)
        } else {
          console.log(files)
        }
      })

      form.on('file',function(name,file){
        var name = path.basename(file.path)
        var data = fs.readFileSync(root + "/data/" + name)
        data = data.toString()
        var list = data.split("\n")
        for(var i=0;i<list.length;i++){
          var obj = {}
          entry = list[i].replace("\r","")
          obj.enroll_number = entry.split(',')[0]
          obj.name = entry.split(',')[1]
          std.push(obj)
        }
        var class_data = {}
        class_data._id = req.params.college + '/' + req.params.department + '/' + req.params.batch
        class_data.batch = req.params.batch
        class_data.college = req.params.college
        class_data.semester = req.params.sem
        class_data.department = req.params.department
        class_data.students = std
        class_data.attendance = std
        console.log(class_data)
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
            res.status(500)
            res.end()
          } else {
            db.collection('classes').insert(class_data)
            db.collection('admin').update({_id:decoded.name},{$addToSet:{"batches":{"batch":req.params.batch,"_id":class_data._id,"semester":req.params.sem}}})
            db.close()
            res.status(200)
            res.end()
          }
        })
      })
    } else {
      console.log("failed to verify")
      res.status(500)
      res.end()
    }
  })
})

router.post('/addnewfaculty',function(req,res){
  console.log(req.body)
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(err){
          console.log(err)
          res.status(500)
          res.end()
        } else {
          db.collection('faculty').insert(req.body)
          db.collection('admin').update({_id:decoded.name},{$addToSet:{"faculties":{"id": req.body._id,"name": req.body.name}}})
          console.log('new faculty added')
          res.status(200)
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

router.post('/assignFacultyNewBatch/:faculty_id',function(req,res){
  console.log('assignFacultyNewBatch request');
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("faculty data requested.")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('faculty').update({_id:req.params.faculty_id},{$addToSet:{"current_classes":{"_id":req.body._id,"batch":req.body.batch,"semester":req.body.semester,"subject":req.body.subject,"classes_held":[]}}})
          console.log("added")
          res.status(200)
          res.end()
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

router.delete('/removefaculty/:id',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("delete faculty requested.")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('faculty').remove({_id:req.params.id})
          db.collection('admin').update({_id:decoded.name},{$pull:{"faculties":{"id":req.params.id}}})
          console.log("removed")
          res.status(200)
          res.end()
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

router.delete('/removebatch/:college/:department/:batch',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("delete faculty requested.")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').remove({_id:req.params.college + '/' + req.params.department + '/' + req.params.batch})
          db.collection('admin').update({_id:decoded.name},{$pull:{"batches":{_id: req.params.college + '/' + req.params.department + '/' + req.params.batch}}})
          console.log("removed")
          res.status(200)
          res.end()
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
