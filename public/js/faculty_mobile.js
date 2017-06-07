var view = {
  loadHome: function(){
    var d = new Date()
    d.setHours(0)
    d.setMinutes(0)
    d.setSeconds(0)
    d.setMilliseconds(0)
    var status = "white";
    var absent = "";

    if(model.personalInfo.absent && model.personalInfo.absent.length != 0){
      if(model.personalInfo.absent.indexOf(d.valueOf())>-1){
        absent = "<div class='col-xs-12' style='border-radius:3px;'><h4 class='btn btn-success' onclick=''>Mark Present</h4></div>";
        status = "rgb(239, 62, 62)";
      } else {
        absent = "<div class='row'><div class='col-xs-12' style='border-radius:3px;'><div class='row'><div class='col-xs-12'><h4 class='btn btn-danger' onclick='view.showAbsentOption()'>Will be Absent</h4></div></div><div class='row'><div class='col-xs-12' style='border-radius:3px;'><h4 class='btn btn-primary' onclick=''>Will be Present</h4></div></div></div></div>";
        status = "white";
      }
    } else {
      absent = "<div class='row'><div class='col-xs-12' style='border-radius:3px;'><div class='row'><div class='col-xs-12'><h4 class='btn btn-danger' onclick='view.showAbsentOption()'>Will be Absent</h4></div></div><div class='row'><div class='col-xs-12' style='border-radius:3px;'><h4 class='btn btn-primary' onclick=''>Will be Present</h4></div></div></div></div>";
    }

    var content = "<div class='col-xs-12' style='border-radius:3px;margin-bottom:5px;padding-top:5px;padding-bottom:5px;margin-top:5px;background-color:" + status + ";border: solid 1px rgba(200,200,200,.5);font-size:16px;text-transform:capitalize;color:black;font-size:18px'>" + model.personalInfo.personalData.name + "</div><div class='col-xs-12'><div class='row' id='home_section'></div></div>";
    document.getElementById('main').style.paddingLeft = "10px";
    document.getElementById('main').style.paddingRight = "10px";
    document.getElementById('main').innerHTML = content;
    var ctd = "";
    if(model.classes_today.length != 0 ){
      ctd = "<div class='row'><div class='col-xs-12' style='font-size:24px;font-weight:bold;color:rgba(0,0,0,.7)'>" + model.classes_today.length + " Classes today</div></div><div class='row' style='margin-top:10px;margin-bottom:5px'>" + classes_today + "</div></div>";
      model.classes_today.forEach(function(c,n){
        ctd += "<div class='col-xs-3' style='border-radius:3px;color:rgba(0,0,0,.6);padding:0px;'><div class='row' style='padding:0px;margin:0px'><div class='col-xs-12' style='padding:0px;color:rgba(0,0,0,.7);font-size:16px'>" + c.class + "th<sub>class</sub></div><div class='col-xs-12' style='padding:0px;color:rgba(0,0,0,.5);font-size:12px'>" + c.period + "th<sub>period</sub></div><div class='col-xs-12' style='margin-top:5px;font-size:16;color:red;'><span class='glyphicon glyphicon-remove'></span></div></div></div>";
      })
    } else {
      ctd = "<div class='row'><div class='col-xs-8 col-xs-offset-2' style='font-size:24px;font-weight:bold;color:rgb(244, 83, 66)'>! Schedule Not Available</div><div class='col-xs-12' style='color:rgba(0,0,0,1)'>set up now</div></div></div>";
    }
    console.log(model);

    var content2 = "<div class='col-xs-12' style='padding-bottom:10px;border-radius:3px;margin-bottom:5px;padding-top:7px;background-color:white;border: solid 1px rgba(200,200,200,.5);'>" + ctd + absent;
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
    var content = "<div class='col-xs-12 batches_box;' style='overflow-x:hidden;height:94%;display:fixed;padding-left:25px;padding-right:25px;margin-top:5px;'><div class='row' id='batch_list_header' style='background-color:white;border: solid 1px rgba(200,200,200,.5);margin-bottom:5px;border-radius:3px'><h4 class='col-xs-12'>batches</h4></div><div id='batches_cards' style='margin-bottom:10px'></div></div>";
    document.getElementById('main').innerHTML = content;
    var contentX = "";
    model.personalInfo.current_classes.forEach(function(x,i){
      var days = ["Mon","Tue","Wed","Thu","Fri","Sat"];
      var classes_timing = "";
      if(x.timing && x.timing.length !=0){
        x.timing.forEach(function(z,n){
          classes_timing += "<div class='col-xs-2' style='color:rgba(0,0,0,.7);'><div class='row'><div class='col-xs-12' style='padding:0'>" + days[n] + "</div><div class='col-xs-12' style='font-size:10px;color:rgba(0,0,0,.6);padding:0'>" + z + "th</div></div></div>";
        })
      } else {
        classes_timing += "<div class='col-xs-12' style='color:rgba(0,0,0,.6);font-size:18px'>No schedule found</div>";
      }
      contentX += "<div class='row text-center' style='margin-bottom:5px;border: solid 1px rgba(200,200,200,.3);box-shadow:1px 1px 1px rgba(160,160,160,.6);border-radius:5px'><div class='col-xs-12' style='background-color:white;'><div class='row'><div class='col-xs-4' style='font-size:44px;padding-top:10px'><div class='row'><div class='col-xs-12;' style='color:rgba(0,0,0,.55);color:rgba(0,0,0,.8);font-family:Raleway'>" + x.class + "<span style='font-size:24px'>th</span></div></div></div><div class='col-xs-7'><h3 style='margin-top:10px;color:rgba(0,0,0,.8);margin-bottom:0px;'>" + x.subject + "</h3><div class='row' style='margin-top:0px'><div class='col-xs-12' style='font-size:13px;color:rgba(0,0,0,.4)'>strength -</div></div></div></div><div class='row' style='margin-top:10px;border-bottom:solid 1px rgba(0,0,0,.1);padding-bottom:10px;padding-right:5px'>" + classes_timing + "</div><div class='row' style='padding-top:10px;padding-bottom:10px;font-size:18px;margin-top:0px'><div class='col-xs-4'><span class='glyphicon glyphicon-envelope' style='color:#4286f4'></span></div><div class='col-xs-4 lelo' id='report#"+x._id+"'><span id='report#"+x._id+"' class='glyphicon glyphicon-circle-arrow-right'></span></div><div class='col-xs-4'><span class='glyphicon glyphicon glyphicon-option-horizontal'></span></div></div></div></div>";
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
      if(!Number.isNan(input.value)){
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

  showAbsentOption: function(){
    var content = "<div class='row modal' id='absentModal' style='padding-top:150px'><div class='col-xs-8 col-xs-offset-2 text-center modalContent' style='background-color:white;border-radius:7px;'><div class='row' style='border-bottom:solid 1px rgba(0,0,0,.6);color:rgb(91, 143, 247)'><div class='col-xs-12'><h2>Reason</h2></div></div><div class='row' style='border-bottom: solid 1px black;font-size:20px;cursor:pointer'><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(60,60,60,.4);' onclick='controller.willBeAbsent(1)'>On School Duty</div><div class='col-xs-12' style='padding-top:10px;padding-bottom:10px;' onclick='controller.willBeAbsent(2)'>Day off</div></div><div class='row'><div class='col-xs-4 col-xs-offset-4' style='padding-top:10px;padding-bottom:10px;color:rgb(244, 14, 33);cursor:pointer' onclick='view.closeAbsentModal()'>close</div></div></div></div>";
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

  showPersonal: function(){
    document.getElementById('take-attendance-button').style.display = "none";
    document.getElementById('mobile-home-section').style.color = "grey";
    document.getElementById('mobile-report-section').style.color = "grey";
    document.getElementById('mobile-personal-section').style.color = "black";
    if(!model.personalInfo.personalData){
      document.getElementById('main').innerHTML = "<div class='col-xs-12' style='margin-top:30%'><div class='row'><div class='col-xs-10 col-xs-offset-1' style='background-color:white;border-radius:5px;font-size:18px;padding:10px;margin-bottom:10px'>We need to know little more about you. Please provide us some more information</div></div><div class='row'><div class='col-xs-8 col-xs-offset-2'><div class='btn btn-primary' onclick='view.setUpProfile()'>Set up Profile</div></div></div></div>"
    } else {
      var firstName = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.3)'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249)'>First Name</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8)'>" + model.personalInfo.personalData.first + "</div></div>";

      var secondName = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.3)'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249)'>Last Name</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8)'>" + model.personalInfo.personalData.last + "</div></div>";

      var password = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249)'>Password</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8)'>change</div></div>";

      var mobile = "<div class='row' style='background-color:white;;padding-top:10px;padding-bottom:10px;border-bottom:solid 1px rgba(160,160,160,.3)'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249)'>Mobile</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8)'>" + model.personalInfo.personalData.mobile + "</div></div>";

      var email = "<div class='row' style='background-color:white;padding-top:10px;padding-bottom:10px;'><div class='col-xs-12 text-left' style='color:rgb(77, 215, 249)'>EMAIL</div><div class='col-xs-12 text-left' style='color:rgba(60,60,60,.8)'>" + model.personalInfo.personalData.email + "</div></div>";
      
      document.getElementById('main').innerHTML = "<div class='col-xs-12' style='overflow-y:auto'><div class='row'><div class='col-xs-12' style='background-color:rgba(14, 23, 35,.98);padding-top:20px;padding-bottom:20px'><img src='img/flat-face-icon-23.png' style='max-width:100px;'></div></div><div class='row'><div class='col-xs-12 text-center'>Personal Info</div></div>" + firstName + secondName + password + "<div class='row'><div class='col-xs-12 text-center'>Contact Info</div></div>" + mobile + email + "</div>";
    }
  },

  setUpProfile: function(){
    var firstName = "<div class='row' style='background-color:white;border-radius:3px;padding-top:10px;padding-bottom:10px;margin-bottom:5px;border: solid 1px rgba(160,160,160,.5)'><div class='col-xs-4'>First Name</div><div class='col-xs-6'><input id='first' class='required' size=15 type=text style='border: solid 1px rgba(160,160,160,.8);border-radius:3px' onblur='controller.check(event)'></div><div class='col-xs-2 showRequiredError' id='showRequiredError#first'></div></div>";

    var lastName = "<div class='row' style='background-color:white;border-radius:3px;padding-top:10px;padding-bottom:10px;margin-bottom:5px;border: solid 1px rgba(160,160,160,.5)'><div class='col-xs-4'>Last Name</div><div class='col-xs-6'><input id='last' class='required' size=15 type=text style='border: solid 1px rgba(160,160,160,.8);border-radius:3px' onblur='controller.check(event)'></div><div class='col-xs-2 showRequiredError' id='showRequiredError#last'></div></div>";

    var mobile = "<div class='row' style='background-color:white;border-radius:3px;padding-top:10px;padding-bottom:10px;margin-bottom:5px;border: solid 1px rgba(160,160,160,.5)'><div class='col-xs-4'>Mobile</div><div class='col-xs-6'><input id='mobile' class='required' size=15 maxlength=10 type=text style='border: solid 1px rgba(160,160,160,.8);border-radius:3px' onblur='controller.check(event)'></div><div class='col-xs-2 showRequiredError' id='showRequiredError#mobile'></div></div>";

    var address = "<div class='row' style='background-color:white;border-radius:3px;padding-top:10px;padding-bottom:10px;margin-bottom:5px;border: solid 1px rgba(160,160,160,.5)'><div class='col-xs-4'>Address</div><div class='col-xs-6'><input id='address' size=15 type=text style='border: solid 1px rgba(160,160,160,.8);border-radius:3px'></div></div>";

    var email = "<div class='row' style='background-color:white;border-radius:3px;padding-top:10px;padding-bottom:10px;margin-bottom:5px;border: solid 1px rgba(160,160,160,.5)'><div class='col-xs-4'>E-Mail Id</div><div class='col-xs-6'><input id='email' class='required' size=15 type=text style='border: solid 1px rgba(160,160,160,.8);border-radius:3px' onblur='controller.check(event)'></div><div class='col-xs-2 showRequiredError' id='showRequiredError#email'></div></div>";

    var password = "<div class='row' style='background-color:white;border-radius:3px;padding-top:10px;padding-bottom:10px;margin-bottom:5px;border: solid 1px rgba(160,160,160,.5)'><div class='col-xs-4'>New Password</div><div class='col-xs-6'><input id='password' class='required' size=15 type=password style='border: solid 1px rgba(160,160,160,.8);border-radius:3px' onblur='controller.check(event)'></div><div class='col-xs-2 showRequiredError' id='showRequiredError#password'></div></div>";

    var reEnterPassword = "<div class='row' style='background-color:white;border-radius:3px;padding-top:10px;padding-bottom:10px;margin-bottom:5px;border: solid 1px rgba(160,160,160,.5)'><div class='col-xs-4'>Re-enter Password</div><div class='col-xs-6'><input size=15 class='required' id='reEnterPassword' type=password style='border: solid 1px rgba(160,160,160,.8);border-radius:3px' onblur='controller.check(event)'></div><div class='col-xs-2 showRequiredError' id='showRequiredError#reEnterPassword'></div></div>";

    document.getElementById('main').innerHTML = "<div class='col-xs-10 col-xs-offset-1' style='height:94%;overflow-y:auto;'>" + firstName + lastName + mobile + address + email + password + reEnterPassword + "<div class='row'><div class='col-xs-12'><div class='btn btn-danger' onclick='controller.checkAll()'>Submit</div></div></div></div>"
    var i = 0;

  }
};

