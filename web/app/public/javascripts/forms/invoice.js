function deleteSelectedInvoices() {
    // Select all checked checkboxes
    const checkedCheckboxes = document.querySelectorAll('.invoice-checkbox:checked');

    // Extract data-ids from checked checkboxes
    const selectedIds = Array.from(checkedCheckboxes).map((checkbox) => {
        return checkbox.dataset.id;
    });

    // Send a POST request with the selected data-ids
    fetch('/invoices/delete-selected', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedIds }),
    })
    .then(response => response.json())
    .then(data => {
        // Check for success message or error message in the response
        if (data.message === 'Invoices deleted successfully') {
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


// JavaScript function to clone and append the element
function addElement(container) {
    // Get the template element within the specified container
    const template = container.querySelector('.add-el');

    // Clone the template element
    const clone = template.cloneNode(true);

    // Update the 'for' attribute of the label
    const label = clone.querySelector('.data-list-label')
    const labelFor = label.getAttribute('for');
    const labelNumber = container.querySelectorAll('.add-el').length + 1;
    label.setAttribute('for', `${labelFor}-${labelNumber}`);

    // Update the 'id' attribute of the input before the datalist
    const inputBeforeDatalist = clone.querySelector('.data-list-input');
    const inputIdBeforeDatalist = inputBeforeDatalist.getAttribute('id');
    inputBeforeDatalist.setAttribute('id', `${inputIdBeforeDatalist}-${labelNumber}`);

    // Update the 'id' attribute of the datalist
    const datalist = clone.querySelector('.data-list-datalist');
    const datalistId = datalist.getAttribute('id');
    datalist.setAttribute('id', `${datalistId}-${labelNumber}`);

    // Clear the input values in the clone
    const inputs = clone.querySelectorAll('input');
    inputs.forEach(input => input.value = '');

    // Set the product quantities clone to value 1
    const product_quantites = clone.querySelector('input[name="product_quantities[]"]');
    if (product_quantites) {
        product_quantites.value = '1';
    }

    // Set the value of the input element with name "paid_on" to today
    const paid_on = clone.querySelector('input[name="paid_on[]"]');
    if (paid_on) {
        const today = new Date(); // Keep this as a Date object
        paid_on.value = formatDateToISO(today); // Pass the Date object to formatDate
    }
    
    // Append the clone to the container
    container.querySelector('.add-el-container').appendChild(clone);
    getDataLists();
}



async function createInvoice() {
    const invoiceForm = document.querySelector('form[action="/invoices/create"]');

    if (invoiceForm) {
        const formData = new FormData(invoiceForm);
        const dataIds = {};
        var prices = {};
        const discountAmounts = {}; // Change variable name to discountAmounts
    
        // Iterate over inputs with datalist
        const inputsWithDatalist = invoiceForm.querySelectorAll('.data-list-input');
        inputsWithDatalist.forEach((input) => {
            const datalistId = input.getAttribute('data-datalist-id');
            const datalist = document.querySelector(`#${datalistId}`);
            if (datalist) {
                const selectedOption = datalist.querySelector(`option[value="${input.value}"]`);
        
                // Append data-id, price, amount-total, amount-percentage, and tax-percentage to FormData if an option is selected
                if (selectedOption) {
                    formData.delete(input.name);
                    const dataId = selectedOption.getAttribute('data-id');
                    const price = selectedOption.getAttribute('data-price');
                    const amountTotal = selectedOption.getAttribute('data-amount-total');
                    const amountPercentage = selectedOption.getAttribute('data-amount-percentage');
                    const taxPercentage = selectedOption.getAttribute('data-percentage'); // Added line
        
                    // Check the type of input and store data accordingly
                    const inputType = input.name.replace(/\[\]$/, ''); // Remove trailing []
                    if (!dataIds[inputType]) {
                        dataIds[inputType] = [];
                    }
                    dataIds[inputType].push(dataId);
        
                    if (inputType.includes('product')) {
                        if (!prices[inputType]) {
                            prices[inputType] = [];
                        }
                        prices[inputType].push(price);
        
                        // Set each price individually in the form data
                        prices[inputType].forEach((productPrice, index) => {
                            formData.set(`${inputType}_prices[${index}]`, productPrice);
                        });
                    } else if (inputType.includes('discount')) {
                        if (!discountAmounts[inputType]) {
                            discountAmounts[inputType] = { total: [], percentage: [] };
                        }
                        discountAmounts[inputType].total.push(amountTotal);
                        discountAmounts[inputType].percentage.push(amountPercentage);
        
                        // Set each amount individually in the form data
                        discountAmounts[inputType].total.forEach((total, index) => {
                            formData.set(`${inputType}_amounts_totals[${index}]`, total);
                        });
        
                        // Set each amount percentage individually in the form data
                        discountAmounts[inputType].percentage.forEach((percentage, index) => {
                            formData.set(`${inputType}_amounts_percentages[${index}]`, percentage);
                        });
                    }
        
                    // Set tax percentage in the form data
                    formData.set(`${inputType}_tax_percentage`, taxPercentage);
        
                    // Set each dataId individually in the form data
                    dataIds[inputType].forEach((id, index) => {
                        formData.set(`${inputType}[${index}]`, id);
                    });
                }
            }
        });

        // Get the totals info
        const amount_total = parseFloat(document.querySelector('.total_amount').innerHTML);
        const amount_due = parseFloat(document.querySelector('.amount_due').innerHTML);

        // Get the project info
        const selected_project = document.getElementById('project-datalist').querySelector('.selected');
        let project_total_time;
        let project_hour_rate;
        let project_timeTracking;
        let project_name;
        let project_description; 
        if (selected_project) {
            project_total_time = selected_project.dataset.project_total_time;
            project_hour_rate = parseFloat(document.getElementById('project_hour_rate').value);
            project_timeTracking = JSON.stringify(JSON.parse(selected_project.dataset.time_tracking));
            project_name = document.getElementById('project').value;
            project_description = selected_project.dataset.description;
        }

        const tax_amount = parseFloat(document.querySelector('.total_tax').dataset.tax);

        // Create a new URLSearchParams object with the form data
        const formDataParams = new URLSearchParams(formData);
        // Append amount info and project info to the form data
        formDataParams.append('amount_total', amount_total);
        formDataParams.append('amount_due', amount_due);
        formDataParams.append('tax_amount', tax_amount);
        if (selected_project) {
            formDataParams.append('project_total_time', project_total_time);
            formDataParams.append('project_hour_rate', project_hour_rate);
            formDataParams.append('project_timeTracking', project_timeTracking);
            formDataParams.append('project_name', project_name);
            formDataParams.append('project_description', project_description);
        }


        // Fetch API POST request
        try {
            const response = await fetch('/invoices/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDataParams.toString(),
            });

            if (response.ok) {
                // Handle success, e.g., redirect to a new page
                window.location.href = '/invoices?success';
            } else {
                // Handle errors
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

// Attach the createInvoice function to the form submission event
const invoiceForm = document.querySelector('form[action="/invoices/create"]');
if (invoiceForm) {
    invoiceForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        createInvoice(); // Call the custom function to handle form submission
    });

    // Set the value of the input element with name "paid_on" to today based on data-date-format
    const paidOnInput = document.querySelector('input[name="paid_on[]"]');
    if (paidOnInput) {
        const today = new Date();
        
        // paidOnInput.type = 'date'; // Change to text to support custom format
        paidOnInput.value = formatDateToISO(today);
    }

    // Set the value of the input element with name "due_date" to today + 2 weeks based on data-date-format
    const dueDateInput = document.querySelector('input[name="due_date"]');
    if (dueDateInput) {
        const today = new Date();
        const twoWeeksFromToday = new Date(today);
        twoWeeksFromToday.setDate(today.getDate() + 14); // Add 14 days

        console.log(formatDateToISO(twoWeeksFromToday));
        
        dueDateInput.value = formatDateToISO(twoWeeksFromToday);
    }

}


// Update the invoice totals
function changeInvoice (option) {
    // If the customer option has been selected then we need to search for the projects which match the customer
    if (option && option.classList.contains('customer-option')) {
        // Execute your code here
        getProjects(option);
    }

    const selectedOptions = document.querySelectorAll('.selected');

    // Get the product prices
    const prices = [];
    selectedOptions.forEach((option) => {
        const price = option.dataset.price;
        if (price !== undefined) {
            prices.push(parseFloat(price)); // Convert to a numeric value if needed
        }
    });

    // Get the product quantities
    const product_quantities_inputs = document.querySelectorAll('.product-quantity');
    const product_quantities = [];
    product_quantities_inputs.forEach((quantity) => {
        if (quantity.value !== undefined) {
            product_quantities.push(parseFloat(quantity.value));
        }
    })

    // Get the product totals
    const product_totals = [];
    for (let i = 0; i < prices.length; i++) {
        const product_total = prices[i] * product_quantities[i];
        product_totals.push(parseFloat(product_total));
    }

    // Get the discount percentage
    const discount_percentages = [];
    selectedOptions.forEach((option) => {
        const discount_percentage = option.dataset.amountPercentage;
        if (discount_percentage !== undefined) {
            discount_percentages.push(parseFloat(discount_percentage)); // Convert to a numeric value if needed
        }
    });


    // Get the discount percentage
    const discount_totals = [];
    selectedOptions.forEach((option) => {
        const discount_total = option.dataset.amountTotal;
        if (discount_total !== undefined) {
            discount_totals.push(parseFloat(discount_total)); // Convert to a numeric value if needed
        }
    });

    // Get the tax percentage
    const tax_percentage_input = document.querySelector('#tax-datalist .selected')
    var tax_percentage;
    if(tax_percentage_input) {
        tax_percentage = tax_percentage_input.dataset.percentage;
    }
    tax_percentage_input.setAttribute('data-tax-percentage', tax_percentage);

    // Get the shipping amount
    var shipping_amount = 0;
    if(document.querySelector('#shipping_amount').value) {
        shipping_amount = parseFloat(document.querySelector('#shipping_amount').value);
    }

    // Get the paid amounts
    const paid_amounts = [];
    const paid_amounts_input = document.querySelectorAll('.paid-amount');
    paid_amounts_input.forEach((amount) => {
        const paid_amount = amount.value;
        if (paid_amount !== undefined) {
            paid_amounts.push(parseFloat(paid_amount));
        }
    })


    // Get project total
    let project_total = 0;
    const project_total_data = document.querySelector('.total_project').dataset.total;
    if (project_total_data) {
        project_total = parseFloat(project_total_data);
    }

    // Calculate the totals
    const product_total = product_totals.reduce((sum, price) => sum + parseFloat(price), 0);
    const discount_amounts_total = discount_totals.reduce((sum, total) => sum + parseFloat(total),0);
    const discount_amounts_percentage = discount_percentages.reduce((sum, percentage) => sum + parseFloat(percentage),0);
    const sub_total = product_total + project_total;
    const discounts_total = (sub_total / 100 * discount_amounts_percentage) + discount_amounts_total;
    let tax_amount = ((sub_total - discounts_total) + shipping_amount) / 100 * parseFloat(tax_percentage);
    let amount_total = (product_total + project_total) - discounts_total + shipping_amount + tax_amount;
    const paid_total = paid_amounts.reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
    const amount_due = (paid_total > amount_total) ? 0 : (amount_total - paid_total);

    // Update the totals
    document.querySelector('.total_products').innerHTML = (product_total).toFixed(2);
    document.querySelector('.total_products').setAttribute('data-total', (product_total).toFixed(2));
    document.querySelector('.total_shipping').innerHTML = (shipping_amount).toFixed(2);
    document.querySelector('.total_shipping').setAttribute('data-total', (shipping_amount).toFixed(2));
    document.querySelector('.total_discount').innerHTML = (discounts_total).toFixed(2);
    document.querySelector('.total_discount').setAttribute('data-total', (discounts_total).toFixed(2));
    document.querySelector('.total_tax').innerHTML = (tax_amount).toFixed(2) + " (" + tax_percentage + "%)";
    document.querySelector('.total_tax').setAttribute('data-tax', (tax_amount).toFixed(2));
    document.querySelector('.total_amount').innerHTML = (amount_total).toFixed(2);
    document.querySelector('.total_amount').setAttribute('data-total', (amount_total).toFixed(2));
    document.querySelector('.amount_due').innerHTML = (amount_due).toFixed(2);
    document.querySelector('.amount_due').setAttribute('data-total', (amount_due).toFixed(2));
}



function getProjects(option) {
    // Get the selected customer id
    const selectedCustomerId = option.dataset.id;
    // Send a GET request with the selected data-ids
    fetch(`/invoices/create/projects/${selectedCustomerId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        // Check if the response status is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        return response.json();
    })
    .then(response => {
        // Get the projects response
        const projects = response;

        // Get the project billing div
        const projectBilling = document.querySelector('.project-billing');

        // If the projects array isn't empty then remove the hidden class from the project billing div
        // When selecting another option where the projects are empty then add the hidden class again
        if (projects.length > 0) {
            projectBilling.classList.remove('hidden');
        } else {
            projectBilling.classList.add('hidden');
        }

        const input = document.getElementById('project');
        const datalist = document.getElementById('project-datalist');

        // Get the project input field
        const projectInput = document.getElementById('project');
        const projectDataList = document.getElementById('project-datalist');
        
        // Clear existing options
        projectInput.innerHTML = '';
        projectDataList.innerHTML = '';

        // Populate the datalist with the fetched projects
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.name;
            option.innerHTML = project.name;
            option.setAttribute('data-id', project._id);
            projectDataList.appendChild(option);
            option.setAttribute('data-time_tracking', JSON.stringify(project.timeTracking));
            option.setAttribute('data-description', project.description);
            option.setAttribute('data-project_total_time', project.totalTimeInHours)
        });
        clickOptions(input, datalist);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updatePriceWithProject(el) {
    // Get the hour rate applied
    hourRate = el.value;
    // Get the project ID
    const project_id = document.getElementById("project-datalist").querySelector('.selected').dataset.id;
    // If there's no hour rate, update the according totals
    if (!hourRate) {
        // Select the <p> element with class "total_project"
        const totalProjectElement = document.querySelector('.total_project');
        // Reset the project total
        totalProjectElement.innerHTML = "";
        // Update the value of the data-total attribute to 0
        totalProjectElement.dataset.total = '0';
        // Recalculate the totals
        changeInvoice();
        return;
    }
    fetch(`/invoices/create//project/${project_id}/${hourRate}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        // Check if the response status is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        return response.json();
    })
    .then(response => {
        // Get the projects response
        const projectPrice = response;

        // Update the project total price
        const projectTotal = document.querySelector('.total_project');
        projectTotal.innerHTML = (projectPrice).toFixed(2);

        // Set the project total attribute for calculations
        projectTotal.setAttribute('data-total', (projectPrice).toFixed(2));
 
        // Update the totals
        changeInvoice();
    });
}


const createInvoiceWrapper = document.querySelector('.edit-invoice');
if (createInvoiceWrapper) {
    const paid_on = document.getElementById('paid_on');
    if(paid_on) {
        // Get the current date in the format YYYY-MM-DD
        const currentDate = new Date().toISOString().split('T')[0];

        // Set the value of the input element to the current date
        paid_on.value = currentDate;
    }

    // Get the due date from the data attribute
    const dueDateInput = document.getElementById('due_date');
    if (dueDateInput) {
        const dueDateAttr = dueDateInput.getAttribute('data-date');

        // Convert the date string to a Date object
        const dueDate = new Date(dueDateAttr);
        
        // Format the date for the input type date (YYYY-MM-DD)
        const isoFormattedDate = formatDateToISO(dueDate); // Use a helper function

        // Set the value of the input field to the formatted date
        dueDateInput.value = isoFormattedDate;
    }
}

// Helper function to format the date as YYYY-MM-DD
function formatDateToISO(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    // Return the date in ISO format
    return `${year}-${month}-${day}`;
}


// Function to style overdue invoices
function styleOverdueInvoices() {
    const tableRows = document.querySelectorAll('.invoices .table-sort tbody tr');
    if(tableRows) {
        const today = new Date(); // Get today's date

        tableRows.forEach(row => {
            const amountDueCell = row.querySelector('td[data-field="amount_due"]');
            const dueDateCell = row.querySelector('td[data-field="due_date"]');
    
            if (amountDueCell && dueDateCell) {
                const amountDueText = amountDueCell.textContent.trim();
                const dueDateText = dueDateCell.textContent.trim();
    
                // Parse the amount due
                const amountDue = parseFloat(amountDueText.replace(/[^\d.-]/g, '')); // Remove currency symbols
                // Parse the due date
                const dueDateParts = dueDateText.split('/');
                const dueDate = new Date(`${dueDateParts[2]}-${dueDateParts[1]}-${dueDateParts[0]}`); // Format as YYYY-MM-DD
                // Check conditions
                if (amountDue > 0 && dueDate < today) {
                    row.classList.add('overdue'); // Add class for styling
                }
            }
        });
    }
}

// Call the function to style overdue invoices
styleOverdueInvoices();
