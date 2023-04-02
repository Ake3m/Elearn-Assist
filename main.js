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
    //adding event listener to open new window instead of using an href. On Double click, open assignment elearning page.
    assignment_div.addEventListener("mouseup", () => {
      resetSlideDelete();
      // TODO - UNCOMMENT LATER
      // window.open(`${base_url}${id}`, "_blank");
    });

    // TODO - delete on slide for assignment_div

    // variables to detect slideDelete events
    assignment_div_slider.style.position = "relative";
    const originLeft = assignment_div_slider.style.left;
    let [assignmentDown, startX, scrollLeft] = [false, null, null];

    //functions for slide delete
    const autoShowDelete = () => {};
    const autoReturnPosition = async () => {
      console.log("returning...");
      console.log(`${assignment_div_slider.style.left} to ${0}`);
      while (assignment_div_slider.style.left != "0px") {
        assignment_div_slider.style.left =
          parseInt(assignment_div_slider.style.left) + 1 + "px";
        console.log(assignment_div_slider.style.left);
      }
    };
    const resetSlideDelete = () => {
      console.log("noMoreSlide");
      autoReturnPosition();
      assignmentDown = false;
      startX = null;
      scrollLeft = null;
    };

    assignment_div_slider.addEventListener("mousedown", (e) => {
      if (!assignmentDown) {
        assignmentDown = true;
      }
    });
    assignment_div_slider.addEventListener("mouseleave", (e) => {
      if (!assignmentDown) return;
      resetSlideDelete();
    });
    assignment_div_slider.addEventListener("mousemove", (e) => {
      if (!assignmentDown) return;
      if (startX == null) {
        startX = e.pageX;
      }
      //decrease == left, increase == right
      // positive == left, negative == right
      if (startX - e.pageX >= 0 && startX - e.pageX < 100) {
        assignment_div_slider.style.left =
          originLeft - (startX - e.pageX) + "px";
        console.log(`MOVE LEFT BY ${originLeft - (startX - e.pageX) + "px"}`);
      } else {
        console.log("move right");
      }
    });

    //temporary delete functionality
    assignment_div.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      console.dir(e);
      if (confirm("Are you sure you want to delete this assignment?")) {
        chrome.storage.local.remove(id, () => {
          alert("Assignment has been removed");
          assignment_div.style.display = "none";
        });
      }
    });
  }
});

