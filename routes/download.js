const router = require('express').Router()
const mongo = require('mongodb').MongoClient
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const fs = require('fs')
const xl = require('excel4node')
const dayName = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const months = ["January","February","March","April","May","June","July","Augut","September","October","November","December"]

router.get('/attendanceOverview/:school/:batch/:section/:faculty_id/:subject',function(req,res){
  console.log(req.url)
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'9aIkpJ5UdL+V73h9zoVNPb5LAEeRMiPVucw0q+cYJXK6wyOO+0VzkXR+w6mmU',function(err,decoded){
    if(!err){
      console.log("Excell sheet requested")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        const classes_held=[];
        if(!err){
          db.collection('faculty').findOne({_id:req.params.faculty_id},{"current_classes":1},function(err,item){
            if(!err){
              item.current_classes.forEach(function(a,b){
                if(a._id === req.params.school + '/' + req.params.batch + '/' + req.params.section ){
                  classes_held = a.classes_held
                }
              })
              }
            })
          db.collection('classes').findOne({_id:req.params.school + '/' + req.params.batch + '/' + req.params.section},function(err,itm){
            if(!err){
                    const data = itm.student_data
                    const wb = new xl.Workbook()
                    const ws = wb.addWorksheet('attendance-sheet')
                    const style = wb.createStyle({font: {color: '#FF0800',size: 12},numberFormat: '$#,##0.00; ($#,##0.00); -'})
                    ws.cell(1,1).string('Enrollment Number').style(style)
                    ws.column(1).setWidth(25)
                    ws.cell(1,2).string('Name').style(style)
                    ws.column(2).setWidth(25)
                    ws.cell(1,3).string('Classes Not Taken').style(style)
                    ws.column(3).setWidth(13)
                    ws.cell(1,4).string('Absent Percentage').style(style)
                    ws.cell(1,5).string('Present Percentage').style(style)
                    ws.column(4).setWidth(13)
                    ws.column(5).setWidth(13)
                    for(var i=0;i<data.length;i++){
                      console.log(data[i])
                      if(data[i].name != null && data[i].enroll_number != null){
                        ws.cell(i+2,1).string(data[i].enroll_number)
                        ws.column(1).setWidth(25)
                        ws.cell(i+2,2).string(data[i].name)
                        ws.column(2).setWidth(25)
                        if(data[i].hasOwnProperty(req.params.subject) && data[i][req.params.subject].hasOwnProperty("absent") ){
                          ws.cell(i+2,3).number(data[i][req.params.subject].absent.length)
                          ws.column(3).setWidth(13)
                          ws.cell(i+2,4).number(Math.ceil((data[i][req.params.subject].absent.length/classes_held.length)*100))
                          ws.column(4).setWidth(13)
                          ws.cell(2+i,5).number(100-Math.ceil((data[i][req.params.subject].absent.length/classes_held.length)*100)).style(style)
                          ws.column(5).setWidth(13)
                        } else {
                          ws.cell(i+2,3).number(0)
                          ws.column(3).setWidth(13)
                          ws.cell(i+2,4).number(0)
                          ws.cell(i+2,5).number(100)
                          ws.column(4).setWidth(25)
                          ws.column(5).setWidth(25)
                        }
                      }
                    }
                    wb.write(__dirname + '/xlxs/' + req.params.school + '-' + req.params.section + '-' + req.params.batch + '[attendance-report].xlxs',function(err,stats){
                      if(!err){
                        res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                        res.setHeader('Content-Disposition','attachment; filename=' + req.params.school + '-' + req.params.section + '-' + req.params.batch + '[attendance-report].xlxs')
                        fs.createReadStream(__dirname + '/xlxs/' + req.params.school + '-' + req.params.section + '-' + req.params.batch + '[attendance-report].xlxs').pipe(res)
                      } else {
                        console.log(err)
                        db.close()
                        res.status(500)
                        res.end()
                      }
                    })
                  } else {
                    console.error(err)
                    db.close()
                    res.status(404)
                    res.end()
                  }
          })
        } else {
          console.error(err)
          db.close()
          res.status(500)
          res.end()
        }
      })
    } else {
      console.error(err)
      res.status(500)
      res.end()
    }
  })
})

