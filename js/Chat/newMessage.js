export const newMessage = (who, message, playerSkin = null) => {

    const chat = document.querySelector('.chat__messages');

    const li = document.createElement('li');
    li.textContent = `${who}: ${message}`;
    if (playerSkin != null) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.style.backgroundColor = playerSkin;
        li.appendChild(box)
    }

    chat.appendChild(li);
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;

}