var router = require('express').Router()
var mongo = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')
var root = __dirname
var request = require('request')

router.get('/getDepartmentData',function(req,res){
  console.log("admin connected")
  var cookies = cookie.parse(req.headers.cookie || '')
  console.log(cookies)
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
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
              if(err){
                errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
                db.close()
                res.status(404)
                res.end()
              } else {
                console.log(JSON.stringify(item))
                res.setHeader('Content-type','application/json')
                res.json(item)
                db.close()
              }
            })
          } else {
            errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
            res.status(404)
            res.end()
          }
        })
      } else {
        errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
        res.status(401)
        res.end()
      }
    })
  }
})

router.get('/getFacultyData/:id',function(req,res){
  console.log('ajax request');
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
          db.collection('faculty').findOne({_id:req.params.id},function(err,item){
            if(!err){
              res.json(item)
            } else {
              errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
              res.status(404)
              res.end()
            }
          })
          db.close()
        } else {
          errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
          db.close()
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

router.get('/classesheld/:faculty_id/:school/:batch/:section',function(req,res){
  console.log(req.device)
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    errRequest("http://localhost:80/error/nodejsErr/faculty","cookies",err)
    res.status(401)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        errRequest("http://localhost:80/error/nodejsErr/faculty","jwt",err)
        res.status(401)
        res.end()
      } else {
        console.log(decoded.name)
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            errRequest("http://localhost:80/error/mongoErr/faculty","mongodb",err)
            db.close()
            res.status(500)
            res.end()
          } else {
            db.collection("faculty").findOne({_id:req.params.faculty_id,"current_classes._id": req.params.school + '/' + req.params.batch + '/' + req.params.section},{"current_classes.$.classes_held":1},function(err,item){
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

router.get('/getBatchData/:domain_name/:section/:batch',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("Class data requested.")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').findOne({_id:req.params.domain_name + '/' + req.params.section + '/' + req.params.batch},function(err,item){
            if(!err){
              res.json(item)
              db.close()
            } else {
              errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
              db.close()
              res.status(404)
              res.end()
            }
          })
          db.close()
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

router.post('/addnewbatch/:domain_name/:batch/:section/:cls/:school',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      var std = []
      var form = formidable.IncomingForm()
      form.encoding = 'utf-8'
      form.uploadDir = root + "/data"
      form.parse(req,function(err,fields,files){
        if(err){
          errRequest("http://localhost:80/error/nodejsErr/admin","formidable",err)
        } else {
          console.log(files)
        }
      })

      form.on('file',function(name,file){
        var name = path.basename(file.path)
        var data = fs.readFileSync(root + "/data/" + name)
        data = data.toString()
        var list = data.split("\n")
        for(var i=0;i<list.length-1;i++){
          var obj = {}
          entry = list[i].replace("\r","")
          var ent = entry.split(',')
          obj.enroll_number = ent[0]
          obj.name = ent[1]
          obj.mobile = ent[2]
          std.push(obj)
        }
        var class_data = {}
        class_data._id = req.params.domain_name + '/' + req.params.batch + '/' + req.params.section
        class_data.batch = req.params.batch
        class_data.school = req.params.school
        class_data.domain_name = req.params.domain_name
        class_data.class = req.params.cls
        class_data.section = req.params.section
        class_data.students = std
        class_data.student_data = std
        class_data.prev_faculties = {}
        class_data.current_faculties = []
        console.log(class_data)
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
            db.close()
            res.status(500)
            res.end()
          } else {
            db.collection('classes').insert(class_data)
            db.collection('admin').update({_id:decoded.name},{$addToSet:{"batches":{"batch":class_data.batch,"_id":class_data._id,"class":req.params.cls}}})
            db.close()
            res.status(200)
            res.end()
          }
        })
      })
    } else {
      errRequest("http://localhost:80/error/nodejsErr/admin","jwt",err)
      res.status(401)
      res.end()
    }
  })
}
})

router.post('/addnewfaculty',function(req,res){
  console.log(req.body)
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(err){
          errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
          db.close()
          res.status(500)
          res.end()
        } else {
          var d = (new Date()).valueOf().toString()
          req.body.otp = "T-" + d.substr(d.length-5,d.length)
          db.collection('faculty').insert(req.body)
          db.collection('admin').update({_id:decoded.name},{$addToSet:{"faculties":{"id": req.body._id,"name": req.body.name,"recent_messages":{},"total_messages":{}}}})
          request({
            url:'http://localhost:80/sendsms/facultyotp',
            body: {name:req.body.name,username:req.body._id,mobile:req.body.mobile,otp:req.body.otp,school:req.body.school},
            json:true,
            method:'POST'
          },function(err,resp,body){
            if(!err){
              res.status(200)
              res.end()
            } else {
              console.log(body)
              res.status(500)
              res.end()
            }
          })
          console.log('new faculty added')
          res.status(200)
          res.end()
          db.close()
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

router.post('/batchsettings',function(req,res){
  console.log(req.body)
  if(!cookie){
    errRequest("http://localhost:80/error/nodejsErr/admin","cookies",err)
    res.status(500)
    res.end()
  } else {
  var cookies = cookie.parse(req.headers.cookie || '')
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