/*
router.get('/attendanceDetailed/:school/:batch/:section/:faculty_id/:subject',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'9aIkpJ5UdL+V73h9zoVNPb5LAEeRMiPVucw0q+cYJXK6wyOO+0VzkXR+w6mmU',function(err,decoded){
    if(!err){
      console.log("Excell sheet requested")
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          var classes_held=[];
          db.collection('faculty').findOne({_id:req.params.faculty_id},{"current_classes":1},function(err,item){
            item.current_classes.forEach(function(a,b){
              if(a._id === req.params.school + '/' + req.params.batch + '/' + req.params.section ){
                classes_held = a.classes_held
              }
                classes_held = classes_held.sort(function(nlmn,dnln){
                  return dnln - nlmn;
                })
              })
            })

          db.collection('classes').findOne({_id:req.params.school + '/' + req.params.batch + '/' + req.params.section},function(err,itm){
            if(!err){
                    var data = itm.student_data
                    var wb = new xl.Workbook()
                    var ws = {}
                    var style = wb.createStyle({font: {color: '#FF0800',size: 12},numberFormat: '$#,##0.00; ($#,##0.00); -'
                  })
                    var present = wb.createStyle({border: {left:{style:'thin',color:'black'},right:{style:'thin',color:'black'},top:{style:'thin',color:'black'},bottom:{style:'thin',color:'black'}},fill: {type:'pattern',patternType:'lightUp',fgColor: '#00ff00'
                  }})
                    var absent = wb.createStyle({border: {left:{style:'thin',color:'black'},right:{style:'thin',color:'black'},top:{style:'thin',color:'black'},bottom:{style:'thin',color:'black'}},fill: {type:'pattern',patternType:'darkVerical',fgColor: '#ef2b2b'
                  }})
                    var current_month = ""
                    var ntx=0;
                    classes_held.forEach(function(x,n){
                      var d = new Date(x)
                      if(n===0){
                        current_month = months[d.getMonth()]
                        ws[months[d.getMonth()]] = wb.addWorksheet(ws[months[d.getMonth()]])
                        if(ntx===0){
                          data.forEach(function(zl,en){
                            if(zl.name && zl.enroll_number){
                              ws[months[d.getMonth()]].cell(2+en,1).string(zl.enroll_number)
                              ws[months[d.getMonth()]].cell(2+en,2).string(zl.name)
                              ws[current_month].column(1).setWidth(15)
                              ws[current_month].column(2).setWidth(25)
                            }
                          })
                        }
                      } else if(current_month != months[d.getMonth()]){
                        ntx = 0
                        current_month = months[d.getMonth()]
                        ws[months[d.getMonth()]] = wb.addWorksheet(ws[months[d.getMonth()]])
                        if(ntx===0){
                          data.forEach(function(zl,en){
                            if(zl.name && zl.enroll_number){
                              ws[months[d.getMonth()]].cell(2+en,1).string(zl.enroll_number)
                              ws[months[d.getMonth()]].cell(2+en,2).string(zl.name)
                              ws[current_month].column(1).setWidth(15)
                              ws[current_month].column(2).setWidth(25)
                            }
                          })
                        }
                      }
                      ws[months[d.getMonth()]].cell(1,3+ntx).string(d.getDate() + ' ' + months[Number(d.getMonth())] + ', ' + dayName[d.getDay()])
                      ws[months[d.getMonth()]].column(3+ntx).setWidth(15)
                      ntx++;
                    })

                    current_month = ""

                    data.forEach(function(te,ne){
                      if(y.name != null && y.enroll_number != null && y.hasOwnProperty(req.params.subject) && y[req.params.subject].hasOwnProperty('absent') ){
                        var absns = y[req.params.subject].absent.sort(function(abl,dbl){
                          return abl -dbl
                        })
                        var nty = 0
                        absns.forEach(function(l,m){
                          var crdt = new Date()
                          if( m===0 ){
                            nty = 0
                            current_month = d.getMonth()
                          } else if( current_month != d.getMonth()){
                            nty=0;
                            current_month = d.getMonth()
                          }
                          ws[months[months[d.getMonth()]]].cell(2+j,3+nx).style(absent)
                          ws[months[months[d.getMonth()]].column(3+nx).setWidth(15)
                        })
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

*/

