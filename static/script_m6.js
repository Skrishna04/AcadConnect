document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const chatHeaderName = document.getElementById('chat-header-name');

    let currentContact = 'Skaria Mathew';

    function loadMessages() {
        fetch('/api/messages')
            .then(response => response.json())
            .then(data => {
                chatMessages.innerHTML = '';
                data.filter(msg => msg.from === currentContact || msg.to === currentContact).forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message', msg.from === currentContact ? 'received' : 'sent');
                    messageDiv.innerHTML = `<p>${msg.message}</p><span class="timestamp">${msg.timestamp}</span>`;
                    chatMessages.appendChild(messageDiv);
                });
            });
    }

    sendButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message.trim() === '') return;
        fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Shan Krishna', // Hardcoded for this example. In a real application, this should be dynamic.
                to: currentContact,
                message: message
            })
        })
        .then(response => response.json())
        .then(newMessage => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'sent');
            messageDiv.innerHTML = `<p>${newMessage.message}</p><span class="timestamp">${newMessage.timestamp}</span>`;
            chatMessages.appendChild(messageDiv);
            messageInput.value = '';
        });
    });

    document.querySelectorAll('.contact').forEach(contact => {
        contact.addEventListener('click', () => {
            document.querySelector('.contact.active').classList.remove('active');
            contact.classList.add('active');
            currentContact = contact.getAttribute('data-contact');
            chatHeaderName.textContent = currentContact;
            loadMessages();
        });
    });

    loadMessages();
});