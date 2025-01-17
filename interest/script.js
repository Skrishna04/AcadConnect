// script.js

document.querySelectorAll('input[name="branches"]').forEach(function(branchCheckbox) {
    branchCheckbox.addEventListener('change', function() {
      const selectedBranches = Array.from(document.querySelectorAll('input[name="branches"]:checked')).map(input => input.value);
      
      // Hide all interest sections initially
      const interestSections = document.querySelectorAll(".interest-group");
      interestSections.forEach(section => {
        section.style.display = "none";
      });
  
      // Show interest sections based on the selected branches
      selectedBranches.forEach(branch => {
        const interestSection = document.getElementById(`${branch}-interests`);
        if (interestSection) {
          interestSection.style.display = "block";
        }
      });
    });
  });
  
  // Form Submission Handler (optional)
  document.getElementById("interestForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    // Collect the selected branches
    const branches = Array.from(document.querySelectorAll('input[name="branches"]:checked')).map(input => input.value);
  
    // Collect interests based on the selected branches
    let interests = [];
    branches.forEach(branch => {
      const branchInterests = Array.from(document.querySelectorAll(`input[name="${branch}-interests"]:checked`)).map(input => input.value);
      interests = interests.concat(branchInterests);
    });
  
    console.log("Selected Branches:", branches);
    console.log("Selected Interests:", interests);
  
    // You can send this data to a server or process it further
  });
  