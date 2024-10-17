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
                    const sortOrder = ascending ? 'asc' : 'desc';

                    const link = parseUrlPath(window.location.href);

                    const currentPageLink = document.querySelector('.pagination a[data-current-page]');
                    const currentPage = currentPageLink ? Number(currentPageLink.getAttribute('data-current-page')) : 1;

                    const response = await fetch(`${link[0]}/sort?page=${currentPage}&sort_by=${column}&sort_order=${sortOrder}&reload=false`);
                    const sortedData = await response.json();

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
});
