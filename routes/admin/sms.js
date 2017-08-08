const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const root = __dirname
const request = require('request')
const router = require('express').Router();

let serverRequest = function(res){
	request(this,function(err,resp,body){
		console.log(body,"body")
		if(!err && resp.statusCode === 200){
			res.status(200)
			res.end()
		} else {
			console.log(err)
			res.status(500)
			res.end()
		}
	})
}

function smsFaculties(req,res){
	console.log(req.body);
	const cookies = cookie.parse(req.headers.cookie || '')
	if(!cookies){
		res.status(401)
		res.end()
	} else {
		jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
			if(!err){
				serverRequest.call({
					url: 'http://oniv.in/sendsms/smsFaculties',
					method: 'post',
					body: req.body,
					json:true
				},res)
			} else {
				res.status(401)
				res.end()
			}
		})
	}
}

function smsClass(req,res){
	const cookies = cookie.parse(req.headers.cookie || '')
	if(!cookies){
		res.status(401)
		res.end()
	} else {
		jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
			if(!err){
				const o = {}
				o.mobiles = []
				req.body.mobiles.forEach((x,i)=>{
					if(typeof x === 'object'){
						x.forEach((y,n)=>{
							o.mobiles.push(y)
						})
					} else {
						o.mobiles.push(x)
					}
				})
				o.text = req.body.text
				serverRequest.call({
					url: 'http://oniv.in/sendsms/smsClass',
					method: 'post',
					body: o,
					json:true
				},res)
			} else {
				res.status(401)
				res.end()
			}
		})
	}
}

function setSchedule(req,res){
	const cookies = cookie.parse(req.headers.cookie || '')
	if(!cookies){
		res.status(401)
		res.end()
	} else {
		jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
			if(!err){
				const o = []
				Object.keys(req.body.sch).forEach((x,i)=>{
					o.push(req.body.sch[x].h.toString() + ":" + req.body.sch[x].m.toString())
				})
				console.log(o);
				mongo.connect('mongodb://localhost:27018/data',function(err,db){
					if(!err){
						db.collection('faculty').update({_id:req.body.sf,"current_classes._id":req.body.btc},{$set:{"current_classes.$.schedule":o}})
						const ob = {}
						ob["schedule." + req.body.sf] = o
						db.collection('classes').update({_id:req.body.btc},{$set:ob})
						db.collection('classes').findOne({_id:req.body.btc},function(err,item){
							req.body.mo = item.students
							req.body.sch = o
							delete req.body.schedule
							serverRequest.call({
								url: 'http://oniv.in/sendsms/informschedule',
								method: 'post',
								body: req.body,
								json:true
							},res)
						})
						db.close()
					} else {
						res.status(500)
						res.end()
					}
				})
			} else {
				res.status(401)
				res.end()
			}
		})
	}
}

module.exports.smsFaculties = smsFaculties
module.exports.smsClass = smsClass
module.exports.setSchedule = setSchedule
