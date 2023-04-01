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

chrome.action.onClicked.addListener(async (tab) => {
    
    //check for old dates and removes them
    chrome.storage.local.get(null, (assignments)=>{
        for(let id in assignments)
        {
            let assignmentObj=JSON.parse(assignments[id]);
            const date_and_time = assignmentObj['due_date']+", "+assignmentObj['due_time']; 
            const today = new Date(); 
            const due_date = new Date(date_and_time);
            console.log(today);
            console.log(due_date);
            if(today>due_date){
                chrome.storage.local.remove(id,function(){
                    var error = chrome.runtime.lastError;
                       if (error) {
                           console.error(error);
                       }
                })
            }
        }
    })

    // //clear local storage
    // chrome.storage.local.clear(function() {
    //     var error = chrome.runtime.lastError;
    //     if (error) {
    //         console.error(error);
    //     }
    //     // do something more
    // });
    // chrome.storage.sync.clear(); // callback is optional

    //opens the window
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 800,
        height: 600
      });


    
});

//alarm listener
chrome.alarms.onAlarm.addListener((alarm)=>{
    let assignment_name=alarm["name"].split('.')[0];
    let assignment_hour=parseInt(alarm["name"].split('.')[1]);
    let message=`${assignment_name} is due in `;
    if(assignment_hour >1)
    {
        message+=`${assignment_hour} hours`
    }
    else{
        message+=`${assignment_hour} hour`
    }
    chrome.notifications.create({
        type:'basic',
        iconUrl:'./imaages/ndhu-logo.png',
        title:'Assignment Assistant',
        message:message,
        button:[{title:'Dismiss'}],
        priority:0
    })
})

