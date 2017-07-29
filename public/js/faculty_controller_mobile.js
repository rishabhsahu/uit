
var controller = {
  absent: {students:[]},
  markpresent:0,

  facultyData: function(){
    document.getElementById("main").innerHTML = "";
    document.getElementById('mobile-home-section').style.color = "black";
    document.getElementById('mobile-report-section').style.color = "grey";
    document.getElementById('mobile-personal-section').style.color = "grey";
    var day_today = (new Date()).getDay();
    var requestFacultyData = new XMLHttpRequest();

    if(!requestFacultyData){
      alert('error')
    }

    requestFacultyData.open('GET','http://localhost:80/faculty/requestFacultyData',true);
    requestFacultyData.send(null)

    requestFacultyData.onreadystatechange = function(){
      var response = requestFacultyData.response;
      if( requestFacultyData.status === 200 && requestFacultyData.readyState === XMLHttpRequest.DONE){

          response = JSON.parse(response);
          console.log(response);
          var arr = [];
          var school = response._id.split('@')[1];
          model.personalInfo = {};
          model.personalInfo.current_classes = [];
          model.personalInfo.current_classes = response.current_classes;
          model.personalInfo.absent = [];
          model.personalInfo.absent = response.absent;
          model.personalInfo.reason = {};
          model.personalInfo.reason = response.reason;
          model.personalInfo.name = response.name;
          model.personalInfo.first = response.first;
          model.personalInfo.last = response.last;
          model.personalInfo.mobile = response.mobile;
          model.personalInfo.email = response.email;
          model.personalInfo.dob = response.dob;
          model.personalInfo.school = response.school;
          model.personalInfo.school_id = response.domain_name;
          model.personalInfo.profileSetUp = response.profileSetUp;
          model.personalInfo._id = response._id;

            model.personalInfo.current_classes.forEach(function(t,n){
              if(t.schedule && t.schedule[day_today] != "0"){
                console.log((new Date()).getDay());
                arr.push({"class":t.class,"period":t.schedule[day_today]});
              }
            })
            model.classes_today = arr;
            console.log(model);
          } else if(requestFacultyData.status === 504 && requestFacultyData.readyState === 4){
            controller.notifyUser("Internal Server Error. Please Try again",0);
          }
          view.loadHome();
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
              case 'score':
                view.showScoreOptions();
                break;
            }
      } else if(attendance.status === 504 && attendance.readyState === 4){
        controller.notifyUser("Internal Server Error. Try again",0);
      }
    }

      attendance.open('GET','http://localhost:80/faculty/getStudentList/' + _id,true);
      attendance.send(null);
    })
},

routes: function(e){
  model.route = e.target.id.split('#')[0];
  var id = e.target.id.split('#')[1];
  model.selectedBatch = [];
  model.selectedBatch._id = id;
  model.personalInfo.current_classes.forEach(function(x,i){
    if( x._id === id){
      model.selectedBatch = model.personalInfo.current_classes[i];
    }
  })
  console.log(model.route);
  switch(model.route){
    case 'attendance':
      view.closeBatchOptionModal(1);
      this.getStudentList();
      break;
    case 'report':
      controller.getReport();
      break;
    case 'score':
      view.closeBatchOptionModal();
      this.getStudentList();
      break;

    case "schedule":
      view.setScheduleModal();
      view.closeBatchOptionModal();
      break;

    case "notifyClass":
        view.notifyClass();
        view.closeBatchOptionModal();
        break;

    case "download":
        window.open(id,'_blank');
        break;

    case "absent":
        this.willBeAbsent(Number(id));
        break;
  }
},

