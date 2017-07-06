var view = {
  updateView: function(){
    var noClass = "";
    var noFaculty = "";
    if(model.info.batches.length === 0 || model.info.faculties.length === 0){
      if(model.info.batches.length === 0){
        noClass = "<div class='row' style='margin-top:30px;adding-top:20px;padding-bottom:20px;background-color:rgba(250,250,250,.8);border-radius:5px;border: solid 1px rgb(180,180,180);color:rgba(0,0,0,.8)'><div class='col-xs-12 text-danger'><h3>No Class Created</h3></div><div class='col-xs-12' onclick='view.showAddBatchModal()' style='cursor:pointer'><u>Create one</u></div></div>";
      }

      if(model.info.faculties.length === 0){
        noFaculty = "<div class='row' style='margin-top:30px;adding-top:20px;padding-bottom:20px;background-color:rgba(250,250,250,.8);border-radius:5px;border: solid 1px rgb(180,180,180);color:rgba(0,0,0,.8)'><div class='col-xs-12 text-danger'><h3>No Faculty Added</h3></div><div class='col-xs-12' onclick='view.showAddFacultyModal()' style='cursor:pointer'><u>Add one</u></div></div>";
      }

      document.getElementById('report_section').innerHTML = "<div class='col-xs-4 col-xs-offset-4 text-center' style='padding-top:100px'>" + noClass + noFaculty + "</div>";
    } else {
      document.getElementById('school_name').innerHTML = model.info.name;
      var absentFaculties = "";
      if(model.absentToday.length >0){
        absentFaculties = "<div class='row'><div class='col-xs-9 col-xs-offset-2' style='border-radius:3px;background-color:white;margin-top:20px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.6)'><div class='row'><div class='col-xs-12 text-danger' style='border-bottom:solid 1px rgba(160,160,160,.6)'><h3>Absent faculties</h3></div></div><div class='row' style='padding-bottom:5px'><div class='col-xs-4' style='border-right: solid 1px rgba(160,160,160,.6)'><canvas id='xcd'></canvas></div><div class='col-xs-8' style='max-height:110px;padding-top:10px;padding-bottom:10px;overflow-y:auto'><div class='row'><div class='col-xs-10 col-xs-offset-1'>";
        model.absentToday.forEach(function(x,i){
          absentFaculties += "<div class='row' style='padding-top:5px;padding-bottom:5px;overflow-y:auto;margin-top:5px;background-color:rgba(160,160,160,.4);border-radius:3px'><div class='col-xs-6' style='border-right:solid 1px white;text-transform:capitalize'>" + x + "</div><div class='col-xs-6'>" + model.reasonToday[i] + "</div></div>";
        })
        absentFaculties += "</div></div></div></div></div></div>";
      }

      var absents = "<div class='row'><div class='col-xs-9 col-xs-offset-2' style='background-color:white;margin-top:5px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8)'><div class='row'><div class='col-xs-12 text-danger' style='border-bottom:solid 1px rgba(160,160,160,.4)'><h3>Faculties with Number of Absents</h3></div></div><div class='row' style='padding-bottom:5px;padding-top:5px'><div class='col-xs-10 col-xs-offset-1' style='max-height:110px;overflow-y:auto'>";
      var t = model.info.faculties;
      t.sort(function(a,b){
        if(a.absent){
          dl = a.absent.length;
        } else {
          dl = 0;
        }
        if(b.absent){
          nl = b.absent.length;
        } else {
          nl = 0;
        }
        return nl - dl;
      });
      t.forEach(function(x,i){
        var nm,abts;
        if(x.absent){
          nm = x.name;
          abts = x.absent.length;
        } else {
          nm = x.name;
          abts = 0;
        }
        absents += "<div class='row' style='padding-top:5px;padding-bottom:5px;overflow-y:auto;margin-top:5px;background-color:rgba(200,200,200,.5);border-radius:3px;text-transform:capitalize'><div class='col-xs-6' style='border-right:solid 1px white;font-weight:bold;color:rgb(70,70,70)'>" + nm + "</div><div class='col-xs-6'>" + abts + "</div></div>";
      })
      absents += "</div></div></div></div>";
      var msgs = [];
      model.info.faculties.forEach(function(x,i){
        var cnt = 0;
        for(var p in x.recent_messages){
          cnt++;
        }
        var o = {"name":x.name,"cnt":cnt};
        msgs.push(o);
      })
      t = msgs.sort(function(a,b){
        return b.cnt - a.cnt;
      })
      fcbmsgs = "";
      t.forEach(function(x,i){
        fcbmsgs += "<div class='row' style='border-radius:3px;margin-top:5px'><div class='col-xs-7 col-xs-offset-1' style='background-color:rgba(200,200,200,.3);border-radius:3px;color: rgb(70,70,70);font-weight:bold;text-transform:capitalize;padding-top:5px;padding-bottom:5px;'>" + x.name + "</div><div class='col-xs-2 col-xs-offset-1' style='background-color:rgba(200,200,200,.4);border-radius:3px;color: rgb(70,70,70);font-weight:bold;padding-top:5px;padding-bottom:5px;'>" + x.cnt + "</div></div>";
      })

      var messages = "<div class='row'><div class='col-xs-9 col-xs-offset-2' style='border:solid 1px rgba(160,160,160,.8);border-radius:3px;background-color:white;margin-top:5px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8)'><div class='row' style=';padding-top:10px;padding-bottom:10px'><div class='col-xs-5' style='border-right: solid 1px rgb(160,160,160)'><div class='row'><div class='col-xs-12' style='font-size:22px'><span style='padding-bottom:5px;color:rgb(80,80,80);'>Messages This Month</span></div><div class='col-xs-12' style='font-size:32px;padding-top:15px;padding-bottom:15px'><span style='border-top: solid 1px rgb(160,160,160);color:rgb(91, 183, 216)'>" + model.info.recent_messages + "</span></div></div></div><div class='col-xs-7'><div class='row'><div class='col-xs-12'><h5><span style='padding-bottom:5px;border-bottom: solid 1px rgb(160,160,160);font-weight:bold;color:rgb(110,110,110)'>Messages ( By Faculties )</span></h5></div><div class='col-xs-12' style='max-height:80px;overflow-y:auto'>" + fcbmsgs + "</div></div></div></div></div></div>"

      var header_options = "<div class='col-xs-10 col-xs-offset-1 text-center' style='background-color:white;border-radius:3px;padding-top:10px;padding-bottom:10px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8);color:rgb(110,110,110);font-weight:bold;cursor:pointer'><div class='row'><div class='col-xs-3' style='border-right:solid 1px rgb(160,160,160)' onclick='view.showAddFacultyModal()'>New Faculty</div><div class='col-xs-3' style='border-right:solid 1px rgb(160,160,160)' onclick='view.showAddBatchModal()'>New Class</div><div class='col-xs-3' style='border-right:solid 1px rgb(160,160,160)' onclick='view.messageFaculties()'>Message Faculties</div><div class='col-xs-3' style='color:rgba(0,0,0,.2);cursor:not-allowed'>Notify Parents</div></div></div>";


          var left = "<div class='col-xs-9' style='max-height:550px;margin-top:25px;overflow-y:auto;'>" + messages + absentFaculties + absents + "<div class='row'><div class='col-xs-10 col-xs-offset-2' style='margin-top:25px'></div></div></div>";
          var right = "<div class='col-xs-2 col-xs-offset-1' style='margin-top:50px;'><div class='row'><div class='col-xs-12'><div class='row' style='background-color:white;border-radius:3px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8);cursor:pointer' onclick='view.showClasses()'><div class='col-xs-12' style='border-bottom:solid 1px rgb(160,160,160);color:rgb(110,110,110)'><h4>Total Classes</h4></div><div class='col-xs-12 text-primary' style='font-size:48px;'>" + model.info.batches.length + "</div></div><div class='row' style='background-color:white;border-radius:3px;margin-top:15px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8);cursor:pointer' onclick='view.showFacultyNames()'><div class='col-xs-12' style='border-bottom:solid 1px rgb(160,160,160);color:rgb(110,110,110)'><h4>Total Faculties</h4></div><div class='col-xs-12' style='font-size:48px;color:rgb(66, 206, 244)'>" + model.info.faculties.length + "</div></div><div class='row' style='background-color:white;border-radius:3px;margin-top:15px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8)'><div class='col-xs-12' style='border-bottom:solid 1px rgb(160,160,160);color:rgb(110,110,110)'><h4>Total Students</h4></div><div class='col-xs-12' style='font-size:48px;color:rgb(66, 206, 244)'>" + "0" + "</div></div><div class='row' style='background-color:white;border-radius:3px;margin-top:15px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8)'><div class='col-xs-12' style='border-bottom:solid 1px rgb(160,160,160);color:rgb(110,110,110)'><h4>Data/Reports</h4></div><div class='col-xs-12' style='border-bottom:solid 1px rgb(190,190,190);font-size:12px;cursor:not-allowed;padding-top:5px;padding-bottom:5px;color:rgb(80,80,80)'>Download</div><div class='col-xs-12' style='font-size:12px;cursor:not-allowed;padding-top:5px;padding-bottom:5px;color:rgb(80,80,80)'>Save to Google Drive</div></div></div></div></div>";

      var content = "<div class='col-xs-12 text-center' style='margin-top:15px'>" + "<div class='row' style='margin-bottom:15px'>" + header_options + "</div>" + "<div class='row'>" + left + right + "</div></div>";

      document.getElementById('report_section').innerHTML = content;
      /*
      var facultiesList = "";
      var batchesList = "";
      model.info.faculties.forEach(function(faculty,i){
        facultiesList += "<div class='col-xs-12 faculty_names' id='" + faculty.id + "'>" + faculty.name + "</div>";
      })
      model.info.batches.forEach(function(batches,i){
        batchesList += "<div class='col-xs-12 batches_names' id='" + batches._id + "'' onclick='view.batchDataPanel(event)'>" + batches.class + "th class" + "</div>";
      })
      document.getElementById("faculty_list_box").innerHTML = facultiesList;
      document.getElementById("batch_list_box").innerHTML = batchesList;

      */

      // Start of faculty Settings modal

      document.getElementById("switch").innerHTML += "<div id='facultySettingModal' class='text-center modal col-sm-12'><div class='row' style='padding-top:100px;'><div class='col-sm-4 col-sm-offset-4 modalContent' style='padding:20px;font-size: 20px;'>Are you sure you want to remove this Faculty from section/school ?<br><div class='text-danger' style='font-size:16px;'>note- this removal will be permanent and you will loose all the faculty data</div></div></div><div class='row' style='padding-top:20px;'><div class='col-sm-4 col-sm-offset-4'><div class='row'><div class='col-sm-2 col-sm-offset-3 btn btn-danger' onclick='controller.deleteFaculty()'>Yes</div><div class='btn btn-success col-sm-2 col-sm-offset-2' onclick='view.closeFacultySettingModal()'>No</div></div></div></div></div>";

      document.getElementById("switch").innerHTML += "<div id='deassignbatchModal' class='text-center modal col-sm-12'><div class='row' style='padding-top:100px;'><div class='col-sm-4 col-sm-offset-4 modalContent' style='padding:20px;font-size: 20px;'>Are you sure you want to De-assign Faculty this Batch?<br><div class='text-success' style='font-size:16px;'>note- You can however Re-assign Faculty this Batch and get the data back</div></div></div><div class='row' style='padding-top:20px;'><div class='col-sm-4 col-sm-offset-4'><div class='row'><div class='col-sm-2 col-sm-offset-3 btn btn-danger' onclick='controller.deassignbatch()'>Yes</div><div class='btn btn-success col-sm-2 col-sm-offset-2' onclick='view.closeDeassignBatchModal()'>No</div></div></div></div></div>";

      /*
      model.info.faculties.forEach(function(faculty,i){
        document.getElementsByClassName("faculty_names")[i].onclick = controller.facultySelected;
      });
      */
      graph.facultiesNotTakingClassToday('xcd');
    }
  },

  route: function(e){
    switch(e){
      case 'faculty':
        if(document.getElementById('batch_list') != null){
          document.getElementById('batch_list').style.display = "none";
        }
        view.showFacultyNames();
        break;

        case 'class':
          if(document.getElementById('faculty_list') != null){
           document.getElementById('faculty_list').style.display = "none";
         }
          view.showClasses();
          break;
    }
  },

  showFacultyNames: function(){
    var names = "";
    if(model.info.faculties){
      model.info.faculties.forEach(function(x,i){

          names += "<div class='col-xs-3 faculty_name text-danger' id='" + x.id + "' onclick='controller.facultySelected(event)' style='margin-top:15px;margin-left:10px;border:solid 1px rgba(160,160,160,.8);box-shadow:2px 2px 5px rgba(160,160,160,.4);border-radius:3px'>" + x.name + "</div>";
      })
    }
    var content = "<div class='col-sm-12 text-center'><div class='row' style='margin-top:15px'><div class='col-xs-4 col-xs-offset-4 faculty_name' style='font-weight:bold;border:solid 1px rgba(160,160,160,.8);box-shadow:2px 2px 5px rgba(160,160,160,.4);border-radius:3px;background-color:rgb(209, 35, 35);color:white' onclick='view.showAddFacultyModal()'> + Add New Faculty</div><div class='col-xs-1 col-xs-offset-1 glyphicon faculty_name glyphicon-arrow-left' style='font-weight:bold;border:solid 1px rgba(160,160,160,.8);box-shadow:2px 2px 5px rgba(160,160,160,.4);border-radius:3px;' onclick='controller.sectionData()'></div></div><div class='row' style='max-height:500px;overflow-y:auto;margin-top:15px;margin-left:50px'>" + names + "</div></div>";
    document.getElementById('report_section').innerHTML = content;
  },

  showClasses: function(){
      var names = "";
      var classes;
      if(model.info.batches){
        classes = model.info.batches;
        classes.sort(function(x,i){
          return x.class-i.class;
        })

        classes.forEach(function(x,i){
            names += "<div class='col-xs-2 faculty_name text-danger' id='" + x._id + "' onclick='controller.batchSelected(event)' style='margin-top:15px;border:solid 1px rgba(160,160,160,.8);box-shadow:2px 2px 5px rgba(160,160,160,.4);border-radius:3px;margin-left:10px'>" + x.class + "</div>";
        })
      }
      var content = "<div class='col-sm-12 text-center'><div class='row' style='margin-top:15px'><div class='col-xs-4 col-xs-offset-4 faculty_name' style='font-weight:bold;background-color:rgb(209, 35, 35);border:solid 1px rgba(160,160,160,.8);box-shadow:2px 2px 5px rgba(160,160,160,.4);border-radius:3px;color:white' onclick='view.showAddBatchModal()'> + Add New Batch</div><div class='col-xs-1 col-xs-offset-1 glyphicon faculty_name glyphicon-arrow-left' style='font-weight:bold;border:solid 1px rgba(160,160,160,.8);box-shadow:2px 2px 5px rgba(160,160,160,.4);border-radius:3px;' onclick='controller.sectionData()'></div></div><div class='row' style='max-height:500px;overflow-y:auto;margin-top:15px'>" + names + "</div></div>";
      document.getElementById('report_section').innerHTML = content;
  },

  showSelectedFacultyData: function(){
    var sendSmsButton = "";
    console.log(model.selectedFaculty);
    if(!model.selectedFaculty.teaching_since){
      model.selectedFaculty.teaching_since = "Not Added";
    }
    if(!model.selectedFaculty.mobile){
      model.selectedFaculty.mobile = "Not Added";
      sendSmsButton = "<div class='row text-center' style='margin-top:5px;'><div class='col-xs-12 btn btn-primary disabled' id='sendFacultySms' style='border-radius:0px' onclick='view.showSmsModal()'>send sms</div></div>";
    } else {
      sendSmsButton = "<div class='row text-center' style='margin-top:5px;'><button type=button class='col-xs-12 btn btn-primary' id='sendFacultySms' style='border-radius:0px' onclick='view.showSmsModal()'>send sms</button></div>";
    }

    if(typeof(model.selectedFaculty.classes_today) === "object"){


          var tt_string = "<div class='row' style='background-color:rgb(239, 241, 244);'><div class='col-xs-4'>Class</div><div class='col-xs-8'>Period</div></div><div class='row text-center' style='max-height:100px;overflow-y:auto;background-color:white;padding-bottom:10px'><div class='col-xs-12'>";
          for(var props in model.selectedFaculty.classes_today){
            tt_string += "<div class='row text-center' style='margin-top:8px;height:'><div class='col-xs-3 col-xs-offset-1' style='background-color:rgba(160,160,160,.3);border-radius:3px;padding-left:2px;padding-right:2px'>" + props + "th</div><div class='col-xs-6 col-xs-offset-1' style='background-color:rgba(160,160,160,.3);border-radius:3px'>" + model.selectedFaculty.classes_today[props] + "</div></div>";
          }

          tt_string += "</div></div>";
          var timetable = "<div class='row text-center' style='background-color:rgb(25, 127, 216);margin-top:5px;border: solid 1px rgba(160,160,160,.6);box-shadow:2px 2px 5px rgba(160,160,160,.4);border-radius:3px'><div class='col-xs-12'><div class='row'><div class='col-xs-12' style='border-bottom:solid 1px rgba(160,160,160,.8);color:white'><h4>Todays Time Table</h4></div></div><div class='row' style='background-color:background-color:white;'><div class='col-xs-12' style='background-color:white;padding-top:5px;padding-bottom:5px;color:rgba(0,5,2,1)'>" + model.days[0] + "day</div></div>" + tt_string + "</div></div>";
    } else {
          var timetable = "<div class='row text-center' style='margin-top:5px;border: solid 1px rgba(160,160,160,.6);box-shadow:2px 2px 5px rgba(160,160,160,.4);'><div class='col-xs-12'><div class='row'><div class='col-xs-12' style='background-color:rgb(26, 99, 216);border-bottom:solid 1px rgba(160,160,160,.8);color:white'><h4>Todays Time Table</h4></div></div><div class='row'><div class='col-xs-12' style=padding-top:5px;padding-bottom:5px;color:rgb(50,50,50)>" + model.days[0] + "day</div></div><div class='row' style='background-color:white'><div class='col-xs-12' style='margin-top:10px;margin-bottom:15px;color:rgba(70,70,70,1)'>Time Table not set</div></div></div></div>";
    }

    var facultyInfo = "<div class='col-sm-2 col-sm-offset-1' style='margin-left:50px'><div class='row' style='background-color:white;border: solid 1px rgba(160,160,160,.6);box-shadow:2px 2px 5px rgba(160,160,160,.4)'><div class='col-xs-12 text-center' style='padding-top:15px;padding-bottom:15px;border-bottom:solid 1px #d0d5e0;background-color:rgb(32, 46, 81);'><img src='img/flat-face-icon-23.png' width=60%></div><div class='row text-center'><div class='col-xs-12' style='margin-top:10px'><div style='border-bottom:solid 1px rgba(160,160,160,.8)'><div class='row' style='padding-top:3px;padding-bottom:3px;'><div class='text-left col-xs-3 col-xs-offset-1'><b>Name</b></div></div><div class='row' style='padding-top:3px;padding-bottom:3px;'><div class='text-left col-xs-11 col-xs-offset-1'>" + model.selectedFaculty.name + "</div></div></div><div class='row' style='padding-top:3px;padding-bottom:3px;'><div class='text-left col-xs-3 col-xs-offset-1'><b>username</b></div></div><div style='border-bottom:solid 1px rgba(160,160,160,.8)'><div class='row' style='padding-top:3px;padding-bottom:3px;'><div class='text-left col-xs-11 col-xs-offset-1'>" + model.selectedFaculty._id + "</div></div></div><div class='row' style='padding-top:3px;padding-bottom:3px;'><div class='text-left col-xs-3 col-xs-offset-1'><b>Mobile</b></div></div><div style='border-bottom:solid 1px rgba(160,160,160,.8)'><div class='row' style='padding-top:3px;padding-bottom:3px;'><div class='text-left col-xs-11 col-xs-offset-1'>" + model.selectedFaculty.mobile + "</div></div></div></div></div></div>" + sendSmsButton + timetable + "</div>";

    var clsInf = "";
    if(model.selectedFaculty.current_classes && model.selectedFaculty.current_classes.length>0){
      model.selectedFaculty.current_classes.forEach(function(x,i){
        if(x.classes_held.length != 0){
          clsInf += "<div class='col-xs-12 card' style='border-radius:3px;margin-bottom: 10px;margin-right: 10px;background-color:rgba(255,255,255,.7);border:solid 1px rgba(160,160,160,.8);box-shadow:2px 2px 5px rgba(160,160,160,.4);cursor:pointer' onclick='controller.getBatchData(event,0)'><canvas id='" + x._id + "'></canvas><div class='col-xs-12' style='font-size:12px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.2);font-weight:bold;'><span style='font-size:14px'>" + x.class + "</span>th Class</div></div>";
        } else {
          clsInf += "<div class='col-xs-12 card' style='border-radius:3px;margin-bottom: 10px;margin-right: 10px;background-color:rgba(255,255,255,.7);border:solid 1px rgba(160,160,160,.8);box-shadow:2px 2px 5px rgba(160,160,160,.4);cursor:pointer' onclick='controller.getBatchData(event,0)'><canvas id='" + x._id + "'></canvas><div class='row'><div class='col-xs-12' style='font-size:12px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.2);font-weight:bold;'><span style='font-size:14px'>" + x.class + "</span>th Class</div></div></div>";
        }
      })
    } else {
      clsInf = "<div class='col-xs-12' style='margin-top:10px;background-color:white;border:solid 1px rgba(160,160,160,.8);box-shadow:2px 2px 5px rgba(160,160,160,.4);border-radius:3px;font-weight:bold;color:rgb(90,90,90);padding-top:10px;padding-bottom:10px'>No class alloted</div>";
    }

    var otherInfo = "<div class='text-center col-sm-2' id='classesYahaDikha'><div class='row' style='padding-right:15px;padding-left:15px;'><div class='col-xs-12' style='background-color:white;border-radius:2px;padding-top:10px;padding-bottom:10px;font-size:14px;font-weight:bold;border:solid 1px rgba(160,160,160,.8);box-shadow:2px 2px 5px rgba(160,160,160,.4);background-color:rgb(66, 134, 244)'>classes appointed</div></div><div class='row' style='max-height:500px;overflow-y:auto;padding-right:15px;padding-left:15px;margin-top:15px;'>" + clsInf + "</div></div>";

    var central = "<div class='col-sm-6 col-sm-offset-1 text-center'><div class='row'><div class='col-xs-12' style='background-color:rgba(160,160,160,.4);border-radius:3px;height:250px;padding-top:110px'>Nothing to Show now</div></div></div>";

    var header_options = "<div class='row' style='margin-top:15px;margin-bottom:25px'><div class='col-xs-10 col-xs-offset-1 text-center' style='background-color:white;border-radius:3px;padding-top:10px;padding-bottom:10px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8);color:rgb(110,110,110);font-weight:bold;cursor:pointer'><div class='row'><div class='col-xs-4' style='border-right:solid 1px rgb(160,160,160)' onclick='view.assignNewBatch(0)'>Assign New Batch</div><div class='col-xs-4' style='border-right:solid 1px rgb(160,160,160)' onclick='view.showSmsModal()'>Message Faculty</div><div class='col-xs-4 text-danger' onclick='view.removeFaculty()'>Delete</div></div></div></div>";

    var content = header_options + "<div class='row'>" + otherInfo + central + facultyInfo + "</div></div>"
    document.getElementById("report_section").innerHTML = content;

    graph.current_classes_box();
    graph.numberOfAbsents();

  },

  renderBatchData: function(response,id){
    var e;
    model.selectedFaculty.current_classes.forEach(function(x,n){
      if(x._id === id){
        model.selectedBatch = x;
        e = n;
      }
    })
    model.e = e;
    model.id = id;
    var std = "";
    console.log(model);
    model.studentAttendanceData = response;
    var ch = 1;
    model.studentAttendanceData.forEach(function(student,i){
      var count = 0;
      var classesHeld = model.selectedFaculty.current_classes[e].classes_held.length;
      if(classesHeld === 0){
        classesHeld = 1;
      }
      if(student[model.selectedFaculty.current_classes[e].subject] === undefined){
         student[model.selectedFaculty.current_classes[e].subject] = {};
       }

       if(student[model.selectedFaculty.current_classes[e].subject].attendance === undefined){
         student[model.selectedFaculty.current_classes[e].subject].attendance = [];
       }

       if(model.selectedBatch.classes_held.length > 1){
         ch = model.selectedBatch.classes_held.length;
       }

       if(student[model.selectedFaculty.current_classes[e].subject].absent){
         var t = student[model.selectedFaculty.current_classes[e].subject].absent.length;
       } else {
         t=0;
       }
       count = ch - t;
       std += "<tr class='row text-center c'><td class='col-xs-4' style='font-size:12px;font-family:notosans'>" + student.name + "</td><td class='col-xs-4'>" + count + "</td><td>" + Math.ceil(count/ch*100) + "</td></tr>";
    });

    var x = "<div class='col-xs-12 modal3' id='modalReport's style='background-color:rgba(255,255,255,1);'><div class='row' sid='reportModal' style='margin-top:25px;margin-bottom:25px'><div class='col-sm-2' style='border-right:solid 1px rgba(160,160,160,.7)'><div class='row text-center' style='margin-bottom:10px'><div class='col-xs-12'><div class='btn btn-default' id='attendance_button' style='background-color:lightgrey'>Attendance</div></div></div></div><div class='col-sm-10'>" + "<div class='row' style='margin-bottom:25px'><div class='col-sm-8 col-sm-offset-2' style='background-color:white;color:black;border-radius:5px;box-shadow:2px 2px 5px rgba(160,160,160,.4);border-left:solid 1px rgba(160,160,160,.5)'>" + "<div class='row' style='padding-top:10px;padding-bottom:10px;background-color:rgba(14, 23, 35,.9);color:white;border-radius:5px 5px 0px 0px'>" +"<div class='col-xs-6' style='font-size:24px'>" + model.selectedBatch.subject + "</div><div class='col-xs-2' style='font-size:14px;color:rgba(220,220,220,.8)'>" + ch + "<br><span style='font-size:10px;color:rgba(40,40,40,.7);color:green'>taken</span></div></div><div class='row' style='padding-top:10px;padding-bottom:10px;background-color:rgba(14, 23, 35,.9);color:white'><div class='col-xs-4'>Name</div><div class='col-xs-4'>Classes Taken</div><div class='col-xs-4'>Percentage</div></div><div class='row' style='height:250px;overflow-y:auto;'><table class='col-xs-12 table-condensed table-striped'>" + std + "</table></div></div></div><div class='row'><div class='col-xs-4 col-xs-offset-2'><canvas width=400 height=400 id='7DayChart'></canvas></div></div></div></div></div>";
    document.getElementsByTagName("body")[0].innerHTML += x;
    document.getElementById('modalReport').style.display = "block";
    graph.batchPastWeekData();
  },

  showScores: function(){
    var e = model.e;
    var id = model.id;
    model.selectedFaculty.current_classes.forEach(function(x,n){
      if(x._id === id){
        model.selectedBatch = x;
        e = n;
      }
    })
    var ch;
    var std;
    model.studentAttendanceData.forEach(function(student,i){
      if(student[model.selectedFaculty.current_classes[e].subject] && typeof student[model.selectedFaculty.current_classes[e].subject].scores == "object"){

          t = student[model.selectedFaculty.current_classes[e].subject].scores[0].score;
          ch = student[model.selectedFaculty.current_classes[e].subject].scores[0].max_score;
      }

       std += "<tr class='row text-center c'><td class='col-xs-4' style='font-size:12px;font-family:notosans'>" + student.name + "</td><td class='col-xs-4'>" + t + "</td><td>" + Math.ceil(t/ch*100) + "</td></tr>";
    });

    var x = "<div class='col-xs-12 modal3' id='modalReport's style='background-color:rgba(255,255,255,1);'><div class='row' sid='reportModal' style='margin-top:25px;margin-bottom:25px'><div class='col-sm-2' style='border-right:solid 1px rgba(160,160,160,.7)'><div class='row text-center' style='margin-bottom:10px'><div class='col-xs-12'><div class='btn btn-default' id='attendance_button' style='background-color:lightgrey'>Attendance</div></div></div><div class='row text-center'><div class='col-xs-12'><div class='btn btn-default' id='test_score_button' onclick='view.showScores()'>Test Score</div></div></div></div><div class='col-sm-10'>" + "<div class='row' style='margin-bottom:25px'><div class='col-sm-8 col-sm-offset-2' style='background-color:white;color:black;border-radius:5px;box-shadow:2px 2px 5px rgba(160,160,160,.4);border-left:solid 1px rgba(160,160,160,.5)'>" + "<div class='row' style='padding-top:10px;padding-bottom:10px;background-color:rgba(14, 23, 35,.9);color:white;border-radius:5px 5px 0px 0px'>" +"<div class='col-xs-6' style='font-size:24px'>" + model.selectedBatch.subject + "</div><div class='col-xs-2' style='font-size:14px;color:rgba(220,220,220,.8)'>" + ch + "<br><span style='font-size:10px;color:rgba(40,40,40,.7);color:green'>taken</span></div></div><div class='row' style='padding-top:10px;padding-bottom:10px;background-color:rgba(14, 23, 35,.9);color:white'><div class='col-xs-4'>Name</div><div class='col-xs-4'>Classes Taken</div><div class='col-xs-4'>Percentage</div></div><div class='row' style='height:250px;overflow-y:auto;'><table class='col-xs-12 table-condensed table-striped'>" + std + "</table></div></div></div><div class='row'><div class='col-xs-4 col-xs-offset-2'><canvas width=400 height=400 id='7DayChart'></canvas></div></div></div></div></div>";
    document.getElementsByTagName("body")[0].innerHTML += x;
    document.getElementById('modalReport').style.display = "block";
    graph.batchPastWeekData();
  },

  showCustomReport: function(){
    console.log(model.reportData)
    document.getElementById('batchData').style.display = "none";
    var reportData = model.studentAttendanceData;
    var cuttoff = document.getElementById('cuttoff').value;
    var selectedYear = document.getElementById('selectedYear').value;
    var selectedMonth = document.getElementById('selectedMonth').value;
    var selectedDate = document.getElementById('selectedDate').value;
    var completeDate = (model.months.indexOf(selectedMonth) + 1) + "/" + selectedDate + "/" + selectedYear;
    var dateSelected = Date.parse(completeDate);
    console.log(dateSelected);
    var afterDateData = {};
    ch = 1;
    if(cuttoff === undefined || cuttoff === ""){
      cuttoff = 75;
    }

    var classesHeldDates = [];
    model.selectedBatch.classes_held.forEach(function(x,i){
      if(x >= dateSelected){
        classesHeldDates.push(x);
      }
    })
    console.log(classesHeldDates);
    if(classesHeldDates.length > ch){
      ch = classesHeldDates.length;
    }

    console.log(cuttoff);
    var x = "<table class='table-responsive table-striped' class='col-xs-12'><tr class='row' style='font-size:18px;'><th class='col-xs-6 text-center'>Name</th><th class='col-xs-3 text-center'>Attendance</th><th class='col-xs-3 text-center'>Percentage</th></tr>";
    reportData.forEach(function(student,i){
      if(student[model.selectedBatch.subject] === undefined){
         student[model.selectedBatch.subject] = {};
       }

       if(student[model.selectedBatch.subject].attendance === undefined){
          student[model.selectedBatch.subject].attendance = [];
        }
        var presentDates = [];
        student[model.selectedBatch.subject].attendance.forEach(function(z,i){
          if(z >= dateSelected){
            presentDates.push(z);
          }
        })

        console.log(presentDates);
        var count = presentDates.length;

        if( (count/ch)*100 >= cuttoff ){
          x += "<tr style='font-family:notosans;' class='row'><td class='col-xs-4 text-left'><div class='btn btn-success' style='margin-top: 5px;margin-bottom: 5px;'>" + student.name + "</div></td><td class='col-xs-4 text-center'>" + count + "</td><td class='col-xs-4 text-center'>" + (count/ch)*100 + "</td></tr>";
        }
    })
    x += "</table></div><div style='padding-top:5px;padding-bottom:5px;border-bottom: 3px solid lightgrey;' class='col-xs-12 text-right'><div style='margin-right:10px' class='btn btn-default disabled' onclick='controller.downloadAttendanceReport()'>Download Attendance Report</div><div class='btn btn-default disabled'>Download Scoresheet</div></div>";
    document.getElementById("reportSection").innerHTML = x;
  },

  showStudentData: function(e){
    console.log(model.studentAttendanceData[e]);
    var content="<div class='col-xs-10 col-xs-offset-1'><div class='row'>";
    for(var month in model.studentAttendanceData[e][model.selectedFaculty.current_classes[0].subject]){
      content += "<div class='btn btn-warning'>" + month +"</div></div></div>";
    }
    content = content.replace("\n","");
    document.getElementById("studentData").innerHTML = content ;
  },

  showAddFacultyModal: function(){

    var x = "";
    model.facultyFormFields.forEach(function(field){
      x += "<div class='col-sm-12' style='margin-top:15px'><div class='row'><b><div class='col-sm-12' style='color:rgb(90,90,90)'>" + field + " <span class='showRequiredError glyphicon glyphicon-asterisk' style='color:grey;font-size:12px;font-weight:none;'></span></div></b></div><div class='row'><div class='col-sm-12'><input name='" + field + "' type='text' id='" + field +"' class='required'></div></div></div>"

    })
    document.getElementById("switch").innerHTML += "<div id='addFacultyModal' class='text-center modal col-sm-12'><div class='row'><div class='col-sm-8 col-sm-offset-2 modalContent'><div class='row modelHeader'><div class='col-sm-12' style='border-bottom: solid 1px rgba(160,160,160,.6);padding-top:10px;padding-bottom:10px'><h2>Add New Faculty</h2></div></div><div class='row modalBody'><div class='col-sm-12'><div class='row facultyAddForm' style='margin-top:15px'>" + x +"</div></div></div><div class='row text-center' style='margin-top:12px;'><div class='col-xs-5'><hr></div><div class='col-xs-2' style='font-size:24px;'>or</div><div class='col-xs-5'><hr></div></div><div class='row'><h3 class='col-xs-12' style='margin-bottom:24px'>To add more than one Faculty</h3>" +
    "<div class='col-xs-5 col-xs-offset-1'><img class='img-responsive' src='img/addFacultySample.jpg'></div><div class='col-xs-4 col-xs-offset-1 text-justify'>upload .txt file containing data of each faculty in this format, where each faculty data should begin with new row<br><code>Name,Mobile Number</code></div></div><div class='row'></div><div class='row' style='margin-top:24px;'><div class='col-xs-2 col-xs-offset-4'><input type='file'></div></div><div class='row text-center' style='margin-top:8px'><button type=button class='btn btn-danger disabled' onclick='view.close()'>Send</button></div></div><div class='col-xs-1 close' style='font-size:48px;font-weight:bold;cursor:pointer;' onclick='view.closeAddFacultyModal(1)'>&times;</div></div><div class='row'><div class='col-sm-2 col-sm-offset-5' style='margin-top: 25px;'><button type='submit' class='btn btn-danger' onclick='controller.checkAll(0)'>submit</button></div></div></div>";

    document.getElementById("addFacultyModal").style.display = "block" ;
  },

  showDeassignModal: function(){
    document.getElementById("deassignbatchModal").style.display = "block" ;
  },

  showAddBatchModal: function(){
    var stri = "<select id='class'><option value='KG-1'>KG-1</option><option value='KG-2'>KG-2</option>";
    for(var i=1;i<13;i++){
      stri += "<option value='" + i.toString() + "'>" + i + "</option>";
    }
    stri += "</select>";
    document.getElementById("switch").innerHTML += "<div id='addBatchModal' class='text-center modal col-sm-12'><div class='row'><div class='col-sm-8 col-sm-offset-2 modalContent'><div class='row modelHeader'><div class='col-sm-12'><h2>Create New Class</h2></div></div><hr><div class='row'><div class='col-xs-5 col-xs-offset-1'><img class='img-responsive' src='img/addBatchSample.JPG'></div><div class='col-xs-4 col-xs-offset-1'>upload .txt file containing data of each student of the Batch in the format given below <b>(Sample picture on the left)</b>,<br><br><code>Roll Number,Name,Mobile</code><br><br>where each student data should begin with new row.</div></div><br>" +
    "<div class='row' style='margin-top:24px;'><div class='col-xs-12'><b>batch</b>: <input id='year' class='required' type='text' maxlength='4' size='4'> <span class='showRequiredError glyphicon glyphicon-asterisk' style='color:grey;font-size:12px'></span><br>(batch should be ending year for the batch. ex: if batch ending in year 2014, then '2014')</div><div class='col-xs-12' style='margin-top:10px;'><b>class</b>: " + stri + "</div><div class='col-xs-12' style='margin-top:10px;'><b>Section</b>: <input id='section' class='required' type='text' maxlength='4' size='4'> <span class='showRequiredError glyphicon glyphicon-asterisk' style='color:grey;font-size:12px'></span></div><div class='col-xs-4 col-xs-offset-5' style='margin-top:10px;'><input class='required' type='file' style='border-bottom:none;margin-top:10px;' accept='text/plain' name='student_list' id='student_list'></div><br></div></div><div class='col-xs-1 close' style='font-size:40px;font-weight:bold;cursor:pointer;padding:0px;' onclick='view.closeAddBatchModal()'>&times;</div></div><div class='row'><div type=button style='margin-top:25px;' class='col-xs-2 col-xs-offset-5'><button class=' btn btn-danger' onclick='controller.checkAll(1)'>Send</button></div></div></div>";
    document.getElementById("addBatchModal").style.display = "block" ;
  },

  showFilterModal: function(){
    var classes_held = {};
    model.selectedBatch.classes_held.forEach(function(d,i){
      var x = new Date(d);
      console.log(x);
      classes_held[model.months[x.getMonth()]] = [];
      classes_held[model.months[x.getMonth()]].push(x.getDate());
      classes_held.year = [];
      classes_held.year.push(x.getFullYear()) ;
    })
    var yearList = "";
    var monthList = "";
    var dateList = "";
    for(var name in classes_held){
      if(name != "year"){
        monthList += "<option id='" + name + "'>" + name + "</option>"
        classes_held[name].forEach(function(dt,i){
          dateList += "<option id='" + dt + "'>" + dt + "</option>";
        })
      } else {
        classes_held[name].forEach(function(yr){
          yearList += "<option id='" + yr + "'>" + yr + "</option>";
        })
      }
    }

    document.getElementById('modalContent').innerHTML = "<div class='row'><div class='col-xs-12 text-right' style='font-size:24px'><div onclick='view.close()' style='cursor:pointer;'>&times;</div></div></div><div class='row'><div class='col-xs-12'><h3>Filter Report-</h3></div></div><hr><div class='row'><div class='col-xs-12'>Cutt-off percentage: <input type='text' maxlength='2' id='cuttoff'></div></div><div class='row' style='margin-top: 10px;'><div class='col-xs-12'>Show from <select id='selectedYear'>" + yearList + "</select> <select id='selectedMonth'>" + monthList + "</select> <select id='selectedDate'>" + dateList + "</select></div></div><div class='row' style='margin-top:10px;margin-bottom:10px'><div class='col-xs-12 text-center'><div class='btn btn-danger' onclick='view.showCustomReport()'>Filter</div></div></div>";
    document.getElementById('batchData').style.display = 'block';
  },

  batchDataPanel: function(e){
    model.selectedBatch._id = e.target.id;
    console.log(model.selectedBatch);
    var content = "<div class='row' style='padding-top:5px;padding-bottom:5px;border-bottom: 1px solid lightgrey'><div class='col-xs-11'></div><div class='col-xs-1'><img style='cursor:pointer' width=25 src='img/delete.png' onclick='controller.deleteBatch()'></div></div>"
    document.getElementById("report_section").innerHTML = content;
  },

  assignNewBatch: function(){

    var z = [];
      model.selectedFaculty.current_classes.forEach(function(y){
        z.push(y.class);
      })

      var content = "<select>";
      model.info.batches.forEach(function(x){
        if(z.indexOf(x.class) <0 ){
          content += "<option id='#" + x.class + "'>" + x.class + "</option>";
        }
      })
      content += "</select>";

          document.getElementsByTagName("body")[0].innerHTML += "<div id='assignFacultyNewBatchModal' class='text-center modal col-sm-12' style='padding-top:100px'><div class='row'><div class='col-sm-4 col-sm-offset-4 modalContent'><div class='row modelHeader' style='border-bottom: solid 1px rgba(160,160,160,.6)'><div class='col-sm-12'><h2>assign new batch</h2></div></div><div class='row'><div class='col-xs-12' style='margin-top:30px;'><b>Class</b> " + content + "</div><div class='col-xs-12' style='margin-top:30px;'><b>Subject </b> <input id='assignedSubject' id='class' type='text'></div><br></div></div><div class='col-xs-1 close' style='font-size:40px;font-weight:bold;cursor:pointer;padding:0px;' onclick='view.closeAssignNewBatchModal(0)'>&times;</div></div><div class='row'><div style='margin-top:15px;' class='col-xs-2 col-xs-offset-5'><button class='btn btn-danger' onclick='controller.assignFacultyNewBatch(0)'>ADD</button></div></div></div>";
    document.getElementById("assignFacultyNewBatchModal").style.display = "block" ;
  },

  closeFacultyList: function(){
    document.getElementById("faculty_list").style.display = "none" ;
  },

  closeBatchList: function(){
    document.getElementById("batch_list").style.display = "none" ;
  },

  closeAddBatchModal: function(){
    document.getElementById("addBatchModal").style.display = "none" ;
    document.getElementById("addBatchModal").parentNode.removeChild(document.getElementById("addBatchModal"));
    controller.sectionData();
  },

  closeAssignNewBatchModal: function(n){
    if(n===0){
      document.getElementById("assignFacultyNewBatchModal").style.display = "none" ;
      document.getElementById("assignFacultyNewBatchModal").parentNode.removeChild(document.getElementById("assignFacultyNewBatchModal"));
      view.showSelectedFacultyData();
    } else {
      document.getElementById("assignClassNewSubjectModal").style.display = "none" ;
      document.getElementById("assignClassNewSubjectModal").parentNode.removeChild(document.getElementById("assignClassNewSubjectModal"));
      controller.getBatchData(1);
    }
  },

  closeFacultySettingModal: function(){
    document.getElementById('facultySettingModal').style.display = "none";
  },

  closeDeassignBatchModal: function(){
    document.getElementById('deassignbatchModal').style.display = "none";
  },

  closeBatchData: function(){
    document.getElementById('batchData').style.display = "none";
  },

  closeAddFacultyModal: function(n){
    document.getElementById('addFacultyModal').style.display = "none";
    document.getElementById("addFacultyModal").parentNode.removeChild(document.getElementById("addFacultyModal"));
    if(n===1){
      controller.sectionData();
    }
  },

  closeMessageClassModal: function(){
    document.getElementById('messageClassModal').style.display = "none";
    document.getElementById("messageClassModal").parentNode.removeChild(document.getElementById("messageClassModal"));
    controller.getBatchData(1);
  },

  closeMessageFacultiesModal: function(){
    document.getElementById('messageFacultiesModal').style.display = "none";
    document.getElementById("messageFacultiesModal").parentNode.removeChild(document.getElementById("messageFacultiesModal"));
    controller.sectionData();
  },

  closeSendFacultySmsModal: function(){
    document.getElementById('smsFacultyModal').style.display = "none";
    document.getElementById("smsFacultyModal").parentNode.removeChild(document.getElementById("smsFacultyModal"));
    view.showSelectedFacultyData();
  },

  showSmsModal: function(){
    if(model.selectedFaculty.mobile && model.selectedFaculty.mobile != "Not Added" ){
      document.getElementById("switch").innerHTML += "<div id='smsFacultyModal' class='text-center modal col-sm-12'><div class='row'><div class='col-sm-4 col-sm-offset-4 modalContent'><div class='row modelHeader'><div class='col-xs-1 col-xs-offset-11' style='font-size:24px;font-weight:bold;cursor:pointer;padding:0px;' onclick='view.closeSendFacultySmsModal()'>&times;</div><div class='col-sm-12'><h2>Write Message</h2></div></div><hr><div class='row'><div class='col-xs-12' style='margin-top:10px;'><textarea id='sms-text' maxlength=160 rows=6 id='class' type='text'></textarea></div><br></div></div><div class='row'><div class='col-xs-2 col-xs-offset-5'><button type=button style='margin-top:15px;' class='btn btn-danger' onclick='controller.sendFacultySms()'>Send</button></div></div></div>";

    } else {
      document.getElementById("switch").innerHTML += "<div id='smsFacultyModal' class='text-center modal col-sm-12'><div class='row'><div class='col-sm-6 col-sm-offset-3 modalContent'><div class='row modelHeader'><div class='col-xs-1 col-xs-offset-11' style='font-size:24px;font-weight:bold;cursor:pointer;padding:0px;' onclick='view.closeSendFacultySmsModal()'>&times;</div><div class='col-sm-12 text-danger'><h2>Mobile Number not available</h2></div></div><hr><div class='row'><div class='col-xs-12' style='margin-top:10px;'>This Faculty has not yet added the Mobile Number</div></div></div></div>";
    }
    var content = "<select id='selectBatch'>";
    var z = [];
    model.selectedFaculty.current_classes.forEach(function(y){
      z.push(y.batch);
    })
    model.info.batches.forEach(function(x){
      if(z.indexOf(x.batch) <0 ){
        content += "<option id='#" + x.class + "'>" + x.class + "</option>";
      }
    })
    content += "</select>";
    document.getElementById("smsFacultyModal").style.display = "block" ;
  },

  showClassData: function(){
    var left;
    var clsnm;
    var th;
    if(model.selectedBatch.class>3){
      th = "<span style='font-size:24px;color:rgb(80,80,80)'>th</span>";
    } else if(model.selectedBatch.class == "KG-1" || model.selectedBatch.class == "KG-2"){
      th = "";
    } else {
      switch(model.selectedBatch.class){
        case "1": th = "<span style='font-size:24px;color:rgb(80,80,80)'>st</span>"; break;
        case "2": th = "<span style='font-size:24px;color:rgb(80,80,80)'>nd</span>"; break;
        case "3": th = "<span style='font-size:24px;color:rgb(80,80,80)'>rd</span>"; break;
      }
    }
    var right = "<div class='col-xs-2' style='position:fixed;right:45px;margin-top:50px;'><div class='row'><div class='col-xs-12'><div class='row' style='background-color:white;border-radius:3px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8)'><div class='col-xs-12' style='border-bottom:solid 1px rgb(160,160,160);color:rgb(110,110,110)'><h4>Class</h4></div><div class='col-xs-12 text-primary' style='font-size:300%;'>" + model.selectedBatch.class + th + "</div></div><div class='row' style='background-color:white;border-radius:3px;margin-top:15px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8)'><div class='col-xs-12' style='border-bottom:solid 1px rgb(160,160,160);color:rgb(110,110,110)'><h4>Strength</h4></div><div class='col-xs-12' style='font-size:48px;color:rgb(66, 206, 244)'>" + model.selectedBatch.students.length + "</div></div></div></div></div>";
    console.log(model);
      if(model.selectedBatch.current_faculties.length != 0){
        var subjects = "<div class='row' style='margin-top:25px'><div class='col-xs-11 col-xs-offset-1'><div class='row'>";
        var sn=0;
        model.selectedBatch.current_faculties.forEach(function(x,i){
          if(i===0){
            console.log(x);
            model.SF = {};
            model.SF._id = x[Object.keys(x)[0]];
            subjects += "<div id='" + x[Object.keys(x)[0]] + "' class='col-xs-1 tabs' style='background-color:rgb(203, 208, 216)' onclick='controller.selectThisFaculty(event)'>" + Object.keys(x)[0] + "</div>";
          } else {
            subjects += "<div id='" + x[Object.keys(x)[0]] + "' class='col-xs-1 tabs' onclick='controller.selectThisFaculty(event)' style='background-color:white'>" + Object.keys(x)[0] + "</div>";
          }

        })

         subjects += "</div></div></div>";

         left = "<div class='col-xs-9' style='height:500px;overflow-y:auto;padding-right:75px;margin-top:25px;'><div class='row'><div class='col-xs-10 col-xs-offset-2' style='margin-top:25px'><canvas id='pastSevenDays'></canvas></div></div><div class='row' id='classStudentData' style='margin-top:35px'></div></div>";
      } else {
        left = "<div class='col-xs-9' style='margin-top:150px;'><div class='row'><div class='col-xs-6 col-xs-offset-3' style='background-color:white;border-radius:3px;box-shadow:1px 2px 5px rgba(160,160,160,.8);border:solid 1px rgba(160,160,160,.8)'><div class='row'><div class='col-xs-12'><h3 class='text-danger'>No Subject Added</h3></div></div><div class='row'><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;color:rgb(0,0,0,.6);cursor:pointer' onclick='view.assignNewSubject()'><u>Assign New Subject</u></div></div></div></div></div>";
        subjects = ""
      }

    var header_options = "<div class='col-xs-8 text-center' style='position:fixed;top:15px;right:120px;z-index:1;background-color:white;border-radius:3px;padding-top:10px;padding-bottom:10px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8);cursor:pointer;font-weight:bold;color:rgb(110,110,110)'><div class='row'><div class='col-xs-3' style='border-right:solid 1px rgb(160,160,160)' onclick='view.assignNewSubject()'>New Subject</div><div class='col-xs-3' style='border-right:solid 1px rgb(160,160,160)' onclick='view.messageWholeClassModal()'>Message Whole Class</div><div class='col-xs-3' style='border-right:solid 1px rgb(160,160,160)'>Message Selected</div><div class='col-xs-3'>Settings</div></div></div><div class='glyphicon glyphicon-arrow-left' style='position:fixed;right:20px;top:15px;padding:10px;background-color:white;border-radius:3px;border:solid 1px rgba(160,160,160,.8);box-shadow:1px 2px 5px rgba(160,160,160,.8);font-size:20px;color:rgb(70,70,70);cursor:pointer' onclick='view.showClasses()'></div>";

    var content = "<div class='col-xs-12 text-center' style='margin-bottom:15px'>" + "<div class='row' style='margin-bottom:15px'>" + header_options + "</div>" + "<div class='row'><div class='col-xs-12' style='margin-top:45px'>" + subjects + "</div></div><div class='row'><div style='overflow:none'>" + left + "</div>" + right + "</div></div>";

    document.getElementById('report_section').innerHTML = content;
    controller.selectThisFaculty(1);
  },

  assignNewSubject: function(){
    var faculties = "";
    var cr_f = [];
    if(model.selectedBatch.current_faculties){
      model.selectedBatch.current_faculties.forEach(function(x,i){
        cr_f.push(x[Object.keys(x)[0]]);
      })
    }
    console.log(cr_f);
    model.info.faculties.forEach(function(x,i){
      if(cr_f.indexOf(x.id)<0){
        faculties += "<option value='" + x.id + "'>" + x.name + "</option>";
      }
    })
    if(document.getElementById('assignClassNewSubjectModal')){
      var elm = document.getElementById('assignClassNewSubjectModal');
      elm.parentNode.removeChild(elm);
    }
    document.getElementsByTagName("body")[0].innerHTML += "<div id='assignClassNewSubjectModal' class='text-center modal col-sm-12'><div class='row'><div class='col-sm-4 col-sm-offset-4 modalContent'><div class='row modelHeader'><div class='col-xs-1 col-xs-offset-11' style='font-size:24px;font-weight:bold;cursor:pointer;padding:0px;' onclick='view.closeAssignNewBatchModal(1)'>&times;</div><div class='col-sm-12'><h2>assign new batch</h2></div></div><hr><div class='row' style='padding-top:10px;padding-bottom:10px'><div class='col-xs-3 col-xs-offset-3'><b>Class</b></div><div class='col-xs-3'><select id='selectBatch'><option id='#" + model.selectedBatch.class + "'>" + model.selectedBatch.class + "</option></select></div></div><div class='row' style='padding-top:10px;padding-bottom:10px'><div class='col-xs-3 col-xs-offset-3'><b>Faculty</b></div><div class='col-xs-3'><select id='selectFaculty'>" + faculties + "</select></div></div><div class='col-xs-12' style='margin-top:10px;'><b>Subject</b>: <input id='assignedSubject' id='class' type='text' size=10></div><br></div></div><div class='row'><div class='col-xs-2 col-xs-offset-5'><button type=button style='margin-top:15px;' class='btn btn-danger' onclick='controller.assignFacultyNewBatch(1)'>ADD</button></div></div></div>";
    document.getElementById('assignClassNewSubjectModal').style.display = "block";
  },

  notifyUser: function(str,a){

    if(document.getElementById('notifyUser')){
      document.getElementById('notifyUser').parentNode.removeChild(document.getElementById('notifyUser'));
    }

    document.getElementsByTagName('body')[0].innerHTML += "<div id='notifyUser' class='notif-modal'><div class='text-center' style='position:fixed;right:50px;top:60px;'><div style='border:solid 1px rgba(110,110,110,.6);border-radius:5px;opacity:.8;border-radius:3px;padding:15px' id='notifText'></div></div></div><div id='notifyError' class='modal'><div class='text-center' style='position:fixed;right:25px;top:120px'><div style='border:solid 1px rgba(110,110,110,.6);border-radius:5px;opacity:.8;border-radius:3px;padding:15px' id='notifText2'></div></div></div>";

    if(a===0){
      document.getElementById('notifText').style.backgroundColor = "red";
      document.getElementById('notifText').innerHTML = str;
      document.getElementById('notifyUser').style.display = "block";
      setTimeout(function(){
        document.getElementById('notifyUser').style.display = "none";
      },3000);

    } else if(a===1){
      document.getElementById('notifText').style.backgroundColor = "lightgreen";
      document.getElementById('notifText').style.opacity = ".6";
      document.getElementById('notifText').innerHTML = str;
      document.getElementById('notifyUser').style.display = "block";
      setTimeout(function(){
        document.getElementById('notifyUser').style.display = "none";
      },3000);

    } else if(a===5){
      document.getElementById('notifText2').innerHTML = str;
      document.getElementById('notifyError').style.display = "block";
      setTimeout(function(){
        document.getElementById('notifyError').style.display = "none";
      },3000);
    }
  },

  messageFaculties: function(){
    model.faculties_mobiles = [];
    model.selectedMobiles = [];
    model.info.faculties.forEach(function(x,i){
      if(x.mobile){
        model.faculties_mobiles[x.id] = x.mobile;
      }
    })
    if(document.getElementById('messageFacultiesModal')){
      document.getElementById('messageFacultiesModal').parentNode.removeChild(document.getElementById('messageFacultiesModal'));
    }
    var names = "";
    model.info.faculties.forEach(function(x,i){
      if(x.mobile){
        names += "<div class='col-xs-8 col-xs-offset-2' style='color:rgb(90,90,90);padding-top:10px;padding-bottom:10px;margin-top:3px;margin-bottom:3px;background-color:lightgrey;border-bottom:solid 1px rgba(160,160,160,.5);cursor:pointer;border-radius:5px' onclick='view.selectName(event,0)' id='" + x.id + "'>" + x.name + "</div>";
      }
    })
    if(names === ""){
      names = "<div class='col-xs-12 text-center' style='margin-top:30%;color:rgb(110,110,110)'>No faculty with Mobile Number</div>";
    }
    document.getElementsByTagName('body')[0].innerHTML += "<div class='text-center col-xs-12 modal' id='messageFacultiesModal' style='animation-name:modalDrop;animation-duration:.3s'><div class='row' style='margin-top:50px'><div class='col-xs-8 col-xs-offset-2' class='name_selection' style='background-color:white;border-radius:3px;padding-top:20px;padding-bottom:20px'><div class='row'><div class='col-xs-4' style='border-right: solid 1px rgba(200,200,200,1);'><div class='row' style='padding-top:10px;padding-bottom:10px;'><div class='col-xs-8 col-xs-offset-2' style='border-bottom:solid 1px rgba(200,200,200,.6);'><div class='row'><div class='col-xs-4 text-right'><input type='checkbox' name='selectAll' value='true' onclick='view.selectAll()'></div><div class='col-xs-8 text-left' style='color:rgb(110,110,110);font-size:18px;'>Select All</div></div></div></div><div id='names_list' class='row' style='height:250px;overflow-y:auto;padding-left:10px;padding-right:10px;margin-top:15px'>" + names + "</div></div><div class='col-xs-4' style='border-right: solid 1px rgba(200,200,200,1);'><div class='row' style='padding-top:10px;padding-bottom:10px;'><div class='col-xs-8 col-xs-offset-2' style='color:rgb(110,110,110);'><div class='row'><div class='col-xs-12' style='font-size:18px;border-bottom:solid 1px rgba(200,200,200,.6);'>Selected</div></div></div></div><div class='row' style='padding-top:15px'><div class='col-xs-8 col-xs-offset-2' id='selectedNames' style='height:250px;overflow-y:auto;'></div></div></div><div class='col-xs-4'><div class='row' style='padding-top:10px;padding-bottom:10px;'><div class='col-xs-8 col-xs-offset-2' style='color:rgb(110,110,110);'><div class='row'><div class='col-xs-12' style='font-size:18px;border-bottom:solid 1px rgba(200,200,200,.6);'>Text</div></div></div></div><div class='row' style='padding-top:15px'><div class='col-xs-8 col-xs-offset-2'><textarea id='SMSfacultytext' placeholder='Enter Text Message' rows=10 cols=15 maxlength=160 style='border-radius:5px;'></textarea></div></div></div></div></div><div class='col-xs-1' style='font-size:28px;margin-left:20px;color:white;cursor:pointer' onclick='view.closemessageFacultiesModal()'><span class='glyphicon glyphicon-remove close' onclick='view.closeMessageFacultiesModal()'></span></div></div><div class='row' style='margin-top:50px'><button class='col-xs-2 col-xs-offset-5' style='background-color:rgb(30, 90, 188);padding-top:10px;padding-bottom:10px;border-radius:2px;font-size:18px;color:white;border:solid 1px rgba(90,90,90,.8);cursor:pointer;border: solid 1px rgb(239, 166, 33)' onclick='controller.sendSMStoFaculties()'>Send</button></div></div></div>";
    document.getElementById('messageFacultiesModal').style.display = "block";
  },

  messageWholeClassModal: function(){
    model.student_mobiles = {};
    model.selectedMobiles = [];
    model.selectedBatch.students.forEach(function(x,i){
      model.student_mobiles[x.enroll_number] = x.mobile;
    })
    if(document.getElementById('messageClassModal')){
      document.getElementById('messageClassModal').parentNode.removeChild(document.getElementById('messageClassModal'));
    }
    var names = "";
    model.selectedBatch.students.forEach(function(x,i){
      names += "<div class='col-xs-8 col-xs-offset-2 students' style='color:rgb(90,90,90);padding-top:10px;padding-bottom:10px;margin-top:3px;margin-bottom:3px;background-color:lightgrey;border-bottom:solid 1px rgba(160,160,160,.5);cursor:pointer;border-radius:5px' onclick='view.selectName(event,1)' id='" + x.enroll_number + "'>" + x.name + "</div>";
    })
    document.getElementsByTagName('body')[0].innerHTML += "<div class='text-center col-xs-12 modal' id='messageClassModal' style='animation-name:modalDrop;animation-duration:.3s'><div class='row' style='margin-top:50px'><div class='col-xs-8 col-xs-offset-2' class='name_selection' style='background-color:white;border-radius:3px;padding-top:20px;padding-bottom:20px'><div class='row'><div class='col-xs-4' style='border-right: solid 1px rgba(200,200,200,1);'><div class='row' style='padding-top:10px;padding-bottom:10px;'><div class='col-xs-8 col-xs-offset-2' style='border-bottom:solid 1px rgba(200,200,200,.6);'><div class='row'><div class='col-xs-4 text-right'><input type='checkbox' name='selectAll' value='true' onclick='view.selectAll()'></div><div class='col-xs-8 text-left' style='color:rgb(110,110,110);font-size:18px;'>Select All</div></div></div></div><div id='names_list' class='row' style='height:250px;overflow-y:auto;padding-left:10px;padding-right:10px;margin-top:15px'>" + names + "</div></div><div class='col-xs-4' style='border-right: solid 1px rgba(200,200,200,1);'><div class='row' style='padding-top:10px;padding-bottom:10px;'><div class='col-xs-8 col-xs-offset-2' style='color:rgb(110,110,110);'><div class='row'><div class='col-xs-12' style='font-size:18px;border-bottom:solid 1px rgba(200,200,200,.6);'>Selected</div></div></div></div><div class='row' style='padding-top:15px'><div class='col-xs-8 col-xs-offset-2' id='selectedNames' style='height:250px;overflow-y:auto;'></div></div></div><div class='col-xs-4'><div class='row' style='padding-top:10px;padding-bottom:10px;'><div class='col-xs-8 col-xs-offset-2' style='color:rgb(110,110,110);'><div class='row'><div class='col-xs-12' style='font-size:18px;border-bottom:solid 1px rgba(200,200,200,.6);'>Text</div></div></div></div><div class='row' style='padding-top:15px'><div class='col-xs-8 col-xs-offset-2'><textarea id='SMSclasstext' placeholder='Enter Text Message' rows=10 cols=15 maxlength=160 style='border-radius:5px;'></textarea></div></div></div></div></div><div class='col-xs-1' style='font-size:28px;margin-left:20px;color:white;cursor:pointer' onclick='view.closeMessageClassModal()'><span class='glyphicon glyphicon-remove close'></span></div></div><div class='row' style='margin-top:50px'><button class='col-xs-2 col-xs-offset-5' style='background-color:rgb(30, 90, 188);padding-top:10px;padding-bottom:10px;border-radius:2px;font-size:18px;color:white;border:solid 1px rgba(90,90,90,.8);cursor:pointer;border:solid 1px rgb(239, 166, 33)' onclick='controller.sendSMStoClass()'>Send</button></div></div>";
    document.getElementById('messageClassModal').style.display = "block";
  },

  selectName: function(e,n){
    if(n===1){
      if(model.selectedNames.indexOf(e.target.id)<0){
        model.selectedMobiles.push(model.student_mobiles[e.target.id]);
        model.selectedNames.push(e.target.id);
        e.target.style.backgroundColor = "rgb(83, 176, 226)";
        e.target.style.color = "white";
        document.getElementById('selectedNames').innerHTML += "<div class='col-xs-12' style='color:white;padding-top:10px;padding-bottom:10px;margin-top:3px;margin-bottom:3px;border:solid 1px rgba(160,160,160,.4);box-shadow:0px 1px 3px rgba(160,160,160,.4);cursor:pointer;background-color:rgb(83, 176, 226);border-radius:5px' id='#" + e.target.id + "'>" + e.target.innerHTML + "</div>";
      } else {
        model.selectedNames.splice(model.selectedNames.indexOf(e.target.id),1);
        model.selectedMobiles.splice(model.selectedMobiles.indexOf(model.student_mobiles[e.target.id]),1);
        e.target.style.backgroundColor = "lightgrey";
        e.target.style.color = "rgb(90,90,90)";
        document.getElementById('#' + e.target.id).parentNode.removeChild(document.getElementById('#' + e.target.id));
      }
    } else {
      if(model.selectedNames.indexOf(e.target.id)<0){
        model.selectedMobiles.push(model.faculties_mobiles[e.target.id]);
        model.selectedNames.push(e.target.id);
        e.target.style.backgroundColor = "rgb(83, 176, 226)";
        e.target.style.color = "white";
        document.getElementById('selectedNames').innerHTML += "<div class='col-xs-12' style='color:white;padding-top:10px;padding-bottom:10px;margin-top:3px;margin-bottom:3px;border:solid 1px rgba(160,160,160,.4);box-shadow:0px 1px 3px rgba(160,160,160,.4);cursor:pointer;background-color:rgb(83, 176, 226);border-radius:5px' id='#" + e.target.id + "'>" + e.target.innerHTML + "</div>";
      } else {
        model.selectedNames.splice(model.selectedNames.indexOf(e.target.id),1);
        model.selectedMobiles.splice(model.selectedMobiles.indexOf(model.faculties_mobiles[e.target.id]),1);
        e.target.style.backgroundColor = "lightgrey";
        e.target.style.color = "rgb(90,90,90)";
        document.getElementById('#' + e.target.id).parentNode.removeChild(document.getElementById('#' + e.target.id));
    }
    console.log(model.selectedMobiles);
  }
},

selectAll: function(){
  if(model.selectedMobiles.length===0){
    model.selectedBatch.students.forEach(function(x,i){
      if(x.name != null){
        model.selectedMobiles.push(x.mobile);
        model.selectedNames.push(x.enroll_number);
        document.getElementById(x.enroll_number).style.backgroundColor = "rgb(83, 176, 226)";
        document.getElementById(x.enroll_number).style.color = "white";
      }
    })
    model.selectedBatch.students.forEach(function(x,i){
      document.getElementById('selectedNames').innerHTML += "<div class='col-xs-12' style='color:white;padding-top:10px;padding-bottom:10px;margin-top:3px;margin-bottom:3px;border:solid 1px rgba(160,160,160,.4);box-shadow:0px 1px 3px rgba(160,160,160,.4);cursor:pointer;background-color:rgb(83, 176, 226);border-radius:5px' id='#" + x.enroll_number + "'>" + x.name + "</div>";
    })
  } else {
    model.selectedMobiles = [];
    document.getElementById('selectedNames').innerHTML = "";
    var els = document.getElementsByClassName('students');
    Array.prototype.forEach.call(els,function(el){
      el.style.backgroundColor = "lightgrey";
      el.style.color = "rgb(90,90,90)";
    })
  }
  console.log(model.selectedMobiles);
}

};

var model = {
  selectedFaculty: [],
  selectedBatch: {},
  months: ["january","february","march","april","may","june","july","august","september","october","november","december"],
  facultyFormFields : ["Name","Password"],
  days: ["Mon","Tue","Wed","Thu","Fri","Sat"],
  selectedNames: []
};
