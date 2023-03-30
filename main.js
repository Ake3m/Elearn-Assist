const upcoming_assignments=document.querySelector(".upcoming-assignments");
chrome.storage.local.get(null, (assignments)=>{
   for(let id in assignments)
   {
    let assignmentObj=JSON.parse(assignments[id]);//converts the JSON to object;
    console.log(assignmentObj);
    //creating html elements for the object properties
    let assignment_div=document.createElement("div");
    let assignment_div_header=document.createElement("h3");
    //const assignment_name=document.createElement("p");
    let assignment_due_date=document.createElement("p");
    //filling the new objects with the data
    assignment_div_header.textContent=`Assignment name:${assignmentObj['name_of_course']}-${assignmentObj['name_of_assignment']}`;
    assignment_due_date.textContent=`Date due: ${assignmentObj['due_date']}, ${assignmentObj['due_day']}, ${assignmentObj['due_time']}`;
    //placing items inside the div
    assignment_div.append(assignment_div_header);
    assignment_div.append(assignment_due_date);
    assignment_div.classList.add("assignment-container");

    upcoming_assignments.append(assignment_div);
   }
})