takeAttendance: function(){

  var name = "";
  model.students.forEach(function(student,i){
    if(student.name && student.enroll_number){
      if(controller.absent.students.indexOf(student.enroll_number)<0){
        name += "<div onclick='controller.markAbsent(event)' class='col-xs-12 text-left student' style='background-color:lightgreen;text-transform:capitalize;color:grey;border-bottom:solid 1px rgba(160,160,160,.4);padding-top:10px;padding-bottom:10px;cursor:pointer' " + "id=" + student.enroll_number + ">" + student.name + "<br>" + student.enroll_number +"</div>";
      } else {
        name += "<div onclick='controller.markAbsent(event)' class='col-xs-12 text-left student' style='text-transform:capitalize;color:black;background-color:rgb(239, 108, 88);padding-top:10px;padding-bottom:10px;cursor:pointer' " + "id=" + student.enroll_number + ">" + student.name + "<br>" + student.enroll_number +"</div>";
      }
    }
  })
  document.getElementById("main").innerHTML = "<div id='counter' onclick='controller.clearList()' style='cursor:pointer' onclick=''><div style='width:20px;height:20px;' id='count'>" + controller.absent.students.length + "</div></div><div id='attendance-options' style='cursor:pointer' onclick='view.showAttendanceOptions()'><div class='glyphicon glyphicon-calendar' style='width:20px;height:20px;color:black'></div></div><div id='inverse-button' style='cursor:pointer' onclick='controller.inverse()'><div class='glyphicon glyphicon-list-alt' style='width:20px;height:20px;color:black'></div></div><div class='col-xs-12 batches_box' id='attendance-box'><div class='row' id='student_list_box' style='background-color:white'>" + name +"</div></div></div><div id='send-button' onclick='controller.submitData()'><span style='padding:15px;background-color:rgba(56,103,211,1);border-radius:30px;border:solid 1px grey;cursor:pointer' class='glyphicon glyphicon-send'></span></div><div id='send-message-selected' onclick='controller.sendMessageSelectedModal()'><span style='padding:15px;background-color:white;border-radius:50%;border:solid 1px grey;cursor:pointer;box-shadow: 0px 8px 10px rgba(0,0,0,.4);' class='glyphicon glyphicon-envelope'></span></div>";
  document.getElementById('main').innerHTML += "<div class='modal col-xs-12' id='attendance-options-modal' style='background-color: rgba(0,0,0,.9)'><div style='margin-top: 100px' class='row'><hr class='col-xs-8 col-xs-offset-2'><br><br><h3 style='color:white'>Select a New Date</h3><br><div class='col-xs-12'><select id='allDates'></select></div><div class='col-xs-12'><select id='allMonth'></select></div><div class='col-xs-12'><select id='allYear'></select></div></div><div class='col-xs-12' style='font-size:20px;color:white;margin-top:20px'><div class='btn btn-danger' onclick='controller.dateSelected2()'>Select</div></div></div></div>";

},

inverse: function(){
  this.absent.students = [];
  var els = document.getElementsByClassName('student');
  if(this.markpresent === 0){
    this.markpresent = 1;
    model.students.forEach(function(x,i){
      if(x.name && x.enroll_number){
        document.getElementById(x.enroll_number).style.backgroundColor = "rgb(239, 108, 88)";
        controller.absent.students.push(x.enroll_number);
        document.getElementById(x.enroll_number).style.color = "black";
      }
    })
  } else {
    this.markpresent = 0;
    Array.prototype.forEach.call(els,function(el,i){
        el.style.backgroundColor = "lightgreen";
        el.style.color = "grey";
    })
  }
  document.getElementById('count').innerHTML = this.absent.students.length;
},

clearList: function(){
  this.absent.students = [];
  this.takeAttendance();
},

markAbsent: function(e){
  var student_id = e.target.id;
  console.log(student_id);
  if(this.absent.students.indexOf(student_id)<0){
    document.getElementById(student_id).style.backgroundColor= "rgb(239, 108, 88)";
    document.getElementById(student_id).style.color= "black";
    this.absent.students.push(student_id);
    document.getElementById('count').innerHTML = this.absent.students.length;
  } else {
    document.getElementById(student_id).style.backgroundColor= "lightgreen";
    document.getElementById(student_id).style.color= "grey";
    this.absent.students.splice(this.absent.students.indexOf(student_id),1);
    document.getElementById('count').innerHTML = this.absent.students.length;
  }
  console.log(this.absent.students);
},

