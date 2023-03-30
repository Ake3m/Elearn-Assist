const upcoming_assignments=document.querySelector(".upcoming-assignments");
let base_url="http://www.elearn.ndhu.edu.tw/moodle/mod/assignment/view.php?id=";
chrome.storage.local.get(null, (assignments)=>{
   for(let id in assignments)
   {
    let assignmentObj=JSON.parse(assignments[id]);//converts the JSON to object;
    console.log(assignmentObj);
    //creating html elements for the object properties
    let assignment_link=document.createElement("a");
    let assignment_div=document.createElement("div");
    let assignment_div_header=document.createElement("h3");
    //const assignment_name=document.createElement("p");
    let assignment_due_date=document.createElement("p");
    //filling the new objects with the data
    assignment_link.href=`${base_url}${id}`;
    assignment_div_header.textContent=`Assignment name:${assignmentObj['name_of_course']}-${assignmentObj['name_of_assignment']}`;
    assignment_due_date.textContent=`Date due: ${assignmentObj['due_date']}, ${assignmentObj['due_day']}, ${assignmentObj['due_time']}`;
    //placing items inside the div
    assignment_div.append(assignment_div_header);
    assignment_div.append(assignment_due_date);
    assignment_div.classList.add("assignment-container");
    //placing div in anchor tag
    assignment_link.append(assignment_div);

    upcoming_assignments.append(assignment_link);
   }
})

