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
