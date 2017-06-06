
var controller = {
  present: {students:[]},

  facultyData: function(){
    document.getElementById("main").innerHTML = "";
    document.getElementById('take-attendance-button').style.display = "block";
    document.getElementById('mobile-home-section').style.color = "black";
    document.getElementById('mobile-report-section').style.color = "grey";
    var day_today = (new Date()).getDay()-1;
    var requestFacultyData = new XMLHttpRequest();

    if(!requestFacultyData){
      alert('error')
    }

    requestFacultyData.open('GET','http://localhost:3000/faculty/requestFacultyData',true);
    requestFacultyData.send(null)

    requestFacultyData.onreadystatechange = function(){
      var response = requestFacultyData.response;
      if( requestFacultyData.status === 200 && requestFacultyData.readyState === XMLHttpRequest.DONE){

          response = JSON.parse(response);
          model.personalInfo = response;
          var arr = [];
          model.personalInfo.current_classes.forEach(function(t,n){
            if(t.timing && t.timing[day_today] != 0){
              arr.push({"class":t.class,"period":t.timing[day_today]});
            }
          })
          model.classes_today = arr;
          console.log(model);
          view.loadHome();
        } else {
        }
    }

  },

  getStudentList: function(){
    model.students = [];
    console.log(model);
    var _id = model.selectedBatch._id;
    console.log(_id)
    model.personalInfo.current_classes.forEach(function(x,i){
      var attendance = new XMLHttpRequest();

      attendance.onreadystatechange = function(){
        var response = attendance.response;
        if( attendance.status === 200 && attendance.readyState === XMLHttpRequest.DONE){
            response = JSON.parse(response);
            model.students = response ;
            switch(model.route){
              case 'attendance': controller.takeAttendance();
                break;
              case 'score': view.showScoreOptions();
            }
      } else {}
    }

      attendance.open('GET','http://localhost:3000/faculty/getStudentList/' + _id,true);
      attendance.send(null);
    })
},

routes: function(e){
  model.route = e.target.id.split('#')[0];
  var _id = e.target.id.split('#')[1];
  model.selectedBatch._id = _id;
  model.personalInfo.current_classes.forEach(function(x,i){
    if( x._id === _id){
      model.selectedBatch = model.personalInfo.current_classes[i];
    }
  })
  console.log(model.route);
  switch(model.route){
    case 'attendance':
      document.getElementById('take-attendance-button').style.display = "block";
      document.getElementById('batchListModal').style.display = "none";
      controller.getStudentList();
      break;
    case 'report': controller.getReport();
      break;
    case 'score':
      document.getElementById('take-attendance-button').style.display = "block";
      document.getElementById('batchListModal').style.display = "none";
      controller.getStudentList();
      break;
  }
},

takeAttendance: function(){
  document.getElementById('take-attendance-button').style.display = "none";
  var name = "";
  model.students.forEach(function(student,i){
    if(controller.present.students.indexOf(student.enroll_number)<0){
      name += "<div onclick='controller.markPresent(event)' class='col-xs-12 text-left' style='text-transform:capitalize;color:grey;background-color:rgba(215,215,215,.2);border:solid 1px lightgrey;padding-top:25px;padding-bottom:25px;cursor:pointer' " + "id=" + student.enroll_number + ">" + student.name + "<br>" + student.enroll_number +"</div>";
    } else {
      name += "<div onclick='controller.markPresent(event)' class='col-xs-12 text-left' style='text-transform:capitalize;color:grey;background-color:lightgreen;border:solid 1px lightgrey;padding-top:25px;padding-bottom:25px;cursor:pointer' " + "id=" + student.enroll_number + ">" + student.name + "<br>" + student.enroll_number +"</div>";
    }
  })
  document.getElementById("main").innerHTML = "<div id='counter' onclick='controller.clearList()' style='cursor:pointer' onclick=''><div style='width:20px;height:20px;' id='count'>" + controller.present.students.length + "</div></div><div id='attendance-options' style='cursor:pointer' onclick='view.showAttendanceOptions()'><div class='glyphicon glyphicon-calendar' style='width:20px;height:20px;color:black'></div></div><div class='col-xs-12 batches_box' id='attendance-box'><div class='row' id='student_list_box''>" + name +"</div></div></div><div id='send-button' onclick='controller.submitData()'><span style='padding:15px;background-color:rgba(56,103,211,1);border-radius:30px;border:solid 1px grey;cursor:pointer' class='glyphicon glyphicon-send'></span></div>";
  document.getElementById('main').innerHTML += "<div class='modal col-xs-12' id='attendance-options-modal' style='background-color: rgba(0,0,0,.9)'><div style='margin-top: 100px' class='row'><hr class='col-xs-8 col-xs-offset-2'><br><br><h3 style='color:white'>Select a New Date</h3><br><div class='col-xs-12'><select id='allDates'></select></div><div class='col-xs-12'><select id='allMonth'></select></div><div class='col-xs-12'><select id='allYear'></select></div></div><div class='col-xs-12' style='font-size:20px;color:white;margin-top:20px'><div class='btn btn-danger' onclick='controller.dateSelected2()'>Select</div></div></div></div>";

},

clearList: function(){
  controller.present.students = [];
  controller.takeAttendance();
},

markPresent: function(e){
  var student_id = e.target.id;
  console.log(student_id);
  if(this.present.students.indexOf(student_id)<0){
    document.getElementById(student_id).style.backgroundColor= "lightgreen";
    document.getElementById(student_id).style.color= "black";
    this.present.students.push(student_id);
    document.getElementById('count').innerHTML = this.present.students.length;
  } else {
    document.getElementById(student_id).style.backgroundColor= "rgba(225,225,225,1)";
    document.getElementById(student_id).style.color= "grey";
    this.present.students.splice(this.present.students.indexOf(student_id),1);
    document.getElementById('count').innerHTML = this.present.students.length;
  }
  console.log(this.present.students);
},

submitData: function(){
  document.getElementById('attendance-box').style.display= 'none';
  document.getElementById('send-button').style.display= 'none';
  document.getElementById('take-attendance-button').style.display= 'block';
  this.present.subject = model.selectedBatch.subject;
  if(!this.present.hasOwnProperty('date')){
    console.log(controller);
    var d = new Date();
    d.setSeconds(0);
    d.setHours(0);
    d.setMinutes(0);
    d.setMilliseconds(0);
    this.present.date = d.valueOf();
  }
  console.log(JSON.stringify(this.present))
  var SAD = new XMLHttpRequest();

  SAD.onreadystatechange = function(){
    if(SAD.readyState == 4 || SAD.status == 200){

      document.getElementById('take-attendance-button').style.display = "block";
      controller.present.students = [];
      delete controller.present.date;
      controller.facultyData();
    } else {
    }
  }

  SAD.open("POST","http://localhost:3000/faculty/submitData/" + model.selectedBatch._id,true)
  SAD.setRequestHeader('Content-Type','application/json');
  SAD.send(JSON.stringify(this.present))
},

dateSelected: function(){
  var L = model.months.indexOf(document.getElementById('selectedMonth').value);
  var T = document.getElementById('selectedDate').value + '/' + L + '/' + document.getElementById('selectedYear').value;
  controller.present.date = new Date(Number(document.getElementById('selectedYear').value),L,Number(document.getElementById('selectedDate').value)).valueOf();
  console.log(controller.present.date);
  document.getElementById('attendance-options-modal').style.display = "none";
},

dateSelected2: function(){
  var L = model.months.indexOf(document.getElementById('allMonth').value);
  controller.present.date = new Date(Number(document.getElementById('allYear').value),L,Number(document.getElementById('allDates').value)).valueOf();
  console.log(controller.present.date);
  document.getElementById('attendance-options-modal').style.display = "none";
},

getReport: function(){
  var requestReport = new XMLHttpRequest();

  requestReport.onreadystatechange = function(){
    if(requestReport.readyState == 4 || requestReport.status == 200){
      model.reportData = JSON.parse(requestReport.response);
      var reportData = model.reportData;
      console.log(model.reportData);
      var content2 = "<div class='modal col-xs-12 text-center' id='downloadsOptionModal'><div class='row' style='animation-name: pushup;animation-duration:.25s;position:fixed;bottom:0;height:50%;width:100%;background-color:white;border-radius: 10px'><div class='col-xs-12'><div class='row' style='margin-bottom:15px;'><div class='col-xs-12' style='border-bottom: 1px solid grey'><h3>Select list<span style='position:absolute;right: 10%;font-size: 26px;color:red;cursor:pointer' onclick='view.closeDownloadListModal()'>&times;</span></h3></div><div class='col-xs-12' style='margin-top:10px'><div class='row' style='margin-top:10px'><div class='col-xs-12'><a href='http://localhost:3000/download/attendanceOverview/" + model.selectedBatch._id + "/" + model.personalInfo._id + "/" + model.selectedBatch.subject + "' target='_blank' class='btn btn-default'>Attendance Report ( Overview )</a></div></div><div class='row' style='margin-top:10px'><div class='col-xs-12'><a href='http://localhost:3000/download/attendanceDetailed/" + model.selectedBatch._id + "/" + model.personalInfo._id + "/" +  model.selectedBatch.subject + "' target='_blank' class='btn btn-default'>Attendance Report ( Date by Date Track )</a></div></div></div></div></div></div>";
      document.getElementsByTagName('body')[0].innerHTML += content2;
      var x = "<div id='downloads' onclick='view.showDownloadOptions()'><span style='width:15px;height:15px;' class='glyphicon glyphicon-download'></span></div><div class='batches_box col-xs-12' id='student_list_box'>";
      var max = 1;

      reportData.student_data.forEach(function(student){
        var count = 0;
        if(student[model.selectedBatch.subject] === undefined){
           student[model.selectedBatch.subject] = {};
         }

         if(student[model.selectedBatch.subject].attendance === undefined){
            student[model.selectedBatch.subject].attendance = [];
          }

         count = student[model.selectedBatch.subject].attendance.length;
        if(model.selectedBatch.classes_held.length > max){
          max = model.selectedBatch.classes_held.length;
        }
        var tests = "";
        if(student[model.selectedBatch.subject].hasOwnProperty('scores')){
          student[model.selectedBatch.subject]["scores"].forEach(function(m,n){
            tests += " <label class='label label-warning' style='color:white'>" + m.test_name + "-" + m.score + "</label> "
          })
        } else {
        }
         if( (count/max)*100 > 75 ){
           x += "<div class='row text-left' style='border:solid 1px lightgrey;padding-top:15px;padding-bottom:15px;cursor:pointer;background-color:rgba(225,225,225,.4)'><div class='col-xs-12'><div class='' style='font-size:13px;text-transform:capitalize;'><b>" + student.name + "</b></div></div><br><div class='col-xs-12' style='font-size:12px'>" + student.enroll_number + "</div><br><div class='col-xs-12'>" + count + "/" + max + " <div class='label label-success'>" + Math.ceil((count/max)*100) + "</div> " + tests + " </div></div>";
         } else {
           x += "<div class='row text-left' style='border:solid 1px lightgrey;padding-top:15px;padding-bottom:15px;cursor:pointer;background-color:rgba(225,225,225,.5)'><div class='col-xs-12'><div class='' style='font-size:13px;text-transform:capitalize;'><b>" + student.name + "</b></div></div><br><div class='col-xs-12' style='font-size:12px'>" + student.enroll_number + "</div><br><div class='col-xs-12'>" + count + "/" + max + " <div class='label label-danger'>" + Math.ceil((count/max)*100) + "</div> " + tests + " </div></div>";
         }
      })
      x += "</div>";
      view.showReport(x);
    } else {
      view.showReport("<div style='position:relative;top:75px;'>loading ...</div>");
    }
  }

  requestReport.open("GET","http://localhost:3000/faculty/report/" + model.selectedBatch._id + '/' + model.selectedBatch.subject ,true);
  requestReport.send(null);
},

submitScores: function(){
  var obj = {scores:model.studentScoreArray,test_name:model.scoreSettings[0]["Test Name"],max_score:model.scoreSettings[1]["Maximum Score"]};
  var SSR = new XMLHttpRequest();

  SSR.onreadystatechange =  function(){
    if(SSR.readyState == 4 || SSR.status == 200){
      document.getElementById('take-attendance-button').style.display = "block";
      delete model.studentScoreArray ;
      delete model.scoreSettings ;
      controller.facultyData();
    } else {
    }
  }
  console.log(obj);
  SSR.open('POST','http://localhost:3000/faculty/submitscores/' + model.selectedBatch._id + '/' + model.selectedBatch.subject, true);
  SSR.setRequestHeader('Content-Type','application/json');
  SSR.send(JSON.stringify(obj));
},

addScoreSetting: function(){
  var obj = {};
  obj[model.scoreSettinglist[model.scoreSettingCount]] = document.getElementById('scoreSettingInput').value;
  model.scoreSettings.push(obj);
  model.scoreSettingCount++ ;
  if(model.scoreSettingCount === model.scoreSettinglist.length){
    console.log(model);
    view.showNamesForScores();
  } else {
    document.getElementById('scoreSettings').innerHTML = model.scoreSettinglist[model.scoreSettingCount];
  }
},

willBeAbsent: function(n){
  var obj = {
    absent: n
  }
  var xhr = new XMLHttpRequest();
  if(!xhr){
    alert("error");
  }

  xhr.onreadystatechange = function(){
    if(xhr.status === 200 && xhr.readyState === 4){
      view.closeAbsentModal();
    }
  }

  xhr.open('POST','http://localhost:3000/faculty/markabsent',true);
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.send(JSON.stringify(obj))
}


};

window.onload = controller.facultyData
