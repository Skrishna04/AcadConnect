// Store chat messages for different conversations
const chats = {
    1: [],
    2: []
};

let currentChatId = '1';

// DOM Elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const contacts = document.querySelectorAll('.contact');

// Function to create a new message element
function createMessageElement(message, isSent) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    
    const messageP = document.createElement('p');
    messageP.textContent = message;
    
    const timestamp = document.createElement('span');
    timestamp.className = 'timestamp';
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(messageP);
    messageDiv.appendChild(timestamp);
    
    return messageDiv;
}

// Function to display messages for the current chat
function displayMessages(chatId) {
    chatMessages.innerHTML = '';
    chats[chatId].forEach(msg => {
        chatMessages.appendChild(createMessageElement(msg.text, msg.sent));
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send a message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        // Add message to current chat
        chats[currentChatId].push({
            text: message,
            sent: true
        });
        
        // Display updated messages
        displayMessages(currentChatId);
        
        // Clear input
        messageInput.value = '';
    }
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Handle chat switching
contacts.forEach(contact => {
    contact.addEventListener('click', () => {
        // Remove active class from all contacts
        contacts.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked contact
        contact.classList.add('active');
        
        // Update current chat
        currentChatId = contact.dataset.chatId;
        
        // Update chat header
        const contactName = contact.querySelector('h4').textContent;
        const headerName = document.querySelector('.chat-header h4');
        const headerInitial = document.querySelector('.chat-header .initials');
        headerName.textContent = contactName;
        headerInitial.textContent = contactName[0];
        
        // Display messages for selected chat
        displayMessages(currentChatId);
    });
}); 