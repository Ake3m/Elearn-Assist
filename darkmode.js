let isDarkMode;

const setDarkMode = (nowDarkMode) => {
  const body = document.querySelector("body");
  const toIcon = document.querySelector(
    nowDarkMode ? ".sun-icon" : ".moon-icon"
  );
  const nowIcon = document.querySelector(
    nowDarkMode ? ".moon-icon" : ".sun-icon"
  );

  console.log("nowDarkMode "+nowDarkMode)
  nowDarkMode ? body.classList.remove(["dark"]) : body.classList.add(["dark"]);
  toIcon.classList.add("active-theme");
  nowIcon.classList.remove("active-theme");

  chrome.storage.local.set({ darkmode: !nowDarkMode });

  return !nowDarkMode;
};

const getDarkMode = async () => {
  await chrome.storage.local.get(["darkmode"]).then(async (res) => {
    if (res.key == undefined) {
      await chrome.storage.local.set({ darkmode: false }).then(() => {
        isDarkMode = false;
      });
    } else {
      isDarkMode = res.darkmode;
    }
  });
  console.log("darkmode "+isDarkMode)
};

const darkModeOption = async () => {
  getDarkMode();
  const moonIcon = document.querySelector(".moon-icon");
  const sunIcon = document.querySelector(".sun-icon");
  isDarkMode
    ? moonIcon.classList.add("active-theme")
    : sunIcon.classList.add("active-theme");
  const toggle = document.querySelector(".toggle-dark-mode");
  toggle.addEventListener("click", async () => {
    console.log("BEFORE "+isDarkMode)
    isDarkMode = setDarkMode(isDarkMode);
  });
};

darkModeOption();

