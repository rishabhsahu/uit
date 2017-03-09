var view = {

};

var model = {
  facultyList: [],
  batchesList: []
};

var controller = {
  getDepartmentData: function(){
    var getDepartmentData = new XMLHttpRequest();
    getDepartmentData.onreadystatechange = function(){
      var response = getDepartmentData.response;
      if(response.status === 200, response.readyState === 4){
        console.log(response);
      }
    }
    getDepartmentData.open('GET','http://localhost:3000/admin/getDepartmentData',true);
    getDepartmentData.send(null);
  }
};
