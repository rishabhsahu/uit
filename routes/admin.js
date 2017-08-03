let router = require('express').Router()
let mongo = require('mongodb').MongoClient
let ObjectId = require('mongodb').ObjectId
let cookie = require('cookie')
let jwt = require('jsonwebtoken')
let formidable = require('formidable')
let fs = require('fs')
let path = require('path')
let qs = require('querystring')
let root = __dirname
let request = require('request')
let addnewbatch = require('./admin/new.js').addnewbatch
let addnewfaculty = require('./admin/new.js').addnewfaculty
let getDepartmentData = require('./admin/get.js').getDepartmentData
let getFacultyData = require('./admin/get.js').getFacultyData
let classesheld = require('./admin/get.js').classesheld
let getBatchData = require('./admin/get.js').getBatchData
let getAllStudents = require('./admin/get.js').getAllStudents

router.get('/getDepartmentData',getDepartmentData)

router.get('/getFacultyData/:id',getFacultyData)

router.get('/classesheld/:faculty_id/:school/:batch/:section',classesheld)

router.get('/getBatchData/:domain_name/:section/:batch',getBatchData)
router.get('/getallstudents',getAllStudents)

router.get('/student_images/:image',function getStudentImage(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          fs.createReadStream(root + '/public/student_images/' + req.params.image).pipe(res)
        } else {
          console.log("failed to connect to db")
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      errRequest("http://localhost:80/error/nodejsErr/admin","jwt",err)
      res.status(401)
      res.end()
    }
  })
}
})

router.post('/addnewbatch/:domain_name/:batch/:section/:cls/:school',addnewbatch)

router.post('/addnewfaculty',addnewfaculty)

router.post('/batchsettings',function(req,res){
  console.log(req.body)
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(err){
          errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
          db.close()
          res.status(500)
          res.end()
        } else {
          db.collection("classes").update({_id:req.body.batch},{$set:{"class_teacher":req.body.class_teacher}})
          db.close()
          res.status(200)
          res.end()
        }
      })
    } else {
      errRequest("http://localhost:80/error/nodejsErr/admin","jwt",err)
      res.status(401)
      res.end()
    }
  })
}
})

router.post('/assignFacultyNewBatch/:faculty_id',function(req,res){
  console.log('assignFacultyNewBatch request');
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').findOne({_id:req.body._id},{"prev_faculties":1},function(err,item){
            var obj = {}
            if(!err){
              console.log(item)
              if(item.prev_faculties.hasOwnProperty(req.params.faculty_id) && item.prev_faculties[req.params.faculty_id].subject === req.body.subject){
                  db.collection('faculty').update({_id:req.params.faculty_id},{$addToSet:{"current_classes":{"_id":req.body._id,"batch":req.body.batch,"class":req.body.class,"subject":req.body.subject,"classes_held":item.prev_faculties[req.params.faculty_id]["classes_held"]}}})
                  console.log("Faculty Re-assigned")
                  db.close()
                  res.status(200)
                  res.end()
              } else {
                db.collection('faculty').update({_id:req.params.faculty_id},{$addToSet:{"current_classes":{"_id":req.body._id,"class":req.body.class,"subject":req.body.subject,"classes_held":[]}}})
                console.log("added")
                var o1 = {}
                o1[req.body.subject] = req.params.faculty_id
                db.collection('classes').update({_id:req.body._id},{$addToSet:{"current_faculties":o1}})
                db.close()
                res.status(200)
                res.end()
              }
            } else {
              errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
              db.close()
              res.status(404)
              res.end()
            }
          })
        } else {
          errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      errRequest("http://localhost:80/error/nodejsErr/admin","jwt",err)
      res.status(401)
      res.end()
    }
  })
}
})

