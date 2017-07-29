var view = {
  loadHome: function(){
      if(model.personalInfo.profileSetUp === 0){
          view.showPersonal();
      } else {
        document.getElementById('mobile-home-section').style.color = "black";
        document.getElementById('mobile-report-section').style.color = "grey";
        document.getElementById('mobile-personal-section').style.color = "grey";
        var d = new Date()
        d.setHours(0)
        d.setMinutes(0)
        d.setSeconds(0)
        d.setMilliseconds(0)
        var status = "white";
        var absent = "<div class='col-xs-12'><div class='row' id='batch_list_header' style='margin-top:20px;margin-bottom:20px;border-radius:3px'><div class='col-xs-12'><span style='color:rgb(110,110,110);font-size:18px;border-top: solid 1px rgb(65, 104, 244);padding-top:5px'>Todays Status</span></div></div></div>";

          if(model.personalInfo.absent && model.personalInfo.absent.length != 0){
            if(model.personalInfo.absent.indexOf(d.valueOf())>-1){
              absent += "<div class='col-xs-12' style='border-radius:3px;font-size:18px;border:solid 1px rgb(239, 62, 62);box-shadow:0px 1px 10px rgba(160,160,160,.8);background-color:white;color:rgb(239, 62, 62);padding-top:10px;padding-bottom:10px;'><div class='row' style='margin-top:3px;margin-bottom:15px;'><div class='col-xs-12'>You marked yourself Absent/Busy for today</div></div></div><div class='col-xs-12' style='border-radius:3px;font-size:18px;border:solid 1px rgba(110,110,110,.45);background-color:#0D47A1;color:white;margin-top:3px;padding-top:10px;padding-bottom:10px'><div class='row'><div class='col-xs-12'>Mark Present</div></div></div>";
            } else {
              absent += "<div class='col-xs-12' style='background-color:white;border-radius:3px;border:solid 1px rgba(200,200,200,.8);box-shadow:0px 1px 10px rgba(200,200,200,1);padding-top:10px;padding-bottom:10px'><div class='row'><div class='col-xs-4 col-xs-offset-1'><div id='markabsent' class='btn btn-danger'>Absent</div></div><div class='col-xs-4 col-xs-offset-1'><div class='btn btn-primary' onclick=''>Present</div></div></div></div>";
            }
          } else {
            absent += "<div class='col-xs-12' style='border-radius:3px;border:solid 1px rgba(160,160,160,.6);box-shadow:0px 1px 10px rgba(160,160,160,.8);padding-top:10px;padding-bottom:10px;background-color:white'><div class='row'><div class='col-xs-12'><div class='row'><div class='col-xs-12' style='padding-top:5px;padding-bottom:5px;margin-bottom:10px;font-size:14px'>What is your status about Today</div></div><div class='row'><div class='col-xs-4 col-xs-offset-1'><div class='btn btn-danger' onclick='view.showAbsentOption()'>Absent</div></div><div class='col-xs-4 col-xs-offset-1'><div class='btn btn-primary' onclick=''>Present</div></div></div></div></div></div>";
          }

          var content = "<div style='animation-name:homeSec;animation-duration:.25s;animation-timing-function:ease-out'><div class='col-xs-12'><div class='row' id='home_section' style='padding-left:5px;padding-right:5px;'></div></div><div class='col-xs-12' id='mainX' style='margin-top:5px'><div></div></div>";

        document.getElementById('main').innerHTML = content;
        var ctd = "";
        if(model.classes_today.length != 0 ){
          ctd = "<div class='row' style='margin-top:5px;margin-bottom:5px;color:rgb(110,110,110)'><div class='col-xs-12'><div class='row' style='padding-top:10px;padding-bottom:10px;font-size:18px;border-bottom: solid 1px rgb(200,200,200)'><div class='col-xs-6'>period</div><div class=col-xs-6>class</div></div><div class='col-xs-12' style='max-height:80px;overflow-y:auto'>";
          model.classes_today.forEach(function(c,n){
            var th;
            if(c.class>3){
              th = "<span style='font-size:16px'>th</span>";
            } else if(c.class == "KG-1" || c.class == "KG-2"){
              th = "";
            } else {
              switch(c.class){
                case "1": th = "<span style='font-size:16px'>st</span>"; break;
                case "2": th = "<span style='font-size:16px'>nd</span>"; break;
                case "3": th = "<span style='font-size:16px'>rd</span>"; break;
              }
            }
            var pr;
            if(c.period>3){
              pr = "<span style='font-size:16px;color:rgb(80,80,80)'>th</span>";
            } else if(c.period == "KG-1" || c.period == "KG-2"){
              pr = "";
            } else {
              switch(c.period){
                case "1": pr = "<span style='font-size:16px'>st</span>"; break;
                case "2": pr = "<span style='font-size:16px'>nd</span>"; break;
                case "3": pr = "<span style='font-size:16px'>rd</span>"; break;
              }
            }
            ctd += "<div class='row' style='padding-top:5px;padding-bottom:5px;font-size:16px;color:white'><div class='col-xs-4 col-xs-offset-1' style='border-radius:2px;padding-top:2px;padding-bottom:2px;color:rgb(70,70,70);font-weight:bold'>" + c.period + pr + "</div><div class='col-xs-4 col-xs-offset-2' style='border-radius:2px;padding-top:2px;padding-bottom:2px;color:rgb(70,70,70);font-weight:bold'>" + c.class + th + "</div></div>";
          })
          ctd += "</div></div></div></div>";
        } else {
          ctd = "<div class='row' style='padding-top:10px;padding-bottom:10px'><div class='col-xs-12' style='font-size:20px;margin-top:5px;margin-bottom:5px;color:rgb(70,70,70)'>! Schedule Not Yet Set</div><div class='col-xs-12'>set up now</div></div></div>";
        }
        console.log(model);

        var content2 = "<div class='col-xs-12'><div class='row' id='batch_list_header' style='margin-top:20px;margin-bottom:20px;border-radius:3px'><div class='col-xs-12'><span style='color:rgb(110,110,110);font-size:18px;border-top: solid 1px rgb(65, 104, 244);padding-top:5px'>Classes Today</span></div></div></div><div class='col-xs-12' style='border-radius:2px;margin-bottom:5px;background-color:white;border:solid 1px rgba(200,200,200,1);box-shadow:0px 1px 5px rgba(200,200,200,1)'>" + ctd + absent;
        document.getElementById('home_section').innerHTML = content2;

        content = "<div id='notifyUser' class='notif-modal'><div class='row text-center'><div class='col-xs-8 col-xs-offset-2' style='opacity:.85;border-radius:3px;padding-top:5px;padding-bottom:5px;font-size:16px' id='notifText'></div></div></div><div id='notifyError' class='col-xs-12 modal'><div class='row text-center' style='padding-top:120px'><div class='col-xs-8 col-xs-offset-2' style='padding-top:10px;padding-bottom:10px;;border-radius:3px;background-color:white' id='notifText2'></div></div></div>";
        document.getElementsByTagName('body')[0].innerHTML += content;
        document.getElementById('main').style.overflowY = "auto";
        this.loadReportSection();

      }
      let options = [
        {id:"absent#0",title:"Holiday"},{id:"absent#1",title:"On-Duty"}
      ];
      document.getElementById('markabsent').addEventListener('click',function(){ view.showBatchOptionModal("Absent for",options,"")});
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
   document.getElementById('main').style.backgroundImage = "none";
   document.getElementById('mobile-home-section').style.color = "black";
   document.getElementById('mobile-personal-section').style.color = "grey";
   document.getElementById('mobile-report-section').style.color = "grey";
    var content = "<div class='row'><div class='col-xs-12 batches_box;' style='overflow-x:hidden;display:fixed;margin-top:5px;'><div class='row' id='batch_list_header' style='margin-top:20px;margin-bottom:20px;border-radius:3px'><div class='col-xs-12'><span style='color:rgb(110,110,110);font-size:18px;border-top: solid 1px rgb(65, 244, 67);padding-top:5px'>Batches You Teach</div></div><div id='batches_cards' style='margin-bottom:10px'></div></div></div>";
    document.getElementById('mainX').innerHTML = content;
    var contentX = "";
    let options = [
      {id:"attendance",title:"Take Attendance"},{id:"score",title:"Exam-scores"},{id:"schedule",title:"Set Schedule"},{id:"notifyClass",title:"Notify All"}
    ]

    if(model.personalInfo.current_classes && model.personalInfo.current_classes.length>0){
      model.personalInfo.current_classes.forEach(function(x,i){
        var days = ["Mon","Tue","Wed","Thu","Fri","Sat"];
        var classes_timing = "";
        if(x.schedule && x.schedule.length !=0){
          x.schedule.forEach(function(z,n){
            classes_timing += "<div class='col-xs-2' style='color:rgba(0,0,0,.7);'><div class='row'><div class='col-xs-12' style='padding:0'>" + days[n] + "</div><div class='col-xs-12' style='font-size:10px;color:rgba(0,0,0,.6);padding:0'>" + z + "th</div></div></div>";
          })
        } else {
          classes_timing += "<div class='col-xs-12' style='color:rgb(160,160,160);font-size:18px'>No schedule found</div>";
        }
        var th;
        if(x.class>3){
          th = "<span style='font-size:24px;color:rgb(80,80,80)'>th</span>";
        } else if(x.class == "KG-1" || x.class == "KG-2"){
          th = "";
        } else {
          switch(x.class){
            case "1": th = "<span style='font-size:24px;color:rgb(80,80,80)'>st</span>"; break;
            case "2": th = "<span style='font-size:24px;color:rgb(80,80,80)'>nd</span>"; break;
            case "3": th = "<span style='font-size:24px;color:rgb(80,80,80)'>rd</span>"; break;
          }
        }

        contentX += "<div class='row text-center classes-card'><div class='col-xs-12'><div class='row'><div class='col-xs-4 classes-card-header'><div class='row'><div class='col-xs-12;'>" + x.class + th + "</div></div></div><div class='col-xs-7'><h1 class='classes-card-subject'>" + x.subject + "</h1><div class='row' style='margin-top:0px'></div></div></div><div class='row classes-card-class-timings'>" + classes_timing + "</div><div class='row classes-card-footer'><div class='col-xs-6 col-xs-offset-2 lelo' id='report#"+x._id+"'><span id='report#"+x._id+"'  class='glyphicon glyphicon-circle-arrow-right' style='font-size:16px;color:rgb(70,70,70);cursor:pointer;'></span></div><div class='col-xs-4' id='options" + x._id + "'><span id='options#"+x._id+"' class='glyphicon glyphicon glyphicon-option-vertical' style='color:rgb(70,70,70)'></span></div></div></div></div>";
      })
    } else {
      contentX = "<div class='row'><div class='col-xs-12' style='border-radius:3px;margin-bottom:10px;border:solid 1px rgba(110,110,110,.45);box-shadow:1px 1px 5px rgba(160,160,160,.5);background-color:white;font-size:20px;color:rgb(70,70,70,.8);padding-top:10;padding-bottom:10px'>No Batch Alloted</div></div>";
    }
    document.getElementById('batches_cards').innerHTML = contentX;
    model.personalInfo.current_classes.forEach(function(x,i){
      document.getElementsByClassName('lelo')[i].onclick = controller.routes;
      document.getElementById('options#' + x._id).addEventListener('click',function(){view.showBatchOptionModal("Options",options,x._id)})
    })

  },

  showAttendanceOptions: function(){
    document.getElementById('attendance-options-modal').style.display = "block";
        for(var i=1;i<32;i++){
          document.getElementById('allDates').innerHTML += "<option>" + i + "</option>" ;
        }
        for(var i=0; i<13; i++){
          document.getElementById('allMonth').innerHTML += "<option>" + model.months[i] + "</option>" ;
        }
        var year = new Date().getFullYear();
          document.getElementById('allYear').innerHTML += "<option>" + (Number(year)-1).toString() + "</option><option selected>" + year.toString() + "</option><option>" + (Number(year)+1).toString() + "</option>" ;

  },

  showScoreOptions: function(){
    var content = "<div id='scoreOptionsModal' class='col-xs-12 modal text-center'><div class='row'><h3 class='col-xs-12' style='color:black'>Scores</h3></div><div class='row'><div class='col-xs-10 col-xs-offset-1' style='margin-top: 20px'><div class='row' style='margin-top: 10px'><div class='btn btn-danger' onclick='view.editPrevious()'>Edit Previous Scores</div></div><div class='row' style='margin-top: 10px'><div class='btn btn-danger' onclick='view.getTestSettings()'>Create New Test Score List</div></div></div>";
    document.getElementsByTagName('body')[0].innerHTML += content;
    document.getElementById('scoreOptionsModal').style.display = "block";
  },

  getTestSettings: function(){
    this.closeScoreOptionModal();
    model.scoreSettingCount = 0;
    model.scoreSettinglist = ["Test Name","Maximum Score"];
    model.scoreSettings = [];
    model.studentCount = 0;
    model.studentScores = {scores:{}};
    var content = "<div class='col-xs-12'><div class='row' style='margin-top:25px;'><div class='col-xs-10 col-xs-offset-1' style='border-bottom: solid 1px rgb(200,200,200);color:rgb(110,110,110)'><h2>Class - " + model.selectedBatch.class + "</h2></div></div><div class='row' style='margin-top:25px'><div class='col-xs-10 col-xs-offset-1' style='border-radius:3px'><div class='row'><h4 class='col-xs-12' id='scoreSettings' style='color:rgb(70,70,70)'>Settings</h4></div><div class='row' style='margin-top:10px'><div class='col-xs-12'><input type='text' id='scoreSettingInput' style='background-color:rgb(249, 250, 252);border:none;border-bottom: solid 2px rgb(160,160,160);text-transform:uppercase' autofocus></div></div><div class='row btn btn-warning' style='margin-top:10px;margin-bottom:10px'><div class='' onclick='controller.addScoreSetting()'>Done</div></div></div></div></div>";
    document.getElementById('main').innerHTML = content;
    document.getElementById('scoreSettingInput').focus();
    document.getElementById('scoreSettings').innerHTML = model.scoreSettinglist[model.scoreSettingCount];
  },

  showNamesForScores: function(){
    const content = "<div class='col-xs-12'><div class='row' style='margin-top:5px;'><div class='col-xs-10 col-xs-offset-1' style='border-bottom: solid 1px rgb(200,200,200);color:rgb(110,110,110)'><h2>Class - " + model.selectedBatch.class + "</h2></div></div><div class='row text-center' style='padding-top:10px;color:rgb(110,110,110)'><div class='col-xs-6'>Test Name - " + model.scoreSettings[0]["Test Name"] + "</div><div class='col-xs-6'>Max Score - " + model.scoreSettings[1]["Maximum Score"] + "</div></div><div class='row' style='margin-top:25px'><div class='col-xs-10 col-xs-offset-1' style='border-radius:3px'><div class='row'><div class='col-xs-12' id='student_name' style='font-size:16px'>student</div></div><div class='row' style='margin-top:5px'><div class='col-xs-12'><input type='text' maxlength=" + model.scoreSettings[1]["Maximum Score"].length + "  id='studentScore' style='background-color:rgb(249, 250, 252);border:none;border-bottom: solid 2px rgb(160,160,160);' autofocus></div></div><div class='row' style='margin-top:10px;margin-bottom:10px'><div class='col-xs-4 text-center' onclick='view.getTestSettings()'><div class='btn glyphicon glyphicon-repeat' style='color:red'></div></div><div class='col-xs-4 text-center' onclick='view.oneStepBack()'><div class='btn glyphicon glyphicon-arrow-left'></div></div><div class='col-xs-4 text-center' onclick='view.oneStepForward()'><div class='btn glyphicon glyphicon-arrow-right'></div></div><div class='col-xs-12' style='padding-top:15px'><button class='btn btn-danger'>Submit Now</button></div></div></div></div></div></div>";

    /* <div class='col-xs-4' onclick='view.getScores()'><div class='btn glyphicon glyphicon-ok text-success'></div></div> */
    let addScore = function(n){
      switch(n.toString()){
        case "0":
          model.studentScores.scores[model.students[model.studentCount].enroll_number] = input.value;
          break;

        case "1":
          model.studentScores.scores[model.students[model.studentCount].enroll_number] = input.value.substr(0,2);
          break;

        case "2":
          model.studentScores.scores[model.students[model.studentCount].enroll_number] = "A";
          break;
      }
      input.value = ""
      model.studentCount++;
      if(model.studentCount == model.students.length){
        controller.submitScores();
      } else {
        document.getElementById('student_name').innerHTML = model.students[model.studentCount]["name"];
        document.getElementById('student_name').setAttribute('enr',model.students[model.studentCount]["enroll_number"]);
      }
    }
    document.getElementById('main').innerHTML = content;
    document.getElementById('student_name').innerHTML = model.students[model.studentCount]["name"];
    document.getElementById('student_name').setAttribute('enr',model.students[model.studentCount]["enroll_number"]);
    document.getElementById('studentScore').focus();
    let input = document.querySelector('#studentScore');
    input.addEventListener('input', function(){
      if(input.value != "A" && !Number.isNaN(input.value)){
        if(input.value.length == model.scoreSettings[1]["Maximum Score"].length && Number(input.value) <= Number(model.scoreSettings[1]["Maximum Score"]) ){
          addScore(0)
        } else if(input.value.length == model.scoreSettings[1]["Maximum Score"].length && Number(input.value) > Number(model.scoreSettings[1]["Maximum Score"])){
          addScore(1)
        }
      } else {
        if(input.value === "A"){
          addScore(2)
        }
      }
    });
  },

  oneStepBack: function(){
    if(model.studentCount !=0 ){
      model.studentCount--;
      view.showNamesForScores();
    } else {
      view.showNamesForScores();
    }
  },

  oneStepForward: function(){
    if(model.studentCount < model.students.length ){
      model.studentCount++;
      view.showNamesForScores();
    } else {
      controller.submitScores();
    }
  },

  showAbsentOption: function(){
    var content = "<div class='modal col-xs-12' id='absentModal'><div class='row' style='padding-top:50px'><div class='col-xs-8 col-xs-offset-2 text-center modalContent' style='background-color:white;border-radius:4px;'><div class='row' style='border-bottom: solid 1px black;font-size:20px;cursor:pointer;text-transform:uppercase'><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(60,60,60,.4);font-size:14px' onclick='controller.willBeAbsent(1)'>On School Duty</div><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;font-size:14px' onclick='controller.willBeAbsent(2)'>Day off</div></div></div></div><div class='row' style='margin-top:20px'><div class='col-xs-12 text-center'><span class='glyphicon glyphicon-remove' style='font-size:24px;color:white' onclick='view.closeAbsentModal()'></span></div></div></div>";
    document.getElementsByTagName("body")[0].innerHTML += content;
    document.getElementById("absentModal").style.display = "block";
  },

  closeDownloadListModal: function(){
    document.getElementById('downloadsOptionModal').style.display = "none";
    document.getElementById('downloadsOptionModal').parentNode.removeChild(document.getElementById('downloadsOptionModal'));
    controller.getReport();
  },

  closeBatchListModal: function(){
    document.getElementById('batchListModal').style.display = "none";
    document.getElementById('batchListModal').parentNode.removeChild(document.getElementById('batchListModal'));
    controller.getReport();
  },

  closeBatchOptionModal: function(n){
    document.getElementById('batchOptionModal').style.display = "none";
    document.getElementById('batchOptionModal').parentNode.removeChild(document.getElementById('batchOptionModal'));
    if(n===0){
      controller.facultyData();
    }
  },

  closeSetSchedule: function(){
    document.getElementById('setSchedule').style.display = "none";
    document.getElementById('setSchedule').parentNode.removeChild(document.getElementById('setSchedule'));
    controller.facultyData();
  },

  closeNotifyClass: function(){
    document.getElementById('notifyClass').style.display = "none";
    document.getElementById('notifyClass').parentNode.removeChild(document.getElementById('notifyClass'));
    controller.facultyData();
  },

  closeScoreOptionModal: function(){
    document.getElementById('scoreOptionsModal').style.display = "none";
    document.getElementById('scoreOptionsModal').parentNode.removeChild(document.getElementById('scoreOptionsModal'));
  },

  closeEditPrevious: function(){
    document.getElementById('pastexams').style.display = "none";
    document.getElementById('pastexams').parentNode.removeChild(document.getElementById('pastexams'));
  },

  showPersonal: function(){
    document.getElementById('mobile-home-section').style.color = "grey";
    document.getElementById('mobile-report-section').style.color = "grey";
    document.getElementById('mobile-personal-section').style.color = "black";
    if(model.personalInfo.profileSetUp === 0){
      document.getElementsByTagName('body')[0].innerHTML = "<div class='col-xs-12 text-center' style='height:100%;background-color:white'><div class='row' style='margin-top:50px;font-size:32px;color:rgb(110,110,110)'><div class='col-xs-10 col-xs-offset-1'><span style='border-bottom: solid 1px rgb(160,160,160)'>" + model.personalInfo.name + "</span></div></div><div class='row'><div class='col-xs-12' style='margin-top:50px'><div class='row'><div class='col-xs-10 col-xs-offset-1' style='color:grey;border-radius:3px;font-size:18px;padding:10px;margin-bottom:10px;'>We need to know little more about you. Please provide us some more information</div></div><div class='row'><div class='col-xs-8 col-xs-offset-2'><div class='btn btn-primary' onclick='view.setUpProfile()' style='font-size:18px;background-color:rgb(74, 124, 206)'>Set up Profile <span class='glyphicon glyphicon-arrow-right' style='color: rgb(70,70,70)'></span></div></div></div></div></div><div class='row'><div class='col-xs-12' style='position:fixed;bottom:0px;left:0px;padding-bottom:10px;color:rgb(110,110,110);font-size:18px;'><span style='padding-top:5px;border-top: solid 1px rgb(160,160,160)'>" + model.personalInfo.school + "</span></div></div></div>"
    } else {
      console.log(model);
      var firstName = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.3)'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249);font-size:14px'>First Name</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8);font-size:18px'>" + model.personalInfo.first + "</div></div>";

      var secondName = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.3)'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249);font-size:14px'>Last Name</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8);font-size:18px'>" + model.personalInfo.last + "</div></div>";

      var school = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.3)'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249);font-size:14px'>School Name</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8);font-size:18px'>" + model.personalInfo.school + "</div></div>";

      var d = new Date(model.personalInfo.dob);
      var dob = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.3)'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249);font-size:14px'>Date of Birth</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8);font-size:18px'>" + d.getDate() + " " + model.months[d.getMonth()-1] + ", " + d.getFullYear() + "</div></div>";

      var password = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249);font-size:14px'>Password</div><a class='col-xs-12 text-left' style='color:rgba(60,60,60,.8);font-size:18px;text-decoration:underline' href='#' target='_blank'>change</a></div>";

      var mobile = "<div class='row' style='background-color:white;;padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.3)'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249);font-size:14px'>Mobile</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8);font-size:18px'>" + model.personalInfo.mobile + "</div></div>";

      var email = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249);font-size:14px'>EMAIL</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8);font-size:18px'>" + model.personalInfo.email + "</div></div>";

      var logout = "<div class='row' style=''><button class='text-center col-xs-12 text-left' style='background-color:rgb(66, 134, 244);padding-top:20px;padding-bottom:20px;color:rgb(77, 215, 249);font-size:16px'onclick='controller.logout()' >Logout</button></div>";

      document.getElementById('main').innerHTML = "<div class='col-xs-12' style='overflow-y:auto;overflow-y:auto;animation-name:personalSec;animation-duration:.25s'><div class='row'><div class='col-xs-12' style='padding-top:20px;padding-bottom:20px;background-color:rgb(20, 33, 61)'><img src='img/flat-face-icon-23.png' style='max-width:100px;'></div></div><div class='row'><div class='col-xs-12 text-center' style='color:rgb(160,160,160)'><h4>personal</h4></div></div>" + firstName + secondName + school + dob + password + "<div class='row'><div class='col-xs-12 text-center' style='background-color:rgb(230,230,230);color:rgb(160,160,160)'><h4>contact</h4></div></div>" + mobile + email + logout + "</div>";
    }
  },

  setUpProfile: function(){
    if(model.setupcounter === 5){
      var dt = "<Select id='birthDate'>";
      for(var i=1;i<32;i++){
        dt += "<option value=" + i + ">" + i + "</option>";
      }
      dt += "</select>";
      var mn = "<Select id='birthMonth'>";
      for(var i=1;i<13;i++){
        mn += "<option value=" + i + ">" + i + "</option>";
      }
      mn += "</select>";
      var y = "<Select id='birthYear'>";
      for(var i=(new Date()).getFullYear()-18;i>(new Date()).getFullYear()-80;i--){
        y += "<option value=" + i + ">" + i + "</option>";
      }
      y += "</select>";
      var firstName = "<div class='row text-center prf_stup_fields'><div class='col-xs-12 glyphicon glyphicon-user' style='font-size:32px'></div><div class='col-xs-12' id='field'><h3>" + model.fields[model.setupcounter].text + "</h3><span class='showRequiredError' id='showRequiredError#" + model.fields[model.setupcounter].id + "'></span></div><div class='col-xs-12'>" + dt + " " + mn + " " + y + "</div></div>";

    } else {
      var firstName = "<div class='row text-center prf_stup_fields'><div class='col-xs-12 glyphicon glyphicon-user' style='font-size:32px'></div><div class='col-xs-12' id='field'><h3>" + model.fields[model.setupcounter].text + "</h3><span class='showRequiredError' id='showRequiredError#" + model.fields[model.setupcounter].id + "'></span></div><div class='col-xs-12'><input id='" + model.fields[model.setupcounter].id + "' size=15 class='required' type=text onblur='controller.check(event)' autofocus></div></div>";
    }
    document.getElementsByTagName('body')[0].innerHTML = "<div class='col-xs-12' style='height:100%;overflow-y:auto;'><div class='row' style='padding-top:50px'><div class='col-xs-12'>" + firstName + "</div></div><div class='row'><button class='col-xs-6 col-xs-offset-3'><div class='row text-center prf_stup_submit' style='background-color:#FF5722;color:white'><div class='col-xs-12' onclick='controller.check()' style='border-radius:3px;'><h4 class='btn'>Next</h4></div></div></button></div></div>"
    var i = 0;
    document.getElementById('main').style.backgroundImage = "none";

  },

  showBatchOptionModal: function(title,options,id){
    var batch = id;
    console.log(batch);
    model.selectedBatch._id = batch;
    let str = "";
    options.forEach((x,i)=>{
      str += "<div class='row text-center' style='margin-top:5px' onclick='controller.routes(event)'><div id='" + x.id + "#" + batch + "' class='col-xs-10 col-xs-offset-1 btn btn-default'>" + x.title + "</div></div>";
    })
    document.getElementsByTagName('body')[0].innerHTML += "<div class='modal col-xs-12 text-center' id='batchOptionModal'><div class='row' style='animation-name: pushup;animation-duration:.25s;position:fixed;bottom:0;height:50%;width:100%;background-color:white;border-radius: 10px'><div class='col-xs-12'><div class='row' style='margin-bottom:15px;'><div class='col-xs-12' style='border-bottom: 1px solid grey'><h3>" + title + "<span style='position:absolute;right: 10%;font-size: 26px;color:rgb(239, 108, 88);cursor:pointer' onclick='view.closeBatchOptionModal(0)'>&times;</span></h3></div><div class='col-xs-12' style='margin-top:10px'>" + str + "</div></div></div></div></div>";
    document.getElementById('batchOptionModal').style.display = "block";
  },

  setScheduleModal: function(){
    this.closeBatchOptionModal(0);
    var day ="<div class='col-xs-12'><div class='row' style='margin-top:5px;margin-bottom:5px;color:rgb(90,90,90)'><div class='col-xs-6'><h3>Days</h3></div><div class='row'><div class='col-xs-6'><h3>Period</h3></div></div><div style='height:170px;overflow-y:auto;overflow-x:hidden;padding-top:5px;padding-bottom:5px'>";
    var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    days.forEach(function(x,i){
      day += "<div class='row' style='margin-top:5px;margin-bottom:5px;color:rgb(90,90,90)'><div class='col-xs-6' style='padding-top:5px;font-size:16px'>" + days[i] + "</div><div class='col-xs-3 col-xs-offset-1'><input type='text' size=2 maxlength=2 style='border:none;border-bottom: solid 2px rgb(160,160,160)' class='pr' id='day" + i + "'></div></div>";
    })
    day += "</div></div></div>";
    document.getElementsByTagName('body')[0].innerHTML += "<div class='col-xs-12 modal' style='color:rgb(70,70,70);background-color:black' id='setSchedule'><div class='row text-center'><div class='col-xs-8 col-xs-offset-2'><div class='row' style='background-color:white;border-radius:2px;margin-top:20%;'>" + day + "</div><div class='row' style='margin-top:15px;padding-top:5px;padding-bottom:5px;font-size:14px;color:rgb(90,90,90);font-weight:bold'><div class='col-xs-12'><div class='btn btn-primary' onclick='controller.setSchedule()'>set</div></div></div></div></div><div class='col-xs-12 text-center' style='margin-top:50px'><span class='glyphicon glyphicon-remove' style='font-size:24px;color:white' onclick='view.closeSetSchedule()'></span></div></div>";
    document.getElementById('setSchedule').style.display = "block";
  },

  notifyClass: function(){
    this.closeBatchOptionModal(0);
    document.getElementsByTagName('body')[0].innerHTML += "<div class='col-xs-12 modal' style='background-color:black' id='notifyClass'><div class='row text-center'><div class='col-xs-8 col-xs-offset-2' style='background-color:white;border-radius:5px;margin-top:10%;'><div class='row'><div class='col-xs-12' style='border-bottom: solid 1px rgba(0,0,0,.8);margin-bottom:15px'><h3>Write Text</h3></div><div class='col-xs-12' style='padding-bottom:15px;'><textarea id='notify-text' type=text maxlength='160' rows=5 style='border: solid 1px rgba(60,60,60,.5)' style='height:100px' placeholder='Notify about Test, Books etc'></textarea></div><div class='col-xs-12' style='margin-top:10px;margin-bottom:10px' onclick='controller.notifyClass()'>Send</div></div></div></div><div class='row' style='margin-top:20px'><div class='col-xs-12 text-center' style='position:absolute;bottom:50px'><span class='glyphicon glyphicon-remove' style='font-size:24px;color:white' onclick='view.closeNotifyClass()'></span></div></div></div>";
    document.getElementById('notifyClass').style.display = "block";
  },

  editPrevious: function(){
    document.getElementsByTagName('body')[0].innerHTML += "<div class='modal col-xs-12 text-center' id='pastexams'><div class='row' style='animation-name: pushup;animation-duration:.25s;position:fixed;bottom:0;height:50%;width:100%;background-color:white;border-radius: 10px'><div class='col-xs-12'><div class='row' style='margin-bottom:15px;'><div class='col-xs-12' style='border-bottom: 1px solid grey'><h3>Select Test<span style='position:absolute;right: 10%;font-size: 26px;color:rgb(239, 108, 88);cursor:pointer' onclick='view.closeEditPrevious()'>&times;</span></h3></div><div class='col-xs-12' style='margin-top:10px'>" +  "</div></div></div></div></div>";
    document.getElementById('pastexams').style.display = "block";
  }
};


