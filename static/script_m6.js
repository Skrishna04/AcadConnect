document.getElementById('send-button').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    const chatId = document.querySelector('.contact.active').dataset.chatId;
    const senderId = '1'; // Example sender ID
    const receiverId = chatId;

    fetch('http://localhost:5000/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sender_id: senderId,
            receiver_id: receiverId,
            content: message
        })
    }).then(response => response.json())
      .then(data => {
          console.log('Message sent:', data);
          messageInput.value = '';
          loadMessages(senderId, receiverId);
      });
});

function loadMessages(user1Id, user2Id) {
    fetch(`http://localhost:5000/messages?user1_id=${user1Id}&user2_id=${user2Id}`)
    .then(response => response.json())
    .then(messages => {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.textContent = message.content;
            chatMessages.appendChild(messageElement);
        });
    });
}

// Load messages for the default chat
document.addEventListener('DOMContentLoaded', function() {
    loadMessages('1', '2'); // Example user IDs
});