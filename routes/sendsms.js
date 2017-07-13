var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient
var request = require('request')
var authkey = "155975ATpoRPi5h593ea16c"
var months = ["january","february","march","april","may","june","july","august","septermber","october","november","december"]

router.post('/notifyclass',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      var mobile = ""
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').findOne({_id:req.body.batch_id},{"students.mobile":1},function(err,item){
            if(!err){
                item.students.forEach(function(x,i){
                  mobile += x.mobile + ","
                })
          var api_url = "http://api.msg91.com/api/sendhttp.php?"
          api_url += "authkey=" + authkey + "&"
          api_url += "mobiles=" + mobile + "&message=" + encodeURIComponent(req.body.text + "\nsent via oniv.in") + "&sender=onivin&route=4"
          request({
            method:'get',
            url: api_url
          },function(err,resp,body){
            if(!err){
                      db.collection("faculty").update({_id:decoded.name},{$inc:{"recent_messages":req.body.mobiles.length}})
                      db.collection("admin").update({_id:"school.admin@" + decoded.name.split('@')[1]},{$inc:{"recent_messages":req.body.mobiles.length}})
                      db.close()
                      res.status(200)
                      res.end()
                    } else {
                      console.log(err)
                      db.close()
                      res.status(504)
                      res.end()
                    }
                  })
                } else {
                  console.log(err)
                  res.status(504)
                  res.end()
                }
              })
        } else {
          res.status(504)
          res.end()
        }
      })
    } else {
      console.log(err)
      res.status(200)
      res.end()
    }
  })
})

