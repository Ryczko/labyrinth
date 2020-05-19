export const inicializeChat = () => {
  const sendBtn = document.querySelector(".chat__form__button");
  
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
  });
};
