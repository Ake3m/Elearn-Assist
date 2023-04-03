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

//flag used to determine if window is open
var windowOpenFlag = false;
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

    //checks if a window is not already open
    if(windowOpenFlag == false){ 
        windowOpenFlag = true;
        //creates window and opens it
        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            width: 800,
            height: 600
        }, function(win){ 
            windowOpenFlag = win.id;
        });
    }else if(typeof windowOpenFlag == 'number'){ 
        //pop window comes to the front
        chrome.windows.update(windowOpenFlag,{focused:true});
    }
});


//when window is deleted, we change flag back to false
chrome.windows.onRemoved.addListener(function(winID){ 
    if(windowOpenFlag == winID){ 
        windowOpenFlag = false;
    }
});

//alarm listener
chrome.alarms.onAlarm.addListener((alarm)=>{
    console.log(alarm["name"]);
    let assignment_name=alarm["name"].substring(0,alarm["name"].length-2);
    let assignment_hour=parseInt(alarm["name"].substring(alarm["name"].length-2));
    console.log(assignment_name);
    console.log(assignment_hour);
    let message=`${assignment_name} is due in `;
    if(assignment_hour >1)
    {
        message+=`${assignment_hour} hours`
    }
    else{
        message+=`${assignment_hour} hour`
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
          if (reminders.one_hour_before > 0) {
            chrome.alarms.create(`${data}01`, { delayInMinutes: reminders.one_hour_before });
          }

          //uncomment below to test the notification functionality
        //   chrome.alarms.create(`${data}10`,{delayInMinutes:1});
      
          // Respond to the content script to acknowledge that the message was received
          console.log("New assignment received and alarms created");
          sendResponse("New assignment received and alarms created.");
    }
})

