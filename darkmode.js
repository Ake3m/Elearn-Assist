const localStoreDarkMode=()=>{

}

const darkModeOption= async ()=>{
    let isDarkMode = null;
    await chrome.storage.local.get(["darkmode"]).then(async(res)=>{
        if(res.key == undefined) {
            await chrome.storage.local.set({darkmode:false}).then(()=>{
                isDarkMode = false;
            })
        } else {
            isDarkMode = res.key;
        }
    })
    await chrome.storage.local.get(["darkmode"]).then(async(res)=>{
        console.log(res.darkmode)
    })
}

darkModeOption()