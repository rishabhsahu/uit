//  imporitng core node modules
const express=require('express')
const app = express()
const bp = require('body-parser')
const device = require('express-device')
const cookie = require('cookie')

//importing routes
const authentication = require('./routes/authentication.js')
const login = require('./routes/login')
const faculty = require('./routes/faculty')
const admin = require('./routes/admin')
const batch = require('./routes/batch')
const customscore = require('./routes/customscore.js')
const download = require('./routes/download')
const ips = require('child_process').execSync("ifconfig | grep inet | grep -v inet6 | awk '{gsub(/addr:/,\"\");print $2}'").toString().trim().split("\n");
const serverRequest = function(res){
  request(this,function(err,resp,body){
		if(!err && resp.statusCode === 200){
			res.status(200)
			res.end(body)
		} else {
			console.log(err)
			res.status(504)
			res.end()
		}
	})
}

app.use(device.capture())
app.use(authentication)
app.use('/login',bp.json(),login)
app.use('/admin',bp.json(),admin)
app.use('/custom-testscore',bp.json(),customscore)
app.use('/faculty',bp.json(),faculty)
app.use('/student',bp.json(),batch)
app.use('/download',download)
app.use('/logout',function(req,res){
  console.log('logout')
  res.setHeader('Set-cookie',cookie.serialize('user','',{expires: new Date(1),httpOnly:true}))
  res.status(200)
  res.end()
})


app.listen(process.env.PORT || 80,function(){
  console.log("listening on port 80")
})
