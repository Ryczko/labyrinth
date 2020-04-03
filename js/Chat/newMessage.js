export const newMessage = (who, message) => {

    const chat = document.querySelector('.chat__messages');

    const li = document.createElement('li');
    li.textContent = `${who}: ${message}`;
    chat.appendChild(li);
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;

}