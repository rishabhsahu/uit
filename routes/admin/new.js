let mongo = require('mongodb').MongoClient
let ObjectId = require('mongodb').ObjectId
let cookie = require('cookie')
let jwt = require('jsonwebtoken')
let formidable = require('formidable')
let fs = require('fs')
let path = require('path')
let root = __dirname
let request = require('request')

function addnewbatch(req,res){
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
        class_data.tests = {}
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
}

function addnewfaculty(req,res){
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
}

module.exports.addnewbatch = addnewbatch
module.exports.addnewfaculty = addnewfaculty
