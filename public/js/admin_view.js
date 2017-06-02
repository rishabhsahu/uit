var view = {
  updateView: function(){
    document.getElementById('school_name').innerHTML = model.info.name;

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

    document.getElementById("switch").innerHTML += "<div id='facultySettingModal' class='text-center modal col-sm-12'><div class='row' style='padding-top:100px;'><div class='col-sm-4 col-sm-offset-4 modalContent' style='padding:20px;font-size: 20px;'>Are you sure you want to remove this Faculty from department/college ?<br><div class='text-danger' style='font-size:16px;'>note- this removal will be permanent and you will loose all the faculty data</div></div></div><div class='row' style='padding-top:20px;'><div class='col-sm-4 col-sm-offset-4'><div class='row'><div class='col-sm-2 col-sm-offset-3 btn btn-danger' onclick='controller.deleteFaculty()'>Yes</div><div class='btn btn-success col-sm-2 col-sm-offset-2' onclick='view.closeFacultySettingModal()'>No</div></div></div></div></div>";

    document.getElementById("switch").innerHTML += "<div id='deassignbatchModal' class='text-center modal col-sm-12'><div class='row' style='padding-top:100px;'><div class='col-sm-4 col-sm-offset-4 modalContent' style='padding:20px;font-size: 20px;'>Are you sure you want to De-assign Faculty this Batch?<br><div class='text-success' style='font-size:16px;'>note- You can however Re-assign Faculty this Batch and get the data back</div></div></div><div class='row' style='padding-top:20px;'><div class='col-sm-4 col-sm-offset-4'><div class='row'><div class='col-sm-2 col-sm-offset-3 btn btn-danger' onclick='controller.deassignbatch()'>Yes</div><div class='btn btn-success col-sm-2 col-sm-offset-2' onclick='view.closeDeassignBatchModal()'>No</div></div></div></div></div>";

    //end of faculty Settings modal

    model.info.faculties.forEach(function(faculty,i){
      document.getElementsByClassName("faculty_names")[i].onclick = controller.facultySelected;
    });
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
    model.info.faculties.forEach(function(x,i){
      names += "<div class='col-xs-12 faculty_name' id='" + x.id + "' onclick='controller.facultySelected(event)'>" + x.name + "</div>";
    })
    var content = "<div class='col-sm-2 col-sm-offset-2 modal2 text-center' id='faculty_list'><div class='row'><div class='col-xs-12 faculty_name' style='font-weight:bold' onclick='view.showAddFacultyModal()'> + Add New Faculty</div>" + names + "</div></div><div class='col-sm-10' style='height:100%;' onclick='view.closeFacultyList()'></div>";
    document.getElementById('report_section').innerHTML = content;
    document.getElementById('faculty_list').style.display = "block";
  },

  showClasses: function(){
      var names = "";
      var classes = model.info.batches;
      classes.sort(function(x,i){
        return x.class-i.class;
      })

      classes.forEach(function(x,i){
        names += "<div class='col-xs-12 faculty_name' id='" + x._id + "' onclick='controller.batchSelected(event)'>" + x.class + "th</div>";
      })
      var content = "<div class='col-sm-2 col-sm-offset-2 modal2 text-center' id='batch_list'><div class='row'><div class='col-xs-12 faculty_name' style='font-weight:bold' onclick='view.showAddBatchModal()'> + Add New Batch</div>" + names + "</div></div><div class='col-sm-10' style='height:100%;' onclick='view.closeBatchList()'></div>";
      document.getElementById('report_section').innerHTML = content;
      document.getElementById('batch_list').style.display = "block";
  },

  showSelectedFacultyData: function(){
    console.log(model.selectedFaculty);
    if(!model.selectedFaculty.teaching_since){
      model.selectedFaculty.teaching_since = "Not Added";
    }
    if(!model.selectedFaculty.mobile){
      model.selectedFaculty.mobile = "Not Added";
    }
    var facultyInfo = "<div class='col-xs-3' style='margin-left:10px;background-color:white;margin-top:50px;border: solid 1px rgba(160,160,160,.6);box-shadow:2px 2px 5px rgba(160,160,160,.4)'><div class='row'><div class='col-xs-12 text-center' style='padding-top:15px;padding-bottom:15px;border-bottom:solid 1px #d0d5e0;background-color:rgb(32, 46, 81);'><img src='img/flat-face-icon-23.png' width=60%></div><div class='row text-center'><div class='col-xs-12' style='margin-top:10px'><div class='row' style='padding-top:10px;padding-bottom:10px;'><div class='text-left col-xs-3 col-xs-offset-1'><b>Name</b></div><div class='text-left col-xs-7 col-xs-offset-1'>" + model.selectedFaculty.name + "</div></div><div class='row' style='padding-top:10px;padding-bottom:10px;'><div class='text-left col-xs-3 col-xs-offset-1'><b>Username</b></div><div class='text-left col-xs-7 col-xs-offset-1'>" + model.selectedFaculty._id + "</div></div><div class='row' style='padding-top:10px;padding-bottom:10px;'><div class='text-left col-xs-3 col-xs-offset-1'><b>Mobile</b></div><div class='text-left col-xs-7 col-xs-offset-1'>" + model.selectedFaculty.mobile + "</div></div><div class='row' style='padding-top:10px;padding-bottom:10px;'><div class='text-left col-xs-3 col-xs-offset-1'><b>Teaching Since</b></div><div class='text-left col-xs-7 col-xs-offset-1'>" + model.selectedFaculty.teaching_since + "</div></div></div></div>";
    document.getElementById('faculty_list').style.display = "none";

    var clsInf = "";
    model.selectedFaculty.current_classes.forEach(function(x,i){
      if(x.classes_held.length != 0){
        clsInf += "<div class='col-xs-4' style='border-radius:3px;padding:15px;padding-bottom:0px;background-color:rgba(255,255,255,.7);border: solid 1px rgba(160,160,160,.6);box-shadow:2px 2px 5px rgba(160,160,160,.4);cursor:pointer'><div class='row'><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;'><div style='font-size:24px;color:green'>" + x.classes_held.length/x.classes_held.length*100 + "%" + "</div></div><div class='col-xs-12' style='font-size:12px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.2);font-weight:bold;'><span style='font-size:14px'>" + x.class + "</span>th Class</div><div class='col-xs-12'><div class='row' style='padding-top:10px;padding-bottom:10px'><div class='col-xs-6' style='font-weight:bold;border-right:solid 1px rgba(160,160,160,.2);'><span style='font-size:14px;color:rgba(20,20,20,.8)'>" + x.classes_held.length + "</span><br><span style='font-size:10px;color:rgba(40,40,40,.7);color:green'>taken</span></div><div class='col-xs-6' style='font-weight:bold;'><span style='font-size:14px;color:rgba(20,20,20,.8)'>0</span><br><span style='font-size:10px;color:rgba(40,40,40,.7);color:red'>dismissed</span></div></div></div></div></div>";
      } else {
        clsInf += "<div class='col-xs-4' style='border-radius:3px;padding:15px;padding-bottom:0px;background-color:rgba(255,255,255,.7);border: solid 1px rgba(160,160,160,.6);box-shadow:2px 2px 5px rgba(160,160,160,.4);cursor:pointer'><div class='row'><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;font-size:24px;color:rgba(160,160,160,.9)'>Not yet</div><div class='col-xs-12' style='font-size:12px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.2);font-weight:bold;'><span style='font-size:14px'>" + x.class + "</span>th Class</div><div class='col-xs-12'><div class='row' style='padding-top:10px;padding-bottom:10px'><div class='col-xs-6' style='font-weight:bold;border-right:solid 1px rgba(160,160,160,.2);'><span style='font-size:14px;color:rgba(20,20,20,.8)'>" + x.classes_held.length + "</span><br><span style='font-size:10px;color:rgba(40,40,40,.7);color:green'>taken</span></div><div class='col-xs-6' style='font-weight:bold;'><span style='font-size:14px;color:rgba(20,20,20,.8)'>0</span><br><span style='font-size:10px;color:rgba(40,40,40,.7);color:red'>dismissed</span></div></div></div></div></div>";
      }
    })

    var otherInfo = "<div class='text-center col-sm-7 col-xs-offset-1' style='margin-top:25px'><div class='row'>" + clsInf + "</div></div>";

    var content = "<div id='batchListSection' class='row'><div class='col-xs-11'>";
    content += "<div style='margin-left:10px' class='btn btn-warning' id='assignNewBatch' onclick='view.assignNewBatch()'>+ assign new Batch</div></div><div class='col-xs-1' style='margin-top:5px'><img style='cursor:pointer;color:red' width=25 src='img/delete.png' onclick='view.facultySettings()'></div></div><div class='row' id='reportSection'></div><div class='row' id='main'>" + facultyInfo + "</div></div>" + otherInfo + "</div>"
    document.getElementById("report_section").innerHTML = content;
  },

  renderBatchData: function(response,id){
    var e;
    model.selectedFaculty.current_classes.forEach(function(x,n){
      if(x._id === id){
        model.selectedBatch = x;
        e = n;
      }
    })
    console.log(model);
    var x = "<div class='col-xs-6'><h3 class='text-right text-danger' style='margin-top:13px'>" + model.selectedFaculty.current_classes[e].subject + "</h3></div><div class='col-xs-6 text-right'><div class='btn btn-default' onclick='view.showDeassignModal()' style='margin-top:10px;margin-bottom:10px'>De-assign Batch</div><div class='btn btn-default' onclick='view.showFilterModal()' style='margin-top:10px;margin-bottom:10px;margin-left:5px'>Filter</div></div><div id='studentDataReport' class='col-xs-12 text-center'><table class='col-xs-12 table-responsive table-striped'><tr class='row' style='font-size:18px;'><div id='historyModal' class='modal'><div class='modal-content'><span class='close' onclick='controller.modalCloses()' id='close'>&times;</span><div class='studentData row'></div></div></div><th class='col-xs-6 text-center'>Name</th><th class='col-xs-3 text-center'>Attendance</th><th class='col-xs-3 text-center'>Percentage</th></tr><div class='col-xs-12 modal' id='batchData'><div class='row'><div class='col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4 modal-content text-center' id='modalContent'></div></div></div>";
    model.studentAttendanceData = response;
    model.studentAttendanceData.forEach(function(student,i){
      var max = 1;
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
         max = model.selectedBatch.classes_held.length;
       }

       count += student[model.selectedFaculty.current_classes[e].subject].attendance.length;
       if( (count/max)*100 < 75 ){
         x += "<tr style='font-family:notosans;' class='row'><td class='col-xs-6 text-left'><div style='margin-top: 5px;margin-bottom: 5px;' class='btn btn-danger' id='" + student.enroll_number +"'>" + student.name + "</div></td><td class='col-xs-3 text-center'>" + count + "</td><td class='col-xs-3 text-center'>" + Math.ceil((count/max)*100) + "</td></tr>";
       } else {
         x += "<tr style='font-family:notosans;' class='row'><td class='col-xs-4 text-left'><div style='margin-top: 5px;margin-bottom: 5px;' class='btn btn-success' id='" + student.enroll_number +"'>" + student.name + "</div></td><td class='col-xs-4 text-center'>" + count + "</td><td class='col-xs-4 text-center'>" + (count/max)*100 + "</td></tr>";
       }
    });
    x += "</table></div><div style='padding-top:5px;padding-bottom:5px;' class='col-xs-12 text-right'><a target='_blank' href='" + "http://localhost:3000/download/attendanceOverview/" + model.selectedBatch._id + "/" + model.selectedFaculty._id + "/" + model.selectedBatch.subject + "' style='margin-right:10px' class='btn btn-default''>Download Attendance Report</a><div class='btn btn-default disabled'>Download Scoresheet</div></div>";
    document.getElementById("reportSection").innerHTML = x;
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
    max = 1;
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
    if(classesHeldDates.length > max){
      max = classesHeldDates.length;
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

        if( (count/max)*100 >= cuttoff ){
          x += "<tr style='font-family:notosans;' class='row'><td class='col-xs-4 text-left'><div class='btn btn-success' style='margin-top: 5px;margin-bottom: 5px;'>" + student.name + "</div></td><td class='col-xs-4 text-center'>" + count + "</td><td class='col-xs-4 text-center'>" + (count/max)*100 + "</td></tr>";
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
      if(field!="Username"){
        x += "<div class='col-sm-4'><div class='row'><h5 class='col-sm-12'>" + field + "</h5></div><div class='row'><div class='col-sm-12'><input name='" + field + "' type='text' id='" + field +"'></div></div></div>"
      } else {
        x += "<div class='col-sm-4'><div class='row'><h5 class='col-sm-12'>Username</h5></div><div class='row'><div class='col-sm-12'><input name='Username' type='text' id='Username'>" + "@" + model.info.college +"</div></div></div>"
      }
    })

    document.getElementById("switch").innerHTML += "<div id='addFacultyModal' class='text-center modal col-sm-12'><div class='row'><div class='col-sm-8 col-sm-offset-2 modalContent'><div class='row modelHeader'><div class='col-xs-1 col-xs-offset-11' style='font-size:24px;font-weight:bold;cursor:pointer;padding:0px;' onclick='view.closeAddFacultyModal()'>&times;</div><div class='col-sm-12'><h2>Add New Faculty</h2></div></div><hr><div class='row modalBody'><div class='col-sm-12'><div class='row facultyAddForm'>" + x +"</div><div class='col-sm-2 col-sm-offset-5' style='margin-top: 15px;'><button type='submit' class='btn btn-block btn-danger' onclick='controller.addNewFaculty()'>submit</button></div></div></div><div class='row text-center' style='margin-top:12px;'><div class='col-xs-5'><hr></div><div class='col-xs-2' style='font-size:24px;'>or</div><div class='col-xs-5'><hr></div></div><div class='row'><h3 class='col-xs-12' style='margin-bottom:24px'>To add more than one Faculty</h3>" +
    "<div class='col-xs-5 col-xs-offset-1'><img class='img-responsive' src='img/addFacultySample.jpg'></div><div class='col-xs-4 col-xs-offset-1 text-justify'>upload .txt file containing data of each faculty in this format, where each faculty data should begin with new row<br><code>Name,Gender,Mobile Number,</code></div></div><div class='row'></div><div class='row' style='margin-top:24px;'><div class='col-xs-2 col-xs-offset-4'><input type='file'></div></div><div class='row text-center' style='margin-top:8px'><div class='btn btn-danger disabled' onclick='view.close()'>Send</div></div></div></div>";

    document.getElementById("addFacultyModal").style.display = "block" ;
  },

  showDeassignModal: function(){
    document.getElementById("deassignbatchModal").style.display = "block" ;
  },

  showAddBatchModal: function(){
    document.getElementById("switch").innerHTML += "<div id='addBatchModal' class='text-center modal col-sm-12'><div class='row'><div class='col-sm-8 col-sm-offset-2 modalContent'><div class='row modelHeader'><div class='col-xs-1 col-xs-offset-11' style='font-size:24px;font-weight:bold;cursor:pointer;padding:0px;' onclick='view.closeAddBatchModal()'>&times;</div><div class='col-sm-12'><h2>Create New Batch</h2></div></div><hr><div class='row'><div class='col-xs-5 col-xs-offset-1'><img class='img-responsive' src='img/addBatchSample.JPG'></div><div class='col-xs-4 col-xs-offset-1'>upload .txt file containing data of each student of the Batch in the format given below <b>(Sample picture on the left)</b>,<br><br><code>Roll Number,Name,Mobile</code><br><br>where each student data should begin with new row.</div></div><br>" +
    "<div class='row' style='margin-top:24px;'><div class='col-xs-12'><b>batch</b>: <input id='year' type='text' maxlength='4' size='4'><br>(batch should be starting year for the batch. ex: if batch started in year 2014, then '2014')</div><div class='col-xs-12' style='margin-top:10px;'><b>class</b>: <input id='class' id='class' type='text' maxlength='2' size='2'></div><div class='col-xs-4 col-xs-offset-5' style='margin-top:10px;'><input type='file' style='margin-top:10px;' accept='text/plain' name='student_list' id='student_list'></div><br><div style='margin-top:15px;' class='col-xs-2 col-xs-offset-5 btn btn-danger' onclick='controller.addNewBatch()'>Send</div></div></div></div>";
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

    document.getElementById("switch").innerHTML += "<div id='assignFacultyNewBatchModal' class='text-center modal col-sm-12'><div class='row'><div class='col-sm-8 col-sm-offset-2 modalContent'><div class='row modelHeader'><div class='col-xs-1 col-xs-offset-11' style='font-size:24px;font-weight:bold;cursor:pointer;padding:0px;' onclick='view.closeAssignNewBatchModal()'>&times;</div><div class='col-sm-12'><h2>assign new batch</h2></div></div><hr><div class='row'><div class='col-xs-12' style='margin-top:10px;'><b>Class</b> <div id='batchList'></div></div><div class='col-xs-12' style='margin-top:10px;'><b>Subject</b>: <input id='assignedSubject' id='class' type='text'></div><br><div style='margin-top:15px;' class='col-xs-2 col-xs-offset-5 btn btn-danger' onclick='controller.assignFacultyNewBatch()'>ADD</div></div></div></div>";

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
    document.getElementById('batchList').innerHTML = content;
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
  },

  closeAssignNewBatchModal: function(){
    document.getElementById("assignFacultyNewBatchModal").style.display = "none" ;
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

  closeAddFacultyModal: function(){
    document.getElementById('addFacultyModal').style.display = "none";
  }

};

var model = {
  selectedFaculty: [],
  selectedBatch: {},
  months: ["january","february","march","april","may","june","july","august","september","october","november","december"],
  facultyFormFields : ["Name","Username","Password"]
};