router.get('/examscores/all/:school/:batch/:section',function(req,res){
  var cookies = cookie.parse(req.headers.cookie || '')
  jwt.verify(cookies.user,'9aIkpJ5UdL+V73h9zoVNPb5LAEeRMiPVucw0q+cYJXK6wyOO+0VzkXR+w6mmU',function(err,decoded){
    if(!err){
      mongo.connect('mongodb://localhost:27018/data',function(err,db){
        if(!err){
          db.collection('classes').findOne({_id:req.params.school + '/' + req.params.batch + '/' + req.params.section},{"student_data":1,"current_faculties":1},function(err,item){
            if(!err){
              var wb = new xl.Workbook()
              const style1 = wb.createStyle({alignment:{horizontal:['right'],vertical:['center']},font: {color: '#4277f4',size: 12},numberFormat: '$#,##0.00; ($#,##0.00); -'})
              const style2 = wb.createStyle({alignment:{horizontal:['right'],vertical:['center']},font: {color: '#e52424',size: 12},numberFormat: '$#,##0.00; ($#,##0.00); -'})
              const style3 = wb.createStyle({alignment:{horizontal:['right'],vertical:['center']},font: {color: '#252526',size: 12},numberFormat: '$#,##0.00; ($#,##0.00); -'})

              const stylep = wb.createStyle({alignment:{horizontal:['right'],vertical:['center']},font: {color: '#24ad6f',size: 12},numberFormat: '$#,##0.00; ($#,##0.00); -'})

              const styleh = wb.createStyle({alignment:{horizontal:['right'],vertical:['center']},font: {color: '#181918',size: 14},numberFormat: '$#,##0.00; ($#,##0.00); -'})

              const styled = wb.createStyle({alignment:{horizontal:['right'],vertical:['center']},font: {color: '#ea7910',size: 10},numberFormat: '$#,##0.00; ($#,##0.00); -'})
              var ws = {}
              if(item.current_faculties.length>0){
                item.current_faculties.forEach(function(sub){
                  ws[Object.keys(sub)[0]] = wb.addWorksheet(Object.keys(sub)[0])
                  ws[Object.keys(sub)[0]].cell(1,1).string('Enrollment Number').style(style3)
                  ws[Object.keys(sub)[0]].cell(1,2).string('Name').style(style3)
                  ws[Object.keys(sub)[0]].cell(1,3).string('Test Name').style(styleh)
                  ws[Object.keys(sub)[0]].cell(2,3).string('Test Date').style(styleh)
                  ws[Object.keys(sub)[0]].cell(3,3).string('Max Score').style(styleh)
                })
              }
              var tnames = []
              item.student_data.forEach(function(s,n){
                if(s.name && s.enroll_number){
                  Object.keys(ws).forEach(function(sb,i){
                    ws[sb].cell(5+n,1).string(s.enroll_number).style(style1)
                    ws[sb].column(1).setWidth(20)
                    ws[sb].cell(5+n,2).string(s.name).style(style2)
                    ws[sb].column(2).setWidth(20)
                    ws[sb].column(3).setWidth(15)
                    ws[sb].cell(5+n,3).string("")
                      if(s.hasOwnProperty(sb) && s[sb].hasOwnProperty('scores')){
                        if(n===0){
                          s[sb].scores.forEach(function(dl,dt){
                            ws[sb].cell(1,4+dt).string("Test - " + dl.test_name).style(styleh)
                            tnames.push(dl.test_name)
                            ws[sb].cell(2,4+dt).string(dl.testdate).style(styled)
                            ws[sb].cell(3,4+dt).string(dl.max_score).style(style2)
                            ws[sb].column(4+dt).setWidth(15)
                          })
                        }
                        s[sb].scores.forEach(function(ts,tn){
                          if(tnames.indexOf(ts.test_name)>-1){
                            if(ts.score != "A"){
                              ws[sb].cell(5+n,4+tnames.indexOf(ts.test_name)).string(ts.score + " ( " + Math.ceil((ts.score*100)/ts.max_score) + "% )").style(stylep)
                            } else {
                              ws[sb].cell(5+n,4+tnames.indexOf(ts.test_name)).string(ts.score).style(style2)
                            }
                          }
                        })
                      }
                  })
                }
              })

              wb.write(__dirname + '/xlxs/examscores-all/' + req.params.school + '-' + req.params.batch + '-' + req.params.section + '[Exam-Scores].xlxs',function(err,stats){
                if(!err){
                  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                  res.setHeader('Content-Disposition','attachment; filename=' + req.params.school + '-' + req.params.batch + '-' + req.params.section + '[Exam-Scores].xlxs')
                  fs.createReadStream(__dirname + '/xlxs/examscores-all/' + req.params.school + '-' + req.params.batch + '-' + req.params.section + '[Exam-Scores].xlxs').pipe(res)
                } else {
                  console.log(err)
                  db.close()
                  res.status(500)
                  res.end()
                }
              })

            } else {
              db.close()
              console.log(err)
              res.status(404)
              res.end()
            }
          })
        } else {
          console.error(err)
          res.status(500)
          res.end()
        }
      })
    } else {
      console.error(err)
      res.status(500)
      res.end()
    }
  })
})

module.exports = router
