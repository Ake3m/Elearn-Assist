const upcoming_assignments = document.querySelector(".upcoming-assignments");
let base_url =
  "http://www.elearn.ndhu.edu.tw/moodle/mod/assignment/view.php?id=";

//gets assignments from local storage and stores it in sorted_assignments list
//change to arrow function
const getAssignments = () => {
  return new Promise((resolve, reject) => {
    let sorted_assignments = [];
    chrome.storage.local.get(null, (assignments) => {
      for (let id in assignments) {
        let assignmentsObj = JSON.parse(assignments[id]);
        const date_and_time = String(
          assignmentsObj["due_date"] + ", " + assignmentsObj["due_time"]
        );
        let temp = {
          id: id,
          date: date_and_time,
          name: assignmentsObj["name_of_course"],
          data: assignments[id],
        };
        sorted_assignments.push(temp);
      }
      //sorts array by date
      sorted_assignments.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      resolve(sorted_assignments); //after d is gotten from local storage
    });
  });
};

//after function runs, the sorted_assignments will be sorted by date and displayed
getAssignments().then((sorted_assignments) => {
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
  while (i < sorted_assignments.length) {
    //id of each assignment
    let id = sorted_assignments[i].id;
    //the JSON string of each assignment
    let assignment = sorted_assignments[i].data;

    let assignmentObj = JSON.parse(assignment); //converts the JSON to object;
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
    assignment_div.addEventListener("mouseleave", (e) => {
      assignmentReleased();
    });
    assignment_div.addEventListener("mousemove", (e) => {
      if (!assignmentDown) return;
      if (startX == undefined) {
        startX = e.pageX;
      }
      const move = -(startX - e.pageX) + "px";
      //console.log(move+` || assignmentDown ${assignmentDown}, deleteVisible ${deleteVisible}, startX ${startX}, endX ${endX}, scrollLeft ${scrollLeft}`)
      if (-(startX - e.pageX) >= 0) {
        assignment_div_slider.style.left = 0 + "px";
      } else if (-(startX - e.pageX) <= -100) {
        assignment_div_slider.style.left = -100 + "px";
      } else {
        assignment_div_slider.style.left = move;
      }
      endX = parseInt(assignment_div_slider.style.left);
    });

    //adding event listener to open new window instead of using an href. On Double click, open assignment elearning page.
    assignment_div.addEventListener("mouseup", () => {
      if (startX == undefined) {
        let page_url = `${base_url}${id}`;

        chrome.windows.getAll({ populate: true }, function (window_list) {
          var windowCheckFlag = true;
          for (var i = 0; i < window_list.length; i++) {
            var tabs = window_list[i].tabs;
            for (var j = 0; j < tabs.length; j++) {
              if (tabs[j].url == page_url) {
                chrome.tabs.update(tabs[j].id, { selected: true });
                chrome.windows.update(window_list[i].id, { focused: true });
                windowCheckFlag = false;
                break;
              }
            }
          }

          //if it can't find a window, it will create it
          if (windowCheckFlag) {
            window.open(`${base_url}${id}`, "_blank");
          }
        });
      } else {
        if (!deleteVisible) assignmentReleased();
        else resetSlideDelete();
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
        //clear the alarms that are associated with the deleted assignment
        chrome.alarms.clear(`${id}24`, (wasCleared) => {
          if (wasCleared) {
            console.log(`Alarm: ${id}24 was cleared.`);
          }
        });
        chrome.alarms.clear(`${id}12`, (wasCleared) => {
          if (wasCleared) {
            console.log(`Alarm: ${id}12 was cleared.`);
          }
        });
        chrome.alarms.clear(`${id}01`, (wasCleared) => {
          if (wasCleared) {
            console.log(`Alarm: ${id}01 was cleared`);
          }
        });
      }
    });

    i++;
  }
});

