document.addEventListener('DOMContentLoaded', function() {
    const contactsList = document.getElementById('contacts-list');
    const messagesContainer = document.getElementById('messages-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const searchInput = document.getElementById('search-input');
    const refreshBtn = document.getElementById('refresh-btn');
    
    let currentRecipientId = null;
    let users = [];

    // Load users
    function loadUsers() {
        fetch('/api/get_users')
            .then(response => response.json())
            .then(data => {
                users = data;
                renderUsers();
            })
            .catch(error => console.error('Error loading users:', error));
    }

    // Render users in the sidebar
    function renderUsers() {
        contactsList.innerHTML = '';
        const template = document.getElementById('contact-template');

        users.forEach(user => {
            const clone = template.content.cloneNode(true);
            const contactDiv = clone.querySelector('.contact');
            
            contactDiv.dataset.userId = user.id;
            contactDiv.querySelector('.contact-name').textContent = user.name;
            contactDiv.querySelector('.contact-email').textContent = user.email;

            contactDiv.addEventListener('click', () => selectUser(user));
            contactsList.appendChild(clone);
        });
    }

    // Select a user to chat with
    function selectUser(user) {
        currentRecipientId = user.id;
        
        // Update chat header
        document.getElementById('chat-contact-name').textContent = user.name;
        
        // Update active state
        document.querySelectorAll('.contact').forEach(el => el.classList.remove('active'));
        document.querySelector(`[data-user-id="${user.id}"]`).classList.add('active');
        
        // Load messages
        loadMessages(user.id);
        
        // Enable input
        messageInput.disabled = false;
        sendButton.disabled = false;
    }

    // Load messages for a specific user
    function loadMessages(recipientId) {
        fetch(`/api/get_messages/${recipientId}`)
            .then(response => response.json())
            .then(messages => {
                renderMessages(messages);
            })
            .catch(error => console.error('Error loading messages:', error));
    }

    // Render messages in the chat area
    function renderMessages(messages) {
        messagesContainer.innerHTML = '';
        const template = document.getElementById('message-template');

        messages.forEach(message => {
            const clone = template.content.cloneNode(true);
            const messageDiv = clone.querySelector('.message');
            
            messageDiv.classList.add(message.sent ? 'sent' : 'received');
            messageDiv.querySelector('.message-text').textContent = message.content;
            messageDiv.querySelector('.message-time').textContent = formatTime(message.timestamp);
            
            messagesContainer.appendChild(clone);
        });

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Send a message
    function sendMessage() {
        if (!currentRecipientId || !messageInput.value.trim()) return;

        const message = {
            recipient_id: currentRecipientId,
            content: messageInput.value.trim()
        };

        fetch('/api/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        })
        .then(response => response.json())
        .then(() => {
            messageInput.value = '';
            loadMessages(currentRecipientId);
        })
        .catch(error => console.error('Error sending message:', error));
    }

    // Helper function to format timestamp
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        renderFilteredUsers(filteredUsers);
    });

    refreshBtn.addEventListener('click', loadUsers);

    // Disable message input until a user is selected
    messageInput.disabled = true;
    sendButton.disabled = true;

    // Initial load
    loadUsers();
});

// Add this function
function renderFilteredUsers(filteredUsers) {
    contactsList.innerHTML = '';
    const template = document.getElementById('contact-template');

    filteredUsers.forEach(user => {
        const clone = template.content.cloneNode(true);
        const contactDiv = clone.querySelector('.contact');
        
        contactDiv.dataset.userId = user.id;
        contactDiv.querySelector('.contact-name').textContent = user.name;
        contactDiv.querySelector('.contact-email').textContent = user.email;

        contactDiv.addEventListener('click', () => selectUser(user));
        contactsList.appendChild(clone);
    });
}