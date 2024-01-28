function shippingCheckBoxChange(checkbox) {
    const billingDetailsSection = document.querySelector('.billing_details');

    if (checkbox.checked) {
        // If "Same as shipping information" is checked
        billingDetailsSection.classList.add('hidden');
    } else {
        // If "Same as shipping information" is unchecked
        billingDetailsSection.classList.remove('hidden');
    }
}


function deleteSelectedCustomers() {
    // Select all checked checkboxes
    const checkedCheckboxes = document.querySelectorAll('.customer-checkbox:checked');

    // Extract data-ids from checked checkboxes
    const selectedIds = Array.from(checkedCheckboxes).map((checkbox) => {
        return checkbox.dataset.id;
    });

    // Send a POST request with the selected data-ids
    fetch('/customers/delete-selected', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedIds }),
    })
    .then(response => response.json())
    .then(data => {
        // Check for success message or error message in the response
        if (data.message === 'Customers deleted successfully') {
            // Perform page refresh or other actions
            location.reload(); // Reload the page
        } else {
            // Handle errors
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}