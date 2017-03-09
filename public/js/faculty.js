var view ={
      home: "<div class='col-md-9 col-xs-10 col-xs-12 left'> <div class='row'> <div class='col-md-5 col-xs-12 col-xs-offset-1 panel panel2 text-center'> <div class='row'> <h5 class='classHead0'>Class X</h5></div><div class='row class_info'> </div><div class='col-xs-12 text-center classes_buttons'> <button id='classX' class='col-xs-6 btn btn-info'>attendance</button> <button id='classX_report' class='col-xs-5 col-xs-offset-1 btn btn-info'>reports</button> </div></div><div class='col-md-5 col-xs-12 col-xs-offset-1 panel panel2 text-center'> <div class='row'> <h5 class='classHead0'>Class X</h5></div><div class='row class_info'> </div><div class='col-xs-12 text-center classes_buttons'> <button id='classX' class='col-xs-6 btn btn-info'>attendance</button> <button id='classX_report' class='col-xs-5 col-xs-offset-1 btn btn-info'>reports</button> </div></div><div class='col-md-3 col-xs-12 col-xs-offset-1 panel panel_setting text-center'> <h4 style='color:black;font-weight:bold'>Setting</h4> <div class='row setting_list'> <div class='col-xs-12 setting' id='add_staff'>Add Student</div><div class='col-xs-12 setting' id='remove_staff'>Remove Student</div><div class='col-xs-12 setting' id='remove_staff'>Edit Student Record</div><div class='col-xs-12 setting' id=>Submit Report to HOD</div><div class='col-xs-12 setting'>Change Password</div></div></div><div class='col-md-7 col-md-offset-1 col-xs-12 col-xs-offset-1 panel text-center'> <div class='row' style='color:black;font-size:24px;font-weight:bold' class='col-xs-12'> <div class='col-xs-12'>Reports</div></div><div class='row' style='background-color:white;height:40%;overflow-y:auto;'> <div class='col-xs-12 text-center' style='font-size:150%;' id='showReport'> <div style='opacity:.7;position:relative;top:100px;'>select batch</div></div></div></div></div></div><div class='col-md-3 col-xs-12'> <div style='' class='col-md-12 panel text-center col-xs-12'> <div style='color:black;font-size:160%;'>Name</div><hr style='box-shadow: 5px .5px 10px lightgrey'> <div class='row panel_dept_info'> </div></div><div style='max-height:150px;' class='col-md-12 panel text-center col-xs-12'> <h4 style='color:black;font-weight:bold;'>Time Table</h4> <div class='row time_table'> </div></div></div>",

      loadHome: function(){
        document.getElementById("nextSection").innerHTML = view.home;
        controller.present.students = [];
        controller.facultyData();
      },

      showReport:function(x){
        document.getElementById("showReport").innerHTML = x;
      },

      updateFacultyData: function(){
        console.log(model);
          for(var i=0;i<1;i++){
            document.getElementsByClassName("class_info")[i].innerHTML = "<div class='col-xs-6 text-center'>subject:</div><div class='col-xs-6 text-danger'>" + model.classX.subject + "</div><div class='col-xs-6 text-center'>strength:</div><div class='col-xs-6'>" + model.classX.strength + "</div><div class='col-xs-6 text-center'>classes held:</div><div class='col-xs-6'>" + model.classX.classesHeld + "</div><div class='col-xs-6 text-center'>first class:</div><div class='col-xs-6'>" + model.classX.firstClass + "</div>";
          }
      },

      updatePersonalInfo: function(){
        document.getElementsByClassName('panel_dept_info')[0].innerHTML = "<div class='col-xs-7 text-center'>Department</div><div class='col-xs-5 text-danger'>" + model.personalInfo.department + "</div><div class='col-xs-7 text-center'>Joined:</div><div class='col-xs-5'>" + model.personalInfo.joined + "</div><div class='col-xs-7 text-center'>Classes:</div><div class='col-xs-5'>" + model.personalInfo.status + "</div><div class='col-xs-7 text-center'>Status:</div><div class='col-xs-5 text-info'>" + model.personalInfo.classes + "</div><div class='col-xs-7 text-center'>subjects A:</div><div class='col-xs-5 text-info'>" + model.personalInfo.subjectA + "</div><div class='col-xs-7 text-center'>subjects B:</div><div class='col-xs-5 text-info'>" + model.personalInfo.subjectB + "</div>";

      }
};

