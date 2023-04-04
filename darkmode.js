let isDarkMode;

const setDarkMode = async (nowDarkMode) => {
  const body = document.querySelector("body");
  const toIcon = document.querySelector(
    nowDarkMode ? ".sun-icon" : ".moon-icon"
  );
  const nowIcon = document.querySelector(
    nowDarkMode ? ".moon-icon" : ".sun-icon"
  );

  nowDarkMode ? body.classList.remove(["dark"]) : body.classList.add(["dark"]);
  toIcon.classList.add("active-theme");
  nowIcon.classList.remove("active-theme");

  await chrome.storage.local.set({ darkmode: !nowDarkMode }).then(async () => {
    await getDarkMode()
  });

  return !nowDarkMode;
};

const getDarkMode = async () => {
  await chrome.storage.local.get(["darkmode"]).then(async (res) => {
    if (res.darkmode == undefined) {
      await chrome.storage.local.set({ darkmode: false }).then(() => {
        isDarkMode = false;
      });
    } else {
      isDarkMode = res.darkmode;
      if(isDarkMode) {
        document.querySelector("body").classList.add("dark")
        document.querySelector(".moon-icon").classList.add("active-theme")
      } else {
        document.querySelector(".sun-icon").classList.add("active-theme");
      }
    }
  });
};

const darkModeOption = async () => {
  getDarkMode();
  const toggle = document.querySelector(".toggle-dark-mode");
  toggle.addEventListener("click", async () => {
    isDarkMode = setDarkMode(isDarkMode);
  });
};

darkModeOption();

