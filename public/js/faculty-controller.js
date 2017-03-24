var view ={
      home: "<div class='col-md-9 col-xs-10 col-xs-12 left'> <div class='row'><div class='col-md-3 col-xs-12 col-xs-offset-1 panel panel_batch text-center' id='panel_batch'> <h4 style='color:black;font-weight:bold'>Batches</h4>"
       + "<div class='row batch_list' id='batch_list'></div></div><div class='col-md-7 col-md-offset-1 col-xs-12 col-xs-offset-1 panel text-center'>" +
      " <div class='row' style='color:black;font-size:24px;font-weight:bold' class='col-xs-12'> <div class='col-xs-12'>Reports</div></div><div class='row' style='background-color:white;height:70%;overflow-y:auto;'> <div class='col-xs-12 text-center' style='font-size:150%;' id='showReport'> <div style='opacity:.7;position:relative;top:100px;'>select batch</div></div></div></div></div></div><div class='col-md-3 col-xs-12'> <div style='' class='col-md-10 panel text-center col-xs-12'> <div style='color:black;font-size:160%;'>Name</div><hr style='box-shadow: 5px .5px 10px lightgrey'> <div class='row panel_dept_info'> </div></div><div style='max-height:150px;' class='col-md-10 panel text-center col-xs-12'> <h4 style='color:black;font-weight:bold;'>Time Table</h4> <div class='row time_table'> </div></div></div>",

      loadHome: function(){
        document.getElementById("nextSection").innerHTML = view.home;
        document.getElementById('nextSection').innerHTML += "<div class='col-xs-12 modal' id='batchData'><div class='row'><div class='col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4 modal-content text-center' id='batchDataContent'></div></div></div>"
        controller.present.students = [];
        controller.facultyData();
      },

      showReport:function(x){
        document.getElementById("showReport").innerHTML = x;
      },

      updateFacultyData: function(){
        console.log(model);
        var content = "";
        model.personalInfo.current_classes.forEach(function(x,i){
          content += "<div class='col-xs-8 col-xs-offset-2 btn btn-warning batches' id='" + x._id + "'>" + x.semester + "th, Sem" + "</div>";
        })
        document.getElementById('batch_list').innerHTML = content;
        model.personalInfo.current_classes.forEach(function(x,i){
          document.getElementsByClassName('batches')[i].onclick = view.showBatchDataModal;
        })

      },

      updatePersonalInfo: function(){
        document.getElementsByClassName('panel_dept_info')[0].innerHTML = "<div class='col-xs-7 text-center'>Department</div><div class='col-xs-5 text-danger'>" + model.personalInfo.department + "</div><div class='col-xs-7 text-center'>Joined:</div><div class='col-xs-5'>" + model.personalInfo.joined + "</div><div class='col-xs-7 text-center'>Classes:</div><div class='col-xs-5'>" + model.personalInfo.status + "</div><div class='col-xs-7 text-center'>Status:</div><div class='col-xs-5 text-info'>" + model.personalInfo.classes + "</div><div class='col-xs-7 text-center'>subjects A:</div><div class='col-xs-5 text-info'>" + model.personalInfo.subjectA + "</div><div class='col-xs-7 text-center'>subjects B:</div><div class='col-xs-5 text-info'>" + model.personalInfo.subjectB + "</div>";
        view.updateFacultyData();

      },

      showBatchDataModal: function(e){
        var id = e.target.id;
        model.selectedBatch = {};
        model.personalInfo.current_classes.forEach(function(x,i){
          if( x._id === id){
            model.selectedBatch = model.personalInfo.current_classes[i];
            document.getElementById('batchData').style.display = "block";
            document.getElementById('batchDataContent').innerHTML = "<div class='row' id='batchData'><div class='col-xs-12 text-right' style='font-size: 24px;cursor:pointer' onclick='view.closeModal()'>&times;</div></div><div class='row text-center text-danger' style='border-bottom: 1px solid lightgrey'><h4 class='col-xs-12'>" + x.semester + "th, Sem</h4></div><div class='row' style='padding-top:10px'><div class='col-xs-6 text-success'>Subject :</div><div class='col-xs-6'>" + x.subject + "</div></div><div class='row' style='padding-top:10px'><div class='col-xs-6 text-success'>First Class :</div><div class='col-xs-6'>" + x.classes_held[0] + "</div></div><div class='row' style='padding-top:10px'><div class='col-xs-6 text-success'>Batch :</div>" + x.batch + "</div></div><div class='row' style='padding-top:10px'><div class='col-xs-6 text-success'>Class Held:</div><div class='col-xs-6'>" + x.classes_held.length + "</div></div><hr><div class='row' style='padding-top:5px'><div class='col-xs-6 text-success'><div class='btn btn-info' onclick='controller.getStudentList()'>Attendance</div></div><div class='col-xs-6'><div class='btn btn-success' onclick='controller.getReport()'>Report</div></div></div>";
          } else {

          }
        })
      },

      closeModal: function(){

        document.getElementById('batchData').style.display = "none";
      }
};

var model = {
  months: ["january","february","march"],
  students: [],
  personalInfo: {},
  selectedBatch: {}
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
          model.personalInfo = response;
          console.log(model);

          view.updatePersonalInfo();

        } else {
        }
    }

  },

  getStudentList: function(){
    model.students = [];
    console.log(model);
    model.personalInfo.current_classes.forEach(function(x,i){
      var attendance = new XMLHttpRequest();

      attendance.onreadystatechange = function(){
        var response = attendance.response;
        if( attendance.status === 200 && attendance.readyState === XMLHttpRequest.DONE){
            response = JSON.parse(response);
            model.students = response ;
            console.log(model.students);
            controller.takeAttendance();
      } else {}
    }

      attendance.open('GET','http://localhost:3000/faculty/getStudentList/' + model.selectedBatch._id,true);
      attendance.send(null);
    })
},

