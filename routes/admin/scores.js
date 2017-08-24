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
const passKey = '9aIkpJ5UdL+V73h9zoVNPb5LAEeRMiPVucw0q+cYJXK6wyOO+0VzkXR+w6mmU'
const ep = require('excel');

const serverRequest = function(res){
  request(this,function(err,resp,body){
		console.log(body,"body")
		if(!err && resp.statusCode === 200){
			res.status(200)
			res.end()
		} else {
      console.error(err)
			res.status(503)
			res.end()
		}
	})
}

const errRequest = function(u,m,e){
  serverRequest.call({
    url:u + "/" + m,
    method: 'post',
    body: e,
    json: true
  },res)
}

function scoreSheet(req,res){
	const cookies = cookie.parse(req.headers.cookie || '')
	jwt.verify(cookies.user,passKey,(err,decoded)=>{
		if(!err){
			const cls = {inp:{},dt:{},mo:{}}
			const form = formidable.IncomingForm()
			form.encoding = "utf-8"
			form.keepExtensions = true
			form.uploadDir = root + "/data/scores"
			form.parse(req,(err,fields,value)=>{
				if(err) throw err
				cls.inp = fields;
			})
			form.on('file',(name,file)=>{
				const nm = path.basename(file.path)
				const arr = []
				ep(root + "/data/scores/" + nm,function(err,data){
					if(err) console.error(err);
					const flds = data.shift()
					class Std {
						constructor(keys,values) {
							keys.forEach((x,i)=>{
								this[x] = values[i];
							})
						}
					}
					let dtob
					cls.inp.testdate = cls.inp.testDate + '/' + cls.inp.testMonth + '/' + cls.inp.testYear
					delete cls.inp.testYear
					delete cls.inp.testMonth
					delete cls.inp.testDate
					mongo.connect('mongodb://localhost:27018/data',(err,db)=>{
						if(err) console.log(err)
						data.forEach((a)=>{
							const o = new Std(flds,a)
							cls.dt[o.enroll_number] = o;
							o.type = "upload"
							dtob = {['student_data.$.' + cls.inp['subject'] + '.exams.' + cls.inp.name] : o}
							db.collection('classes').update({_id:req.params.sch + "/" + req.params.btc + "/" + req.params.sc,"student_data.enroll_number":o.enroll_number},{$set:dtob})
							console.log(o);
						})
						db.collection('classes').update({_id:req.params.sch + "/" + req.params.btc + "/" + req.params.sc},{$set:{['exams.' + cls.inp.subject + '.' + cls.inp.name]:{'testdate':cls.inp.testdate},maxscore:cls.inp.maxscore}})
						db.collection('classes').findOne({_id:req.params.sch + "/" + req.params.btc + "/" + req.params.sc},{'students':1},function(err,item){
							item.students.forEach((s,n)=>{
								cls.mo[s.enroll_number]=[s.parent1,s.parent2]
							})
							console.log(cls);
							serverRequest.call({
		            url:'http://oniv.in/api/sendsms/scores/upload',
		            body: cls,
		            json:true,
		            method:'POST'
		          },res)
						})
					})
				})
			})
			form.on('error',(err)=>{console.log(err)})
			form.on('end',()=>{
			})
		}
	})
}

module.exports.scoreSheet = scoreSheet
