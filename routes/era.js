var router = require('express').Router()
var cookie = require('cookie')
var jwt = require('jsonwebtoken')
var mongo = require('mongodb').MongoClient
var authkey = "155975ATpoRPi5h593ea16c"

router.post('/:domain/:subdomain',function(req,res){
  mongo.connect('mongodb://localhost:27018/oniv',function(err,db){
    if(err){
      db.close()
      res.status(500)
      res.end()
    } else {
      db.collection(req.params.domain).update({_id:req.params.subdomain},{$addToSet:{"recentErrors":req.body}},true)
      db.close()
      res.end()
    }
  })
})

router.post('/reportissue',function(req,res){
      mongo.connect('mongodb://localhost:27018/oniv',function(err,db){
        if(!err){
          db.collection('reported').insert(req.body)
          db.close()
          res.status(200)
          res.end()
        } else {
        db.close()
        res.status(500)
        res.end()
        }
      })
})

module.exports = router
