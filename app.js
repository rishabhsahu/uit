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
var download = require('./routes/download')

app.set('views','./views')
app.set('view engine','ejs')
app.use(device.capture())
app.use(authentication)
app.use('/login',bp.urlencoded({extended:true}),login)
app.use('/admin',bp.json(),admin)
app.use('/faculty',bp.json(),faculty)
app.use('/download',download)

app.use(express.static('public'))
app.use('/login',express.static('public'))
app.use('/login/faculty',express.static('public'))
app.use('/login/admin',express.static('public'))

app.listen(process.env.PORT || 3000,function(){
  console.log("listening on port 3000")
})
