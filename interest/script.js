// Friend Requests Data (with examples)
const friendRequests = [
  { id: 1, name: 'Alice Smith', bio: 'Loves cooking and baking', avatar: 'A' },
  { id: 2, name: 'Bob Johnson', bio: 'Music lover and guitarist', avatar: 'B' },
  { id: 3, name: 'Eva Green', bio: 'Travel enthusiast', avatar: 'E' },
];

// Friend Suggestions Data (with examples)
const friendSuggestions = [
  { id: 4, name: 'Charlie Brown', bio: 'Tech enthusiast', avatar: 'C' },
  { id: 5, name: 'Diana Ross', bio: 'Fitness enthusiast', avatar: 'D' },
  { id: 6, name: 'Steve Rogers', bio: 'Adventure seeker', avatar: 'S' },
];

// Render Friend Requests
function renderFriendRequests() {
  const requestList = document.getElementById('request-list');
  requestList.innerHTML = ''; // Clear existing content
  friendRequests.forEach(request => {
    const requestItem = document.createElement('div');
    requestItem.className = 'request-item';
    requestItem.innerHTML = `
      <div class="profile-avatar">${request.avatar}</div>
      <div>
        <h3>${request.name}</h3>
        <p>${request.bio}</p>
      </div>
      <button class="accept" onclick="acceptRequest(${request.id})">Accept</button>
      <button class="decline" onclick="declineRequest(${request.id})">Decline</button>
    `;
    requestList.appendChild(requestItem);
  });
}

// Render Friend Suggestions
function renderFriendSuggestions() {
  const suggestionList = document.getElementById('suggestion-list');
  suggestionList.innerHTML = ''; // Clear existing content
  friendSuggestions.forEach(friend => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.innerHTML = `
      <div class="profile-avatar">${friend.avatar}</div>
      <div>
        <h3>${friend.name}</h3>
        <p>${friend.bio}</p>
      </div>
      <button onclick="sendFriendRequest(${friend.id})">Add Friend</button>
    `;
    suggestionList.appendChild(suggestionItem);
  });
}

// Accept Friend Request
function acceptRequest(id) {
  alert(`Friend request from ID ${id} accepted!`);
  const index = friendRequests.findIndex(request => request.id === id);
  if (index !== -1) {
    friendRequests.splice(index, 1);
    renderFriendRequests();
  }
}

// Decline Friend Request
function declineRequest(id) {
  alert(`Friend request from ID ${id} declined.`);
  const index = friendRequests.findIndex(request => request.id === id);
  if (index !== -1) {
    friendRequests.splice(index, 1);
    renderFriendRequests();
  }
}

// Perform Search (simple functionality)
function performSearch() {
  const searchQuery = document.getElementById('search-bar').value.toLowerCase();
  if (searchQuery) {
    alert(`Searching for "${searchQuery}"...`);
    // Add actual search logic here
  } else {
    alert("Please enter a name to search!");
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderFriendRequests();
  renderFriendSuggestions();
});
