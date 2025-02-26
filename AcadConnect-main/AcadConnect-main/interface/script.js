document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("editButton");
  const nameElement = document.getElementById("name");
  const collegeElement = document.getElementById("college");
  const courseElement = document.getElementById("course");
  const bioElement = document.getElementById("bio");
  const emailElement = document.getElementById("email");
  const locationElement = document.getElementById("location");

  editButton.addEventListener("click", function () {
    const newName = prompt("Enter your name:", nameElement.textContent);
    const newCollege = prompt("Enter your college:", collegeElement.textContent);
    const newCourse = prompt("Enter your course:", courseElement.textContent);
    const newBio = prompt("Enter your bio:", bioElement.textContent);
    const newEmail = prompt("Enter your email:", emailElement.textContent);
    const newLocation = prompt("Enter your location:", locationElement.textContent);

    if (newName) nameElement.textContent = newName;
    if (newCollege) collegeElement.textContent = newCollege;
    if (newCourse) courseElement.textContent = newCourse;
    if (newBio) bioElement.textContent = newBio;
    if (newEmail) emailElement.textContent = newEmail;
    if (newLocation) locationElement.textContent = newLocation;
  });
});
