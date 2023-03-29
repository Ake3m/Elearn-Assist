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