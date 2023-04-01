//global variables
let currentAssignment = "";
let newAssignment = {};
let date_flag = true;
let due_date_found = false;
let one_day_before=0;
let twelve_hours_before=0;
let one_hour_before=0;

//DOM objects
const navBar = document.querySelector("div#content");
const newButton = document.createElement("button");

newButton.innerHTML = "Track this assignment";
navBar.prepend(newButton);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type, assignmentID } = request;
  if (type === "NEW") {
    currentAssignment = assignmentID;
    console.log(currentAssignment);
  }
});

newButton.addEventListener("click", () => {
  //get name
  const nav_links = document.querySelectorAll("li.first");
  const length = nav_links.length;
  let name_of_assignment = nav_links[length - 1].textContent;
  name_of_assignment = name_of_assignment.substring(5).trim();

  //get course name
  let course_name = nav_links[1].textContent;
  course_name = course_name.substring(5).trim();
  console.log(course_name);
  const rows = document.querySelectorAll("tr");

  //get the due date
  for (let row of rows) {
    if (row.childElementCount === 2) {
      if (row.children[0].textContent.includes("Due date")) {
        due_date_found = true;
        let due_date = row.children[1].textContent;
        console.log(due_date);
        // let [day, date, time] = due_date.split(',');
        const [day, date, time] = due_date.split(",").map((word) => {
          return word.trim();
        });

        // checks due date for assignment
        const date_and_time = date + ", " + time;
        const today = new Date();
        const formatted_deadline_date = new Date(date_and_time);

        console.log(today.getTime());
        const difference_in_milliseconds=formatted_deadline_date.getTime()-today.getTime(); //gets the difference in time in milliseconds
        const diffInMinutes=difference_in_milliseconds/60000; //converts it to minutes
        
        //gets the minutes for 1 day before, 12 hours before and 1 hour before.
        one_day_before=diffInMinutes-1440;//1140 minutes in a day
        twelve_hours_before=diffInMinutes-720;//720 minutes in 12 hours
        one_hour_before=diffInMinutes-60; //60 minutes in an hour

        if (today > formatted_deadline_date) {
          date_flag = false;
        }

        newAssignment = {
          name_of_course: course_name,
          name_of_assignment: name_of_assignment,
          due_day: day,
          due_date: date,
          due_time: time,
        };
      }
    }
  }

  if (due_date_found) {
    console.log(newAssignment);
    //convert the object to json
    const assignmentJson = JSON.stringify(newAssignment);
    console.log(assignmentJson);

    if (date_flag) {
      //check if assignment is already in storage
      chrome.storage.local.get(currentAssignment).then((result) => {
        if (result[currentAssignment]) {
          console.log("Data already stored");
        } else {
          //if not already in storage, adds it to storage
          chrome.storage.local
            .set({ [currentAssignment]: assignmentJson })
            .then(() => {
              console.log("Data should be stored");
            });
            //adds alarms to create notification in the background.js at a specific time.
            //checks each to ensure there is specific
            let responseString="You will be reminded:\n" 
            if(one_day_before>0)
            {
              chrome.alarms.create(`${newAssignment.name_of_assignment}.24`,{delayInMinutes:one_day_before});
              responseString+="1 day before due\n"
            }
            if(twelve_hours_before>0){
              chrome.alarms.create(`${newAssignment.name_of_assignment}.12`,{delayInMinutes:twelve_hours_before});
              responseString+="12 hours before due\n"
            }
            if(one_hour_before>0)
            {
              chrome.alarms.create(`${newAssignment.name_of_assignment}.1`,{delayInMinutes:one_hour_before});
              responseString+="1 hour before due\n"
            }
            alert(`Assignment Tracked Sucessfully.\n${responseString}`);
        }
      });
    } else {
      alert("Unable to track assignment: Due date has passed");
    }
  }
  else{
    alert("This assignment does not have a due date.");
  }
});
//git
