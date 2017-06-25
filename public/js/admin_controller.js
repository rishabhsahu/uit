var controller = {
  departmentData: function(){
    var getDepartmentData = new XMLHttpRequest();
    if(!getDepartmentData){
      console.log(err)
    }
      getDepartmentData.onreadystatechange = function(){
        var response = getDepartmentData.response;
        if(getDepartmentData.status === 200 && getDepartmentData.readyState === 4){
          var response = JSON.parse(response)
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
          model.info.faculties = model.info.faculties.sort(function(o1,o2){
            return o1["recent_messages"] - o2["recent_messages"];
          })
          view.updateView();
        } else {

        }

    }
    getDepartmentData.open('GET','http://localhost:3000/admin/getDepartmentData',true);
    getDepartmentData.send(null);
  },

  facultySelected: function(e){
    e = e.target.id;
    model.selectedFaculty._id = e;
    controller.getFacultyData();
  },

  getFacultyData: function(e){
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
        view.showSelectedFacultyData();
      }
    }
    console.log(model.selectedFaculty);
    facultyDataRequest.open('GET','http://localhost:3000/admin/getFacultyData/' + model.selectedFaculty._id ,true);
    facultyDataRequest.send(null);
  },

  getBatchData: function(e,i){
    e = e.target.id;
    console.log(e);

    var batchDataRequest = new XMLHttpRequest();
    batchDataRequest.onreadystatechange = function(){
      var response = batchDataRequest.response;
      if(batchDataRequest.status === 200 && batchDataRequest.readyState === 4){
        response = JSON.parse(response);
        if(i===0){
          view.renderBatchData(response.student_data,e);
        } else {
          model.selectedBatch = response;
          view.showClassData();
        }
      }
    }

    batchDataRequest.open("GET","http://localhost:3000/admin/getBatchData/" + e,true);
    batchDataRequest.send(null);
  },

  showStudentData: function(e){
    e = e.target.id;
    e = e.replace("#","");
    console.log(e);

    view.showStudentData(e);
  },

  addNewFaculty: function(){
    var obj = {};
    obj.name = document.getElementsByTagName("input")[0].value;
    obj["_id"] = document.getElementsByTagName("input")[0].value.replace(" ","") + "@" + model.info.college;
    obj.password = document.getElementsByTagName("input")[2].value;
    obj.college = model.info.college;
    obj.deparment = model.info.department;
    obj.current_classes = [];
    obj.profileSetUp = 0;
    console.log(obj);
    var newFacultyData = new XMLHttpRequest();

    newFacultyData.onreadystatechange = function(){
      if(newFacultyData.status === 200 && newFacultyData.readyState === 4 ){
        document.getElementById("addFacultyModal").style.display = "none" ;
        controller.departmentData();
      } else if(newFacultyData.status === 500 && newFacultyData.readyState === 4){
        alert("Internal server Error");
        controller.departmentData();
      } else if(newFacultyData.status != 200 && newFacultyData.status !== 500 && newFacultyData.readyState === 4){
        alert('error.Check your internet connection');
        controller.departmentData();
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
    console.log(batch);
    var newBatchData = new XMLHttpRequest();

    newBatchData.onreadystatechange = function(){
      if(newBatchData.status === 200 && newBatchData.readyState === 4 ){
        document.getElementById("addBatchModal").style.display = "none" ;
        controller.departmentData();
      } else if(newBatchData.status === 500 && newBatchData.readyState === 4){
        document.getElementById("addBatchModal").style.display = "none" ;
        alert("Internal server Error");
        controller.departmentData();
      } else if(newBatchData.status != 200 && newBatchData.status !== 500 && newBatchData.readyState === 4){
        document.getElementById("addBatchModal").style.display = "none" ;
        alert('error.Check your internet connection');
        controller.departmentData();
      }
    }

    newBatchData.open('POST','http://localhost:3000/admin/addnewbatch/' + model.info.college + '/' + model.info.department + '/' + batch + '/' + cls,true);
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
        document.getElementById("assignFacultyNewBatchModal").style.display = "none" ;
        getFacultyData(n);
      } else if( newBatchData.status === 500 && newBatchData.readyState === 4 ){
        document.getElementById("assignFacultyNewBatchModal").style.display = "none" ;
        alert('Internal server Error. Please try again. If issue continues, try again after time later');
        getFacultyData(n);
      } else if( newBatchData.status != 500 && newBatchData.status != 200 && newBatchData.readyState === 4){
        document.getElementById("assignFacultyNewBatchModal").style.display = "none" ;
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
        controller.departmentData();
      } else if( deleteFacultyRequest.status === 500 && deleteFacultyRequest.readyState === 4 ){
        document.getElementById("facultySettingModal").style.display = "none" ;
        alert('Internal server Error. Please try again. If issue continues, try again after time later');
        controller.departmentData();
      } else if( deleteFacultyRequest.status != 500 && deleteFacultyRequest.status != 200 && deleteFacultyRequest.readyState === 4){
        document.getElementById("facultySettingModal").style.display = "none" ;
        alert('error. Check your Internet Connection');
        controller.departmentData();
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
        controller.departmentData();
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
        controller.departmentData();
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
        alert('logged out');
      }
    }
    logoutRequest.open('GET','http://localhost:3000/login/logout',true);
    logoutRequest.send(null);
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
    xhr.send(JSON.stringify(obj));
  },

  batchSelected: function(e){
    this.getBatchData(e,1);
  }

};

function getFacultyData(n){
  if(n===0){
    controller.getFacultyData();
  } else {
    view.showClassData();
  }
}

window.onload = controller.departmentData;
