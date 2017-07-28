var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
var request = require('request')
var authkey = "155975ATpoRPi5h593ea16c"
var months = ["january","february","march","april","may","june","july","august","septermber","october","november","december"]
var dt = new Date()

router.get('/requestFacultyData',function(req,res){
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
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            errRequest("http://localhost:80/error/mongoErr/faculty","mongodb",err)
            db.close()
            res.status(500)
            res.end()
          } else {
            db.collection("classes").findOne({_id:req.params.college + '/' + req.params.department + '/' + req.params.batch},function(err,item){
              if(err){
                errRequest("http://localhost:80/error/mongoErr/faculty","mongodb",err)
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
    errRequest("http://localhost:80/error/nodejsErr/faculty","cookies",err)
    res.status(401)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        errRequest("http://localhost:80/error/mongoErr/faculty","mongodb",err)
        res.status(401)
        res.end()
      } else {
        console.log('report submission')
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.log(err)
            db.close()
            res.status(504)
            res.end()
          } else {
              data = req.body
              console.log(data)
              var mobile = ""
              data.students.forEach(function(name,x){
                var final1 = {}
                var y1 = "student_data.$." + req.body.subject + ".absent"
                final1[y1] = d
                db.collection("classes").update({_id:req.params.college + '/' + req.params.department + '/' + req.params.batch,"student_data.enroll_number":name},{$addToSet:final1})
                mobile += data.mobile[x].toString() + ","
              })


              var api_link = "http://api.msg91.com/api/sendhttp.php?"
              api_link += "authkey=" + authkey + "&"
              api_link += "mobiles=" + mobile + "&message="
              api_link += encodeURIComponent("Your child was Absent from class today-" + decoded.name)
              api_link += "&sender=onivin&route=4"
              console.log(api_link)

              var obj1 = {}
              var obj2 = {}
              var school = decoded.name.split('@')[1]
              obj1["_id"] = decoded.name
              obj1["current_classes._id"] = req.params.college + '/' + req.params.department + '/' + req.params.batch
              obj2["current_classes.$.classes_held"] = d
              db.collection("faculty").update(obj1,{$addToSet:obj2})
              request({
                method:'get',
                url: api_link
              },function(err,resp,body){
                if(err){
                  errRequest("http://localhost:80/error/nodejsErr/faculty","request",err)
                  db.collection('SMS_failed').insert({_id:(new Date()).valueOf(),"url":api_link})
                  db.close()
                  res.status(504)
                  res.end()
                } else {
                  db.collection("faculty").update({_id:decoded.name},{$inc:{"recent_messages":req.body.mobile.length}})
                  var xltd = {}
                  var d = new Date()
                  d.setSeconds(0)
                  d.setHours(0)
                  d.setMinutes(0)
                  xltd[d.valueOf()] = req.body.mobile.length
                  db.collection("admin").update({_id:"school.admin@" + decoded.name.split('@')[1]},{$inc:{"recent_messages":xltd}})
                  db.collection("admin").update({_id:"school.admin@" + decoded.name.split('@')[1],"faculties.id":decoded.name},{$inc:{"faculties.$.recent_messages":xltd}})
                  db.close()
                  console.log(resp)
                  res.status(200)
                  res.end()
                }
              })
            }
          })
        }
    })
  }
})

