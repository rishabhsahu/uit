var controller = {
  sectionData: function(){
    var getDepartmentData = new XMLHttpRequest();
    if(!getDepartmentData){
      console.log(err)
    }
      getDepartmentData.onreadystatechange = function(){
        var response = getDepartmentData.response;
        if(getDepartmentData.status === 200 && getDepartmentData.readyState === 4){
          var response = JSON.parse(response);
          model.info = response;
          model.absentToday = [];
          model.reasonToday = [];
          console.log(model)
          model.info.faculties.forEach(function(x,i){
            var d = new Date();
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
            if(x.absent){
              if( x.absent.indexOf(d.valueOf()) != -1){
                model.absentToday.push(x.name);
                model.reasonToday.push(x.reason[d.valueOf()]);
              }
            }
          })

          view.updateView();
        } else if(getDepartmentData.status === 500 && getDepartmentData.readyState === 4){
            view.notifyUser("Internal Server Error",1);
        }

    }
    getDepartmentData.open('GET','http://localhost:3000/admin/getDepartmentData',true);
    getDepartmentData.send(null);
  },

  facultySelected: function(e){
    e = e.target.id;
    model.selectedFaculty = {};
    model.selectedFaculty._id = e;
    getFacultyData(0);
  },

  getFacultyData: function(n){
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    var facultyDataRequest = new XMLHttpRequest();

    facultyDataRequest.onreadystatechange = function(){
      var response = facultyDataRequest.response;
      if(facultyDataRequest.status === 200 && facultyDataRequest.readyState === 4){
        response = JSON.parse(response);
        model.selectedFaculty = response;
        model.selectedFaculty.classes_today = {};
        if(model.selectedFaculty.current_classes && model.selectedFaculty.current_classes.length>0){
          model.selectedFaculty.current_classes.forEach(function(cl,i){
            if(cl.schedule){
              model.selectedFaculty.classes_today[cl.class] = cl.schedule[d.getDay()-1];
            } else {
              model.selectedFaculty.classes_today[cl.class] = "unknown";
            }
          })
        } else {
          model.selectedFaculty.classes_today = "Not Set Yet";
        }
        if(n === 1){
          controller.renderClassData2();
        } else {
          view.showSelectedFacultyData();
        }
      } else if(facultyDataRequest.status === 500 && facultyDataRequest.readyState === 4){
        view.notifyUser("Internal Server Error",1);
      } else if(facultyDataRequest.status != 200 && facultyDataRequest.status != 500 && facultyDataRequest.readyState === 4){
        view.notifyUser("Unexpected error occured",1);
      }
    }
    console.log(model.selectedFaculty);
    facultyDataRequest.open('GET','http://localhost:3000/admin/getFacultyData/' + model.selectedFaculty._id ,true);
    facultyDataRequest.send(null);
  },

  getBatchData: function(i){

    var batchDataRequest = new XMLHttpRequest();
    batchDataRequest.onreadystatechange = function(){
      if(batchDataRequest.status === 200 && batchDataRequest.readyState === 4){
        var response = batchDataRequest.response;
        response = JSON.parse(response);
        console.log(response);
        model.selectedBatch = response;
        if(i!=0){
          view.showClassData();
        } else {
        view.renderBatchData();
        }
      } else if(batchDataRequest.status === 500 && batchDataRequest.readyState === 4){
        view.notifyUser("Internal Server Error",1);
      }
    }

    batchDataRequest.open("GET","http://localhost:3000/admin/getBatchData/" + model.selectedBatch._id,true);
    batchDataRequest.send(null);
  },

  showStudentData: function(e){
    e = e.target.id;
    e = e.replace("#","");
    console.log(e);

    view.showStudentData(e);
  },

  selectThisFaculty: function(e){
    if(typeof e === "object"){
      model.SF = {};
      model.SF._id = e.target.id;
      for(var props in document.getElementsByClassName('tabs')){
        if(!isNaN(props)){
        document.getElementsByClassName('tabs')[props].style.backgroundColor = "white";
        }
      }
      document.getElementById(model.SF._id).style.backgroundColor = "rgb(203, 208, 216)";
      document.getElementById(model.SF._id).style.border = "solid 1px rgba(180,180,180,1)";
    }

    var d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    var facultyDataRequest = new XMLHttpRequest();

    facultyDataRequest.onreadystatechange = function(){
      var response = facultyDataRequest.response;
      if(facultyDataRequest.status === 200 && facultyDataRequest.readyState === 4){
        response = JSON.parse(response);
        model.SF = response;
        controller.renderClassData2();
      }
    }
    facultyDataRequest.open('GET','http://localhost:3000/admin/getFacultyData/' + model.SF._id ,true);
    facultyDataRequest.send(null);

  },

  renderClassData2: function(){
    var ch,sch;
    var sn = "";
    model.SF.current_classes.forEach(function(x,i){
      if(x._id === model.selectedBatch._id){
        ch = x.classes_held.length;
        sn = x.subject;
        if(x.schedule){
          sch = x.schedule;
        }
      }
    })
    var stdnm = "";
    var cp,cl;
    model.selectedBatch.student_data.forEach(function(x,i){
      if(x.name && x.enroll_number){
        if(x[sn]){
          if(x[sn].absent){
            cp = ch - x[sn].absent.length;
          } else {
            cp = ch;
          }
        } else {
          cp = ch
        }
        var t = cp/ch*100
        if(isNaN(t)){
          t=0;
        }
        stdnm += "<div class='row' style='padding-top:7px;padding-bottom:7px'><div class='col-xs-4'>" + x.name + "</div><div class='col-xs-4'>" + cp + "</div><div class='col-xs-4'>" + Math.ceil(t) + "</div></div>";
      }
    })
    if(ch === 0){
      cl = "rgb(160,160,160)"
    } else {
      cl = "rgb(0,0,0,.9)";
    }
    if(sch && sch.length!=0){
      var schdg = "<div class='row' style='margin-top:3px;background-color:white;border-radius:3px;border: solid 1px rgb(190,190,190);box-shadow: 0px 1px 10px rgb(160,160,160);'><div class='col-xs-12' style='border-bottom:solid 1px rgb(160,160,160)'><h3>Time Table</h3></div><div class='col-xs-12'><div class='row' style='padding-top:5px;padding-bottom:5px'>";
      sch.forEach(function(x,i){
        schdg += "<div class='col-xs-2'><div class='row'><div class='col-xs-12'><span style='border-bottom: solid 1px rgb(200,200,200)'>" + model.days[i] + "</span></div></div><div class='row'><div class='col-xs-12' style='color:rgb(110,110,110)'>" + x + "</div></div></div>";
      })
      schdg += "</div></div></div>";
    } else {
      schdg = "<div class='row' style='margin-top:3px;background-color:white;border-radius:3px;border: solid 1px rgb(190,190,190);box-shadow: 0px 1px 10px rgb(160,160,160);'><div class='col-xs-12 text-danger'><h2 style='margin-top:10px;margin-bottom:10px'>Schedule not Set</h2></div></div></div>";
    }
    document.getElementById('classStudentData').innerHTML = "<div class='col-xs-10 col-xs-offset-2'><div class='row'><div class='col-xs-12'><div class='row'><div class='col-xs-4' style='padding-top:5px;padding-bottom:5px;background-color:white;border-radius:3px;border: solid 1px rgb(190,190,190);box-shadow: 0px 1px 10px rgb(160,160,160);'><span style='color:rgb(70,70,70);font-weight:bold'>Classes Held</span> - <span style='font-size:16px'>" + ch + "</span></div><div class='col-xs-8' style='padding-top:5px;padding-bottom:5px;background-color:white;border-radius:3px;border: solid 1px rgb(190,190,190);box-shadow: 0px 1px 10px rgb(160,160,160);'><span style='color:rgb(70,70,70);font-weight:bold'>Faculty</span> - <span style='font-size:16px'>" + model.SF.name + "</span></div></div></div></div><div class='row' style='margin-top:5px;background-color:white;border-radius:3px;border: solid 1px rgb(190,190,190);box-shadow: 0px 1px 10px rgb(160,160,160);color:" + cl + "'><div class='col-xs-12'><div class='row' style='color:rgba(0,0,0,.7);font-weight:bold;border-bottom:solid 1px rgba(160,160,160,.5)'><div class='col-xs-4'><h4>Name</h4></div><div class='col-xs-4'><h4>Present</h4></div><div class='col-xs-4'><h4>Attendance</h4></div></div><div class='row' style='height:200px;overflow-y:auto'><div class='col-xs-12'>" + stdnm + "</div></div></div></div>" + schdg + "</div>";
    graph.pastSevenDays();
  },

  addNewFaculty: function(){
    var obj = {};
    obj.name = document.getElementById('Name').value;
      obj["_id"] = document.getElementById('Name').value.replace(" ","") + "@" + model.info.domain_name;
      obj.mobile = document.getElementById('Mobile').value;
      obj.school = model.info.school;
      obj.domain_name = model.info.domain_name;
      obj.section = model.info.section;
      obj.current_classes = [];
      obj.profileSetUp = 0;
      console.log(obj);
      var newFacultyData = new XMLHttpRequest();

      newFacultyData.onreadystatechange = function(){
        if(newFacultyData.status === 201 && newFacultyData.readyState === 4 ){
          view.closeAddFacultyModal(1)
          view.notifyUser("Faculty Registered",1);
        } else if(newFacultyData.status === 500 && newFacultyData.readyState === 4){
          view.closeAddFacultyModal(1)
          view.notifyUser("Internal Server Error",0);
        } else if(newFacultyData.status != 201 && newFacultyData.status !== 500 && newFacultyData.readyState === 4){
          view.closeAddFacultyModal(1)
          view.notifyUser("Enexpected error occured",1);
        }
      }

      newFacultyData.open('POST','http://localhost:3000/admin/addnewfaculty',true);
      newFacultyData.setRequestHeader('Content-type','application/json');
      newFacultyData.send(JSON.stringify(obj));
  },

  addNewBatch: function(){
    var file = document.getElementById('student_list').files[0];
    var batch = document.getElementById('year').value
    var cls = document.getElementById('class').value
    var sc = document.getElementById('section').value
    console.log(batch);
    var newBatchData = new XMLHttpRequest();

    newBatchData.onreadystatechange = function(){
      if(newBatchData.status === 200 && newBatchData.readyState === 4 ){
        view.closeAddBatchModal()
        view.notifyUser("Batch Added Succesfully",1);
        controller.sectionData();
      } else if(newBatchData.status === 500 && newBatchData.readyState === 4){
        view.closeAddBatchModal()
        controller.sectionData();
        view.notifyUser("Internal Server Error Occured while creating Batch",0);
      } else if(newBatchData.status != 200 && newBatchData.status !== 500 && newBatchData.readyState === 4){
        view.closeAddBatchModal()
        view.notifyUser("Faculty Registered",5);
        controller.sectionData();
      }
    }

    newBatchData.open('POST','http://localhost:3000/admin/addnewbatch/' + model.info.domain_name + '/' + batch + '/' + sc + '/' + cls + '/' + model.info.school,true);
    newBatchData.setRequestHeader('Content-type','application/octet-stream');
    newBatchData.send(file);
  },

  assignFacultyNewBatch: function(n){
    var batch = document.getElementById('selectBatch').value;
    var obj = {};
    obj.subject = document.getElementById('assignedSubject').value;
    model.info.batches.forEach(function(x){
      if(x.class == batch){
        obj.class = x.class;
        obj._id = x._id;
      }
    })
    console.log(obj);

    var newBatchData = new XMLHttpRequest();

    newBatchData.onreadystatechange = function(){
      if(newBatchData.status === 200 && newBatchData.readyState === 4 ){
        var response = newBatchData.response;
        view.closeAssignNewBatchModal(1);
        view.notifyUser("New Batch Assigned to Faculty",1);
        getFacultyData(n);
      } else if( newBatchData.status === 500 && newBatchData.readyState === 4 ){
        view.closeAssignNewBatchModal(1)
        view.notifyUser("Internal Server Error",0);
        getFacultyData(n);
      } else if( newBatchData.status != 500 && newBatchData.status != 200 && newBatchData.readyState === 4){
        view.closeAssignNewBatchModal(1)
        alert('error. Check your Internet Connection');
        getFacultyData(n);
      }
    }

    if(n === 0){
      newBatchData.open('POST','http://localhost:3000/admin/assignFacultyNewBatch/' + model.selectedFaculty._id,true);
    } else {
      var nmt = document.getElementById('selectFaculty').value;
      newBatchData.open('POST','http://localhost:3000/admin/assignFacultyNewBatch/' + nmt ,true);
    }
    newBatchData.setRequestHeader('Content-type','application/json');
    newBatchData.send(JSON.stringify(obj));
  },

  deleteFaculty: function(){
    var deleteFacultyRequest = new XMLHttpRequest();
    deleteFacultyRequest.onreadystatechange = function(){
      if(deleteFacultyRequest.status === 200 && deleteFacultyRequest.readyState === 4 ){
        document.getElementById("facultySettingModal").style.display = "none" ;
        document.getElementById('report_section').innerHTML = "";
        controller.sectionData();
      } else if( deleteFacultyRequest.status === 500 && deleteFacultyRequest.readyState === 4 ){
        document.getElementById("facultySettingModal").style.display = "none" ;
        alert('Internal server Error. Please try again. If issue continues, try again after time later');
        controller.sectionData();
      } else if( deleteFacultyRequest.status != 500 && deleteFacultyRequest.status != 200 && deleteFacultyRequest.readyState === 4){
        document.getElementById("facultySettingModal").style.display = "none" ;
        alert('error. Check your Internet Connection');
        controller.sectionData();
      }
    }
    deleteFacultyRequest.open('DELETE','http://localhost:3000/admin/removefaculty/' + model.selectedFaculty._id,true);
    deleteFacultyRequest.send(null);
  },

  deleteBatch: function(){
    var deleteBatchRequest = new XMLHttpRequest();
    deleteBatchRequest.onreadystatechange = function(){
      if(deleteBatchRequest.status === 200 && deleteBatchRequest.readyState === 4 ){
        model.selectedBatch = {};
        document.getElementById('report_section').innerHTML = "";
        controller.sectionData();
      } else if( deleteBatchRequest.status === 500 && deleteBatchRequest.readyState === 4 ){
        alert('Internal server Error. Please try again. If issue continues, try again after time later');
        view.updateView();
      } else if( deleteBatchRequest.status != 500 && deleteBatchRequest.status != 200 && deleteBatchRequest.readyState === 4){
        alert('error. Check your Internet Connection');
        view.updateView();
      }
    }
    deleteBatchRequest.open('DELETE','http://localhost:3000/admin/removebatch/' + model.selectedBatch._id,true);
    deleteBatchRequest.send(null);
  },

  deassignbatch: function(){
    var deassignbatchRequest = new XMLHttpRequest();
    deassignbatchRequest.onreadystatechange = function(){
      if(deassignbatchRequest.status === 200 && deassignbatchRequest.readyState === 4 ){
        model.selectedBatch = {};
        document.getElementById('report_section').innerHTML = "";
        document.getElementById('deassignbatchModal').style.display = "none";
        controller.sectionData();
      } else if( deassignbatchRequest.status === 500 && deassignbatchRequest.readyState === 4 ){
        alert('Internal server Error. Please try again. If issue continues, try again after time later');
        view.updateView();
      } else if( deassignbatchRequest.status != 500 && deassignbatchRequest.status != 200 && deassignbatchRequest.readyState === 4){
        alert('error. Check your Internet Connection');
        view.updateView();
      }
    }
    deassignbatchRequest.open('DELETE','http://localhost:3000/admin/deassignbatch/' + model.selectedFaculty._id + '/' + model.selectedBatch._id,true);
    deassignbatchRequest.send(null);
  },

  logout: function(){
    var logoutRequest = new XMLHttpRequest();
    logoutRequest.onreadystatechange = function(){
      if(logoutRequest.readyState === 4 && logoutRequest.status === 200){
        window.location = "http://localhost:3000";
      }
    }
    logoutRequest.open('GET','http://localhost:3000/logout',true);
    logoutRequest.send();
  },

  sendFacultySms: function(){
    var obj = {};
    obj.text = document.getElementById('sms-text').value;
    obj.mobile = model.selectedFaculty.mobile;
    obj.faculty = model.selectedFaculty._id;
    obj.user_id = model.info._id;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if(xhr.status === 200 && xhr.readyState === 4){
        controller.getFacultyData();
      }
    }
    xhr.open('POST',"http://localhost:3000/sendsms/smsfaculty",true);
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(JSON.stringify(obj));
  },

  batchSelected: function(e,n){
    model.selectedBatch._id = e.target.id;
    this.getBatchData(n);
  },

  sendSMStoClass: function(){
    var ob = {}
    ob.mobiles = model.selectedMobiles;
    ob.text = document.getElementById('SMSclasstext').value;
    console.log(ob);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          model.selectedMobiles = [];
          model.selectedNames = [];
          view.closeMessageClassModal();
          view.notifyUser("Message sent",1);
        }
      } else {

      }
    }
    xhr.open('POST',"http://localhost:3000/sendsms/sendsmstoclass",true);
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(JSON.stringify(ob));
  },

  sendSMStoFaculties: function(){
    var ob = {}
    ob.mobiles = model.selectedMobiles;
    ob.text = document.getElementById('SMSfacultytext').value;
    console.log(ob);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          model.selectedMobiles = [];
          model.selectedNames = [];
          view.closeMessageFacultiesModal();
          view.notifyUser("Message sent",1);
        }
      } else {

      }
    }
    xhr.open('POST',"http://localhost:3000/sendsms/sendsmstofaculties",true);
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(JSON.stringify(ob));
  },

  checkAll: function(n){
    var el = document.getElementsByClassName('showRequiredError');
    var tl = document.getElementsByClassName('required');
    var er=0;
    for(var i=0;i<tl.length;i++){
      if(tl[i].value.length===0){
        el[i].style.color = "red";
        er++;
      }
    }
    if(er===0){
      switch(n){
        case 0:this.addNewFaculty();
        break;

        case 1:this.addNewBatch();
      }
    }
  },

  submitManualScore: function(){
    var obj = {scores:{},mobiles:{}}
    var els = document.getElementsByClassName('testscoreip');
    Array.prototype.forEach.call(els,function(el){
      if(el.value.length != 0){
        obj.scores[el.id] = el.value;
      } else {
        obj.scores[el.id] = "A";
      }
      obj.mobiles[el.id] = el.getAttribute("mobile");
      console.log(el.getAttribute("mobile"));
    })
    obj.testname = document.getElementById('testname').value;
    obj.maxscore = document.getElementById('maxscore').value;
    obj.subject = document.getElementById('subject').value;
    obj.selectedBatch = model.selectedBatch._id;
    obj.school = model.info.school;
    obj.testdate = (new Date(Number(document.getElementById('testYear').value),Number(document.getElementById('testMonth').value - 1),Number(document.getElementById('testDate').value))).valueOf()
    console.log(obj);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          view.closeAddTestScoreManually();
          view.notifyUser("Test Score Saved on Database and Parents were Informed",1);
        } else {
            view.closeAddTestScoreManually();
            view.notifyUser("Failed to Save Score on Database",0);
        }
      }
    }
    xhr.open("POST","http://localhost:3000/custom-testscore/add-test-score-manually",true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(obj));
  }

};

function getFacultyData(n){
  if(n!=1){
    controller.getFacultyData(n);
  } else {
    view.closeAssignNewBatchModal();
    controller.getBatchData(1);
  }
}

window.onload = controller.sectionData;
