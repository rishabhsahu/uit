graph = {
  batchPastWeekData: function(){
    var classes_held = model.selectedBatch.classes_held;
    classes_held.sort(function(a,b){
      return a-b;
    })

    var lastSevenDays = classes_held.slice(-7);
    var xd = [];
    var yd = [];
    classes_held.forEach(function(x,i){
      var prsnt=0;
      var d = new Date(x);
      xd.push(d.getDate() + " " + model.months[d.getMonth()]);
      model.studentAttendanceData.forEach(function(y,i){
        if(y[model.selectedBatch.subject].attendance.indexOf(x)>-1){
          prsnt++;
        }
      })
      yd.push(prsnt);
    })
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
            label: model.selectedBatch.class + "th / " + model.selectedFaculty.name + " / " + "Past Classes / Students Present",
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
          data: [model.absentToday.length,model.info.faculties.length],
          backgroundColor: ["rgb(91, 205, 247)","rgb(242, 60, 60)"]
        }]
      },
      options:{
        cutoutPercentage: 90,
        rotation: (Math.PI)*.8,
        circumference: Math.PI*1.75,
      }
    })
  }
}
