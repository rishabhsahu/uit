const router = require('express').Router()
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const qs = require('querystring')
const root = __dirname
const request = require('request')
const passKey = '9aIkpJ5UdL+V73h9zoVNPb5LAEeRMiPVucw0q+cYJXK6wyOO+0VzkXR+w6mmU'

const addNewBatch = require('./admin/new.js').addNewBatch
const addNewFaculty = require('./admin/new.js').addNewFaculty
const addNewStudent = require('./admin/new.js').addNewStudent

const getDepartmentData = require('./admin/get.js').getDepartmentData
const getFacultyData = require('./admin/get.js').getFacultyData
const classesheld = require('./admin/get.js').classesheld
const getBatchData = require('./admin/get.js').getBatchData
const getAllStudents = require('./admin/get.js').getAllStudents

const smsFaculties = require('./admin/sms.js').smsFaculties
const smsClass = require('./admin/sms.js').smsClass
const setSchedule = require('./admin/sms.js').setSchedule
const scoreSheet = require('./admin/scores.js').scoreSheet

router.get('/getDepartmentData',getDepartmentData)
router.get('/getFacultyData/:id',getFacultyData)
router.get('/classesheld/:faculty_id/:school/:batch/:section',classesheld)
router.get('/getBatchData/:domain_name/:section/:batch',getBatchData)
router.get('/getallstudents',getAllStudents)

router.post('/smsFaculties',smsFaculties)
router.post('/smsClass',smsClass)
router.post('/setSchedule',setSchedule)
router.post('/scores/upload/:sch/:btc/:sc',scoreSheet)
const serverRequest = function(res){
  request(this,function(err,resp,body){
		console.log(body,"body")
		if(!err && resp.statusCode === 200){
			res.status(200)
			res.end(body)
		} else {
			console.log(err)
			res.status(500)
			res.end()
		}
	})
}

let errRequest = function(u,m,e,res){
  serverRequest.call({
    url:u + "/" + m,
    method: 'post',
    body: e,
    json: true
  },res)
}

router.get('/student_images/:image',function getStudentImage(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){

    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,passKey,function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          res.header({'Cache-Control':'public, max-age=31557600'})
          fs.createReadStream(root + '/public/student_images/' + req.params.image).pipe(res)
        } else {
          console.log("failed to connect to db")
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      console.error(err)
      errRequest("http://oniv.in/report/error/nodejsErr/admin","jwt",err,res)
      res.status(401)
      res.end()
    }
  })
}
})

router.post('/addnewbatch/:domain_name/:batch/:section/:cls/:school/:m',addNewBatch)
router.post('/addnewfaculty',addNewFaculty)
router.post('/batchsettings/addNewStudent/:sh/:bt/:sc',addNewStudent)

router.post('/batchsettings',function(req,res){
  console.log(req.body)
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){

    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,passKey,function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(err){
          errRequest("http://oniv.in/report/error/mongoErr/admin","mongodb",err,res)
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
      console.error(err)
      errRequest("http://oniv.in/report/error/nodejsErr/admin","jwt",err,res)
      res.status(401)
      res.end()
    }
  })
}
})

router.post('/assignFacultyNewBatch/:faculty_id',function(req,res){
  console.log(req.body);
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){

    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,passKey,function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('faculty').update({_id:req.params.faculty_id},{$addToSet:{"current_classes":{"_id":req.body._id,"class":req.body.class,"subject":req.body.subject,"classes_held":[]}}})
          console.log("added")
          var o1 = {}
          o1[req.body.subject] = req.params.faculty_id
          db.collection('classes').update({_id:req.body._id},{$addToSet:{"current_faculties":o1}})
          db.close()
          res.status(200)
          res.end()
        } else {
          console.error(err)
          errRequest("http://oniv.in/report/error/mongoErr/admin","mongodb",err,res)
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      console.error(err)
      errRequest("http://oniv.in/report/error/nodejsErr/admin","jwt",err,res)
      res.status(401)
      res.end()
    }
  })
}
})

router.get('/takeattendance/all',function(req,res){
  let cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){

    res.status(500)
    res.end()
  } else {
    jwt.verify(cookies.user,passKey,function(err,decoded){
      if(!err){
        mongo.connect('mongodb://localhost:27018/data',function(err,db){
          if(err){
            console.error(err)
            errRequest("http://oniv.in/report/error/mongoErr/admin","mongodb",err,res)
            db.close()
            res.status(500)
            res.end()
          } else {
            db.collection('batches').findOne({_id:req.params.school + "/" + req.params.batch + "/" + req.params.section},{"students":1},function(err,item){
              if(err){
                console.error(err)
                errRequest("http://oniv.in/report/error/nodejsErr/admin","mongodb",err,res)
              } else {
                res.status(200)
                serverRequest.call({
                  url:"http://oniv.in/api/static/coaching/takeattendance.html",
                  method: 'get'
                },res)
              }
            })
          }
        })
      } else {
        console.error(err)
        errRequest("http://oniv.in/report/error/nodejsErr/admin","jwt",err,res)
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

    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,passKey,function(err,decoded){
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
              errRequest("http://oniv.in/report/error/mongoErr/admin","mongodb",err,res)
              db.close()
              res.status(404)
              res.end()
            }
          })
        } else {
          errRequest("http://oniv.in/report/error/mongoErr/admin","mongodb",err,res)
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      errRequest("http://oniv.in/report/error/nodejsErr/admin","jwt",err,res)
      res.status(401)
      res.end()
    }
  })
}
})

router.delete('/removefaculty/:id',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){

    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,passKey,function(err,decoded){
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
          errRequest("http://oniv.in/report/error/mongoErr/admin","mongodb",err,res)
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      errRequest("http://oniv.in/report/error/nodejsErr/admin","jwt",err,res)
      res.status(401)
      res.end()
    }
  })
}
})

router.delete('/removebatch/:domain_name/:section/:batch',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  if(!cookie){

    res.status(500)
    res.end()
  } else {
  jwt.verify(cookies.user,passKey,function(err,decoded){
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
          errRequest("http://oniv.in/report/error/mongoErr/admin","mongodb",err,res)
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      errRequest("http://oniv.in/report/error/nodejsErr/admin","jwt",err,res)
      res.status(401)
      res.end()
    }
  })
}
})

module.exports = router
