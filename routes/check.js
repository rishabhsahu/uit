let router = require('express').Router()
let request = require('request')
let mongo = require('mongodb').MongoClient

router.post('/allsubjectsscores',function(req,res){
	console.log(req.body);
	mongo.connect('mongodb://localhost:27018/data',function(err,db){
		if(!err){
			db.collection('classes').findOne({_id:req.body.batch},{"current_faculties":1,"tests":1},function(err,item){
				if(!err){
					let z = 0
					let cfa = []
					let tn = req.body.test_name
					let isTrue = true;
					item.current_faculties.forEach((fnm,i)=>{
						cfa.push(Object.keys(fnm)[0])
					})
					cfa.forEach((x,i)=>{
							if(item.tests[tn].indexOf(x)<0){
								isTrue = false
								res.status(403)
								res.end()
							}
					})
						if(isTrue){
							request({
								url:"http://localhost:80/sendsms/allsubjectsscores",
								method:'POST',
								body:req.body,
								json: true
							},function(err,resp,body){
								console.log(resp.statusCode)
									if(!err && resp.statusCode === 200){
										res.status(200)
										res.end()
									} else {
										res.status(504)
										res.end()
									}
							})
						} else {
							res.status(403)
							res.end()
						}
				} else {
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
