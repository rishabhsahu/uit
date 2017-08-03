var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient()

router.get("/:school/:batch/:section/:er",function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '' )
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').findOne({_id:req.params.school + "/" + req.params.batch + "/" + req.params.section},{"student_data":1,"current_faculties":1},function(err,item){
            if(!err){
              db.close()
              res.status(200)
              item.student_data.forEach((x,i)=>{
                if(x.enroll_number === req.params.er){
                  const o = x
                  o.current_faculties = item.current_faculties
                  res.json(o)
                }
              })
            } else {
              db.close()
              res.status(404)
              res.end()
            }
          })
        } else {
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      res.status(500)
      res.end()
    }
  })
})

router.post('/status/:cc',function(req,res){
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
          let ob = {}
          ob["student_data.$." + req.params.cc] = req.body.tm
          db.collection("classes").update({_id:req.body.batch,"student_data.enroll_number":req.body.er},{$addToSet:ob})
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

module.exports = router