var model = {
  months: ["january","february","march"],
  user:"<%= user %>",
  students: [],

    classX: {
        batch:'',
        subject:'',
        strength:'',
        classesHeld:'',
        firstClass:''
    },

    classY: {
        batch:'',
        subject:'',
        strength:'',
        classesHeld:'',
        firstClass:''
    },

    personalInfo: {
      name: "",
      department: "",
      joined: "",
      status: "",
      subjectA: "",
      subjectB: ""
    }
};

var controller = {
  present: {students:[]},

  facultyData: function(){
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
          model.personalInfo.name = response.name;
          model.personalInfo.department = response.department;
          model.personalInfo.joined = response.joined;
          model.personalInfo.college = response.college;
          model.personalInfo.status = response.status;
          model.personalInfo.subjectA = response.current_classes[0].subject;

          console.log(response);
          response.current_classes.forEach(function(x,i){
              model.classX.batch = x.batch;
              model.classX.branch = x.branch.toLowerCase();
              model.classX.semester = x.semester;
              model.personalInfo.classes = x.branch + ', ' + x.semester + 'th Sem';
              model.classX.subject = x.subject.toUpperCase();
              model.classX.strength = x.strength;
              model.classX.classesHeld = x.classes_held.length;
              model.classX.firstClass = x.classes_held[0];
          })
          view.updateFacultyData();
          view.updatePersonalInfo();
          document.getElementById('classX').onclick = controller.getStudentList;
          document.getElementById('classX_report').onclick = controller.getReport;

        } else {
        }
    }

  },

  getStudentList: function(e){
    var id = e.target.id
    console.log(id)
    var inf = model[id]
    console.log(inf)
    var attendance = new XMLHttpRequest();

    attendance.onreadystatechange = function(){
      var response = attendance.response;
      var students = [];
      if( attendance.status === 200 && attendance.readyState === XMLHttpRequest.DONE){
        if(response == '0' ){
          document.getElementById('notification_box').innerHTML = 'no notifications'
        } else {
          response = JSON.parse(response);
          model.students = response;

          response.forEach(function(student){
            students.push(student.name);
          });
          console.log(model.students);
          controller.takeAttendance();


        }
    } else {}
  }

    attendance.open('GET','http://localhost:3000/faculty/getStudentList/' + model.personalInfo.college + "/" + inf.batch + '/' + inf.branch,true);
    attendance.send(null);
},

takeAttendance: function(){
  var name = "";
  model.students.forEach(function(student,i){
    console.log(student)
    name += "<div class='col-xs-12 names' style='color:black;background-color:rgba(255,51,51,0.9);font-size:130%;margin-top:1%;' " + "id=#" + i + ">" + student.name + "</div>";
  })
  document.getElementById("nextSection").innerHTML = "<div style='height:70%;background-color: rgba(2,62,53,.9);' class='col-md-4 col-xs-8 col-xs-offset-2 col-md-offset-4 panel panel2 text-center'> <h5 style='color:black;display:block;margin-top:0;font-weight:bold;'>student list</h5> <div class='row student_list' style='height:80%;display:block;background-color:white;font-size:14px;' onclick='controller.markPresent(event)'>" + name + "</div><div style='position:relative;top:4%;font-size:16px'> <div style='border-radius:50%;cursor:pointer;color:black' class='col-xs-2 col-xs-offset-2' onclick='controller.submitData()'><img width='90%' class='img-responsive' src='img/confirm.png'></div><div style='border-radius:50%;cursor:pointer;color:black' class='col-xs-offset-4 col-xs-2' onclick='view.loadHome()'>img width='90%' class='img-responsive' src='img/close.png'></div></div></div>";
},
//"<div style='text-align:center;position:absolute;top:30%;background-color:lightblue;color:black;border-radius:3px;' class='text-center col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-4'><div class='row'><h3 class='col-xs-12'>" + model.students[this.count].name + "</h3></div><div style='background-color:rgba(231,228,230,1);' class='row'><a class='col-xs-4 col-xs-offset-1 text-danger' style='font-size:20px;border-radius:5px;margin-top:15px;margin-bottom:15px;background-color: rgba(151,94,151,1)' id='absent' onclick='controller.markAbsent()'>Absent</a><a class='col-xs-4 col-xs-offset-2 text-info' style='font-size:20px;border-radius:5px;margin-top:15px;margin-bottom:15px;background-color: rgba(151,94,151,1)' id='present' onclick='controller.markPresent()'>Present</a></div></div>"
markPresent: function(e){
  var e = e.target.id;
  console.log(document.getElementById(e).innerHTML);
  if(this.present.students.indexOf(document.getElementById(e).innerHTML)<0){
    document.getElementById(e).style.backgroundColor= "lightgreen";
    document.getElementById(e).style.color= "white";
    this.present.students.push(document.getElementById(e).innerHTML);
  } else {
    document.getElementById(e).style.backgroundColor= "rgba(255,51,51,0.9)";
    document.getElementById(e).style.color= "white";
    this.present.students.splice(this.present.students.indexOf(document.getElementById(e).innerHTML),1);
  }
  console.log(this.present.students)
},