var model = {
  classes_today:[],
  selectedBatch:{},
  months: ["January","February","March","April","May","June"],
};

/*
contentX += "<div class='row'><div class='col-xs-12 text-left' style='color:rgba(0,0,0,.55);color:rgba(0,0,0,.9);font-family:Raleway;font-size:20px;border-bottom:solid 1px rgba(0,0,0,.1);'>" + x.class + "<span style='font-size:24px'>th</span></div></div><div class='row text-center' style='margin-bottom:5px;'><div class='col-xs-12' style=''><div class='row'><div class='col-xs-12'><h3 style='margin-top:10px;color:rgba(0,0,0,.8);margin-bottom:0px;'>" + x.subject + "</h3><div class='row' style='margin-top:0px'><div class='col-xs-12' style='font-size:13px;color:rgba(0,0,0,.4)'>strength -</div></div></div></div><div class='row' style='margin-top:10px;padding-bottom:10px;padding-right:5px'>" + classes_timing + "</div><div class='row' style='padding-top:10px;padding-bottom:10px;font-size:18px;margin-top:0px;color:blue'><div class='col-xs-4'><span class='glyphicon glyphicon-envelope' style='font-size:14px'></span></div><div class='col-xs-4 lelo' id='report#"+x._id+"'><span id='report#"+x._id+"' class='glyphicon glyphicon-circle-arrow-right' style='font-size:14px'></span></div><div class='col-xs-4'><span class='glyphicon glyphicon glyphicon-option-horizontal'></span></div></div></div></div>";
*/
