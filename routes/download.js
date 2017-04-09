var router = require('express').Router()
var mongo = require('mongodb').MongoClient
var jwt = require('jsonwebtoken')
var cookie = require('cookie')
var fs = require('fs')
var xl = require('excel4node')
var dayName = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
var months = ["January","February","March","April","May","June"]

router.get('/attendanceOverview/:college/:department/:batch/:faculty_id/:subject',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("Excell sheet requested")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').findOne({_id:req.params.college + '/' + req.params.department + '/' + req.params.batch},function(err,itm){
            if(!err){
              var classes_held=[];
              db.collection('faculty').findOne({_id:req.params.faculty_id},{"current_classes":1},function(err,item){
                item.current_classes.forEach(function(a,b){
                  if(a._id === req.params.college + '/' + req.params.department + '/' + req.params.batch ){
                    classes_held = a.classes_held

                    var data = itm.student_data
                    var wb = new xl.Workbook()
                    var ws = wb.addWorksheet('attendance-sheet')
                    var style = wb.createStyle({font: {color: '#FF0800',size: 12},numberFormat: '$#,##0.00; ($#,##0.00); -'})
                    ws.cell(1,1).string('Enrollment Number').style(style)
                    ws.column(1).setWidth(25)
                    ws.cell(1,2).string('Name').style(style)
                    ws.column(2).setWidth(25)
                    ws.cell(1,3).string('Classes Taken').style(style)
                    ws.column(3).setWidth(13)
                    ws.cell(1,4).string('Attendance Percentage').style(style)
                    for(var i=0;i<data.length;i++){
                      console.log(data[i])
                      ws.cell(i+2,1).string(data[i].enroll_number)
                      ws.column(1).setWidth(25)
                      ws.cell(i+2,2).string(data[i].name)
                      ws.column(2).setWidth(25)
                      if(data[i].hasOwnProperty(req.params.subject) && data[i][req.params.subject].hasOwnProperty("attendance") ){
                        ws.cell(i+2,3).number(data[i][req.params.subject].attendance.length)
                        ws.column(3).setWidth(13)
                        ws.cell(i+2,4).number(Math.ceil((data[i][req.params.subject].attendance.length/classes_held.length)*100))
                        ws.column(4).setWidth(13)
                      } else {
                        ws.cell(i+2,3).number(0)
                        ws.column(3).setWidth(13)
                        ws.cell(i+2,4).number(0)
                        ws.column(4).setWidth(25)
                      }
                    }
                    wb.write(__dirname + '/xlxs/' + req.params.college + '-' + req.params.department + '-' + req.params.batch + '[attendance-report].xlxs',function(err,stats){
                      if(!err){
                        res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                        res.setHeader('Content-Disposition','attachment; filename=' + req.params.college + '-' + req.params.department + '-' + req.params.batch + '[attendance-report].xlxs')
                        fs.createReadStream(__dirname + '/xlxs/' + req.params.college + '-' + req.params.department + '-' + req.params.batch + '[attendance-report].xlxs').pipe(res)
                      } else {
                        console.log(err)
                        db.close()
                        res.status(500)
                        res.end()
                      }
                    })
                  }
                })
              })
            } else {
              console.log("document not found")
              db.close()
              res.status(404)
              res.end()
            }
          })
        } else {
          console.log("failed to connect to db")
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      console.log("failed to verify")
      res.status(500)
      res.end()
    }
  })
})

router.get('/attendanceDetailed/:college/:department/:batch/:faculty_id/:subject',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'uit attendance login',function(err,decoded){
    if(!err){
      console.log("Excell sheet requested")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').findOne({_id:req.params.college + '/' + req.params.department + '/' + req.params.batch},function(err,itm){
            if(!err){
              var classes_held=[];
              db.collection('faculty').findOne({_id:req.params.faculty_id},{"current_classes":1},function(err,item){
                item.current_classes.forEach(function(a,b){
                  if(a._id === req.params.college + '/' + req.params.department + '/' + req.params.batch ){
                    classes_held = a.classes_held
                    classes_held.sort(function(a, b) {
                      return a - b;
                    })

                    var data = itm.student_data
                    var wb = new xl.Workbook()
                    var ws = wb.addWorksheet('detailed-attendance-sheet')
                    var style = wb.createStyle({font: {color: '#FF0800',size: 12},numberFormat: '$#,##0.00; ($#,##0.00); -'})
                    var present = wb.createStyle({border: {left:{style:'thin',color:'black'},right:{style:'thin',color:'black'},top:{style:'thin',color:'black'},bottom:{style:'thin',color:'black'}},fill: {type:'pattern',patternType:'lightUp',fgColor: '#00ff00'}})
                    var absent = wb.createStyle({border: {left:{style:'thin',color:'black'},right:{style:'thin',color:'black'},top:{style:'thin',color:'black'},bottom:{style:'thin',color:'black'}},fill: {type:'pattern',patternType:'lightUp',fgColor: '#FF0800'}})
                    ws.cell(1,1).string('Enrollment Number').style(style)
                    ws.column(1).setWidth(25)
                    ws.cell(1,2).string('Name').style(style)
                    ws.column(3).setWidth(25)
                    var list = []
                    classes_held.forEach(function(x,i){
                      var d = new Date(x);
                      if( d.getMonth() == 3){
                        list.push(x)
                      }
                    })
                    list.forEach(function(r,n){
                      var d = new Date(r)
                      ws.cell(1,3+n).string(  dayName[d.getDay()] + ' ' + d.getDate() + ', ' + months[Number(d.getMonth())])
                      ws.column(3+n).setWidth(15)
                    })
                    console.log(list)

                    data.forEach(function(y,j){
                      ws.cell(2+j,1).string(y.enroll_number)
                      ws.cell(2+j,2).string(y.name)
                      ws.column(2).setWidth(35)
                      if( y.hasOwnProperty(req.params.subject) ){
                        y[req.params.subject].attendance.forEach(function(l,m){
                          if(list.indexOf(l)> -1){
                            ws.cell(2+j,3+list.indexOf(l)).style(present)
                            ws.column(3+list.indexOf(l)).setWidth(15)
                          } else {

                          }
                        })
                      } else {
                      }
                    })
                    wb.write(__dirname + '/xlxs/' + req.params.college + '-' + req.params.department + '-' + req.params.batch + '[attendance-report].xlxs',function(err,stats){
                      if(!err){
                        res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                        res.setHeader('Content-Disposition','attachment; filename=' + req.params.college + '-' + req.params.department + '-' + req.params.batch + '[attendance-report].xlxs')
                        fs.createReadStream(__dirname + '/xlxs/' + req.params.college + '-' + req.params.department + '-' + req.params.batch + '[attendance-report].xlxs').pipe(res)
                      } else {
                        console.log(err)
                        db.close()
                        res.status(500)
                        res.end()
                      }
                    })
                  } else {

                  }
                })
              })
            } else {
              console.log("document not found")
              db.close()
              res.status(404)
              res.end()
            }
          })
        } else {
          console.log("failed to connect to db")
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      console.log("failed to verify")
      res.status(500)
      res.end()
    }
  })
})

module.exports = router
