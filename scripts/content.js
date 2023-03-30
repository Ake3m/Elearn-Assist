//global variables
let currentAssignment="";
let newAssignment={};
let date_flag = 1;

//DOM objects
const navBar=document.querySelector("div#content");
const newButton=document.createElement("button");


newButton.innerHTML="Track this assignment";
navBar.prepend(newButton);


chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    const {type, assignmentID}=request;
    if(type==="NEW")
    {
       currentAssignment=assignmentID;
       console.log(currentAssignment);
    }
});


newButton.addEventListener('click', ()=>{
   
    //get name
    const nav_links=document.querySelectorAll("li.first");
    const length=nav_links.length;
    let name_of_assignment=nav_links[length-1].textContent;
    name_of_assignment=name_of_assignment.substring(5).trim();

    //get course name
    let course_name=nav_links[1].textContent;
    course_name=course_name.substring(5).trim();
    console.log(course_name);
    const rows=document.querySelectorAll('tr');

     //get the due date
    for(let row of rows)
    {
       
        if(row.childElementCount===2)
        {
            if(row.children[0].textContent.includes("Due date"))
            {
                let due_date=row.children[1].textContent;
                console.log(due_date);
                // let [day, date, time] = due_date.split(',');
                const [day,date,time]= due_date.split(',').map((word)=>{
                    return word.trim();
                });
                
                // checks due date for assignment
                const date_and_time = date+", "+time; 
                const today = new Date(); 
                const due_date2 = new Date(date_and_time); 
                console.log(today); 
                console.log(due_date2);
                if (today>due_date2){ 
                    date_flag = 0;
                }


                newAssignment={
                    name_of_course: course_name,
                    name_of_assignment:name_of_assignment,
                    due_day:day,
                    due_date:date,
                    due_time:time
                }
                
                chrome.runtime.onMessage.addListener((response, sendResponse)=>{
                    console.log(response);
                })
            }
        }
       
    }
    console.log(newAssignment);
    //convert the object to json
    const assignmentJson=JSON.stringify(newAssignment);
    console.log(assignmentJson);

    if(flag){
        chrome.storage.local.get(currentAssignment).then((result)=>{
            if(result[currentAssignment])
            {
                console.log("Data already stored");
            }
            else{
            chrome.storage.local.set({[currentAssignment]:assignmentJson}).then(()=>{
                    console.log("Data should be stored")
            }) 
            }
        })
    }
    else{ 
        alert("Unable to track assignment: Due date has passed");
    }
})