submitData: function(){
  document.getElementById('attendance-box').style.display= 'none';
  document.getElementById('send-button').style.display= 'none';
  this.absent.subject = model.selectedBatch.subject;
  this.absent.mobile = [];
  model.students.forEach(function(x,i){
      if(controller.absent.students.indexOf(x.enroll_number)>-1){
        controller.absent.mobile.push(x.mobile);
      }
  })
  if(!this.absent.hasOwnProperty('date')){
    console.log(controller);
    var d = new Date();
    d.setSeconds(0);
    d.setHours(0);
    d.setMinutes(0);
    d.setMilliseconds(0);
    this.absent.date = d.valueOf();
  }
  console.log(JSON.stringify(this.absent))
  var SAD = new XMLHttpRequest();

  SAD.onreadystatechange = function(){
    if(SAD.readyState == 4 && SAD.status == 200){

      controller.absent.students = [];
      delete controller.absent.date;
      controller.facultyData();
      controller.notifyUser("Attendance Data Submit. Parents of Absent students are informed",1);
    } else if(SAD.status === 504 && SAD.readyState == 4){

      controller.absent.students = [];
      delete controller.absent.date;
      controller.facultyData();
      controller.notifyUser("Internal Server Error. Please Try again",5);
    }
  }


    SAD.open("POST","http://localhost:80/faculty/submitData/" + model.selectedBatch._id,true)
    SAD.setRequestHeader('Content-Type','application/json');
    SAD.send(JSON.stringify(this.absent));

},

dateSelected: function(){
  var L = model.months.indexOf(document.getElementById('selectedMonth').value);
  var T = document.getElementById('selectedDate').value + '/' + L + '/' + document.getElementById('selectedYear').value;
  controller.absent.date = new Date(Number(document.getElementById('selectedYear').value),L,Number(document.getElementById('selectedDate').value)).valueOf();
  console.log(controller.absent.date);
  document.getElementById('attendance-options-modal').style.display = "none";
},

dateSelected2: function(){
  var L = model.months.indexOf(document.getElementById('allMonth').value);
  controller.absent.date = new Date(Number(document.getElementById('allYear').value),L,Number(document.getElementById('allDates').value)).valueOf();
  console.log(controller.absent.date);
  document.getElementById('attendance-options-modal').style.display = "none";
},

