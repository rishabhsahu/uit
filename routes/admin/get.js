const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const root = __dirname
const request = require('request')

function getDepartmentData(req,res){
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
}

function getFacultyData(req,res){
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
}

function classesheld(req,res){
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
}

function getBatchData(req,res){
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
}

function getAllStudents(req,res){
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
          var batches = []
          let o = {}
          db.collection('admin').findOne({_id:decoded.name},{"batches":1},function(err,item){
            if(!err){
              res.status(200)
              res.json(item)
              db.close()
            } else {
              errRequest("http://localhost:80/error/mongoErr/admin","mongodb",err)
              db.close()
              res.status(404)
              res.end()
            }
          })
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
}

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

module.exports.getDepartmentData = getDepartmentData
module.exports.getBatchData = getBatchData
module.exports.classesheld = classesheld
module.exports.getFacultyData = getFacultyData
module.exports.getAllStudents = getAllStudents
