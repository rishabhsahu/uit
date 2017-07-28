graph = {
  batchPastWeekData: function(e){
    var classes_held = model.selectedFaculty.current_classes[e].classes_held;
     classes_held = classes_held.sort(function(a,b){
      return a-b;
    })

    var lastSevenDays = classes_held.slice(-7);
    var xd = [];
    var yd = [];
    lastSevenDays.forEach(function(x,i){
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

  studentAbsents: function(){
    const e = document.getElementById('student_attendance');

    const xhr = new XMLHttpRequest();
    xhr.open("GET","http://localhost:80/admin/classesheld/" + model.selectedStudent.current_faculties[model.selectedStudent.selectedSubject] + "/" + model.selectedBatch._id,true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          const classes_held = JSON.parse(xhr.response);
          let ch;
          classes_held.current_classes.forEach(function(x,i){
            if(x._id === model.selectedBatch._id){
              ch = x.classes_held.length;
            }
          })
          if(model.selectedStudent[model.selectedStudent.selectedSubject] && model.selectedStudent[model.selectedStudent.selectedSubject].absent && ch>0){
            const chart = new Chart(e,{
             type:'doughnut',
             data: {
               labels: ["Classes Taken","Classes Held"],
               datasets: [{
                 label: "Attendance in " + model.selectedStudent.selectedSubject + " course",
                 backgroundColor: ["rgb(37, 239, 105)","rgb(29, 162, 186)"],
                 pointBackgroundColor: "rgb(63, 117, 132)",
                 pointBorderWidth:"4",
                 pointHoverBorderColor:"rgb(237, 101, 185)",
                 pointHoverBorderWidth:"6",
                 data:[ch - model.selectedStudent[model.selectedStudent.selectedSubject].absent.length,ch],
               }]
             },
             options: {
               cutoutPercentage: 85,
               rotation: (Math.PI)*.8,
               circumference: (Math.PI)*1.75
             }
           })
         } else {
           const chart = new Chart(e,{
            type:'doughnut',
            data: {
              labels: ["","No Classes Taken"],
              datasets: [{
                label: "Attendance in " + model.selectedStudent.selectedSubject + " course",
                backgroundColor: ["","black"],
                pointBackgroundColor: "rgb(63, 117, 132)",
                pointBorderWidth:"4",
                pointHoverBorderColor:"rgb(237, 101, 185)",
                pointHoverBorderWidth:"6",
                data:[0,1],
              }]
            },
            options: {
              cutoutPercentage: 85,
              rotation: (Math.PI)*.8,
              circumference: (Math.PI)*1.75
            }
          })
         }
        }
      }
    }
    xhr.send(null);
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
  },

  subjectWiseAttendance: function(){
    let d1 = [];
    let d2 = [];
    let c = 0;
    const subs = Object.keys(model.selectedStudent.current_faculties);
    subs.forEach(function(sub,i){

      let xhr = new XMLHttpRequest();
      xhr.open("GET","http://localhost:80/admin/classesheld/" + model.selectedStudent.current_faculties[sub] + "/" + model.selectedBatch._id,true);
      xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            const classes_held = JSON.parse(xhr.response);
            classes_held.current_classes.forEach(function(x,i){
              if(x._id === model.selectedBatch._id){
                d1.push(sub);
                    if(model.selectedStudent[sub] && model.selectedStudent[sub].absent){
                    d2.push(Math.ceil(100*(1 - model.selectedStudent[sub].absent.length/x.classes_held.length)));
                  } else {
                    d2.push(0);
                  }
              }
              console.log(d1,d2);
              c++;
              if(c === subs.length){
                displaySubjectWiseAttendance(d1,d2);
              }
            })
          }
        }
    }
    xhr.send(null);
    })
  },

  lastExam: function(){
    let d1 = [];
    let d2 = [];
    Object.keys(model.selectedStudent.current_faculties).forEach(function(x,i){
      if(model.selectedStudent[x] && model.selectedStudent[x].scores){
        d1.push(x);
        const y = model.selectedStudent[x].scores[model.selectedStudent[x].scores.length - 1];
        if(y.score != "A"){
          d2.push(Math.round(y.score/y.max_score*10000)/100);
        } else {
          d2.push(0);
        }
      }
    })
    let e = document.getElementById('lastExamScores');
    let chart = new Chart(e,{
      type: 'radar',
      data: {
        labels: d1,
        datasets: [{
          label: "Last Exam Scores (in Percentage)",
          data: d2,
          borderColor: "rgba(66, 152, 244,9)",
          borderWidth: 4,
          pointBackgroundColor: "rgba(255, 73, 164,.9)",
          pointRadius: 7,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "rgb(172, 65, 244)"
        }]
      }
    })
  },

  pastTenExams: function(){
    let e = document.getElementById('pastTenExams');
    if(model.selectedStudent[model.selectedStudent.selectedSubject].hasOwnProperty("scores")){
      let scoresArr = model.selectedStudent[model.selectedStudent.selectedSubject].scores.slice(-5);
      let d1 = [];
      let d2 = [];
      scoresArr.forEach(function(x,i){
        if(x.score!="A"){
          d1.push(x.test_name);
          d2.push(Math.round(Number(x.score)/Number(x.max_score)*10000)/100);
        } else {
          d1.push(x.test_name);
          d2.push(Number(0));
        }
      })
      let chart = new Chart(e,{
        type: 'line',
        data: {
          labels: d1,
          datasets: [{
            label: "Last 5 Exams (in Percentage)",
            data: d2,
            lineTension: 0,
            fill: true,
            backgroundColor: "rgba(66, 152, 244,.3)",
            borderColor: "rgba(66, 152, 244,9)",
            borderWidth: 3,
            borderWidthHover: 3,
            pointBackgroundColor: "rgba(255, 73, 164,.9)",
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
      })
    }
  }
}

function displaySubjectWiseAttendance(d1,d2){
  const e = document.getElementById('subjectWiseAttendance');
  let chart = new Chart(e,{
    type:'bar',
    data: {
      labels: d1,
      datasets: [{
        label: "Absents",
        data: d2,
        backgroundColor: "rgba(66, 152, 244,.6)",
        maxBarThickness: "10px"
      }]
    },
    options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              }
          }]
      }
  }
  })
}