getReport: function(){
  var requestReport = new XMLHttpRequest();

  requestReport.onreadystatechange = function(){
    if(requestReport.readyState == 4 && requestReport.status == 200){
      model.reportData = JSON.parse(requestReport.response);
      var reportData = model.reportData;
      console.log(model.reportData);
      var x = "<div id='downloads'><span class='glyphicon glyphicon-download' style='font-size:20px;padding:5px;'></span></div><div class='row' style='overflow-x: hidden;margin-right:0px'><div class='col-xs-12' id='student_list_box'>";
      var dcs = 1;

      reportData.student_data.forEach(function(student){
        var count = 0;
        if(student[model.selectedBatch.subject] === undefined){
           student[model.selectedBatch.subject] = {};
         }

         if(student[model.selectedBatch.subject].absent === undefined){
            student[model.selectedBatch.subject].absent = [];
          }
        if(model.selectedBatch.classes_held.length > dcs){
          dcs = model.selectedBatch.classes_held.length;
        }

        count = model.selectedBatch.classes_held.length - student[model.selectedBatch.subject].absent.length;

        var tests = "";
        if(student[model.selectedBatch.subject].hasOwnProperty('scores')){
          tests = "<div class='row text-left'><div class='col-xs-12' style='padding-left:0px;'>";
          var ts = student[model.selectedBatch.subject]["scores"];
          ts = student[model.selectedBatch.subject]["scores"].slice(-2);
          ts.forEach(function(m,n){
            tests += "<div class='col-xs-5 text-primary' style='padding-right:0px;font-size:12px;color:green;font-weight:bold'><span style='color:rgb(70,70,70)'>" + m.test_name + "</span> - " + m.score + "/" + m.max_score + "</div>"
          })
          tests += "</div></div>";
        } else {
        }
           if(student.name && student.enroll_number){
             x += "<div class='row'><div class='col-xs-10 col-xs-offset-1' style='padding-top:10px;padding-bottom:10px;margin-top:5px;cursor:pointer;background-color:white;border:solid 1px rgba(180,180,180,.8);box-shadow:0px 1px 5px rgba(200,200,200,.8);border-radius:3px;font-family:Roboto'><div class='row text-left'><div class='col-xs-12'><span class='' style='font-size:14px;text-transform:capitalize;'><b>" + student.name + "</b></span></div></div><div class='row'><div class='col-xs-9'><div class='row text-left'><div class='col-xs-12' style='font-size:12px'>" + student.enroll_number + "</div><div class='col-xs-12' style='color:rgb(70,70,70);font-size:14px;font-weight:bold'>Attendance ( <span style='color:rgb(17, 45, 89)'>" + count + "/" + dcs + "</span> ) <span style='color:green'>" + Math.ceil((count/dcs)*100) + "%</span></div><div class='col-xs-12'>" + tests + " </div></div></div><div class='col-xs-3 glyphicon glyphicon-option-vertical' style='margin-top:-5px;font-size:16px;color:rgb(70,70,70)'></div></div></div></div>";
           }
      })
      document.getElementById("main").innerHTML = x;
      let options = [
        {
          id:"download#http://localhost:80/download/attendanceOverview/" + model.selectedBatch._id + "/" + model.personalInfo._id + "/" + model.selectedBatch.subject,
          title: "Attendance( Overview )"
        }
      ]
      document.getElementById('downloads').addEventListener('click',function(){view.showBatchOptionModal("Select Download",options,model.selectedBatch._id)})
    } else if(requestReport.status === 504 && requestReport.readyState === 4){
      controller.notifyUser("Internal Server Error. Try again",0);
    }
  }

  requestReport.open("GET","http://localhost:80/faculty/report/" + model.selectedBatch._id + '/' + model.selectedBatch.subject ,true);
  requestReport.send(null);
},

submitScores: function(){
  model.studentScores.test_name = model.scoreSettings[0]["Test Name"]
  model.studentScores.max_score = model.scoreSettings[1]["Maximum Score"]
  model.studentScores.test_id = model.selectedBatch._id + "/" + model.selectedBatch.class + "/" + model.selectedBatch.subject + "/" + model.scoreSettings[0]["Test Name"]
  var SSR = new XMLHttpRequest();

  SSR.onreadystatechange =  function(){
    if(SSR.readyState == 4 || SSR.status == 200){

      delete model.studentScoreArray ;
      delete model.scoreSettings ;
      controller.facultyData();
      controller.notifyUser("Scores Added succesfully",1);
    } else if(SSR.status === 504 && SSR.readyState == 4){

      delete model.studentScoreArray ;
      delete model.scoreSettings ;
      controller.facultyData();
      controller.notifyUser("Internal Server Error. Try again",5);
    }
  }
  SSR.open('POST','http://localhost:80/faculty/submitscores/' + model.selectedBatch._id + '/' + model.selectedBatch.subject, true);
  SSR.setRequestHeader('Content-Type','application/json');
  SSR.send(JSON.stringify(model.studentScores));
},