router.get('/report/:college/:department/:batch/:subject',function(req,res){
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
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            errRequest("http://localhost:80/error/mongoErr/faculty","mongodb",err)
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

router.post('/submitscores/:school/:batch/:section/:subject',function(req,res){
  console.log(req.body)
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookies){
    console.log(err)
    res.status(401)
    res.end()
  } else {
    jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
      if(err){
        errRequest("http://localhost:80/error/nodejsErr/faculty","jwt",err)
        res.status(401)
        res.end()
      } else {
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            errRequest("http://localhost:80/error/nodejsErr/faculty","mongodb",err)
            db.close()
            res.status(500)
            res.end()
          } else {
            var xyz = {
              test_id: req.body.test_id,
              test_name: req.body.test_name,
              max_score : req.body.max_score
            }
            delete req.body.test_id
            delete req.body.test_name
            delete req.body.score
            delete req.body.max_score
            var o = {}
            for(var s in req.body.scores){
              var enroll_number = s
              xyz.score = req.body.scores[s]
              o["student_data.$." + req.params.subject + '.scores'] = xyz
              var str = "student_data.$." + req.params.subject + '.scores'
              o[str] = xyz
              console.log(o)
              db.collection("classes").update({_id:req.params.school + '/' + req.params.batch + '/' + req.params.section,"student_data.enroll_number":enroll_number},{$addToSet:o})
            }
            db.close()
            res.status(200)
            res.end()
          }
          })
        }
    })
  }
})

router.post('/markabsent',function(req,res){
  console.log(req.body)
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
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            errRequest("http://localhost:80/error/nodejsErr/faculty","mongodb",err)
            db.close()
            res.status(500)
            res.end()
          } else {
            var school = decoded.name.split('@')[1]
            var d = new Date()
            d.setHours(0)
            d.setMinutes(0)
            d.setSeconds(0)
            d.setMilliseconds(0)
            var rsn = {}
            var domain = ""
            rsn["reason." + d.valueOf().toString()] = req.body.absent
            db.collection('faculty').update({_id:decoded.name},{$addToSet:{"absent":d.valueOf()}})
            db.collection('faculty').update({_id:decoded.name},{$set:rsn})

            db.collection('admin').update({_id:"school.admin@" + decoded.name.split('@')[1],"faculties.id":decoded.name},{$addToSet:{"faculties.$.absent":d.valueOf()}})
            obj = {}
            obj["faculties.$.reason." + d.valueOf().toString()] = req.body.absent
            db.collection('admin').update({_id:"school.admin@" + decoded.name.split('@')[1],"faculties.id":decoded.name},{$set:obj})
            db.close()
            res.status(200)
            res.end()
          }
          })
        }
    })
  }
})

router.post('/setupprofile',function(req,res){
  console.log(req.body)
  var cookies = cookie.parse(req.headers.cookie || "")
  if(!cookies){
    errRequest("http://localhost:80/error/nodejsErr/faculty","cookies",err)
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
            errRequest("http://localhost:80/error/mongoErr/faculty","mongodb",err)
            res.status(500)
            res.end()
          } else {
            db.collection('faculty').findOne({_id:decoded.name},function(err,item){
              if(!err){
                for(var props in req.body){
                  var obj = {}
                  obj[props] = req.body[props]
                  db.collection('faculty').update({_id:decoded.name},{$set:obj})
                  db.collection('faculty').update({_id:decoded.name},{$set:{"profileSetUp":1}})
                }
                db.collection('admin').update({_id:"school.admin@" + decoded.name.split('@')[1],"faculties.id":decoded.name},{$set:{"faculties.$.mobile":req.body.mobile}})
                db.close()
                res.status(200)
                res.end()
              } else {
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

router.post('/setschedule',function(req,res){
  console.log(req.body)
  var cookies = cookie.parse(req.headers.cookie || "")
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
            res.status(500)
            res.end()
          } else {
            var obj = {}
            db.collection('faculty').findOne({_id:decoded.name},function(err,item){
              if(!err){
                var school = decoded.name.split('@')[1];
                var q = {_id:decoded.name};
                var r = {}
                q["current_classes._id"] = req.body.batch_id
                r["current_classes.$.schedule"] = req.body.schedule
                db.collection('faculty').update(q,{$set:r})
                db.close()
                res.status(200)
                res.end()
              } else {
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

function errRequest(u,m,o){
  var ed = (new Date()).toString()
  o.time = ed;
  o.module = m;
  request({
    method:"post",
    url: u,
    json:true,
    body: o
  },function(err,resp,body){

  })

}

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
