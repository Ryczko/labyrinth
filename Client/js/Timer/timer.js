const socket = io("http://localhost:3000");

const timer = document.querySelector(".player__timer");
let time = 30;

export const startCounting = () => {
  setInterval(interval, 1000);
};

const interval = () => {
  time--;
  timer.textContent = time;
  if (time === 0) stopCounting();
};

export const stopCounting = () => {
  clearInterval(interval);
  time = 30;
  socket.emit("stop-counting");
};
