const upcoming_assignments=document.querySelector(".upcoming-assignments");
let base_url="http://www.elearn.ndhu.edu.tw/moodle/mod/assignment/view.php?id=";


let sorted_assignments = [];

//gets assignments from local storage and stores it in sorted_assignments list
function getAssignments() {
  let p1 = new Promise((resolve, reject) => {
    chrome.storage.local.get(null, (assignments) =>{ 
      for(let id in assignments){ 
        let assignmentsObj = JSON.parse(assignments[id]); 
        const date_and_time = String(assignmentsObj['due_date']+", "+assignmentsObj['due_time']); 
        let c = {
          id: id,
          date: date_and_time, 
          name: assignmentsObj['name_of_course'],
          data: assignments[id],
        };
        sorted_assignments.push(c);
      }
      resolve(sorted_assignments); //after d is gotten from local storage
    });
  });
  return p1;
}

//after function runs, the sorted_assignments will be sorted by date and displayed
getAssignments()
.then((sorted_assignments) => {

  //sorts the array by date
  sorted_assignments.sort(function(a,b){
    return new Date(a.date)- new Date(b.date);
  });

  // //sorts the array by name
  //  d.sort(function(a,b){
  //   if(a.name>b.name){ 
  //     return 1; 
  //   }
  //   else{
  //     return -1;
  //   }
  // });

  let i = 0; 
  while( i < sorted_assignments.length){ 
    //id of each assignment 
    let id = sorted_assignments[i].id;
    //the JSON string of each assignment 
    let assignment = sorted_assignments[i].data;
    
    let assignmentObj=JSON.parse(assignment);//converts the JSON to object;
    console.log(assignmentObj);
    //creating html elements for the object properties
    let assignment_div=document.createElement("div");
    let assignment_div_header=document.createElement("h3");
    let assignment_due_date=document.createElement("p");
    //filling the new objects with the data
    assignment_div_header.textContent=`${assignmentObj['name_of_course']}-${assignmentObj['name_of_assignment']}`;
    assignment_due_date.textContent=`Date due: ${assignmentObj['due_date']}, ${assignmentObj['due_day']}, ${assignmentObj['due_time']}`;
    //placing items inside the div
    assignment_div.append(assignment_div_header);
    assignment_div.append(assignment_due_date);
    assignment_div.classList.add("assignment-container");
    
    //adding the div to the container
    upcoming_assignments.append(assignment_div);
   //adding event listener to open new window instead of using an href. On Double click, open assignment elearning page.
    assignment_div.addEventListener('dblclick',()=>{
      window.open(`${base_url}${id}`,'_blank');
    });


    //temporary delete functionality
    assignment_div.addEventListener('contextmenu',(e)=>{
      e.preventDefault();
      if(confirm("Are you sure you want to delete this assignment?")){
        chrome.storage.local.remove(id,()=>{
            alert("Assignment has been removed");
            assignment_div.style.display="none";
        });
      }
    });


    i++;
  }

});

 



