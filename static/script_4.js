// Fetch friend requests and suggestions from the backend
function fetchFriendRequests() {
  fetch('/api/requests') // Updated API endpoint
    .then((response) => response.json())
    .then((data) => renderFriendRequests(data))
    .catch((error) => console.error('Error fetching friend requests:', error));
}

function fetchFriendSuggestions() {
  fetch('/api/suggestions') // Updated API endpoint
    .then((response) => response.json())
    .then((data) => renderFriendSuggestions(data))
    .catch((error) => console.error('Error fetching friend suggestions:', error));
}

// Render Profile Info
// function renderProfile() {
//   const userName = 'John Doe'; // Example username
//   const profileFirstLetter = userName.charAt(0).toUpperCase();
//   document.getElementById('profile-first-letter').textContent = profileFirstLetter;
//   document.getElementById('profile-name').textContent = userName;
// }

// Render Friend Requests
function renderFriendRequests(requests) {
  const requestList = document.getElementById('request-list');
  requestList.innerHTML = ''; // Clear existing content
  requests.forEach((request) => {
    const requestItem = document.createElement('div');
    requestItem.className = 'request-item';
    const requestFirstLetter = request.name.charAt(0).toUpperCase();
    requestItem.innerHTML = `
      <div class="profile-avatar">${requestFirstLetter}</div>
      <div>
        <h3>${request.name}</h3>
        <p>${request.bio || 'No bio available'}</p> <!-- Added bio fallback -->
      </div>
      <button class="accept" onclick="acceptRequest(${request.id})">Accept</button>
      <button class="decline" onclick="declineRequest(${request.id})">Decline</button>
    `;
    requestList.appendChild(requestItem);
  });
}

// Render Friend Suggestions
function renderFriendSuggestions(suggestions) {
  const suggestionList = document.getElementById('suggestion-list');
  suggestionList.innerHTML = ''; // Clear existing content
  suggestions.forEach((friend) => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    const suggestionFirstLetter = friend.name.charAt(0).toUpperCase();
    suggestionItem.innerHTML = `
      <div class="profile-avatar">${suggestionFirstLetter}</div>
      <div>
        <h3>${friend.name}</h3>
        <p>${friend.bio || 'No bio available'}</p> <!-- Added bio fallback -->
      </div>
      <button onclick="sendFriendRequest(${friend.id})">Add Friend</button>
    `;
    suggestionList.appendChild(suggestionItem);
  });
}

// Send Friend Request
function sendFriendRequest(friendId) {
  fetch('/api/send_request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Ensures the data is sent as JSON
    },
    body: JSON.stringify({ friendId }), // Send friendId instead of name
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
}

// Accept Friend Request
function acceptRequest(id) {
  fetch('/api/accept_request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      fetchFriendRequests(); // Refresh the list after accepting the request
    });
}

// Decline Friend Request
function declineRequest(id) {
  fetch('/api/decline_request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      fetchFriendRequests(); // Refresh the list after declining the request
    });
}

// Search functionality
function performSearch() {
  const searchQuery = document.getElementById('search-bar').value.toLowerCase();
  if (searchQuery) {
    fetch(`/api/search?query=${searchQuery}`) // Updated API query parameter
      .then((response) => response.json())
      .then((results) => {
        console.log('Search results:', results);
      });
  } else {
    alert('Please enter a name to search!');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // renderProfile();
  fetchFriendRequests();
  fetchFriendSuggestions();
});







document.addEventListener('DOMContentLoaded', function() {
  const profileInitial = document.getElementById('profile-first-letter');
  if (profileInitial) {
      const initial = profileInitial.textContent.trim().charAt(0).toUpperCase();
      profileInitial.textContent = initial;
  }
});

function searchFriends() {
  const query = document.getElementById('search-bar').value;
  if (query.length > 2) {
      fetch(`/search?q=${query}`)
          .then(response => response.json())
          .then(data => displaySearchResults(data))
          .catch(error => console.error('Error:', error));
  }
}

function displaySearchResults(results) {
  // Display the results in your desired location
}

function performSearch() {
  searchFriends();
}

function showRequests() {
  fetch('/requests')
      .then(response => response.json())
      .then(data => displayRequests(data))
      .catch(error => console.error('Error:', error));
}

function showSuggestions() {
  fetch('/suggestions')
      .then(response => response.json())
      .then(data => displaySuggestions(data))
      .catch(error => console.error('Error:', error));
}

function displayRequests(requests) {
  const requestList = document.getElementById('request-list');
  requestList.innerHTML = ''; // Clear previous requests
  requests.forEach(request => {
      const listItem = document.createElement('div');
      listItem.className = 'request-item';
      listItem.textContent = request.name;
      requestList.appendChild(listItem);
  });
}

function displaySuggestions(suggestions) {
  const suggestionList = document.getElementById('suggestion-list');
  suggestionList.innerHTML = ''; // Clear previous suggestions
  suggestions.forEach(suggestion => {
      const listItem = document.createElement('div');
      listItem.className = 'suggestion-item';
      listItem.textContent = suggestion.name;
      suggestionList.appendChild(listItem);
  });
}








function searchFriends() {
  // Implement search functionality here
}

function performSearch() {
  // Implement search button click functionality here
}

function showRequests() {
  document.getElementById('friend-requests').style.display = 'block';
  document.getElementById('suggestions').style.display = 'none';
}

function showSuggestions() {
  document.getElementById('friend-requests').style.display = 'none';
  document.getElementById('suggestions').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.messages-link').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '/messages'; // Redirect to the messaging interface
  });

  // Initially show suggestions or requests based on the hash in the URL
  if (window.location.hash === '#friend-requests') {
    showRequests();
  } else {
    showSuggestions();
  }
});