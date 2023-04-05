chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {//added changeInfo line to fix bug of receiving end does not exist. Idk why. 
    if(changeInfo.status==='complete')
    {
        if(tab.url && tab.url.includes("http://www.elearn.ndhu.edu.tw/moodle/mod/assignment/view.php?id")){
        const queryParameters=tab.url.split("?")[1];
        const urlParameters=new URLSearchParams(queryParameters);
        // console.log(urlParameters.get("id"));
        chrome.tabs.sendMessage(tabId, {
            type:"NEW",
            assignmentID:urlParameters.get("id")
        })
    }
    }
    
});


let windowOpenFlag = 0; 
chrome.action.onClicked.addListener(async (tab) => {

    //NOT A PROBLEM YET, BUTTTTT maybe we should apply the same Promise logic as in main.js
    //to prevent any problems when displaying the data

    //check for old dates and removes them
    chrome.storage.local.get(null, (assignments)=>{
        for(let id in assignments)
        {
            let assignmentObj=JSON.parse(assignments[id]);
            const date_and_time = assignmentObj['due_date']+", "+assignmentObj['due_time']; 
            const today = new Date(); 
            const due_date = new Date(date_and_time);
            if(today>due_date){
                chrome.storage.local.remove(id,function(){
                    var error = chrome.runtime.lastError;
                       if (error) {
                           console.error(error);
                       }
                })
            }
        }
    });

    //function to check if there are assignments due today
    const checkToday=async ()=>{
        const today=new Date();
        let today_count=0;
        chrome.storage.local.get(null,(assignments)=>{
            for(let id in assignments)
            {
                let assignment_object=JSON.parse(assignments[id]);
                const temp_date=new Date(`${assignment_object["due_date"]}, ${assignment_object["due_time"]}`);
                if(today.toDateString()===temp_date.toDateString()){
                    today_count++;
                }
            }

            //if there are assignments due today, notify the user
            if(today_count>=1)
            {
                let messge= today_count===1?`You have ${today_count} assignment due today.`:`You have ${today_count} assignments due today.`;
                chrome.notifications.create({
                type:'basic',
                iconUrl:'images/ndhu-logo.png',
                title:'Assignment Assistant',
                message:messge,
                buttons:[{title:'Dismiss'}],
                priority:0
            })
            }
        });
        
    }

    //checks all windows tabs to see if the pop.html url is active in any of them 
    chrome.windows.getAll({populate : true}, function (window_list) {
        var windowCheckFlag = true;
        for(var i=0;i<window_list.length;i++) {
            var tabs = window_list[i].tabs; 
            for(var j = 0; j<tabs.length; j++){ 
                if (tabs[j].url == chrome.runtime.getURL("popup.html")){ 
                    chrome.windows.update(window_list[i].id,{focused: true});
                    windowCheckFlag = false;
                    break;
                }
            }
        }
        
        //if it can't find a window, it will create it
        if (windowCheckFlag){ 
            chrome.windows.create({
                url: chrome.runtime.getURL("popup.html"),
                type: "popup",
                width: 800,
                height: 600,
            });
            checkToday();
        }

    });
    
        


    

});


//alarm listener
chrome.alarms.onAlarm.addListener((alarm)=>{
    let assignment_ID=alarm["name"].substring(0,alarm["name"].length-2);
    let assignment_hour=parseInt(alarm["name"].substring(alarm["name"].length-2));
    //get the info from storage since I changed the naming convention for the alarm
    chrome.storage.local.get(assignment_ID).then((result)=>{
        const assignment=JSON.parse(result[assignment_ID]);
        const assignment_name=assignment["name_of_assignment"];
        let message=`${assignment_name} is due in `;
        if(assignment_hour >1)
        {
            message+=`${assignment_hour} hours`;
        }
        else{
            message+=`${assignment_hour} hour`;
        }
        console.log(message);
        chrome.notifications.create({
        type:'basic',
        iconUrl:'images/ndhu-logo.png',
        title:'Assignment Assistant',
        message:message,
        buttons:[{title:'Dismiss'}],
        priority:0
    })
    });
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message.type==="NEW_ASSIGNMENT")
    {
        const {data, reminders}=message;
        console.log(data);
        console.log(reminders);

        if (reminders.one_day_before > 0) {
            chrome.alarms.create(`${data}24`, { delayInMinutes: reminders.one_day_before });
          }
          if (reminders.twelve_hours_before > 0) {
            chrome.alarms.create(`${data}12`, { delayInMinutes: reminders.twelve_hours_before });
          }
          if (reminders.twelve_hours_before > 0) {
            chrome.alarms.create(`${data}06`, { delayInMinutes: reminders.six_hours_before });
          }
          if (reminders.twelve_hours_before > 0) {
            chrome.alarms.create(`${data}03`, { delayInMinutes: reminders.three_hours_before });
          }
          if (reminders.one_hour_before > 0) {
            chrome.alarms.create(`${data}01`, { delayInMinutes: reminders.one_hour_before });
          }

          //uncomment below to test the notification functionality (which will fire in 1 minute)
        //   chrome.alarms.create(`${data}10`,{delayInMinutes:1});
      
          // Respond to the content script to acknowledge that the message was received
          console.log("New assignment received and alarms created");
          sendResponse("New assignment received and alarms created.");
    }
})


//in the event the storage object is changed, then it should automatically update the GUI
chrome.storage.onChanged.addListener((changes, areaName)=>{
    const changedAssignmentID=Object.keys(changes)[0];
    console.log(changedAssignmentID);
    if(changes[changedAssignmentID].newValue)//if an object with this key exists, then something was added to storage
    {
        //pass message to main.js to update the display
        chrome.runtime.sendMessage({
            message:"updateDisplay"
        })
    }
    
})  