addScoreSetting: function(){
  var obj = {};
  obj[model.scoreSettinglist[model.scoreSettingCount]] = document.getElementById('scoreSettingInput').value;
  document.getElementById('scoreSettingInput').value = "";
  document.getElementById('scoreSettingInput').focus();
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
      view.closeBatchOptionModal();
      controller.facultyData();
      controller.notifyUser("Marked Absent",1);
    } else if(xhr.status === 504){
      view.closeBatchOptionModal();
      controller.facultyData();
      controller.notifyUser("Internal Server error",0);
    }
  }

  xhr.open('POST','http://localhost:80/faculty/markabsent',true);
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.send(JSON.stringify(obj))
},

check: function(){
  if(model.fields[model.setupcounter].id != "dob" && document.getElementById(model.fields[model.setupcounter].id).value.length===0){
    document.getElementById('showRequiredError#' + model.fields[model.setupcounter].id).innerHTML = "<span class='glyphicon glyphicon-asterisk' style='color:red'></span>";
    document.getElementById(model.fields[model.setupcounter].id).style.borderColor = "red";
  } else if(model.fields[model.setupcounter].id != "dob" && document.getElementById(model.fields[model.setupcounter].id).value.length != 0){
    switch(model.fields[model.setupcounter].id){
      case "mobile":
      if(document.getElementById('mobile').value.toString().length === 10){
        var i = 0;
        while(i<10){
          if(Number(document.getElementById('mobile').value.toString().charAt(i)) == document.getElementById('mobile').value.toString().charAt(i)){
            i++;
            if(i===9){
              model.profile[model.fields[model.setupcounter].id] = document.getElementById(model.fields[model.setupcounter].id).value;
              model.setupcounter++ ;
              view.setUpProfile();
            }
          } else {
            alert("Invalid Mobile Number");
            view.setUpProfile();
          }
        }
      } else {
        alert("Invalid Mobile Number");
        view.setUpProfile();
      }
      break;
      case "email":
        if(document.getElementById('email').value.indexOf('@')>0 && document.getElementById('email').value.indexOf('.com')>3 ){
          model.profile[model.fields[model.setupcounter].id] = document.getElementById(model.fields[model.setupcounter].id).value;
          model.setupcounter++ ;
          view.setUpProfile();
        } else {
          alert("Invalid Email address");
          view.setUpProfile();
        }

      case "password":
          model.profile[model.fields[model.setupcounter].id] = document.getElementById(model.fields[model.setupcounter].id).value;
          model.setupcounter++ ;
          view.setUpProfile();
          break;

      case "reenterpassword":
          if(model.profile.password === document.getElementById("reenterpassword").value){
            this.setUpProfile();
          } else {
            alert("Password Did not matched");
          }

      default:
        model.profile[model.fields[model.setupcounter].id] = document.getElementById(model.fields[model.setupcounter].id).value;
        model.setupcounter++ ;
        view.setUpProfile();
        break;
    }
  } else if( model.fields[model.setupcounter].id === "dob"){
    model.profile[model.fields[model.setupcounter].id] = (new Date(document.getElementById('birthYear').value,document.getElementById('birthMonth').value,document.getElementById('birthDate').value)).valueOf();
    model.setupcounter++ ;
    view.setUpProfile();
  }
},

setUpProfile: function(){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(xhr.status===200 && xhr.readyState===4){
      console.log(this);
      controller.logout();
    }
  }

  xhr.open('POST','http://localhost:80/faculty/setupprofile',true);
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.send(JSON.stringify(model.profile));
},

setSchedule: function(){
  var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var obj = {"schedule":[],batch_id:model.selectedBatch._id};

  for(var i=0; i<6;i++){
    var t = document.getElementById('day' + i).value;
    if(t && t>0){
      obj["schedule"].push(t);
    } else {
      obj["schedule"].push(0);
    }
  }
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4 && xhr.status === 200){
      view.closeSetSchedule();
      view.loadReportSection();
    } else if(xhr.status === 504 && xhr.readyState === 4){
      controller.notifyUser("Internal Server Error. Try again",0);
    }
  }
  console.log(obj);
  xhr.open('POST','http://localhost:80/faculty/setschedule',true);
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.send(JSON.stringify(obj));
},

