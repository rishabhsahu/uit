var view = {
  loadHome: function(){
    var content = "<div class='col-xs-12' style='border-radius:3px;margin-bottom:5px;padding-top:5px;padding-bottom:5px;margin-top:5px;background-color:rgba(160,160,160,.5);border: solid 1px rgba(200,200,200,.5);font-size:16px;text-transform:capitalize;color:white;font-size:18px'>" + model.personalInfo.name + "</div><div class='col-xs-12'><div class='row' id='home_section'></div></div>";
    document.getElementById('main').style.paddingLeft = "10px";
    document.getElementById('main').style.paddingRight = "10px";
    document.getElementById('main').innerHTML = content;
    var classes_today = "";
    model.classes_today.forEach(function(c,n){
      classes_today += "<div class='col-xs-3' style='border-radius:3px;color:rgba(0,0,0,.6);padding:0px;'><div class='row' style='padding:0px;margin:0px'><div class='col-xs-12' style='padding:0px;color:rgba(0,0,0,.7);font-size:16px'>" + c.class + "th<sub>class</sub></div><div class='col-xs-12' style='padding:0px;color:rgba(0,0,0,.5);font-size:12px'>" + c.period + "th<sub>period</sub></div><div class='col-xs-12' style='margin-top:5px;font-size:16;color:red;'><span class='glyphicon glyphicon-remove'></span></div></div></div>";
    })
    console.log(model);
    var content2 = "<div class='col-xs-12' style='padding-bottom:10px;border-radius:3px;margin-bottom:5px;padding-top:7px;background-color:white;border: solid 1px rgba(200,200,200,.5);'><div class='row'><div class='col-xs-12' style='font-size:24px;font-weight:bold;color:rgba(0,0,0,.7)'>" + model.classes_today.length + " Classes today</div></div><div class='row' style='margin-top:10px;margin-bottom:5px'>" + classes_today + "</div></div><div class='col-xs-12' style='border-radius:3px;'><h4 class='btn btn-danger'>Will be Absent</h4></div>";
    document.getElementById('home_section').innerHTML = content2;
  },

  showDownloadOptions: function(){
    console.log(model);
    document.getElementById('downloadsOptionModal').style.display = "block";
  },

  showBatchList: function(){
    var content2 = "<div class='modal col-xs-12 text-center' id='batchListModal'><div class='row' style='animation-name: pushup;animation-duration:.25s;position:fixed;bottom:0;height:50%;width:100%;background-color:white;border-radius: 10px'><div class='col-xs-12'><div class='row' style='margin-bottom:15px;'><div class='col-xs-12' style='border-bottom: 1px solid grey'><h3><div class='btn btn-default' style='background-color:white;border-radius:5px 0px 0px 5px' onclick='view.attendanceList()' id='attd'>Attendance</div><div class='btn btn-default' style='background-color:lightgrey;border-radius:0px 5px 5px 0px' onclick='view.scoreList()' id='scr'>Score</div><span style='position:absolute;right: 10%;font-size: 26px;color:red;cursor:pointer' onclick='view.closeBatchListModal()'>&times;</span></h3></div>";
    content2 += "<div class='row' id='hola'></div></div></div></div></div></div>";

    document.getElementsByTagName('body')[0].innerHTML += content2;
    var abc2 = "<div class='col-xs-12' style='margin-top:10px'><div class='row' style='margin-top:10px'>";
    model.personalInfo.current_classes.forEach(function(x,i){
      abc2 += "<div class='col-xs-12' style='margin-bottom:10px'><div class='btn btn-success batches' id='attendance#" + x._id + "' onclick='controller.routes(event)'>" + x.class + "th, class" + "</div></div>";
    })

    abc2 += "</div></div>";
    document.getElementById('hola').innerHTML = abc2;
    document.getElementById('batchListModal').style.display = "block";
    document.getElementById('take-attendance-button').style.display = "none";
  },


  attendanceList: function(){
    var abc2 = "<div class='col-xs-12' style='margin-top:10px'><div class='row' style='margin-top:10px'>";
    model.personalInfo.current_classes.forEach(function(x,i){
      abc2 += "<div class='col-xs-12' style='margin-bottom:10px'><div class='btn btn-success batches' id='attendance#" + x._id + "' onclick='controller.routes(event)'>" + x.class + "th, class" + "</div></div>";
    })

    abc2 += "</div></div>";
    document.getElementById('attd').style.background = "white";
    document.getElementById('scr').style.background = "lightgrey";
    document.getElementById('hola').innerHTML = abc2;
  },

  scoreList: function(){
    var abc1 = "<div class='col-xs-12' style='margin-top:10px'><div class='row' style='margin-top:10px'>";
    model.personalInfo.current_classes.forEach(function(x,i){
      abc1 += "<div class='col-xs-12' style='margin-bottom:10px'><div class='btn btn-warning batches' id='score#" + x._id + "' onclick='controller.routes(event)'>" + x.class + "th, class" + "</div></div>";
    })
    abc1 += "</div></div>";
    document.getElementById('scr').style.background = "white";
    document.getElementById('attd').style.background = "lightgrey";
    document.getElementById('hola').innerHTML = abc1;
  },

  loadReportSection: function(){
   document.getElementById('mobile-home-section').style.color = "grey";
   document.getElementById('mobile-report-section').style.color = "black";
    document.getElementById('take-attendance-button').style.display = "none";
    var content = "<div class='col-xs-12 batches_box;' style='overflow-x:hidden;height:94%;display:fixed;padding-left:25px;padding-right:25px;margin-top:5px;'><div class='row' id='batch_list_header' style='background-color:white;border: solid 1px rgba(200,200,200,.5);border-bottom:solid 2px rgba(200,200,200,.7);box-shadow: 3px 2px 2px rgba(205,205,205,.6);margin-bottom:5px'><h4 class='col-xs-12'>batches</h4></div><div id='batches_cards' style='margin-bottom:10px'></div></div>";
    document.getElementById('main').innerHTML = content;
    var contentX = "";
    model.personalInfo.current_classes.forEach(function(x,i){
      var days = ["Mon","Tue","Wed","Thu","Fri","Sat"];
      var classes_timing = "";
      if(x.timing){
        x.timing.forEach(function(z,n){
          classes_timing += "<div class='col-xs-2' style='color:rgba(0,0,0,.7);'><div class='row'><div class='col-xs-12' style='padding:0'>" + days[n] + "</div><div class='col-xs-12' style='font-size:10px;color:rgba(0,0,0,.6);padding:0'>" + z + "th</div></div></div>";
        })
      }
      contentX += "<div class='row text-center' style='margin-bottom:5px;border: solid 1px rgba(200,200,200,.5);box-shadow: 1px 1px 2px rgba(205,205,205,.6);border-radius:3px'><div class='col-xs-12' style='background-color:white;'><div class='row' style=';padding-bottom:10px'><div class='col-xs-3' style='font-size:40px;'><div class='row'><div class='col-xs-12;' style='color:rgba(0,0,0,.55);color:#ffe030'>" + x.class + "<span style='font-size:24px'>th</span></div></div></div><div class='col-xs-7'><h3 style='margin-top:10px;color:rgba(0,0,0,.8);margin-bottom:0px;'>" + x.subject + "</h3><div class='row' style='margin-top:0px'><div class='col-xs-12' style='font-size:13px;color:rgba(0,0,0,.4)'>strength -</div></div></div></div><div class='row' style='margin-top:10px;border-bottom:solid 1px rgba(0,0,0,.1);padding-bottom:10px;padding-right:5px'>" + classes_timing + "</div><div class='row' style='padding-top:10px;padding-bottom:10px;font-size:18px;margin-top:0px'><div class='col-xs-4'><span class='glyphicon glyphicon-envelope' style='color:#4286f4'></span></div><div class='col-xs-4 lelo' id='report#"+x._id+"'><span id='report#"+x._id+"' class='glyphicon glyphicon-circle-arrow-right'></span></div><div class='col-xs-4'><span class='glyphicon glyphicon glyphicon-option-horizontal'></span></div></div></div></div>";
    })
    document.getElementById('batches_cards').innerHTML = contentX;
    model.personalInfo.current_classes.forEach(function(x,i){
      document.getElementsByClassName('lelo')[i].onclick = controller.routes;
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
    var content = "<div class='row modal' id='scoreOptionsModal'><div class='col-xs-12 text-center'><div class='row'><h3 class='col-xs-12' style='color:black'>Scores</h3></div><div class='row'><div class='col-xs-10 col-xs-offset-1' style='margin-top: 20px'><div class='row' style='margin-top: 10px'><div class='btn btn-danger disabled'>Edit Previous Scores</div></div><div class='row' style='margin-top: 10px'><div class='btn btn-danger' onclick='view.getTestSettings()'>Create New Test Score List</div></div></div></div>";
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
    var content = "<div class='col-xs-12' style='position:relative;top: 30%'><div class='row'><div class='col-xs-10 col-xs-offset-1' style='background-color:white;border-radius:3px'><div class='row' style='border-bottom: solid 1px white'><h4 class='col-xs-12' id='scoreSettings' style='color:black'>Settings</h4></div><div class='row' style='margin-top:10px'><div class='col-xs-12'><input type='text' id='scoreSettingInput' autofocus></div></div><div class='row' style='margin-top:10px;margin-bottom:10px'><div class='btn btn-warning' onclick='controller.addScoreSetting()'>Done</div></div></div></div></div>";
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

  closeDownloadListModal: function(){
    document.getElementById('downloadsOptionModal').style.display = "none";
    controller.showReport();
  },

  closeBatchListModal: function(){
    document.getElementById('batchListModal').style.display = "none";
    document.getElementById('take-attendance-button').style.display = "block";
    controller.showReport();
  }
};

var model = {
  classes_today:[],
  selectedBatch:{},
  months: ["January","February","March","April","May","June"],
};
