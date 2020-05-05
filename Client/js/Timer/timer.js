const socket = io("http://localhost:3000");

const timer = document.querySelector(".player__timer");
let time = 30;
let intervalId = null;


export const startCounting = () => {
  if (intervalId != null) {
    clearInterval(intervalId);
    time = 30;
  }
  intervalId = setInterval(interval, 1000);
};


const interval = () => {
  time--;
  timer.textContent = time;
};


