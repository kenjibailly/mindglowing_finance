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
    if(paid_on) {
        const today = new Date().toISOString().split('T')[0];
        paid_on.value = today;
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
        });

        // Fetch API POST request
        try {
            const response = await fetch('/invoices/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString(),
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

    // Set the value of the input element with name "paid_on" to today
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('input[name="paid_on[]"]').value = today;
}


// Update the invoice totals
function changeInvoice () {
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

    
    const product_total = product_totals.reduce((sum, price) => sum + parseFloat(price), 0);;
    const discount_amounts_total = discount_totals.reduce((sum, total) => sum + parseFloat(total),0);
    const discount_amounts_percentage = discount_percentages.reduce((sum, percentage) => sum + parseFloat(percentage),0);
    const discounts_total = (product_total / 100 * discount_amounts_percentage) + discount_amounts_total;
    const tax_amount = (product_total + shipping_amount) / 100 * parseFloat(tax_percentage);
    const amount_total = product_total - discounts_total + shipping_amount + tax_amount;
    const paid_total = paid_amounts.reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
    const amount_due = (paid_total > amount_total) ? 0 : (amount_total - paid_total);
    
    if (product_total) {
        document.querySelector('.total_products').innerHTML = product_total;
    }
    if (shipping_amount) {
        document.querySelector('.total_shipping').innerHTML = shipping_amount;
    }
    if (discounts_total) {
        document.querySelector('.total_discount').innerHTML = discounts_total;
    }
    if (tax_amount && tax_percentage) {
        document.querySelector('.total_vat').innerHTML = tax_amount + "(" + tax_percentage + "%)";
    }
    if (amount_total) {
        document.querySelector('.total_amount').innerHTML = amount_total;
    }
    if (!isNaN(amount_due)) {
         document.querySelector('.amount_due').innerHTML = amount_due;
    }
}