// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
    const confirmButtons = document.querySelectorAll('.actions button');
    confirmButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add your logic for handling friend request actions here
            alert(`Button clicked: ${button.textContent}`);
        });
    });
});