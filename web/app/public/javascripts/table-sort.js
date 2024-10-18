document.addEventListener("DOMContentLoaded", function () {
    const tables = document.querySelectorAll('.table-sort');
    let ascending = true;
    
    if (tables.length > 0) {
        tables.forEach(table => {
            const headers = table.querySelectorAll("th[data-sort]");

            // Create an array to store the data-field attributes
            const dataFields = Array.from(headers).map(header => header.getAttribute("data-field"));

            headers.forEach(header => {
                header.addEventListener("click", async function () {
                    const column = header.getAttribute("data-sort");
                    if (column === "false") {
                        return;
                    }
                    const sortOrder = ascending ? 'asc' : 'desc';

                    const link = parseUrlPath(window.location.href);

                    const currentPageLink = document.querySelector('.pagination a[data-current-page]');
                    let currentPage = currentPageLink ? Number(currentPageLink.getAttribute('data-current-page')) : 1;

                    // Sort again from page 1 if clicked again on different page
                    if (currentPage !== 1) {
                        currentPage = 1;
                    }

                    const response = await fetch(`${link[0]}/sort?page=${currentPage}&sort_by=${column}&sort_order=${sortOrder}&reload=false`);
                    const sortedData = await response.json();

                    if (sortedData.error) {
                        return;
                    }

                    const tbody = table.querySelector("tbody");
                    tbody.innerHTML = ''; // Clear existing rows

                    // Populate the table with dynamic data
                    sortedData.data.forEach(dataRow => {
                        const row = document.createElement('tr');

                        // Add checkbox as the first column
                        const checkboxCell = document.createElement('td');
                        checkboxCell.innerHTML = `
                            <label class="checkbox">
                                <input type="checkbox" class="invoice-checkbox box-checkbox" data-id="${dataRow._id}">
                            </label>
                        `;
                        row.appendChild(checkboxCell); // Append checkbox cell as first column

                        // Populate the rest of the columns dynamically
                        dataFields.forEach((field, index) => {
                            const header = headers[index]; // Get the corresponding header
                            const cell = document.createElement('td');
                            
                            // Set data-field attribute
                            cell.setAttribute('data-field', field);
                            
                            // If the field is 'number', include prefix and separator
                            if (field === 'number' && header.getAttribute('data-prefix') && header.getAttribute('data-separator')) {
                                const prefix = getNestedValue(dataRow, header.getAttribute('data-prefix'));
                                const separator = getNestedValue(dataRow, header.getAttribute('data-separator'));
                                
                                cell.innerHTML = `<a class="link" href="${link[0]}${header.getAttribute('data-link')}${dataRow._id}">${prefix}${separator}${getNestedValue(dataRow, field)}</a>`;
                            } else if (header.getAttribute('data-link')) {
                                cell.innerHTML = `<a class="link" href="${link[0]}${header.getAttribute('data-link')}${dataRow._id}">${getNestedValue(dataRow, field)}</a>`;
                            } else if (header.getAttribute('data-image')) {
                                cell.innerHTML = `<img width="${header.getAttribute('data-image')}" src="/uploads/resized/${getNestedValue(dataRow, field)}"></img>`;
                            } else {
                                const fieldValue = getNestedValue(dataRow, field, header.getAttribute('data-extra'), header.getAttribute('data-extra-placement'), header.getAttribute('data-extra-space')); // Dynamically get value from the data
                                cell.innerHTML = fieldValue !== undefined ? fieldValue : '';
                            }

                            row.appendChild(cell);
                        });

                        tbody.appendChild(row);
                    });

                    // Toggle sort direction for the next click
                    ascending = !ascending;

                    // Update pagination links (if needed)
                    updatePaginationLinks(currentPage, column, sortOrder, link);
                    styleOverdueInvoices();
                });
            });
        });
    }

    function updatePaginationLinks(currentPage, column, sortOrder, link) {
        const previousLink = document.querySelector('.pagination .previous');
        const nextLink = document.querySelector('.pagination .next');
        if (previousLink) {
            previousLink.href = `${link[0]}/sort?page=${Number(currentPage) - 1}&sort_by=${column}&sort_order=${sortOrder}&reload=true`;
        }
        if (nextLink) {
            nextLink.href = `${link[0]}/sort?page=${Number(currentPage) + 1}&sort_by=${column}&sort_order=${sortOrder}&reload=true`;
        }

        if (currentPage  == 1) {
            if (previousLink) {
                previousLink.remove(); // Remove the previous link

                if (!nextLink) {
                    // Create the next link
                    const newNextLink = document.createElement('a');
                    newNextLink.classList.add('next');
                    newNextLink.textContent = 'Next'; // Set the text for the link
                    const link_options = `&sort_by=${column}&sort_order=${sortOrder}&reload=true`; // or whatever your logic is for link_options
                    // Set attributes for the next link
                    newNextLink.setAttribute('data-current-page', currentPage);
                    newNextLink.setAttribute('data-page', Number(currentPage) + 1);
                    newNextLink.href = `${link[0]}/sort?page=${Number(currentPage) + 1}${link_options ? link_options : ''}`; // Use link_options if available

                    // Find the pagination container
                    const paginationContainer = document.querySelector('.pagination');

                    // Append the next link inside the pagination div
                    paginationContainer.appendChild(newNextLink);
                }
            }
        }
    }

    function parseUrlPath(link) {
        const url = new URL(link);
        const pathname = url.pathname;
        const pathParts = pathname.split('/').filter(Boolean);
        const isSort = pathParts.includes('sort');
        let mainPath = isSort ? '/' + pathParts.slice(0, pathParts.indexOf('sort')).join('/') : '/' + pathParts.join('/');
        const searchPart = isSort ? '/sort' + url.search : '';
        return searchPart ? [mainPath, searchPart] : [mainPath];
    }

    function getNestedValue(obj, path, path_extra, placement, space) {
        const mainValue = path.split('.').reduce((value, key) => value && value[key], obj);
    
        if (path_extra) {
            const extraValue = path_extra.split('.').reduce((value, key) => value && value[key], obj);
            if (placement === "before") {
                return space === "true" ? extraValue + " " + mainValue : extraValue + mainValue;
            } else {
                return space === "true" ? mainValue + " " + extraValue : mainValue + extraValue;
            }
        }
    
        return mainValue;
    }

    function isSortUrl(url) {
        const urlObj = new URL(url);
        return urlObj.pathname.includes('/sort') && urlObj.searchParams.has('sort_by') && urlObj.searchParams.has('sort_order');
    }
    
    // Get the current URL
    const currentUrl = window.location.href;

    // Check if the URL meets the criteria
    if (isSortUrl(currentUrl)) {
        const link = parseUrlPath(currentUrl);
        const currentPageLink = document.querySelector('.pagination a[data-current-page]');
        const currentPage = currentPageLink ? Number(currentPageLink.getAttribute('data-current-page')) : 1;
        
        // Get sort_by and sort_order from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const column = urlParams.get('sort_by');
        const sortOrder = urlParams.get('sort_order');

        // Call the updatePaginationLinks function
        updatePaginationLinks(currentPage, column, sortOrder, link);
    }


});
