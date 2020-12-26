const instructionLink = document.querySelector("#instruction");
const instructionModal = document.querySelector(".instruction");

instructionLink.addEventListener("click", () => {
  instructionModal.classList.toggle("instruction--show");
});

instructionModal.addEventListener("click", () => {
  instructionModal.classList.remove("instruction--show");
});
