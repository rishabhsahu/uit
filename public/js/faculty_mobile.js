var view = {
  loadHome: function(){
    console.log(model);

    var content = "<div class='modal col-xs-12 text-center' id='batchListModal'><div class='row'><div class='col-xs-10 col-xs-offset-1' style='height:40%;'><div class='row'><h3 class='col-xs-12' style='color:white'>Add Scores</h3></div><div style='height:70%;margin-top:15px;overflow-x:auto;padding-top:10px;padding-bottom:10px' class='row'><div class='col-xs-12'>";
    model.personalInfo.current_classes.forEach(function(x,i){
      content += "<div class='btn btn-warning batches' id='score#" + x._id + "' onclick='controller.routes(event)'>" + x.semester + "th, Sem" + "</div>";
    })
    content += "</div></div></div></div><hr>";
    content += "<div class='col-xs-10 col-xs-offset-1' style='height:40%;'><div class='row'><h3 class='col-xs-12' style='color:white'>Attendance</h3></div><div style='height:70%;margin-top:15px;overflow-x:auto;padding-top:10px;padding-bottom:10px' class='row'><div class='col-xs-12'>";
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
    document.getElementById('attendance-options-modal').style.display = "block";
        for(var i=1;i<32;i++){
          document.getElementById('allDates').innerHTML += "<option>" + i + "</option>" ;
        }
        for(var i=0; i<12; i++){
          document.getElementById('allMonth').innerHTML += "<option>" + model.months[i] + "</option>" ;
        }
        var year = new Date().getFullYear();
          document.getElementById('allYear').innerHTML += "<option>" + (Number(year)-1).toString() + "</option><option selected>" + year.toString() + "</option><option>" + (Number(year)+1).toString() + "</option>" ;

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
