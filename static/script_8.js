// JavaScript for form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const eventForm = document.getElementById('eventForm');
  
    eventForm.addEventListener('submit', function(e) {
      // Perform client-side validation here if needed
      const eventName = document.getElementById('eventName').value;
      const collegeName = document.getElementById('collegeName').value;
      const eventContent = document.getElementById('eventContent').value;
      const eventPoster = document.getElementById('eventPoster').files[0];
      const eventDate = document.getElementById('eventDate').value;
      const eventTime = document.getElementById('eventTime').value;
  
      if (!eventName || !collegeName || !eventContent || !eventPoster || !eventDate || !eventTime) {
        alert('Please fill in all the required fields.');
        e.preventDefault();
      }
    });
  });