notifyClass: function(){
  var obj = {};

  var xhr = new XMLHttpRequest();
  obj.batch_id = model.selectedBatch._id;
  obj.text = document.getElementById('notify-text').value;
  xhr.onreadystatechange = function(){
    if(xhr.status === 200 && xhr.readyState === 4){
      view.closeNotifyClass();
    } else if(xhr.status === 504){
      view.closeNotifyClass();
      controller.notifyUser("Internal Server Error. Try again",5);
    }
  }
  xhr.open('post','http://localhost:80/sendsms/notifyclass',true);
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.send(JSON.stringify(obj));
},

sendMessageSelectedModal: function(){
  document.getElementsByTagName('body')[0].innerHTML += "<div class='col-xs-12 modal' style='background-color:black' id='notifyClass'><div class='row text-center'><div class='col-xs-8 col-xs-offset-2' style='background-color:white;border-radius:5px;margin-top:10%;'><div class='row'><div class='col-xs-12' style='border-bottom: solid 1px rgba(0,0,0,.8);margin-bottom:15px'><h3>Write Text</h3></div><div class='col-xs-12' style='padding-bottom:15px;'><textarea id='message-text' type=text maxlength='160' rows=5 style='border: solid 1px rgba(60,60,60,.5)' size=15 style='height:100px' placeholder='Notify about Test, Books etc'></textarea></div><div class='col-xs-12' style='margin-top:10px;margin-bottom:10px' onclick='controller.sendMessageSelected()'>Send</div></div></div></div><div class='row' style='margin-top:20px'><div class='col-xs-12 text-center' style='position:absolute;bottom:50px'><span class='glyphicon glyphicon-remove' style='font-size:24px;color:white' onclick='view.closeNotifyClass()'></span></div></div></div>";
  document.getElementById('notifyClass').style.display = "block";
},

sendMessageSelected: function(){
  var obj = {};
  var mobiles = [];
  obj.batch_id = model.selectedBatch._id;
  obj.text = document.getElementById('message-text').value;

  model.students.forEach(function(std,i){
    if(controller.absent.students.indexOf(std.enroll_number.toString())>-1){
      mobiles.push(std.mobile);
    }
  })

  obj.mobiles = mobiles;
  console.log(obj);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.status === 200 && xhr.readyState === 4){
      view.closeNotifyClass();
      controller.notifyUser("SMS sent to selected students",1);
    } else if(xhr.status === 504 && xhr.readyState === 4){
      view.closeNotifyClass();
      controller.notifyUser("Internal Server Error. Try again",5);
    }
  }
  xhr.open('post','http://localhost:80/sendsms/messageselected',true);
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.send(JSON.stringify(obj));
},

notifyUser: function(str,a){
  if(a===0){
    document.getElementById('notifText').style.backgroundColor = "red";
    document.getElementById('notifText').innerHTML = str;
    document.getElementById('notifyUser').style.display = "block";
    setTimeout(function(){
      document.getElementById('notifyUser').style.display = "none";
    },4000);

  } else if(a===1){
    document.getElementById('notifText').style.backgroundColor = "lightgreen";
    document.getElementById('notifText').innerHTML = str;
    document.getElementById('notifyUser').style.display = "block";
    setTimeout(function(){
      document.getElementById('notifyUser').style.display = "none";
    },4000);

  } else if(a===5){
    document.getElementById('notifText2').innerHTML = str;
    document.getElementById('notifyError').style.display = "block";
    setTimeout(function(){
      document.getElementById('notifyError').style.display = "none";
    },4000);
  }
},

logout: function(){
  var logoutRequest = new XMLHttpRequest();
  logoutRequest.onreadystatechange = function(){
    if(logoutRequest.readyState === 4 && logoutRequest.status === 200){
      window.location = "http://localhost:80";
    }
  }
  logoutRequest.open('GET','http://localhost:80/logout',true);
  logoutRequest.send();
}


};

window.onload = controller.facultyData
