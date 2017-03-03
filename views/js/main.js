
		var view ={
					updateClassData: function(){
							for(var i=0;i<1;i++){
									document.getElementById("classHead"+i).innerHTML = model.classX.batch;
									document.getElementById("subject"+i).innerHTML = model.classX.subject;
									document.getElementById("strength"+i).innerHTML = model.classX.strength;
									document.getElementById("classesHeld"+i).innerHTML = model.classX.classesHeld;
									document.getElementById("firstClass"+i).innerHTML = model.classX.firstClass;
							}
					}
		};

		var model = {

				classX: {
						batch:"",
						subject:"",
						strength:"",
						classesHeld:"",
						firstClass:""
				},

				classY: {
						batch:"",
						subject:"",
						strength:"",
						classesHeld:"",
						firstClass:""
				}
		};

		var controller = {
			classData: function(){
				var requestClassData = new XMLHttpRequest();

				if(!requestClassData){
					alert("error")
				}

				requestClassData.open('GET','http://localhost:3000/faculty/requestClassData',true);
				requestClassData.send(null)

				requestClassData.onreadystatechange = function(){
					var response = requestClassData.response;
					if( requestClassData.status === 200 && requestClassData.readyState === XMLHttpRequest.DONE){
						if(response == "0" ){
							document.getElementById("notification_box").innerHTML = "no notifications"
						} else {
							response = JSON.parse(response);
							console.log(response);
							document.getElementById("take").onclick = controller.takeAttendance;
							response.current_class.forEach(function(x,i){
									model.classX.batch = x.branch.toUpperCase() + ", " + x.semester + "th Sem";
									model.classX.subject = x.subject.toUpperCase();
									model.classX.strength = x.strength;
									model.classX.classesHeld = x.classesHeld;
									model.classX.firstClass = x.firstClass;
									view.updateClassData();
							})
						}
					}
				}

			},

			takeAttendance: function(){
				var attendance = new XMLHttpRequest();

				attendance.onreadystatechange = function(){
					var response = attendance.response;
					var students = [];
					if( attendance.status === 200 && attendance.readyState === XMLHttpRequest.DONE){
						if(response == "0" ){
							document.getElementById("notification_box").innerHTML = "no notifications"
						} else {
							response = JSON.parse(response);
							console.log(response);
							response.forEach(function(student){
								students.push(student.name);
							});
							this.students = students;
							console.log(this.students);
							document.getElementById("nextSection").innerHTML = response;
						}
				} else {}
			}

				attendance.open("GET",'http://localhost:3000/faculty/takeAttendance',true);
				attendance.send(null);
		}
		};

		window.onload = controller.classData;