submitData: function(){
  this.present.subject = model.classX.subject
  this.present.user = model.user
  this.present.month = (new Date()).getMonth();
  this.present.date = (new Date()).getDate();
  console.log(JSON.stringify(this.present))
  var SAD = new XMLHttpRequest();

  SAD.onreadystatechange = function(){
    if(SAD.readyState == 4 || SAD.status == 200){
      view.loadHome();
    } else {
      console.log("sending data");
    }
  }

  SAD.open("POST","http://localhost:3000/faculty/submitData/uit-rgpv/ec-a/14",true)
  SAD.setRequestHeader('Content-Type','application/json');
  SAD.send(JSON.stringify(this.present))
},

getReport: function(e){
  var e = e.target.id
  e = e.split('_')
  e = e[0]
  console.log(e)
  var requestReport = new XMLHttpRequest();

  requestReport.onreadystatechange = function(){
    if(requestReport.readyState == 4 || requestReport.status == 200){
      var reportData = JSON.parse(requestReport.response);
      console.log(reportData);
      var x = "<table class='table-responsive table-striped' class='col-xs-12'><tr class='row' style='font-size:18px;'><th class='col-xs-6 text-center'>Name</th><th class='col-xs-3 text-center'>Attendance</th><th class='col-xs-3 text-center'>Percentage</th></tr>";
      var max = 1;
      reportData.attendance.forEach(function(student){
        var count = 0;
        if(student[model[e].subject] === undefined){
           student[model[e].subject] = [];
         }

         for(var props in student[model[e].subject]){
           if( model.months.indexOf(props)>=0 ){
             count += student[model[e].subject][props].length;
           }
         }
        if(count>max){
          max = count;
        }
      });
      reportData.attendance.forEach(function(student){
        var count = 0;
        if(student[model[e].subject] === undefined){
           student[model[e].subject] = [];
         }

         for(var props in student[model[e].subject]){
           if( model.months.indexOf(props)>=0 ){
             count += student[model[e].subject][props].length;
           }
         }
         console.log(max);
         x += "<tr style='font-size:14px;font-family:notosans;' class='row'><td class='col-xs-4 text-center'><div class='btn btn-success'>" + student.name + "</div></td><td class='col-xs-4 text-center'>" + count + "</td><td class='col-xs-4 text-center'>" + (count/max)*100 + "</td></tr>";
      })
      x += "</table>";
      view.showReport(x);
    } else {
      document.getElementById("showReport").innerHTML = "<div style='position:relative;top:75px;'>loading ...</div>";
    }
  }

  requestReport.open("GET","http://localhost:3000/faculty/report/" + model.personalInfo.college + "/" + model[e].branch + "/"+ model[e].batch + "/" + model[e].subject,true);
  requestReport.send(null);
}
};

window.onload = view.loadHome;
