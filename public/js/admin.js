var view = {
  updateView: function(){
    var facultiesList = "";
    var batchesList = "";
    model.info.faculties.forEach(function(faculty,i){
      facultiesList += "<div class='col-xs-12 faculty_names' id='" + faculty.id + "'>" + faculty.name + "</div>";
    })
    model.info.batches.forEach(function(batches,i){
      batchesList += "<div class='col-xs-12 batches_names' id='" + batches._id + "'' onclick='view.batchDataPanel(event)'>" + batches.semester + "th Sem" + "</div>";
    })
    document.getElementById("faculty_list_box").innerHTML = facultiesList;
    document.getElementById("batch_list_box").innerHTML = batchesList;

    //Add faculty modal start here
    var x = "";
    model.facultyFormFields.forEach(function(field){
      if(field!="Username"){
        x += "<div class='col-sm-4'><div class='row'><h5 class='col-sm-12'>" + field + "</h5></div><div class='row'><div class='col-sm-12'><input name='" + field + "' type='text' id='" + field +"'></div></div></div>"
      } else {
        x += "<div class='col-sm-4'><div class='row'><h5 class='col-sm-12'>Username</h5></div><div class='row'><div class='col-sm-12'><input name='Username' type='text' id='Username'>" + "@" + model.info.college +"</div></div></div>"
      }
    })
    document.getElementById("switch").innerHTML += "<div id='addFacultyModal' class='text-center modal col-sm-12'><div class='row'><div class='col-sm-8 col-sm-offset-2 modalContent'><div class='row modelHeader'><div class='col-xs-1 col-xs-offset-11' style='font-size:24px;font-weight:bold;cursor:pointer;padding:0px;' onclick='view.close()'>&times;</div><div class='col-sm-12'><h2>Add New Faculty</h2></div></div><hr><div class='row modalBody'><div class='col-sm-12'><div class='row facultyAddForm'>" + x +"</div><div class='col-sm-4 col-sm-offset-4' style='margin-top: 15px;'><button type='submit' class='btn btn-block btn-danger' onclick='controller.addNewFaculty()'>submit</button></div></div></div><div class='row text-center' style='margin-top:12px;'><div class='col-xs-5'><hr></div><div class='col-xs-2' style='font-size:24px;'>or</div><div class='col-xs-5'><hr></div></div><div class='row'><h3 class='col-xs-12' style='margin-bottom:24px'>To add more than one Faculty</h3>" +
    "<div class='col-xs-5 col-xs-offset-1'><img class='img-responsive' src='img/addFacultySample.jpg'></div><div class='col-xs-4 col-xs-offset-1 text-justify'>upload .txt file containing data of each faculty in this format, where each facult data should begin with new row<br><code>Name,Username,Password,Batch,Subject</code></div></div><div class='row'></div><div class='row' style='margin-top:24px;'><div class='col-xs-2 col-xs-offset-4'><input type='file'></div></div><div class='row text-center' style='margin-top:8px'><div class='btn btn-danger disabled' onclick='view.close()'>Send</div></div></div></div>";

    //Add faculty modal end here

    //Add new Batch Modal starts here

    document.getElementById("switch").innerHTML += "<div id='addBatchModal' class='text-center modal col-sm-12'><div class='row'><div class='col-sm-8 col-sm-offset-2 modalContent'><div class='row modelHeader'><div class='col-xs-1 col-xs-offset-11' style='font-size:24px;font-weight:bold;cursor:pointer;padding:0px;' onclick='view.close()'>&times;</div><div class='col-sm-12'><h2>Create New Batch</h2></div></div><hr><div class='row'><div class='col-xs-5 col-xs-offset-1'><img class='img-responsive' src='img/addBatchSample.jpg'></div><div class='col-xs-4 col-xs-offset-1 text-justify'>upload .txt file containing data of each student of the Batch in the format given below <b>(Sample picture on the left)</b>,<br><br><code>Enroll/Roll Number,Name</code><br><br>where each student data should begin with new row.</div></div><br>" +
    "<div class='row' style='margin-top:24px;'><div class='col-xs-12'><b>batch</b>: <input id='year' type='text' maxlength='4' size='4'><br>(batch should be starting year for the batch. ex: if batch started in year 2014, then '2014')</div><div class='col-xs-12' style='margin-top:10px;'><b>semester</b>: <input id='semester' id='sem' type='text' maxlength='2' size='2'></div><div class='col-xs-4 col-xs-offset-5' style='margin-top:10px;'><input type='file' style='margin-top:10px;' accept='text/plain' name='student_list' id='student_list'></div><br><div style='margin-top:15px;' class='col-xs-2 col-xs-offset-5 btn btn-danger' onclick='controller.addNewBatch()'>Send</div></div></div></div>";

    //Add new Batch modal end here

    // assign new batch to faculty//
    document.getElementById("switch").innerHTML += "<div id='assignFacultyNewBatchModal' class='text-center modal col-sm-12'><div class='row'><div class='col-sm-8 col-sm-offset-2 modalContent'><div class='row modelHeader'><div class='col-sm-12'><h2>assign new batch</h2></div></div><hr><div class='row'><div class='col-xs-12' style='margin-top:10px;'><b>Batch:</b> <div id='batchList'></div></div><div class='col-xs-12' style='margin-top:10px;'><b>Subject</b>: <input id='assignedSubject' id='sem' type='text'></div><br><div style='margin-top:15px;' class='col-xs-2 col-xs-offset-5 btn btn-danger' onclick='controller.assignFacultyNewBatch()'>ADD</div><div class='col-xs-1 col-xs-offset-11' style='font-size:24px;font-weight:bold;cursor:pointer;padding:0px;' onclick='view.close()'>&times;</div></div></div></div>";
    //end of assign new batch to faculty//

    // Start of faculty Settings modal

    document.getElementById("switch").innerHTML += "<div id='facultySettingModal' class='text-center modal col-sm-12'><div class='row' style='padding-top:100px;'><div class='col-sm-4 col-sm-offset-4 modalContent' style='padding:20px;font-size: 20px;'>Are you sure you want to remove this Faculty from department/college ?<br><div class='text-danger' style='font-size:16px;'>note- this removal will be permanent and you will loose all the faculty data</div></div></div><div class='row' style='padding-top:20px;'><div class='col-sm-4 col-sm-offset-4'><div class='row'><div class='col-sm-2 col-sm-offset-3 btn btn-danger' onclick='controller.deleteFaculty()'>Yes</div><div class='btn btn-success col-sm-2 col-sm-offset-2' onclick='view.close()'>No</div></div></div></div></div>";

    //end of faculty Settings modal

    model.info.faculties.forEach(function(faculty,i){
      document.getElementsByClassName("faculty_names")[i].onclick = controller.facultySelected;
    });
  },

  showSelectedFacultyData: function(){
    var content = "<div id='studentListSection' class='row' style='padding-top:5px;padding-bottom:5px;border-bottom: 1px solid lightgrey'><div class='col-xs-11'>";
    model.selectedFaculty.current_classes.forEach(function(cls,i){
      content += "<div style='margin-left:10px' class='btn btn-info report_batch_header' id='" + cls._id + "'>" + cls.semester + "th Sem" + "</div>";
    });
    content += "<div style='margin-left:10px' class='btn btn-warning' id='assignNewBatch' onclick='view.assignNewBatch()'>+ assign new Batch</div></div><div class='col-xs-1'><img style='cursor:pointer' width=25 src='img/delete.png' onclick='view.facultySettings()'></div></div><div class='row' id='reportSection'></div><div class='row' id='studentData'></div>"
    document.getElementById("report_section").innerHTML = content;

    model.selectedFaculty.current_classes.forEach(function(faculty,i){
      document.getElementsByClassName("report_batch_header")[i].onclick = controller.getBatchData;
    })
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
    var x = "<div class='col-xs-6'><h3 class='text-right text-danger' style='margin-top:0'>" + model.selectedFaculty.current_classes[e].subject + "</h3></div><div class='col-xs-6 text-right'><div class='btn btn-default' onclick='view.showFilterModal()'>Filter</div></div><div id='studentDataReport' class='col-xs-12'><table class='table-responsive table-striped'><tr class='row' style='font-size:18px;'><div id='historyModal' class='modal'><div class='modal-content'><span class='close' onclick='controller.modalCloses()' id='close'>&times;</span><div class='studentData row'></div></div></div><th class='col-xs-6 text-center'>Name</th><th class='col-xs-3 text-center'>Attendance</th><th class='col-xs-3 text-center'>Percentage</th></tr><div class='col-xs-12 modal' id='batchData'><div class='row'><div class='col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4 modal-content text-center' id='modalContent'></div></div></div>";
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

       count += student[model.selectedFaculty.current_classes[e].subject].attendance.length;
       if( (count/max)*100 < 75 ){
         x += "<tr style='font-family:notosans;' class='row'><td class='col-xs-6 text-left'><div style='margin-top: 5px;margin-bottom: 5px;' class='btn btn-danger' id='" + student.enroll_number +"'>" + student.name + "</div></td><td class='col-xs-3 text-center'>" + count + "</td><td class='col-xs-3 text-center'>" + Math.ceil((count/max)*100) + "</td></tr>";
       } else {
         x += "<tr style='font-family:notosans;' class='row'><td class='col-xs-4 text-left'><div style='margin-top: 5px;margin-bottom: 5px;' class='btn btn-success' id='" + student.enroll_number +"'>" + student.name + "</div></td><td class='col-xs-4 text-center'>" + count + "</td><td class='col-xs-4 text-center'>" + (count/max)*100 + "</td></tr>";
       }
    });
    x += "</table></div><div style='padding-top:5px;padding-bottom:5px;border-bottom: 3px solid lightgrey;' class='col-xs-12 text-right'><div style='margin-right:10px' class='btn btn-default'>Download Attendance Report</div><div class='btn btn-default'>Download Scoresheet</div></div>";
    document.getElementById("reportSection").innerHTML = x;
  },

  showCustomReport: function(){
    document.getElementById('batchData').style.display = "none";
    var reportData = model.reportData;
    var cuttoff = document.getElementById('cuttoff').value;
    var selectedYear = document.getElementById('selectedYear').value;
    var selectedMonth = document.getElementById('selectedMonth').value;
    var selectedDate = document.getElementById('selectedDate').value;
    var completeDate = model.months.indexOf(selectedMonth) + "/" + selectedDate + "/" + selectedYear;
    var dateSelected = Date.parse(completeDate);
    var afterDateData = {};
    max = 1;
    if(cuttoff === undefined || cuttoff === ""){
      cuttoff = 75;
    }
    console.log(cuttoff);
    var reportData = model.studentAttendanceData;
    var x = "<div class='col-xs-6'><h3 class='text-right text-danger' style='margin-top:0'>" + model.selectedBatch.subject + "</h3></div><div class='col-xs-6 text-right'><div class='btn btn-default' onclick='view.showFilterModal()'>Filter</div></div><div id='studentDataReport' class='col-xs-12'><table class='table-responsive table-striped'><tr class='row' style='font-size:18px;'><div id='historyModal' class='modal'><div class='modal-content'><span class='close' onclick='controller.modalCloses()' id='close'>&times;</span><div class='studentData row'></div></div></div><th class='col-xs-6 text-center'>Name</th><th class='col-xs-3 text-center'>Attendance</th><th class='col-xs-3 text-center'>Percentage</th></tr><div class='col-xs-12 modal' id='batchData'><div class='row'><div class='col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4 modal-content text-center' id='modalContent'></div></div></div>";
    reportData.forEach(function(student,i){
      if(student[model.selectedBatch.subject] === undefined){
         student[model.selectedBatch.subject] = {};
       }

       if(student[model.selectedBatch.subject].attendance === undefined){
          student[model.selectedBatch.subject].attendance = [];
        }
        var presentDates = [];
        student[model.selectedBatch.subject].attendance.forEach(function(x,i){
          var dt = Date.parse(x);
          if(dt >= dateSelected){
            presentDates.push(dt);
          }
        })
        var count = presentDates.length;
        if( (count/max)*100 < cuttoff ){
          x += "<tr style='font-family:notosans;' class='row'><td class='col-xs-6 text-left'><div class='btn btn-danger' style='margin-top: 5px;margin-bottom: 5px;'>" + student.name + "</div></td><td class='col-xs-3 text-center'>" + count + "</td><td class='col-xs-3 text-center'>" + Math.ceil((count/max)*100) + "</td></tr>";
        } else {
          x += "<tr style='font-family:notosans;' class='row'><td class='col-xs-4 text-left'><div class='btn btn-success' style='margin-top: 5px;margin-bottom: 5px;'>" + student.name + "</div></td><td class='col-xs-4 text-center'>" + count + "</td><td class='col-xs-4 text-center'>" + (count/max)*100 + "</td></tr>";
        }
    })
    x += "</table>";
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
    document.getElementById("addFacultyModal").style.display = "block" ;
  },

  showAddBatchModal: function(){
    document.getElementById("addBatchModal").style.display = "block" ;
  },

  showFilterModal: function(){
    var classes_held = {};
    model.selectedBatch.classes_held.forEach(function(d,i){
      var x = new Date(Date.parse(d));
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

    document.getElementById('modalContent').innerHTML = "<div class='row'><div class='col-xs-12 text-right' style='font-size:24px'><div onclick='view.close()' style='cursor:pointer;'>&times;</div></div></div><div class='row'><div class='col-xs-12'><h3>Filter Report-</h3></div></div><hr><div class='row'><div class='col-xs-12'>Cutt-off percentage: <input type='text' maxlength='2' id='cuttoff'></div></div><div class='row' style='margin-top: 10px;'><div class='col-xs-12'>Show from <select id='selectedYear'>" + yearList + "</select> <select id='selectedMonth'>" + monthList + "</select> <select id='selectedDate'>" + dateList + "</select></div></div><div class='row' style='margin-top:10px'><div class='col-xs-12 text-center'><div class='btn btn-danger' onclick='view.showCustomReport()'>Filter</div></div></div>";
    document.getElementById('batchData').style.display = 'block';
  },

  batchDataPanel: function(e){
    model.selectedBatch._id = e.target.id;
    console.log(model.selectedBatch);
    var content = "<div class='row' style='padding-top:5px;padding-bottom:5px;border-bottom: 1px solid lightgrey'><div class='col-xs-11'></div><div class='col-xs-1'><img style='cursor:pointer' width=25 src='img/delete.png' onclick='controller.deleteBatch()'></div></div>"
    document.getElementById("report_section").innerHTML = content;
  },

  assignNewBatch: function(){
    var content = "<select id='selectBatch'>";
    var z = [];
    model.selectedFaculty.current_classes.forEach(function(y){
      z.push(y.batch);
    })
    model.info.batches.forEach(function(x){
      if(z.indexOf(x.batch) <0 ){
        content += "<option id='#" + x.batch + "'>" + x.batch + "</option>";
      }
    })
    content += "</select>";
    document.getElementById('batchList').innerHTML = content;
    document.getElementById("assignFacultyNewBatchModal").style.display = "block" ;
  },

  close: function(){
    document.getElementById("addFacultyModal").style.display = "none" ;
    document.getElementById("addBatchModal").style.display = "none" ;
    document.getElementById("assignFacultyNewBatchModal").style.display = "none" ;
    document.getElementById('facultySettingModal').style.display = "none";
    document.getElementById('batchData').style.display = "none";
  },

  facultySettings: function(){
    document.getElementById('facultySettingModal').style.display = "block";
  }

};

var model = {
  selectedFaculty: [],
  selectedBatch: {},
  months: ["january","february","march"],
  facultyFormFields : ["Name","Username","Password"]
};

var controller = {
  departmentData: function(){
    var getDepartmentData = new XMLHttpRequest();
    if(!getDepartmentData){
      console.log(err)
    }
      getDepartmentData.onreadystatechange = function(){
        var response = getDepartmentData.response;
        if(getDepartmentData.status === 200 && getDepartmentData.readyState === 4){
          var response = JSON.parse(response)
          model.info = response;
          console.log(model)
          view.updateView();
        } else {

        }

    }
    getDepartmentData.open('GET','http://localhost:3000/admin/getDepartmentData',true);
    getDepartmentData.send(null);
  },

  facultySelected: function(e){
    e = e.target.id;
    model.selectedFaculty._id = e;
    controller.getFacultyData();
  },

  getFacultyData: function(e){

    var facultyDataRequest = new XMLHttpRequest();

    facultyDataRequest.onreadystatechange = function(){
      var response = facultyDataRequest.response;
      if(facultyDataRequest.status === 200 && facultyDataRequest.readyState === 4){
        response = JSON.parse(response);
        model.selectedFaculty = response;
        view.showSelectedFacultyData();
      }
    }

    facultyDataRequest.open('GET','http://localhost:3000/admin/getFacultyData/' + model.selectedFaculty._id ,true);
    facultyDataRequest.send(null);
  },

  getBatchData: function(e){
    e = e.target.id;
    console.log(e);

    var batchDataRequest = new XMLHttpRequest();
    batchDataRequest.onreadystatechange = function(){
      var response = batchDataRequest.response;
      if(batchDataRequest.status === 200 && batchDataRequest.readyState === 4){
        response = JSON.parse(response);
        view.renderBatchData(response.attendance,e);
      }
    }

    batchDataRequest.open("GET","http://localhost:3000/admin/getBatchData/" + e,true);
    batchDataRequest.send(null);
  },

  showStudentData: function(e){
    e = e.target.id;
    e = e.replace("#","");
    console.log(e);

    view.showStudentData(e);
  },

  addNewFaculty: function(){
    var obj = {};
    obj.name = document.getElementsByTagName("input")[0].value;
    obj["_id"] = document.getElementsByTagName("input")[1].value + "@" + model.info.college;
    obj.password = document.getElementsByTagName("input")[2].value;
    obj.college = model.info.college;
    obj.deparment = model.info.department;
    obj.current_classes = [];
    console.log(obj);
    var newFacultyData = new XMLHttpRequest();

    newFacultyData.onreadystatechange = function(){
      if(newFacultyData.status === 200 && newFacultyData.readyState === 4 ){
        document.getElementById("addFacultyModal").style.display = "none" ;
        controller.departmentData();
      } else if(newFacultyData.status === 500 && newFacultyData.readyState === 4){
        alert("Internal server Error");
        controller.departmentData();
      } else if(newFacultyData.status != 200 && newFacultyData.status !== 500 && newFacultyData.readyState === 4){
        alert('error.Check your internet connection');
        controller.departmentData();
      }
    }

    newFacultyData.open('POST','http://localhost:3000/admin/addnewfaculty',true);
    newFacultyData.setRequestHeader('Content-type','application/json');
    newFacultyData.send(JSON.stringify(obj));
  },

  addNewBatch: function(){
    var file = document.getElementById('student_list').files[0];
    var batch = document.getElementById('year').value
    var sem = document.getElementById('semester').value
    console.log(batch);
    var newBatchData = new XMLHttpRequest();

    newBatchData.onreadystatechange = function(){
      if(newBatchData.status === 200 && newBatchData.readyState === 4 ){
        document.getElementById("addBatchModal").style.display = "none" ;
        controller.departmentData();
      } else if(newBatchData.status === 500 && newBatchData.readyState === 4){
        document.getElementById("addBatchModal").style.display = "none" ;
        alert("Internal server Error");
        controller.departmentData();
      } else if(newBatchData.status != 200 && newBatchData.status !== 500 && newBatchData.readyState === 4){
        document.getElementById("addBatchModal").style.display = "none" ;
        alert('error.Check your internet connection');
        controller.departmentData();
      }
    }

    newBatchData.open('POST','http://localhost:3000/admin/addnewbatch/' + model.info.college + '/' + model.info.department + '/' + batch + '/' + sem,true);
    newBatchData.setRequestHeader('Content-type','application/octet-stream');
    newBatchData.send(file);
  },

  assignFacultyNewBatch: function(){
    var batch = document.getElementById('selectBatch').value;
    batch = batch.replace('#','');
    var obj = {};
    obj.batch = batch;
    obj.subject = document.getElementById('assignedSubject').value;
    model.info.batches.forEach(function(x){
      if(x.batch == batch){
        obj.semester = x.semester;
        obj._id = x._id;
      }
    })
    console.log(obj);

    var newBatchData = new XMLHttpRequest();

    newBatchData.onreadystatechange = function(){
      if(newBatchData.status === 200 && newBatchData.readyState === 4 ){
        var response = newBatchData.response;
        document.getElementById("assignFacultyNewBatchModal").style.display = "none" ;
        controller.getFacultyData();
      } else if( newBatchData.status === 500 && newBatchData.readyState === 4 ){
        document.getElementById("assignFacultyNewBatchModal").style.display = "none" ;
        alert('Internal server Error. Please try again. If issue continues, try again after time later');
        controller.getFacultyData();
      } else if( newBatchData.status != 500 && newBatchData.status != 200 && newBatchData.readyState === 4){
        document.getElementById("assignFacultyNewBatchModal").style.display = "none" ;
        alert('error. Check your Internet Connection');
        controller.getFacultyData();
      }
    }

    newBatchData.open('POST','http://localhost:3000/admin/assignFacultyNewBatch/' + model.selectedFaculty._id,true);
    newBatchData.setRequestHeader('Content-type','application/json');
    newBatchData.send(JSON.stringify(obj));
  },

  deleteFaculty: function(){
    var deleteFacultyRequest = new XMLHttpRequest();
    deleteFacultyRequest.onreadystatechange = function(){
      if(deleteFacultyRequest.status === 200 && deleteFacultyRequest.readyState === 4 ){
        document.getElementById("facultySettingModal").style.display = "none" ;
        document.getElementById('report_section').innerHTML = "";
        controller.departmentData();
      } else if( deleteFacultyRequest.status === 500 && deleteFacultyRequest.readyState === 4 ){
        document.getElementById("facultySettingModal").style.display = "none" ;
        alert('Internal server Error. Please try again. If issue continues, try again after time later');
        controller.departmentData();
      } else if( deleteFacultyRequest.status != 500 && deleteFacultyRequest.status != 200 && deleteFacultyRequest.readyState === 4){
        document.getElementById("facultySettingModal").style.display = "none" ;
        alert('error. Check your Internet Connection');
        controller.departmentData();
      }
    }
    deleteFacultyRequest.open('DELETE','http://localhost:3000/admin/removefaculty/' + model.selectedFaculty._id,true);
    deleteFacultyRequest.send(null);
  },

  deleteBatch: function(){
    var deleteBatchRequest = new XMLHttpRequest();
    deleteBatchRequest.onreadystatechange = function(){
      if(deleteBatchRequest.status === 200 && deleteBatchRequest.readyState === 4 ){
        model.selectedBatch = {};
        document.getElementById('report_section').innerHTML = "";
        controller.departmentData();
      } else if( deleteBatchRequest.status === 500 && deleteBatchRequest.readyState === 4 ){
        alert('Internal server Error. Please try again. If issue continues, try again after time later');
        view.updateView();
      } else if( deleteBatchRequest.status != 500 && deleteBatchRequest.status != 200 && deleteBatchRequest.readyState === 4){
        alert('error. Check your Internet Connection');
        view.updateView();
      }
    }
    deleteBatchRequest.open('DELETE','http://localhost:3000/admin/removebatch/' + model.selectedBatch._id,true);
    deleteBatchRequest.send(null);
  },

  logout: function(){
    var logoutRequest = new XMLHttpRequest();
    logoutRequest.onreadystatechange = function(){
      if(logoutRequest.readyState === 4 && logoutRequest.status === 200){
        alert('logged out');
      }
    }
    logoutRequest.open('GET','http://localhost:3000/login/logout',true);
    logoutRequest.send(null);
  }

};

window.onload = controller.departmentData;