takeAttendance: function(){
  var name = "";
  model.students.forEach(function(student,i){
    name += "<div class='col-xs-12 names' style='color:black;background-color:rgba(255,51,51,0.9);font-size:130%;margin-top:1%;padding:5px' " + "id=" + student.enroll_number + ">" + student.name + "</div>";
  })
  document.getElementById("nextSection").innerHTML = "<div style='height:70%;background-color: rgba(2,62,53,.9);' class='col-md-4 col-xs-8 col-xs-offset-2 col-md-offset-4 panel panel2 text-center'> <h5 style='color:black;display:block;margin-top:0;font-weight:bold;'>student list</h5> <div class='row student_list' style='height:80%;display:block;background-color:white;font-size:14px;' onclick='controller.markPresent(event)'>" + name + "</div><div style='position:relative;top:4%;font-size:16px'> <div style='cursor:pointer;color:black' class='col-xs-12'><div class='row'><div class='col-xs-6'><div class='btn btn-success' onclick='controller.submitData()'>Submit</div></div><div class='col-xs-6'><div class='btn btn-danger' onclick='view.loadHome()'>Cancel</div></div></div></div>";
},
//"<div style='text-align:center;position:absolute;top:30%;background-color:lightblue;color:black;border-radius:3px;' class='text-center col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-4'><div class='row'><h3 class='col-xs-12'>" + model.students[this.count].name + "</h3></div><div style='background-color:rgba(231,228,230,1);' class='row'><a class='col-xs-4 col-xs-offset-1 text-danger' style='font-size:20px;border-radius:5px;margin-top:15px;margin-bottom:15px;background-color: rgba(151,94,151,1)' id='absent' onclick='controller.markAbsent()'>Absent</a><a class='col-xs-4 col-xs-offset-2 text-info' style='font-size:20px;border-radius:5px;margin-top:15px;margin-bottom:15px;background-color: rgba(151,94,151,1)' id='present' onclick='controller.markPresent()'>Present</a></div></div>"
markPresent: function(e){
  var student_id = e.target.id;
  console.log(student_id);
  if(this.present.students.indexOf(student_id)<0){
    document.getElementById(student_id).style.backgroundColor= "lightgreen";
    document.getElementById(student_id).style.color= "white";
    this.present.students.push(student_id);
  } else {
    document.getElementById(student_id).style.backgroundColor= "rgba(255,51,51,0.9)";
    document.getElementById(student_id).style.color= "white";
    this.present.students.splice(this.present.students.indexOf(student_id),1);
  }
  console.log(this.present.students)
},

submitData: function(){
  this.present.subject = model.selectedBatch.subject;
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

  SAD.open("POST","http://localhost:3000/faculty/submitData/" + model.selectedBatch._id,true)
  SAD.setRequestHeader('Content-Type','application/json');
  SAD.send(JSON.stringify(this.present))
},

getReport: function(){
  document.getElementById('batchData').style.display = "none";
  var requestReport = new XMLHttpRequest();

  requestReport.onreadystatechange = function(){
    if(requestReport.readyState == 4 || requestReport.status == 200){
      var reportData = JSON.parse(requestReport.response);
      console.log(reportData);
      var x = "<table class='table-responsive table-striped' class='col-xs-12'><tr class='row' style='font-size:18px;'><th class='col-xs-6 text-center'>Name</th><th class='col-xs-3 text-center'>Attendance</th><th class='col-xs-3 text-center'>Percentage</th></tr>";
      var max = 1;
      reportData.attendance.forEach(function(student){
        var count = 0;
        if(student[model.selectedBatch.subject] === undefined){
           student[model.selectedBatch.subject] = [];
         }

         for(var props in student[model.selectedBatch.subject]){
           if( model.months.indexOf(props)>=0 ){
             count += student[model.selectedBatch.subject][props].length;
           }
         }
        if(count>max){
          max = count;
        }
      });
      reportData.attendance.forEach(function(student){
        var count = 0;
        if(student[model.selectedBatch.subject] === undefined){
           student[model.selectedBatch.subject] = [];
         }

         for(var props in student[model.selectedBatch.subject]){
           if( model.months.indexOf(props)>=0 ){
             count += student[model.selectedBatch.subject][props].length;
           }
         }
         console.log(max);
         if( (count/max)*100 < 75 ){
           x += "<tr style='font-family:notosans;' class='row'><td class='col-xs-6 text-left'><div class='btn btn-danger'>" + student.name + "</div></td><td class='col-xs-3 text-center'>" + count + "</td><td class='col-xs-3 text-center'>" + Math.ceil((count/max)*100) + "</td></tr>";
         } else {
           x += "<tr style='font-family:notosans;' class='row'><td class='col-xs-4 text-left'><div class='btn btn-success'>" + student.name + "</div></td><td class='col-xs-4 text-center'>" + count + "</td><td class='col-xs-4 text-center'>" + (count/max)*100 + "</td></tr>";
         }
      })
      x += "</table>";
      view.showReport(x);
    } else {
      document.getElementById("showReport").innerHTML = "<div style='position:relative;top:75px;'>loading ...</div>";
    }
  }

  requestReport.open("GET","http://localhost:3000/faculty/report/" + model.selectedBatch._id + '/' + model.selectedBatch.subject ,true);
  requestReport.send(null);
}
};

window.onload = view.loadHome;
