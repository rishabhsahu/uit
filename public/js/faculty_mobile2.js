var view = {
  loadHome: function(){

      document.getElementById('mobile-home-section').style.color = "black";
      document.getElementById('mobile-report-section').style.color = "grey";
      document.getElementById('mobile-personal-section').style.color = "grey";
      var d = new Date()
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      var status = "white";
      var absent = "";

        if(model.personalInfo.absent && model.personalInfo.absent.length != 0){
          if(model.personalInfo.absent.indexOf(d.valueOf())>-1){
            absent = "<div class='col-xs-12' style='border-radius:3px;font-size:18px;border:solid 1px rgba(110,110,110,.45);box-shadow:0px 1px 10px rgba(160,160,160,.8);background-color:white;color:rgb(239, 62, 62);border:solid 1px rgb(239, 62, 62);padding-top:10px;padding-bottom:10px;'><div class='row' style='margin-top:3px;margin-bottom:15px;'><div class='col-xs-12'>You marked yourself Absent/Busy for today</div></div></div><div class='col-xs-12' style='border-radius:3px;font-size:18px;border:solid 1px rgba(110,110,110,.45);box-shadow:0px 1px 5px #FFA000;background-color:#0D47A1;color:white;margin-top:3px;padding-top:10px;padding-bottom:10px'><div class='row'><div class='col-xs-12'>Mark Present</div></div></div>";
            status = "rgb(239, 62, 62)";
          } else {
            absent = "<div class='col-xs-12' style='border-radius:3px;'><div class='row'><div class='col-xs-12'><h4 class='btn btn-danger' onclick='view.showAbsentOption()'>Will be Absent</h4></div></div><div class='row'><div class='col-xs-12' style='border-radius:3px;'><h4 class='btn btn-primary' onclick=''>Will be Present</h4></div></div></div>";
            status = "white";
          }
        } else {
          absent = "<div class='col-xs-12'><div class='row'><div class='col-xs-12'><h4 class='btn btn-danger' onclick='view.showAbsentOption()'>Will be Absent</h4></div></div><div class='row'><div class='col-xs-12' style='border-radius:3px;'><h4 class='btn btn-primary' onclick=''>Will be Present</h4></div></div></div></div>";
        }

        var content = "<div style='padding-left:10px;padding-right:10px;'><div class='col-xs-12' style='border-radius:3px;margin-bottom:5px;padding-top:5px;padding-bottom:5px;margin-top:5px;border:solid 1px rgba(110,110,110,.45);box-shadow:0px 1px 10px rgba(160,160,160,.8);background-color:" + status + ";border: solid 1px rgba(160,160,160,.5);font-size:16px;text-transform:capitalize;color:black;font-size:18px'>" + model.personalInfo.name + "</div><div class='col-xs-12'><div class='row' id='home_section'></div></div></div>";

      document.getElementById('main').innerHTML = content;
      var ctd = "";
      if(model.classes_today.length != 0 ){
        ctd = "<div class='row'><div class='col-xs-12' style='background-color:#0277BD;color:white;padding-top:10px;border-radius:3px 3px 0 0;padding-bottom:10px;font-size:24px;border-bottom: 1px solid rgb(90,90,90,.6)'>Classes today - " + model.classes_today.length + "</div></div><div class='row' style='margin-top:10px;margin-bottom:5px'>";
        model.classes_today.forEach(function(c,n){
          ctd += "<div class='col-xs-3' style='border-radius:3px;color:rgba(0,0,0,.6);padding:5px;'><div class='row' style='padding:0px;margin:0px'><div class='col-xs-12' style='padding:0px;color:rgba(0,0,0,.7);font-size:16px'>" + c.class + "th<sub>class</sub></div><div class='col-xs-12' style='padding:0px;color:rgba(0,0,0,.5);font-size:12px'>" + c.period + "th<sub>period</sub></div></div></div>";
        })
        ctd += "</div></div>";
      } else {
        ctd = "<div class='row'><div class='col-xs-8 col-xs-offset-2' style='font-size:24px;color:rgb(244, 83, 66)'>! Schedule Not Available</div><div class='col-xs-12' style='color:rgba(0,0,0,1)'>set up now</div></div></div>";
      }
      console.log(model);

      var content2 = "<div class='col-xs-12' style='border-radius:3px;margin-bottom:5px;background-color:white;border:solid 1px rgba(110,110,110,.45);box-shadow:0px 1px 10px rgba(160,160,160,.8)'>" + ctd + absent;
      document.getElementById('home_section').innerHTML = content2;
      content = "<div id='notifyUser' class='notif-modal'><div class='row text-center'><div class='col-xs-8 col-xs-offset-2' style='opacity:.95;border-radius:3px;padding-top:5px;padding-bottom:5px' id='notifText'></div></div></div><div id='notifyError' class='col-xs-12 modal'><div class='row text-center' style='padding-top:120px'><div class='col-xs-8 col-xs-offset-2' style='padding-top:10px;padding-bottom:10px;;border-radius:3px;background-color:white' id='notifText2'></div></div></div>";
      document.getElementsByTagName('body')[0].innerHTML += content;

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
   document.getElementById('main').style.backgroundImage = "none";
   document.getElementById('mobile-home-section').style.color = "grey";
   document.getElementById('mobile-personal-section').style.color = "grey";
   document.getElementById('mobile-report-section').style.color = "black";
    document.getElementById('take-attendance-button').style.display = "none";
    var content = "<div class='col-xs-12 batches_box;' style='overflow-x:hidden;height:94%;display:fixed;padding-left:25px;padding-right:25px;margin-top:5px;'><div class='row' id='batch_list_header' style='margin-bottom:5px;border-radius:3px'><h4 class='col-xs-12'>batches</h4></div><div id='batches_cards' style='margin-bottom:10px'></div></div>";
    document.getElementById('mainX').innerHTML = content;
    var contentX = "";
    model.personalInfo.current_classes.forEach(function(x,i){
      var days = ["Mon","Tue","Wed","Thu","Fri","Sat"];
      var classes_timing = "";
      if(x.schedule && x.schedule.length !=0){
        x.schedule.forEach(function(z,n){
          classes_timing += "<div class='col-xs-2' style='color:rgba(0,0,0,.7);'><div class='row'><div class='col-xs-12' style='padding:0'>" + days[n] + "</div><div class='col-xs-12' style='font-size:10px;color:rgba(0,0,0,.6);padding:0'>" + z + "th</div></div></div>";
        })
      } else {
        classes_timing += "<div class='col-xs-12' style='color:rgba(0,0,0,.6);font-size:18px'>No schedule found</div>";
      }
      contentX += "<div class='row text-center' style='margin-bottom:5px;border: solid 1px rgba(200,200,200,.2);border-radius:5px'><div class='col-xs-12' style='background-color:white;border:solid 1px rgba(110,110,110,.45);box-shadow:0px 1px 10px rgba(160,160,160,.8)'><div class='row'><div class='col-xs-4' style='font-size:44px;padding-top:10px'><div class='row'><div class='col-xs-12;' style='color:rgba(0,0,0,.55);color:rgba(0,0,0,.8);'>" + x.class + "<span style='font-size:24px'>th</span></div></div></div><div class='col-xs-7'><h2 style='margin-top:10px;color:rgba(0,0,0,.7);margin-bottom:0px;'>" + x.subject + "</h2><div class='row' style='margin-top:0px'><div class='col-xs-12' style='font-size:13px;color:rgba(0,0,0,.4)'>strength -</div></div></div></div><div class='row' style='margin-top:10px;border-bottom:solid 1px rgba(0,0,0,.1);padding-bottom:10px;padding-right:5px'>" + classes_timing + "</div><div class='row' style='padding-top:10px;padding-bottom:10px;font-size:18px;margin-top:0px'><div class='col-xs-4'><span class='glyphicon glyphicon-envelope' style='color:#4286f4'></span></div><div class='col-xs-4 lelo' id='report#"+x._id+"'><span id='report#"+x._id+"' class='glyphicon glyphicon-circle-arrow-right'></span></div><div class='col-xs-4' id='options#"+x._id+"' onclick='view.showBatchOptionModal(event)'><span id='options#"+x._id+"' class='glyphicon glyphicon glyphicon-option-horizontal'></span></div></div></div></div>";
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
    var content = "<div class='row modal' id='scoreOptionsModal'><div class='col-xs-12 text-center'><div class='row'><h3 class='col-xs-12' style='color:black'>Scores</h3></div><div class='row'><div class='col-xs-12 col-xs-offset-1' style='margin-top: 20px'><div class='row' style='margin-top: 10px'><div class='btn btn-danger disabled'>Edit Previous Scores</div></div><div class='row' style='margin-top: 10px'><div class='btn btn-danger' onclick='view.getTestSettings()'>Create New Test Score List</div></div></div></div>";
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
    var content = "<div class='col-xs-12' style='position:relative;top: 30%'><div class='row'><div class='col-xs-12 col-xs-offset-1' style='background-color:white;border-radius:3px'><div class='row' style='border-bottom: solid 1px white'><h4 class='col-xs-12' id='scoreSettings' style='color:black'>Settings</h4></div><div class='row' style='margin-top:10px'><div class='col-xs-12'><input type='text' id='scoreSettingInput' autofocus></div></div><div class='row' style='margin-top:10px;margin-bottom:10px'><div class='btn btn-warning' onclick='controller.addScoreSetting()'>Done</div></div></div></div></div>";
    document.getElementById('main').innerHTML = content;
    document.getElementById('scoreSettingInput').focus();
    document.getElementById('scoreSettings').innerHTML = model.scoreSettinglist[model.scoreSettingCount];
  },

  showNamesForScores: function(){
    var content = "<div class='col-xs-12' style='position:relative;top: 30%'><div class='row'><div class='col-xs-12 col-xs-offset-1' style='background-color:rgba(40,40,40,.4);border-radius:3px'><div class='row' style='border-bottom: solid 1px white'><h4 class='col-xs-12' id='student_name' style='color:white'>student</h4></div><div class='row' style='margin-top:10px'><div class='col-xs-12'><input type='text' maxlength=" + model.scoreSettings[1]["Maximum Score"].length + "  id='studentScore' autofocus></div></div><div class='row' style='margin-top:10px;margin-bottom:10px'><div class='col-xs-6 text-right' onclick='view.getTestSettings()'><div class='btn glyphicon glyphicon-repeat' style='color:red'></div></div><div class='col-xs-6 text-left' onclick='view.oneStepBack()'><div class='btn glyphicon glyphicon-arrow-left'></div></div></div></div></div></div></div>";

    /* <div class='col-xs-4' onclick='view.getScores()'><div class='btn glyphicon glyphicon-ok text-success'></div></div> */

    document.getElementById('main').innerHTML = content;
    document.getElementById('studentScore').focus();
    console.log(model.students[model.studentCount]["name"]);
    document.getElementById('student_name').innerHTML = model.students[model.studentCount]["name"];
    var obj = {};
    var input = document.querySelector('#studentScore');
    input.addEventListener('input', function(){
      if(!Number.isNaN(input.value)){
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
    if(model.studentCount === 5){
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

  showAbsentOption: function(){
    var content = "<div class='modal col-xs-12' id='absentModal'><div class='row' style='padding-top:50px'><div class='col-xs-8 col-xs-offset-2 text-center modalContent' style='background-color:white;border-radius:7px;'><div class='row' style='border-bottom:solid 1px rgba(0,0,0,.6);'><div class='col-xs-12' style='color:rgba(0,0,0,.8)'><h2>Reason</h2></div></div><div class='row' style='border-bottom: solid 1px black;font-size:20px;cursor:pointer'><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(60,60,60,.4);font-size:14px' onclick='controller.willBeAbsent(1)'>On School Duty</div><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;font-size:14px' onclick='controller.willBeAbsent(2)'>Day off</div></div></div></div><div class='row' style='margin-top:20px'><div class='col-xs-12 text-center'><span class='glyphicon glyphicon-remove' style='font-size:24px;color:white' onclick='view.closeAbsentModal()'></span></div></div></div>";
    document.getElementsByTagName("body")[0].innerHTML += content;
    document.getElementById("absentModal").style.display = "block";
  },

  closeDownloadListModal: function(){
    document.getElementById('downloadsOptionModal').style.display = "none";
    controller.showReport();
  },

  closeBatchListModal: function(){
    document.getElementById('batchListModal').style.display = "none";
    document.getElementById('take-attendance-button').style.display = "block";
    controller.showReport();
  },

  closeAbsentModal: function(){
    document.getElementById('absentModal').style.display = "none";
  },

  closeBatchOptionModal: function(){
    document.getElementById('batchOptionModal').style.display = "none";
  },

  closeSetSchedule: function(){
    document.getElementById('setSchedule').style.display = "none";
  },

  closeNotifyClass: function(){
    document.getElementById('notifyClass').style.display = "none";
  },

  showPersonal: function(){
    document.getElementById('take-attendance-button').style.display = "none";
    document.getElementById('mobile-home-section').style.color = "grey";
    document.getElementById('mobile-report-section').style.color = "grey";
    document.getElementById('mobile-personal-section').style.color = "black";
    if(model.personalInfo.profileSetUp === 0){
      document.getElementById('main').style.backgroundImage = "url('/img/back.JPG')";
      document.getElementById('main').innerHTML = "<div class='col-xs-12' style='height:100%;background-color:rgba(0,0,0,.8)'><div class='row'><div class='col-xs-12' style='margin-top:30%'><div class='row'><div class='col-xs-10 col-xs-offset-1' style='background-color:rgb(0, 150, 136);color:white;border-radius:3px;font-size:18px;padding:10px;margin-bottom:10px;'>We need to know little more about you. Please provide us some more information</div></div><div class='row'><div class='col-xs-8 col-xs-offset-2'><div class='btn btn-primary' onclick='view.setUpProfile()'>Set up Profile</div></div></div></div></div></div>"
    } else {
      console.log(model);
      var firstName = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.3)'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249)'>First Name</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8)'>" + model.personalInfo.first + "</div></div>";

      var secondName = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.3)'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249)'>Last Name</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8)'>" + model.personalInfo.last + "</div></div>";

      var password = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249)'>Password</div><a class='col-xs-12 text-left' style='color:rgba(60,60,60,.8);text-decoration:underline' href='#' target='_blank'>change</a></div>";

      var mobile = "<div class='row' style='background-color:white;;padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.3)'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249)'>Mobile</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8)'>" + model.personalInfo.mobile + "</div></div>";

      var email = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249)'>EMAIL</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8)'>" + model.personalInfo.email + "</div></div>";

      document.getElementById('main').innerHTML = "<div class='col-xs-12' style='overflow-y:auto;height:98%;overflow-y:auto;'><div class='row'><div class='col-xs-12' style='background-color:rgb(14, 22, 35);padding-top:20px;padding-bottom:20px'><img src='img/flat-face-icon-23.png' style='max-width:100px;'></div></div><div class='row'><div class='col-xs-12 text-center' style='background-color:rgb(230,230,230)'>Personal Info</div></div>" + firstName + secondName + password + "<div class='row'><div class='col-xs-12 text-center' style='background-color:rgb(230,230,230)'>Contact Info</div></div>" + mobile + email + "</div>";
    }
  },

  setUpProfile: function(){
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
    var firstName = "<div class='row text-center prf_stup_fields'><div class='col-xs-12'>First Name <span class='showRequiredError' id='showRequiredError#first'></span></div><div class='col-xs-12'><input id='first' size=15 class='required' type=text onblur='controller.check(event)'></div></div>";

    var lastName = "<div class='row text-center prf_stup_fields'><div class='col-xs-12'>Last Name <span class='showRequiredError' id='showRequiredError#second'></span></div><div class='col-xs-12'><input id='last' size=15 class='required' type=text onblur='controller.check(event)'></div></div>";

    var dob = "<div class='row text-center prf_stup_fields'><div class='col-xs-12'>Date of Birth <span class='showRequiredError' id='showRequiredError#first'></span></div><div class='col-xs-12 text-center'>" + dt + mn + y + "</div></div>";

    var mobile = "<div class='row text-center prf_stup_fields'><div class='col-xs-12'>Mobile <span class='showRequiredError' id='showRequiredError#mobile'></span></div><div class='col-xs-12'><input id='mobile' size=15 class='required' maxlength=10 type=text onblur='controller.check(event)'></div></div>";

    var address = "<div class='row text-center prf_stup_fields'><div class='col-xs-12'>Address</div><div class='col-xs-12'><input id='address' size=15 type=text></div></div>";

    var email = "<div class='row text-center prf_stup_fields'><div class='col-xs-12'>E-Mail Id <span class='showRequiredError' id='showRequiredError#email'></span></div><div class='col-xs-12'><input id='email' size=15 class='required' type=text onblur='controller.check(event)'></div></div>";

    var password = "<div class='row text-center prf_stup_fields'><div class='col-xs-12'>New Password <span class='showRequiredError' id='showRequiredError#password'></span></div><div class='col-xs-12'><input id='password' size=15 class='required' type=password onblur='controller.check(event)'></div></div>";

    var reEnterPassword = "<div class='row text-center prf_stup_fields'><div class='col-xs-12'>Re-enter Password <span class='showRequiredError' id='showRequiredError#reEnterPassword'></span></div><div class='col-xs-12'><input class='required' id='reEnterPassword' size=15 type=password onblur='controller.check(event)'></div></div>";

    document.getElementById('main').innerHTML = "<div class='col-xs-12' style='height:94%;overflow-y:auto;background-color:rgba(0,0,0,.5)'><div class='row' style='padding-left:10px;padding-right:10px'><div class='col-xs-12'>" + firstName + lastName + dob + mobile + address + email + password + reEnterPassword + "</div></div><div class='row' style='padding-left:10px;padding-right:10px'><div class='col-xs-12'><div class='row text-center prf_stup_fields' style='background-color:#FF5722;color:white'><div class='col-xs-12' onclick='controller.checkAll()' style='border-radius:3px;'><h4>Submit</h4></div></div></div></div></div>"
    var i = 0;
    document.getElementById('main').style.backgroundImage = "none";

  },

  showBatchOptionModal: function(e){
    var batch = e.target.id.split('#')[1];
    model.selectedBatch._id = batch;
    document.getElementsByTagName('body')[0].innerHTML += "<div class='col-xs-12 modal' style='background-color:black' id='batchOptionModal'><div class='row text-center'><div class='col-xs-8 col-xs-offset-2' style='background-color:white;border-radius:7px;margin-top:20%;'><div class='row'><div class='col-xs-12' style='border-bottom:solid 1px rgba(20,20,20,.8)'><h3>Options</h3></div><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.6)' onclick='view.setScheduleModal()'>Analysis</div><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.6)' onclick='view.setScheduleModal()'>Set Schedule</div><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.6)' onclick='view.notifyClass()'>Notify class</div><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.6)'>Course Update</div></div></div></div><div class='row' style='margin-top:20px'><div class='col-xs-12 text-center' style='position:absolute;bottom:50px'><span class='glyphicon glyphicon-remove' style='font-size:24px;color:white' onclick='view.closeBatchOptionModal()'></span></div></div></div></div></div>";
    document.getElementById('batchOptionModal').style.display = "block";
  },

  setScheduleModal: function(){
    var day ="<div class='col-xs-12'><div class='row' style='margin-top:5px;margin-bottom:5px'><div class='col-xs-6'><h4>Days</h4></div><div class='row'><div class='col-xs-6'><h4>Period</h4></div></div><div style='height:130px;overflow-y:auto;overflow-x:hidden'>";
    var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    days.forEach(function(x,i){
      day += "<div class='row' style='margin-top:5px;margin-bottom:5px'><div class='col-xs-6'>" + days[i] + "</div><div class='col-xs-3 col-xs-offset-1'><input type='text' size=2 maxlength=2 style='border-radius:3px;border: solid 1px rgba(0,0,0,.5)' id='day" + i + "'></div></div>";
    })
    day += "</div>";
    document.getElementById('batchOptionModal').style.display = "none";
    document.getElementsByTagName('body')[0].innerHTML += "<div class='col-xs-12 modal' style='background-color:black' id='setSchedule'><div class='row text-center'><div class='col-xs-8 col-xs-offset-2'><div class='row' style='background-color:white;border-radius:7px;margin-top:20%;'><div class='col-xs-12' style='border-bottom:solid 1px rgba(20,20,20,.8)'><h3>Set Schedule</h3></div>" + day + "<div class='col-xs-12' style='padding-top:5px;padding-bottom:5px;' onclick='controller.setSchedule()'>Set</div></div></div></div></div></div><div class='row' style='margin-top:20px'><div class='col-xs-12 text-center' style='position:absolute;bottom:50px'><span class='glyphicon glyphicon-remove' style='font-size:24px;color:white' onclick='view.closeSetSchedule()'></span></div></div></div>";
    document.getElementById('setSchedule').style.display = "block";
  },

  notifyClass: function(){
    document.getElementById('batchOptionModal').style.display = "none";
    document.getElementsByTagName('body')[0].innerHTML += "<div class='col-xs-12 modal' style='background-color:black' id='notifyClass'><div class='row text-center'><div class='col-xs-8 col-xs-offset-2' style='background-color:white;border-radius:5px;margin-top:10%;'><div class='row'><div class='col-xs-12' style='border-bottom: solid 1px rgba(0,0,0,.8);margin-bottom:15px'><h3>Write Text</h3></div><div class='col-xs-12' style='padding-bottom:15px;'><textarea id='notify-text' type=text maxlength='160' rows=5 style='border: solid 1px rgba(60,60,60,.5)' style='height:100px' placeholder='Notify about Test, Books etc'></textarea></div><div class='col-xs-12' style='margin-top:10px;margin-bottom:10px' onclick='controller.notifyClass()'>Send</div></div></div></div><div class='row' style='margin-top:20px'><div class='col-xs-12 text-center' style='position:absolute;bottom:50px'><span class='glyphicon glyphicon-remove' style='font-size:24px;color:white' onclick='view.closeNotifyClass()'></span></div></div></div>";
    document.getElementById('notifyClass').style.display = "block";
  }
};


var model = {
  classes_today:[],
  selectedBatch:{},
  months: ["January","February","March","April","May","June","July","August","Septembet","October","November","December"],
};

/*
contentX += "<div class='row'><div class='col-xs-12 text-left' style='color:rgba(0,0,0,.55);color:rgba(0,0,0,.9);font-family:Raleway;font-size:20px;border-bottom:solid 1px rgba(0,0,0,.1);'>" + x.class + "<span style='font-size:24px'>th</span></div></div><div class='row text-center' style='margin-bottom:5px;'><div class='col-xs-12' style=''><div class='row'><div class='col-xs-12'><h3 style='margin-top:10px;color:rgba(0,0,0,.8);margin-bottom:0px;'>" + x.subject + "</h3><div class='row' style='margin-top:0px'><div class='col-xs-12' style='font-size:13px;color:rgba(0,0,0,.4)'>strength -</div></div></div></div><div class='row' style='margin-top:10px;padding-bottom:10px;padding-right:5px'>" + classes_timing + "</div><div class='row' style='padding-top:10px;padding-bottom:10px;font-size:18px;margin-top:0px;color:blue'><div class='col-xs-4'><span class='glyphicon glyphicon-envelope' style='font-size:14px'></span></div><div class='col-xs-4 lelo' id='report#"+x._id+"'><span id='report#"+x._id+"' class='glyphicon glyphicon-circle-arrow-right' style='font-size:14px'></span></div><div class='col-xs-4'><span class='glyphicon glyphicon glyphicon-option-horizontal'></span></div></div></div></div>";
*/
