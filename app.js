//  imporitng core node modules
var express=require('express')
var app = express()
var bp = require('body-parser')
var device = require('express-device')

//importing routes
var authentication = require('./routes/authentication.js')
var login = require('./routes/login')
var faculty = require('./routes/faculty')
var admin = require('./routes/admin')
var sendsms = require('./routes/sendsms')
var download = require('./routes/download')
var errorRecorder = require('./routes/era')

app.set('views','./views')
app.set('view engine','ejs')
app.use(device.capture())
app.use(authentication)
app.use('/',bp.urlencoded({extended:true}),login)
app.use('/sendsms',bp.json(),sendsms)
app.use('/admin',bp.json(),admin)
app.use('/faculty',bp.json(),faculty)
app.use('/download',download)
app.use('/error',bp.json(),errorRecorder)

app.use(express.static('public'))
app.use('/login',express.static('public'))
app.use('/login/faculty',express.static('public'))
app.use('/login/admin',express.static('public'))

app.listen(process.env.PORT || 3000,function(){
  console.log("listening on port 3000")
})
