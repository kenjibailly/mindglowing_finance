// Initially hide rows beyond the fifth
const number_per_page = 5 + 1; // don't change the + 1
document.addEventListener("DOMContentLoaded", function() {
    const tables = document.querySelectorAll(".dataTable");
    if (tables) {
        tables.forEach(table => {
            const rows = table.getElementsByTagName("tr");

            if (rows.length > number_per_page) {
                table.parentNode.querySelector('.toggleButton').classList.remove('hidden');
            }

            for (let i = number_per_page; i < rows.length; i++) {
                rows[i].classList.add("hidden");
            }
        })
    }
});

// Function to toggle the collapse state
function toggleCollapse(buttonEl) {
    const table = buttonEl.parentNode.querySelector('.dataTable');
    const rows = table.getElementsByTagName("tr");

    // Check if the first hidden row is already hidden
    const isHidden = rows[number_per_page].classList.contains("hidden");

    // Toggle visibility of rows beyond the fifth
    for (let i = number_per_page; i < rows.length; i++) {
        rows[i].classList.toggle("hidden", !isHidden);
    }

    // Update button text based on current state
    const button = table.parentNode.querySelector('.toggleButton');
    button.textContent = isHidden ? "Show Less" : "Show More";
}
