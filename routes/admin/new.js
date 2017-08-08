const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const root = __dirname
const request = require('request')
const qs = require('querystring')

function addNewBatch(req,res){
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
				const class_data = {}
				class_data.students = []
				class_data.student_data = []
				list.forEach((x,i)=>{
					const obj = {}
          entry = x.replace("\r","")
					let add;
					console.log(entry,0)
					if(entry.indexOf('\"')>0 && entry.indexOf('\"')<entry.length){
						add = entry.split('\"')[1]
						console.log(add)
						entry = entry.replace('\"' + add + '\"','')
						console.log(entry,1)
					}
          if(entry.length !=0 || entry != ""){
						const ent = entry.split(',')
						if(ent.length>5){
		          obj.enroll_number = ent[0].toLowerCase()
		          const enrl = ent[0]
		          obj.name = ent[1].toLowerCase()
		          obj.pname = ent[2].toLowerCase()
		          if(add){
                obj.add = add.toLowerCase()
              } else {
                obj.add = ent[3].toLowerCase()
              }
		          obj.city = ent[4].toLowerCase()
		          obj.mobiles = {}
							for(let ni=5;ni<9;ni++){
								if(ni===5){
									if(ent[ni]){
										obj.mobiles.parent1 = ent[ni]
									} else {
										res.status(400)
										res.end()
									}
								} else {
									if(ent[ni]){
										switch(ni){
											case 6:
												obj.mobiles.parent2 = ent[ni]
												break;

											case 7:
												obj.mobiles.sn = ent[ni]
												break;

											case 8:
												obj.mobiles.other = ent[ni]
												break;
										}
									}
								}
						}
            class_data.students.push(obj)
            class_data.student_data.push(obj)
					}
					}
				})
        class_data._id = req.params.domain_name + '/' + req.params.batch + '/' + req.params.section
        class_data.batch = req.params.batch
        class_data.school = req.params.school
        class_data.domain_name = req.params.domain_name
        class_data.class = req.params.cls
        class_data.section = req.params.section
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

function addNewFaculty(req,res){
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
            url:'http://oniv.in/sendsms/facultyotp',
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

function addNewStudent(req,res){
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
            console.log(root);
            form.uploadDir = root + "/../public/student_images"
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
}

module.exports.addNewBatch = addNewBatch
module.exports.addNewFaculty = addNewFaculty
module.exports.addNewStudent = addNewStudent
