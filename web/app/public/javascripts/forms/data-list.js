var dataLists;

function getDataLists() {

    // Get all elements with class "data-list"
    dataLists = document.querySelectorAll('.data-list');

    // Iterate over each data list
    dataLists.forEach(dataList => {
        createDataList(dataList);
    });

}

getDataLists();

function createDataList(dataList) {
    // Find the associated input element within the current data list
    const input = dataList.querySelector('.data-list-input');
    const datalist = dataList.querySelector('.data-list-datalist');

    if (!input || !datalist) {
        console.error('Input or datalist element not found for data list.');
        return;
    }

    // Click event listener to hide datalist when clicking outside the input and datalist
    document.addEventListener('click', function (event) {
        const isClickInsideInput = input.contains(event.target);
        const isClickInsideDatalist = datalist.contains(event.target);


        if (!isClickInsideInput && !isClickInsideDatalist) {
            datalist.style.display = 'none';
            input.style.borderRadius = "5px";
        }
    });

    // Focus event for the input field
    input.onfocus = function () {
        datalist.style.display = 'block';
        input.style.borderRadius = "5px 5px 0 0";
    };

    // Click event for datalist options
    for (let option of datalist.options) {
        option.onclick = function () {
            input.value = option.value;
            datalist.style.display = 'none';
            input.style.borderRadius = "5px";
            // Add a selected class to the option selected and remove the previous one if there is any
            const selectedOption = option.parentNode.querySelector('.selected');
            if(selectedOption) {
                selectedOption.classList.remove('selected');
            }
            option.classList.add('selected');
            // Trigger the invoice change
            triggerInvoiceChange();
        }
    };

    // Initialize the currentFocus
    var currentFocus = -1;
    // Input event for filtering options based on user input
    input.oninput = function () {
        // reset the current focus to 0 when input has changed
        currentFocus = -1;
        const text = input.value.toUpperCase();
        const options = datalist.querySelectorAll('option');

        for (let option of options) {
            if (option.value.toUpperCase().indexOf(text) > -1) {
                option.style.display = "block";
            } else {
                option.style.display = "none";
            }
        }
    }

    // Keydown event for handling arrow key navigation, Enter key, and Backspace key
    input.onkeydown = function (e) {
        if (e.keyCode == 40 || e.keyCode == 38) {
            // Arrow down or Arrow up key pressed
            const visibleOptions = getVisibleOptions(datalist);
            if (e.keyCode == 40) {
                // Arrow down key pressed
                currentFocus += 1;
                if(currentFocus > visibleOptions.length) {
                    currentFocus = 1;
                }
                addActive(visibleOptions, currentFocus);
            } else if (e.keyCode == 38) {
                // Arrow up key pressed
                currentFocus -= 1;
                if(currentFocus < 1) {
                    currentFocus = visibleOptions.length;
                }
                addActive(visibleOptions, currentFocus);
            }
        } else if (e.keyCode == 13) {
            // Enter key pressed
            e.preventDefault();
            const activeOption = datalist.querySelector('.active');

            if (activeOption) {
                input.value = activeOption.value;
                datalist.style.display = 'none';
                input.style.borderRadius = '5px';
                const selectedOption = datalist.querySelector('.selected');
                if(selectedOption) {
                    selectedOption.classList.remove('selected');
                }
                activeOption.classList.add('selected');
                triggerInvoiceChange();
            }
        } else if (e.keyCode == 8) {
            // Backspace key pressed
            removeActive(datalist.querySelectorAll('option'));
            datalist.style.display = 'block';
        }
    };
}

// Helper function to filter visible options
function getVisibleOptions(datalist) {
    return Array.from(datalist.querySelectorAll('option')).filter(option => option.style.display !== 'none');
}

// Helper function to add active class to the currently focused option
function addActive(options, currentFocus) {
    if (!options || !options.length) return false;

    removeActive(options);
    currentFocus = (currentFocus + options.length) % options.length;  // Ensure a valid index

    options[currentFocus].classList.add("active");
}

// Helper function to remove active class from all options
function removeActive(options) {
    options.forEach(option => option.classList.remove("active"));
}

// Helper function to get the current focus index
function getCurrentFocus(datalist) {
    const activeOption = datalist.querySelector('.active');
    return activeOption ? Array.from(datalist.querySelectorAll('option')).indexOf(activeOption) : -1;
}

// Trigger the change on the invoice page, this is to change the shipping, vat, discount and total values
function triggerInvoiceChange() {
    const invoicePage = document.querySelector(".create-invoice");
    if(invoicePage) {
        changeInvoice();
    }
}