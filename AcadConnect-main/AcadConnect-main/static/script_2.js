// script.js

document.getElementById("studentForm").addEventListener("submit", function(event) {
    // Prevent form submission to simulate handling the data
    event.preventDefault();
  
    // Collect form data
    const name = document.getElementById("name").value;
    const rollNumber = document.getElementById("rollNumber").value;
    const course = document.getElementById("course").value;
    const year = document.getElementById("year").value;
    const branch = document.getElementById("branch").value;
    const dob = document.getElementById("dob").value;
    const collegeId = document.getElementById("collegeId").files[0];
  
    // For now, just log the data to the console
    console.log("Student Details Submitted:");
    console.log("Name:", name);
    console.log("Roll Number:", rollNumber);
    console.log("Course:", course);
    console.log("Year:", year);
    console.log("Branch:", branch);
    console.log("Date of Birth:", dob);
    console.log("College ID File:", collegeId);
  
    // You can later send this data to a server using FormData or an AJAX request.
  });
  