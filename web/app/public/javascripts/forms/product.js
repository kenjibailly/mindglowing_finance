function deleteSelectedProducts() {
    // Select all checked checkboxes
    const checkedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
    // Extract data-ids from checked checkboxes
    const selectedIds = Array.from(checkedCheckboxes).map((checkbox) => {
        return checkbox.dataset.id;
    });

    // Send a POST request with the selected data-ids
    fetch('/products/delete-selected', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedIds }),
    })
    .then(response => response.json())
    .then(data => {
        // Check for success message or error message in the response
        if (data.message === 'Products deleted successfully') {
            // Perform page refresh or other actions
            location.reload(); // Reload the page
        } else {
            // Handle errors
            logger.error('Error:', data.message);
        }
    })
    .catch(error => {
        logger.error('Error:', error);
    });
}