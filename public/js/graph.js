graph = {
  batchPastWeekData: function(e){
    var classes_held = model.selectedFaculty.current_classes[e].classes_held;
     classes_held = classes_held.sort(function(a,b){
      return a-b;
    })

    var lastSevenDays = classes_held.slice(-7);
    var xd = [];
    var yd = [];
    classes_held.forEach(function(x,i){
      var prsnt=0;
      var d = new Date(x);
      xd.push(d.getDate() + " " + model.months[d.getMonth()]);
      model.selectedBatch.student_data.forEach(function(y,i){
        if(y[model.selectedSubject].absent){
          if(y[model.selectedSubject].absent.indexOf(x)>-1){
            prsnt++;
          }
        }
      })
      yd.push(prsnt);
    })
    console.log(yd);
    this.renderGraph(xd,yd);
  },

  renderGraph: function(d1,d2){
    var ctx = document.getElementById('7DayChart');
    var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: d1,
        datasets: [{
            label: model.selectedBatch.class + "th / " + model.selectedFaculty.name + " / " + "Past Classes / Students Absent",
            pointBackgroundColor:"rgb(63, 117, 132)",
            borderColor: 'rgb(53, 196, 191)',
            data: d2,
            lineTension:0,
            pointBorderWidth: 4,
            pointHoverBorderColor: "rgb(237, 101, 185)",
            pointHoverBorderWidth: 5
        }]
    },

    // Configuration options go here
    options: {}
    });
    console.log(chart);
  },

  facultiesNotTakingClassToday: function(e){
    var ctx = document.getElementById(e);
    var chart = new Chart(ctx,{
      type:"doughnut",
      data:{
        labels:["Taking","Not Taking"],
        datasets:[{
          label:"hello",
          data: [model.info.faculties.length-model.absentToday.length,model.absentToday.length],
          backgroundColor: ["rgb(91, 205, 247)","rgb(242, 60, 60)"]
        }]
      },
      options:{
        cutoutPercentage: 90,
        rotation: (Math.PI)*.8,
        circumference: Math.PI*1.75,
      }
    })
  },

  current_classes_box: function(){
    model.selectedFaculty.current_classes.forEach(function(x,i){
      var e = document.getElementById(x._id);
      if(x.classes_held.length === 0 ){
        var chart = new Chart(e,{
          type:"pie",
          data:{
            labels:["No Classes Yet"],
            datasets:[{
              label:"hello",
              data: [1],
              backgroundColor: ["black"]
            }]
          },
          options:{
            cutoutPercentage: 85,
            rotation: (Math.PI)*.8,
            circumference: Math.PI*1.5,
          }
        })
      } else {
        var abs;
        if(model.selectedFaculty.absents){
          abs = model.selectedFaculty.absents.length
        } else {
          abs = 0;
        }
        var chart = new Chart(e,{
          type:"pie",
          data:{
            labels:["Taken","Not Taken"],
            datasets:[{
              label:"hello",
              data: [x.classes_held.length,abs],
              backgroundColor: ["rgb(91, 205, 247)","rgb(242, 60, 60)"]
            }]
          },
          options:{
            cutoutPercentage: 80,
            rotation: (Math.PI)*.8,
            circumference: Math.PI*1.75,
          }
        })
      }
    })
  },

  pastSevenDays: function(){
    var d1 = [];
    var d2 = [];

    var e = document.getElementById('pastSevenDays');
    var chart = new Chart(e,{
      type: 'line',
      data:{
        labels:["Past 7 Working Days","Past 21 Working Days"],
        datasets: [{
          label: "Past 7 Days",
          pointBackgroundColor: "rgb(63, 117, 132)",
          borderColor:"rgb(53, 196, 191)",
          pointBorderWidth:"4",
          pointHoverBorderColor:"rgb(237, 101, 185)",
          pointHoverBorderWidth:"6",
          data:[1,3,,0,0,0,02,1,2],
          lineTension:0
        },{
          label: "Past 21 Days",
          data:[0,0,0,0,1,3,2,1,2]
        }]
      }
    })
  },

  numberOfAbsents: function(){
    var d1 = [];
    var d2 = [];

    var e = document.getElementById('daysFacultyWasAbsent');
    var chart = new Chart(e,{
      type: 'doughnut',
      data:{
        labels:["Days Faculty was Absent"],
        datasets: [{
          label: "Past 7 Days",
          pointBackgroundColor: "rgb(63, 117, 132)",
          borderColor:"rgb(53, 196, 191)",
          pointBorderWidth:"4",
          pointHoverBorderColor:"rgb(237, 101, 185)",
          pointHoverBorderWidth:"6",
          data:[model.selectedFaculty.absent.length,]
        }]
      }
    })
  }
}
