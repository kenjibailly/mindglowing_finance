function deleteSelectedProjects() {
    // Select all checked checkboxes
    const checkedCheckboxes = document.querySelectorAll('.project-checkbox:checked');
    // Extract data-ids from checked checkboxes
    const selectedIds = Array.from(checkedCheckboxes).map((checkbox) => {
        return checkbox.dataset.id;
    });

    // Send a POST request with the selected data-ids
    fetch('/projects/delete-selected', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedIds }),
    })
    .then(response => response.json())
    .then(data => {
        // Check for success message or error message in the response
        if (data.message === 'Projects deleted successfully') {
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


// Attach the createProject function to the form submission event
const projectForm = document.querySelector('form[action="/projects/create"]');
if (projectForm) {
    projectForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        createProject(); // Call the custom function to handle form submission
    });
}


async function createProject() {
    const projectForm = document.querySelector('form[action="/projects/create"]');

    if (projectForm) {
        const formData = new FormData(projectForm);
        // Get the customer ID
        const customer_id = document.querySelector('#customer_id-datalist .selected').dataset.id;
        // Change the customer_id to the actual id instead of the name
        formData.set('customer_id', customer_id);

        // Fetch API POST request
        try {
            const response = await fetch('/projects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString(),
            });

            if (response.ok) {
                // Handle success, e.g., redirect to a new page
                window.location.href = '/projects?success';
            } else {
                // Handle errors
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

// Execute editProject function when on that page
const editProjectOnPage = document.querySelector('.edit-project');
if (editProjectOnPage) {
    editProjectPage()
}

function editProjectPage() {
    const customerInput = document.querySelector('#customer_id');
    const customerValue = customerInput.value;
    const customerOptions = document.querySelectorAll('#customer_id-datalist option');
    // Add the selected class to the customer value
    for (let i = 0; i < customerOptions.length; i++) {
        const customerOptionValue = customerOptions[i].value;
        if (customerOptionValue == customerValue) {
            customerOptions[i].classList.add('selected');
        }
    }
}


// Attach the editProjectForm function to the form submission event
const editProjectForm = document.querySelector('.edit-projec-form');
if (editProjectForm) {
    editProjectForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        editProject(); // Call the custom function to handle form submission
    });
}

async function editProject() {
    if (editProjectForm) {
        const formData = new FormData(editProjectForm);
        // Get the customer ID
        const customer_id = document.querySelector('#customer_id-datalist .selected').dataset.id;
        // Change the customer_id to the actual id instead of the name
        formData.set('customer_id', customer_id);

        // Get URL to extract the id
        const urlString = window.location.href;
        const url = new URL(urlString);
        const id = url.pathname.split('/').pop();
        
        // Fetch API POST request
        try {
            const response = await fetch(`/projects/edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString(),
            });

            if (response.ok) {
                // Handle success, e.g., redirect to a new page
                window.location.href = `/projects/project/${id}?success`;
            } else {
                // Handle errors
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

// Show the success message
const projectOverview = document.querySelector('.project-overview');
if (projectOverview) {
    const urlString = window.location.href;
    const url = new URL(urlString);
    
    // Check if the URL contains the query parameter "?success"
    if (url.searchParams.has('success')) {
        // Execute code if the query parameter is present
        const success = document.querySelector('.alert-success');
        success.classList.remove('hidden');
    }
}