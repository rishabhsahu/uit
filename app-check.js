//  imporitng core node modules
var express=require('express')
var app = express()
var bp = require('body-parser')
var device = require('express-device')
var cookie = require('cookie')

//importing routes
var check = require('./routes/check.js')

app.use(bp.json())
app.use('/check',check)

app.listen(2768,function(){
  console.log("listening on port 2768")
})
