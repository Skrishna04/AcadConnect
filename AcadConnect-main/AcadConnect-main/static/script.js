// script.js

document.getElementById("loginForm").addEventListener("submit", function(event) {
    // Prevent form submission for validation
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Simple client-side validation
    if (!email || !password) {
      alert("Please fill in both email and password.");
    } else {
      // Normally here, you'd send a POST request to your backend to authenticate
      console.log("Form submitted");
      // Simulate form submission
      window.location.href = "/dashboard"; // Redirect after login
    }
  });
  