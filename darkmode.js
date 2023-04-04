const setDarkMode= async (currentDarkMode)=>{

}

const getDarkMode = async()=>{
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
    return isDarkMode
}

const darkModeOption= async ()=>{
    let isDarkMode = getDarkMode()
    const moonIcon = document.querySelector(".moon-icon")
    const sunIcon = document.querySelector(".sun-icon")
    isDarkMode ? moonIcon.classList.add('active-theme') : sunIcon.classList.add('active-theme')
}

darkModeOption()