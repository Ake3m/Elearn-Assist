const upcoming_assignments = document.querySelector(".upcoming-assignments");
let base_url =
  "http://www.elearn.ndhu.edu.tw/moodle/mod/assignment/view.php?id=";

//uncomment below to clear all alarms and notifications. Will remove later

// chrome.alarms.clearAll((wasCleared)=>{
//   console.log(wasCleared);
// });

chrome.storage.local.get(null, (assignments) => {
  for (let id in assignments) {
    let assignmentObj = JSON.parse(assignments[id]); //converts the JSON to object;
    console.log(assignmentObj);
    //creating html elements for the object properties
    let assignment_div_wrapper = document.createElement("div");
    let assignment_div_slider = document.createElement("div");
    let assignment_div = document.createElement("div");
    let assignment_div_header = document.createElement("h3");
    let assignment_due_date = document.createElement("p");
    //filling the new objects with the data
    assignment_div_header.textContent = `${assignmentObj["name_of_course"]}-${assignmentObj["name_of_assignment"]}`;
    assignment_due_date.textContent = `Date due: ${assignmentObj["due_date"]}, ${assignmentObj["due_day"]}, ${assignmentObj["due_time"]}`;

    //creating the delete button
    let delete_button = document.createElement("button");
    delete_button.classList.add("assignment-delete");
    delete_button.textContent = "DELETE";
    //placing items inside the div
    assignment_div.append(assignment_div_header);
    assignment_div.append(assignment_due_date);
    assignment_div.classList.add("assignment-container");

    assignment_div_slider.appendChild(assignment_div);
    assignment_div_slider.appendChild(delete_button);
    assignment_div_slider.classList.add("assignment-slider");

    assignment_div_wrapper.appendChild(assignment_div_slider);
    assignment_div_wrapper.classList.add("assignment-wrapper");

    //adding the div to the container
    upcoming_assignments.append(assignment_div_wrapper);

    // TODO - delete on slide for assignment_div

    // variables to detect slideDelete events
    assignment_div_slider.style.position = "relative";
    let [assignmentDown, deleteVisible, startX, endX, scrollLeft] = [
      false,
      false,
      undefined,
      undefined,
      undefined,
    ];

    //functions for slide delete
    let autoInterval = null;
    const autoShowDelete = () => {
      if (parseInt(assignment_div_slider.style.left) <= -100) {
        clearInterval(autoInterval);
        deleteVisible = true;
      } else {
        assignment_div_slider.style.left =
          parseInt(assignment_div_slider.style.left) - 1 + "px";
      }
    };
    const autoReturnPosition = () => {
      if (parseInt(assignment_div_slider.style.left) >= 0)
        clearInterval(autoInterval);
      else {
        assignment_div_slider.style.left =
          parseInt(assignment_div_slider.style.left) + 1 + "px";
      }
    };
    const resetSlideDelete = () => {
      autoInterval = setInterval(autoReturnPosition, 5);
      assignmentDown = false;
      deleteVisible = false;
      endX = undefined;
      startX = undefined;
      scrollLeft = undefined;
    };
    const assignmentReleased = () => {
      if (!assignmentDown) return;
      assignmentDown = false;
      if (endX <= -50) {
        autoInterval = setInterval(autoShowDelete, 5);
      } else {
        resetSlideDelete();
      }
    };

    // adding the event listeners
    assignment_div.addEventListener("mousedown", (e) => {
      if (!assignmentDown) {
        assignmentDown = true;
      }
    });
    assignment_div.addEventListener("mouseleave", assignmentReleased());
    assignment_div.addEventListener("mousemove", (e) => {
      if (!assignmentDown) return;
      if (startX == undefined) {
        startX = e.pageX;
      }
      if (startX - e.pageX < 101 && startX - e.pageX >= 0) {
        assignment_div_slider.style.left = -(startX - e.pageX) + "px";
      }
      endX = parseInt(assignment_div_slider.style.left);
    });

    //adding event listener to open new window instead of using an href. On Double click, open assignment elearning page.
    assignment_div.addEventListener("mouseup", () => {
      if(startX == undefined) window.open(`${base_url}${id}`, "_blank");
      else {
        if (!deleteVisible)
          assignmentReleased();
        else
          resetSlideDelete()
      }
    });

    //temporary delete functionality
    delete_button.addEventListener("click", (e) => {
      e.preventDefault();
      console.dir(e);
      if (confirm("Are you sure you want to delete this assignment?")) {
        chrome.storage.local.remove(id, () => {
          alert("Assignment has been removed");
          assignment_div_wrapper.style.display = "none";
        });
      }
    });
  }
});

