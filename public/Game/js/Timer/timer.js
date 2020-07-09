const timer = document.querySelector(".player__timer");
let time = 30;
let intervalId = null;

const interval = () => {
  time--;
  timer.textContent = time;
};

export const startCounting = () => {
  if (intervalId != null) {
    clearInterval(intervalId);
    time = 30;
  }
  intervalId = setInterval(interval, 1000);
};
