const upcoming_assignments=document.querySelector(".upcoming-assignments");
let base_url="http://www.elearn.ndhu.edu.tw/moodle/mod/assignment/view.php?id=";



chrome.storage.local.get(null, (assignments)=>{
   for(let id in assignments)
   {
    let assignmentObj=JSON.parse(assignments[id]);//converts the JSON to object;
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
   }
})

