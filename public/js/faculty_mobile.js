var view = {
  loadHome: function(){
    console.log(model);

    var content = "<div class='modal col-xs-12 text-center' id='batchListModal'><div class='row'><div class='col-xs-10 col-xs-offset-1' style='height:40%;'><div class='row'><h3 class='col-xs-12' style='color:white'>Add Scores</h3></div><div style='height:70%;margin-top:15px;overflow-x:auto;background-color:rgba(140,140,140,.1);padding-top:10px;padding-bottom:10px' class='row'><div class='col-xs-12'>";
    model.personalInfo.current_classes.forEach(function(x,i){
      content += "<div class='btn btn-warning batches' id='score#" + x._id + "' onclick='controller.routes(event)'>" + x.semester + "th, Sem" + "</div>";
    })
    content += "</div></div></div></div><hr>";
    content += "<div class='col-xs-10 col-xs-offset-1' style='height:40%;'><div class='row'><h3 class='col-xs-12' style='color:white'>Attendance</h3></div><div style='height:70%;margin-top:15px;overflow-x:auto;background-color:rgba(140,140,140,.1);padding-top:10px;padding-bottom:10px' class='row'><div class='col-xs-12'>";
    model.personalInfo.current_classes.forEach(function(x,i){
      content += "<div class='btn btn-success batches' id='attendance#" + x._id + "' onclick='controller.routes(event)'>" + x.semester + "th, Sem" + "</div>";
    })
    content += "</div></div></div></div>";
    document.getElementsByTagName('body')[0].innerHTML += content;
    model.personalInfo.current_classes.forEach(function(x,i){
      document.getElementsByClassName('batches')[i].onclick = controller.routes;
    })
  },

  showDownloadOptions: function(){
    console.log(model);
    document.getElementById('downloadsOptionModal').style.display = "block";
  },

  showBatchList: function(){
    document.getElementById('batchListModal').style.display = "block";
    document.getElementById('take-attendance-button').style.display = "none";
  },

  loadReportSection: function(){
   document.getElementById('mobile-home-section').style.color = "grey";
   document.getElementById('mobile-report-section').style.color = "black";
    document.getElementById('take-attendance-button').style.display = "block";
    var content = "<div class='col-xs-10 col-xs-offset-1 batches_box' style='position:relative;top:30px'><div class='row' id='batch_list_header' style='border-bottom: solid 1px lightgrey'><h3 class='col-xs-12'>Report</h3></div><div style='margin-top: 10px;margin-bottom: 10px;' class='row' id='batch_list'><div class='col-xs-12'>";
    model.personalInfo.current_classes.forEach(function(x,i){
      content += "<div class='btn btn-warning batches' id='report#" + x._id + "'>" + x.semester + "th, Sem" + "</div>";
    })
    content_= "</div></div></div>";
    document.getElementById('main').innerHTML = content;
    model.personalInfo.current_classes.forEach(function(x,i){
      document.getElementsByClassName('batches')[i].onclick = controller.routes;
    })

  },

  showReport:function(x){
    document.getElementById("main").innerHTML = x;
  },

  showAttendanceOptions: function(){
    var requestClassesHeld = new XMLHttpRequest();
    requestClassesHeld.onreadystatechange = function(){
      if(requestClassesHeld.status === 200 && requestClassesHeld.readyState === 4 ){
        var response = JSON.parse(requestClassesHeld.response);
        model.classHeld = response.current_classes[0].classes_held;
        var date = "";
        var month = "";
        var year = "";
        model.classHeld.forEach(function(x,i){
          x = new Date(x);
          var mnt = model.months[Number(x.getMonth())];
          date += "<option>" + x.getDate() +"</option>";
          month += "<option>" + mnt +"</option>";
          year += "<option>" + x.getFullYear() +"</option>";
        })
        document.getElementById('attendance-options-modal').style.display = "block";
        document.getElementById('selectedDate').innerHTML = date;
        document.getElementById('selectedMonth').innerHTML = month;
        document.getElementById('selectedYear').innerHTML = year;
        for(var i=1;i<32;i++){
          document.getElementById('allDates').innerHTML += "<option>" + i + "</option>" ;
        }
        for(var i=0; i<12; i++){
          document.getElementById('allMonth').innerHTML += "<option>" + model.months[i] + "</option>" ;
        }
        var year = new Date().getFullYear();
          document.getElementById('allYear').innerHTML += "<option>" + year-1 + "</option><option>" + year + "</option><option>" + year+1 + "</option>" ;
      }
    }
    requestClassesHeld.open('GET','http://localhost:3000/faculty/classesheld/' + model.selectedBatch._id,true);
    requestClassesHeld.send(null);

  },

  showScoreOptions: function(){
    var content = "<div class='row modal' id='scoreOptionsModal'><div class='col-xs-12 text-center'><div class='row'><h3 class='col-xs-12' style='color:white'>Scores</h3></div><div class='row'><div class='col-xs-10 col-xs-offset-1' style='margin-top: 20px'><div class='row' style='margin-top: 10px'><div class='btn btn-danger disabled'>Edit Previous Scores</div></div><div class='row' style='margin-top: 10px'><div class='btn btn-danger' onclick='view.getTestSettings()'>Create New Test Score List</div></div></div></div>";
    document.getElementsByTagName('body')[0].innerHTML += content;
    document.getElementById('scoreOptionsModal').style.display = "block";
  },

  getTestSettings: function(){
    document.getElementById('scoreOptionsModal').style.display = "none";
    model.scoreSettingCount = 0;
    model.scoreSettinglist = ["Test Name","Maximum Score"];
    model.scoreSettings = [];
    model.studentCount = 0;
    model.studentScoreArray = [];
    var content = "<div class='col-xs-12' style='position:relative;top: 30%'><div class='row'><div class='col-xs-10 col-xs-offset-1' style='background-color:rgba(255,255,255,.9);border-radius:3px'><div class='row' style='border-bottom: solid 1px white'><h4 class='col-xs-12' id='scoreSettings' style='color:white'>Settings</h4></div><div class='row' style='margin-top:10px'><div class='col-xs-12'><input type='text' id='scoreSettingInput' autofocus></div></div><div class='row' style='margin-top:10px;margin-bottom:10px'><div class='btn btn-warning' onclick='controller.addScoreSetting()'>Done</div></div></div></div></div>";
    document.getElementById('main').innerHTML = content;
    document.getElementById('scoreSettingInput').focus();
    document.getElementById('scoreSettings').innerHTML = model.scoreSettinglist[model.scoreSettingCount];
  },

  showNamesForScores: function(){
    var content = "<div class='col-xs-12' style='position:relative;top: 30%'><div class='row'><div class='col-xs-10 col-xs-offset-1' style='background-color:rgba(40,40,40,.4);border-radius:3px'><div class='row' style='border-bottom: solid 1px white'><h4 class='col-xs-12' id='student_name' style='color:white'>student</h4></div><div class='row' style='margin-top:10px'><div class='col-xs-12'><input type='text' maxlength=" + model.scoreSettings[1]["Maximum Score"].length + "  id='studentScore' autofocus></div></div><div class='row' style='margin-top:10px;margin-bottom:10px'><div class='col-xs-6 text-right' onclick='view.getTestSettings()'><div class='btn glyphicon glyphicon-repeat' style='color:red'></div></div><div class='col-xs-6 text-left' onclick='view.oneStepBack()'><div class='btn glyphicon glyphicon-arrow-left'></div></div></div></div></div></div></div>";

    /* <div class='col-xs-4' onclick='view.getScores()'><div class='btn glyphicon glyphicon-ok text-success'></div></div> */

    document.getElementById('main').innerHTML = content;
    document.getElementById('studentScore').focus();
    console.log(model.students[model.studentCount]["name"]);
    document.getElementById('student_name').innerHTML = model.students[model.studentCount]["name"];
    var obj = {};
    var input = document.querySelector('#studentScore');
    input.addEventListener('input', function(){
      if(input.value.length == model.scoreSettings[1]["Maximum Score"].length && Number(input.value) <= Number(model.scoreSettings[1]["Maximum Score"]) ){
        obj[model.students[model.studentCount].enroll_number] = input.value;
        model.studentScoreArray[model.studentCount] = obj;
        console.log(model);
        document.getElementById('student_name').innerHTML = model.students[model.studentCount].name;
        model.studentCount++;
        if(model.studentCount ==5){
          controller.submitScores();
        } else {
          view.showNamesForScores();
        }
      } else if(input.value.length == model.scoreSettings[1]["Maximum Score"].length && Number(input.value) > Number(model.scoreSettings[1]["Maximum Score"])){
        obj[model.students[model.studentCount].enroll_number] = model.scoreSettings[1]["Maximum Score"];
        model.studentScoreArray[model.studentCount] = obj;
        console.log(model);
        document.getElementById('student_name').innerHTML = model.students[model.studentCount].name;
        model.studentCount++;
        if(model.studentCount ==5){
          controller.submitScores();
        } else {
          view.showNamesForScores();
        }
      }
    });
  },

  getScores: function(e){
    var obj = {};
    obj[model.students[model.studentCount].enroll_number] = document.getElementById('studentScore').value;
    model.studentScoreArray.push(obj);
    console.log(model);
    document.getElementById('student_name').innerHTML = model.students[model.studentCount].name;
    model.studentCount++;
    if(model.studentCount ==5){
      controller.submitScores();
    } else {
      view.showNamesForScores();
    }
  },

  oneStepBack: function(){
    if(model.studentCount !=0 ){
      model.studentCount--;
      view.showNamesForScores();
    } else {
      view.showNamesForScores();
    }
  },

  close: function(){
    document.getElementById('downloadsOptionModal').style.display = "none";
    controller.showReport();
  }
};