router.post("/smsfaculty",function(req,res){
  var cookies = cookie.parse(req.headers.cookie || "");
  jwt.verify(cookie.user,"uit attendace login",function(err,decoded){
    if(!err){
      var api_url = "http://api.msg91.com/api/sendhttp.php?"
      api_url += "authkey=" + authkey + "&mobiles=" + req.body.mobile.toString() + "&message=" + encodeURIComponent(req.body.text + "\nsent by " + req.body._id.split('@')[1]) + "&sender=onivin&route=4"
      request({
        method:'get',
        url: api_url
      },function(err,resp,body){
        if(!err){
          mongo.connect('mongodb://localhost:27018/data',function(err,db){
            if(!err){
              var q = {}
              q.sms_sent_faculty[req.body.faculty][0] = 1
              db.collection('admin').update({'_id':req.body.user_id},{$inc:q})
              db.close()
              console.log(body)
              res.status(200)
              res.end()
            } else {
              db.close()
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
})

router.post("/facultyotp",function(req,res){
      var api_url = "http://api.msg91.com/api/sendhttp.php?"
      api_url += "authkey=" + authkey + "&mobiles=" + req.body.mobile.toString() + "&message=" + encodeURIComponent("Mr./Mrs. " + req.body.name + ", you were registered on oniv.in by " + req.body.school + ". Your login credentials are as follows\n" + "Username - " + req.body.username + ",\nOTP - " + req.body.otp + "\nPlease visit oniv.in to complete the registration process") + "&sender=onivin&route=4"
      request({
        method:'get',
        url: api_url
      },function(err,resp,body){
        if(!err){
          console.log(body)
          res.status(200)
          res.end()
        } else {
          console.log(err)
          res.status(500)
          res.end()
        }
      })
})

router.post('/messageselected',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      var mobile = ""
      req.body.mobiles.forEach(function(x,i){
        mobile += x + ","
      })
      var api_url = "http://api.msg91.com/api/sendhttp.php?"
      api_url += "authkey=" + authkey + "&"
      api_url += "mobiles=" + mobile + "&message=" + encodeURIComponent(req.body.text + "\nsent via oniv.in") + "&sender=onivin&route=4"
      request({
        method:'get',
        url: api_url
      },function(err,resp,body){
        if(!err){

          mongo.connect('mongodb://localhost:27018/data',function(err,db){
            if(!err){
                  db.collection("faculty").update({_id:decoded.name},{$inc:{"recent_messages":req.body.mobiles.length}})
                  db.collection("admin").update({_id:"school.admin@" + decoded.name.split('@')[1]},{$inc:{"recent_messages":req.body.mobiles.length}})
                  db.close()
                  res.status(200)
                  res.end()
                } else {
                  console.log(err)
                  db.close()
                  res.status(504)
                  res.end()
                }
              })
            } else {
              console.log(err)
              res.status(504)
              res.end()
            }
          })
        } else {
          res.status(504)
          res.end()
        }
      })
})

router.post('/sendsmstoclass',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      var mobile = ""
      req.body.mobiles.forEach(function(x,i){
        mobile += x + ","
      })
      var api_url = "http://api.msg91.com/api/sendhttp.php?"
      api_url += "authkey=" + authkey + "&"
      api_url += "mobiles=" + mobile + "&message=" + encodeURIComponent(req.body.text + "\nsent via oniv.in") + "&sender=onivin&route=4"
      request({
        method:'get',
        url: api_url
      },function(err,resp,body){
        if(!err){

          mongo.connect('mongodb://localhost:27018/data',function(err,db){
            if(!err){
                  db.collection("faculty").update({_id:decoded.name},{$inc:{"recent_messages":req.body.mobiles.length}})
                  db.collection("admin").update({_id:"school.admin@" + decoded.name.split('@')[1]},{$inc:{"recent_messages":req.body.mobiles.length}})
                  db.close()
                  res.status(200)
                  res.end()
                } else {
                  console.log(err)
                  db.close()
                  res.status(504)
                  res.end()
                }
              })
            } else {
              console.log(err)
              res.status(504)
              res.end()
            }
          })
        } else {
          res.status(504)
          res.end()
        }
      })
})

router.post('/scorereport-admin',function(req,res){
      var api_url = "http://api.msg91.com/api/sendhttp.php?"
      var msg = "<?xml version='1.0' encoding='utf-8' standalone='yes'?><MESSAGE><AUTHKEY>" + authkey + "</AUTHKEY><ROUTE>4</ROUTE><COUNTRY>91</COUNTRY><SENDER>onivin</SENDER>"
      var d = new Date(req.body.testdate)
      for(var p in req.body.scores){
        msg += "<SMS TEXT='"
        if(req.body.scores[p] != "A"){
          msg += "Dear Parent, in " + req.body.subject + "-Test that took place on " + d.toDateString() + ", Your child scored -  " + req.body.scores[p] + " , out of " + req.body.maxscore + " . From - " + req.body.school
        } else {
          msg += "Dear parent, your child was absent from " + req.body.subject + "-test, that took place on " + d.toDateString() + " . From - " + req.body.school
        }
        msg += "'><ADDRESS TO='" + req.body.mobiles[p] + "'></ADDRESS></SMS>"
      }
      msg += "</MESSAGE>"
      console.log(msg);
      request({
        url: "https://control.msg91.com/api/v2/sendsms",
        method:"POST",
        body:msg,
        headers: {
    "Content-Type": "application/xml",
    "authkey": authkey
}
      },function(err,resp,body){
        if(!err){
          console.log(body)
            } else {
              console.log(err)
              res.status(504)
              res.end()
            }
          })
})

router.post('/sendsmstofaculties',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      var mobile = ""
      req.body.mobiles.forEach(function(x,i){
        mobile += x + ","
      })
      var api_url = "http://api.msg91.com/api/sendhttp.php?"
      api_url += "authkey=" + authkey + "&"
      api_url += "mobiles=" + mobile + "&message=" + encodeURIComponent(req.body.text + "\nsent via oniv.in") + "&sender=onivin&route=4"
      request({
        method:'get',
        url: api_url
      },function(err,resp,body){
        if(!err){

          mongo.connect('mongodb://localhost:27018/data',function(err,db){
            if(!err){
                  db.collection("admin").update({_id:"school.admin@" + decoded.name.split('@')[1]},{$inc:{"recent_messages":req.body.mobiles.length}})
                  db.close()
                  res.status(200)
                  res.end()
                } else {
                  console.log(err)
                  db.close()
                  res.status(504)
                  res.end()
                }
              })
            } else {
              console.log(err)
              res.status(504)
              res.end()
            }
          })
        } else {
          res.status(504)
          res.end()
        }
      })
})

module.exports = router