var model = {
  classes_today:[],
  selectedBatch:{},
  months: ["January","February","March","April","May","June","July","August","Septembet","October","November","December"],
  fields : [{text:"Enter you First Name",id:"first"},{text:"Enter you Last Name",id:"last"},{text:"Mobile Number",id:"mobile"},{text:"You email",id:"email"},{text:"You are",id:"sex"},{text:"Your Date of Birth",id:"dob"},{text:"Enter Password",id:"password"},{text:"Re-Enter Password",id:"reenterpassword"}],
  setupcounter : 0,
  profile:{}
};

/*
contentX += "<div class='row'><div class='col-xs-12 text-left' style='color:rgba(0,0,0,.55);color:rgba(0,0,0,.9);font-family:Raleway;font-size:20px;border-bottom:solid 1px rgba(0,0,0,.1);'>" + x.class + "<span style='font-size:24px'>th</span></div></div><div class='row text-center' style='margin-bottom:5px;'><div class='col-xs-12' style=''><div class='row'><div class='col-xs-12'><h3 style='margin-top:10px;color:rgba(0,0,0,.8);margin-bottom:0px;'>" + x.subject + "</h3><div class='row' style='margin-top:0px'><div class='col-xs-12' style='font-size:13px;color:rgba(0,0,0,.4)'>strength -</div></div></div></div><div class='row' style='margin-top:10px;padding-bottom:10px;padding-right:5px'>" + classes_timing + "</div><div class='row' style='padding-top:10px;padding-bottom:10px;font-size:18px;margin-top:0px;color:blue'><div class='col-xs-4'><span class='glyphicon glyphicon-envelope' style='font-size:14px'></span></div><div class='col-xs-4 lelo' id='report#"+x._id+"'><span id='report#"+x._id+"' class='glyphicon glyphicon-circle-arrow-right' style='font-size:14px'></span></div><div class='col-xs-4'><span class='glyphicon glyphicon glyphicon-option-horizontal'></span></div></div></div></div>";
*/
