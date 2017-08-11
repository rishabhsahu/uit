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
const sendsms = require('./routes/sendsms')
const download = require('./routes/download')
const errorRecorder = require('./routes/era')

app.set('views','./views')
app.set('view engine','ejs')
app.use(device.capture())
app.use(authentication)
app.use('/',bp.json(),login)
app.use('/sendsms',bp.json(),sendsms)
app.use('/admin',bp.json(),admin)
app.use('/custom-testscore',bp.json(),customscore)
app.use('/faculty',bp.json(),faculty)
app.use('/student',bp.json(),batch)
app.use('/download',download)
app.get('/logout',function(req,res){
  console.log('logout')
  res.setHeader('Set-cookie',cookie.serialize('user','',{expires: new Date(1),httpOnly:true}))
  res.status(200)
  res.end()
})

app.listen(process.env.PORT || 80,function(){
  console.log("listening on port 80")
})
