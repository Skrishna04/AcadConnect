document.addEventListener('DOMContentLoaded', function() {
    const profileInitial = document.getElementById('profile-initial');
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