var model = {
  selectedBatch:{},
  months: ["January","February","March","April","May","June"],
};

var controller = {
  present: {students:[]},

  facultyData: function(){
    document.getElementById("main").innerHTML = "";
    document.getElementById('take-attendance-button').style.display = "block";
    document.getElementById('mobile-home-section').style.color = "black";
    document.getElementById('mobile-report-section').style.color = "grey";
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
  document.getElementById('batchListModal').style.display = "none";
  document.getElementById('take-attendance-button').style.display = "block";
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
    case 'attendance': controller.getStudentList();
      break;
    case 'report': controller.getReport();
      break;
    case 'score': controller.getStudentList();
      break;
  }
},

takeAttendance: function(){
  document.getElementById('take-attendance-button').style.display = "none";
  var name = "";
  model.students.forEach(function(student,i){
    if(controller.present.students.indexOf(student.enroll_number)<0){
      name += "<div onclick='controller.markPresent(event)' class='col-xs-12 text-left' style='text-transform:capitalize;color:grey;background-color:rgba(215,215,215,.8);border:solid 1px lightgrey;padding-top:25px;padding-bottom:25px;cursor:pointer' " + "id=" + student.enroll_number + ">" + student.name + "<br>" + student.enroll_number +"</div>";
    } else {
      name += "<div onclick='controller.markPresent(event)' class='col-xs-12 text-left' style='text-transform:capitalize;color:grey;background-color:lightgreen;border:solid 1px lightgrey;padding-top:25px;padding-bottom:25px;cursor:pointer' " + "id=" + student.enroll_number + ">" + student.name + "<br>" + student.enroll_number +"</div>";
    }
  })
  document.getElementById("main").innerHTML = "<div id='counter' onclick='controller.clearList()' style='cursor:pointer' onclick=''><div style='width:20px;height:20px;' id='count'>" + controller.present.students.length + "</div></div><div id='attendance-options' style='cursor:pointer' onclick='view.showAttendanceOptions()'><div class='glyphicon glyphicon-calendar' style='width:20px;height:20px;color:black'></div></div><div class='col-xs-12 batches_box' id='attendance-box'><div class='row' id='student_list_box''>" + name +"</div></div></div><div id='send-button' onclick='controller.submitData()'><span style='padding:15px;background-color:rgba(56,103,211,1);border-radius:30px;border:solid 1px grey;cursor:pointer' class='glyphicon glyphicon-send'></span></div>";
  document.getElementById('main').innerHTML += "<div class='modal col-xs-12' id='attendance-options-modal' style='background-color: rgba(0,0,0,.9)'><div class='row'><h3 style='color:white' class='col-xs-12'>Select Date</h3></div><div class='row' style='margin-top:50px;'><div class='col-xs-12'><select id='selectedDate'></select></div><div class='col-xs-12'><select id='selectedMonth'></select></div><div class='col-xs-12'><select id='selectedYear'></select></div><div class='col-xs-12' style='font-size:20px;color:white;margin-top:20px'><div class='btn btn-danger' onclick='controller.dateSelected()'>Select</div></div><div style='margin-top: 100px' class='row'><hr class='col-xs-8 col-xs-offset-2'><br><br><h3 style='color:white'>Or Select a New Date</h3><br><div class='col-xs-12'><select id='allDates'></select></div><div class='col-xs-12'><select id='allMonth'></select></div><div class='col-xs-12'><select id='allYear'></select></div></div><div class='col-xs-12' style='font-size:20px;color:white;margin-top:20px'><div class='btn btn-danger' onclick='controller.dateSelected2()'>Select</div></div></div></div>";

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
      var reportData = JSON.parse(requestReport.response);
      model.reportData = JSON.parse(requestReport.response);
      console.log(reportData);
      var content2 = "<div class='modal col-xs-12 text-center' id='downloadsOptionModal'><div class='row' style='animation-name: pushup;animation-duration:2s;position:fixed;bottom:0;height:50%;width:100%;background-color:white;border-radius: 10px'><div class='col-xs-12'><div class='row' style='margin-bottom:15px;'><div class='col-xs-12' style='border-bottom: 1px solid grey'><h3>Select list<span style='position:absolute;right: 10%;font-size: 26px;color:red;cursor:pointer' onclick='view.close()'>&times;</span></h3></div><div class='col-xs-12' style='margin-top:10px'><div class='row' style='margin-top:10px'><div class='col-xs-12'><a href='http://localhost:3000/download/attendanceOverview/" + model.selectedBatch._id + "/" + model.personalInfo._id + "/" + model.selectedBatch.subject + "' target='_blank' class='btn btn-default'>Attendance Report ( Overview )</a></div></div><div class='row' style='margin-top:10px'><div class='col-xs-12'><a href='http://localhost:3000/download/attendanceDetailed/" + model.selectedBatch._id + "/" + model.personalInfo._id + "/" +  model.selectedBatch.subject + "' target='_blank' class='btn btn-default'>Attendance Report ( Date by Date Track )</a></div></div></div></div></div></div>";
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
           x += "<div class='row text-left' style='border:solid 1px lightgrey;padding-top:15px;padding-bottom:15px;cursor:pointer;background-color:rgba(225,225,225,1)'><div class='col-xs-12'><div class='' style='font-size:13px;text-transform:capitalize;'><b>" + student.name + "</b></div></div><br><div class='col-xs-12' style='font-size:12px'>" + student.enroll_number + "</div><br><div class='col-xs-12'>" + count + "/" + max + " <div class='label label-success'>" + Math.ceil((count/max)*100) + "</div> " + tests + " </div></div>";
         } else {
           x += "<div class='row text-left' style='border:solid 1px lightgrey;padding-top:15px;padding-bottom:15px;cursor:pointer;background-color:rgba(225,225,225,1)'><div class='col-xs-12'><div class='' style='font-size:13px;text-transform:capitalize;'><b>" + student.name + "</b></div></div><br><div class='col-xs-12' style='font-size:12px'>" + student.enroll_number + "</div><br><div class='col-xs-12'>" + count + "/" + max + " <div class='label label-danger'>" + Math.ceil((count/max)*100) + "</div> " + tests + " </div></div>";
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


};

window.onload = controller.facultyData