router.post('/batchsettings/addNewStudent/:expath',function(req,res){
  let cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(!err){
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
            db.close()
            res.status(500)
            res.end()
          } else {
            let form = formidable.IncomingForm()
            form.uploadDir = root + "/public/student_images"
            form.parse(req,function(err,fields,files){
              if(err){
                res.status(500)
                res.end()
              }
            })

            form.on('file',function(name,file){
              const o = qs.parse(req.params.expath)
              const bt = o.batch
              delete o.batch
              o.image = path.basename(file.path)
              o.mobiles = {}
              if(o.parent1.length>0){
                o.mobiles.parent1 = o.parent1
              }
              if(o.parent2 && o.parent2.length>0){
                o.mobiles.parent2 = o.parent2
              }
              if(o.parent1 && o.parent1.length>0){
                o.mobiles.sn = o.sn
              }
              if(o.parent1 && o.parent1.length>0){
                o.mobiles.other = o.other
              }
              delete o.parent1
              delete o.parent2
              delete o.sn
              delete o.other
              db.collection('classes').update({_id:bt},{$addToSet:{"students":o}})
              db.collection('classes').update({_id:bt},{$addToSet:{"student_data":o}})
              res.status(200)
              res.end()
            })

            form.on('error',function(){
              res.status(500)
              res.end()
            })
          }
        })
      } else {
        errRequest("http://localhost:80/error/nodejsErr/admin","jwt",err)
        res.status(401)
        res.end()
      }
    })
  }
})

router.get('/takeattendance/all',function(req,res){
  let cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(!err){
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
            db.close()
            res.status(500)
            res.end()
          } else {
            db.collection('batches').findOne({_id:req.params.school + "/" + req.params.batch + "/" + req.params.section},{"students":1},function(err,item){
              if(err){
                errRequest("http://localhost:80/error/nodejsErr/admin","mongodb",err)
              } else {
                res.status(200)
                fs.createReadStream(root + "/public/takeattendance.html").pipe(res)
              }
            })
          }
        })
      } else {
        errRequest("http://localhost:80/error/nodejsErr/admin","jwt",err)
        res.status(401)
        res.end()
      }
    })
  }
})

router.delete('/deassignbatch/:id/:domain_name/:section/:batch',function(req,res){
  console.log('De-Assign Faculty Batch request');
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("faculty data requested.")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          var classes_held = []
          var subject = ""
          db.collection('faculty').findOne({_id:req.params.id},{"current_classes":1},function(err,item){
            if(!err){
              console.log(item)
              item.current_classes.forEach(function(x,i){
                if(x._id ===  (req.params.domain_name + '/' + req.params.section + '/' + req.params.batch) ){
                  classes_held = x["classes_held"]
                  subject = x["subject"]
                  console.log(classes_held)
                  var obj = {}
                  var y = {
                    "classes_held": classes_held,
                    "subject": subject
                  }
                  obj["prev_faculties." + req.params.id] = y
                  db.collection('faculty').update({_id:req.params.id},{$pull:{"current_classes":{"_id":req.params.domain_name + '/' + req.params.section + '/' + req.params.batch }}})
                  db.collection('classes').update({_id: req.params.domain_name + '/' + req.params.section + '/' + req.params.batch},{$set:obj})
                  console.log("added")
                  db.close()
                  res.status(200)
                  res.end()
                }
              })
            } else {
              errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
              db.close()
              res.status(404)
              res.end()
            }
          })
        } else {
          errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      errRequest("http://localhost:80/error/nodejsErr/admin","jwt",err)
      res.status(401)
      res.end()
    }
  })
}
})

router.delete('/removefaculty/:id',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("delete faculty requested.")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('faculty').remove({_id:req.params.id})
          db.collection('admin').update({_id:decoded.name},{$pull:{"faculties":{"id":req.params.id}}})
          console.log("removed")
          db.close()
          res.status(200)
          res.end()
        } else {
          errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      errRequest("http://localhost:80/error/nodejsErr/admin","jwt",err)
      res.status(401)
      res.end()
    }
  })
}
})

router.delete('/removebatch/:domain_name/:section/:batch',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("delete faculty requested.")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').remove({_id:req.params.domain_name + '/' + req.params.section + '/' + req.params.batch})
          db.collection('admin').update({_id:decoded.name},{$pull:{"batches":{_id: req.params.domain_name + '/' + req.params.section + '/' + req.params.batch}}})
          console.log("removed")
          res.status(200)
          res.end()
          db.close()
        } else {
          errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      errRequest("http://localhost:80/error/nodejsErr/admin","jwt",err)
      res.status(401)
      res.end()
    }
  })
}
})

module.exports = router
