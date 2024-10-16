document.addEventListener("DOMContentLoaded", function () {
    const tables = document.querySelectorAll('.table-sort');
    let ascending = true;
    
    if (tables.length > 0) {
        tables.forEach(table => {
            const headers = table.querySelectorAll("th[data-sort]");
            
            headers.forEach(header => {
                header.addEventListener("click", async function () {
                    const column = header.getAttribute("data-sort");
                    const sortOrder = ascending ? 'asc' : 'desc';

                    const link = parseUrlPath(window.location.href);

                    // Get the current page from the pagination links
                    const currentPageLink = document.querySelector('.pagination a[data-current-page]');
                    const currentPage = currentPageLink ? Number(currentPageLink.getAttribute('data-current-page')) : 1;

                    // Perform an AJAX request to fetch sorted data
                    const response = await fetch(`${link[0]}/sort?page=${currentPage}&sort_by=${column}&sort_order=${sortOrder}&reload=false`);
                    const sortedData = await response.json();

                    // Clear the current table body
                    const tbody = table.querySelector("tbody");
                    tbody.innerHTML = ''; // Clear existing rows

                    // Get header fields from the current table
                    const headerFields = Array.from(headers).map(header => ({
                        field: header.getAttribute("data-field"),
                        link: header.getAttribute("data-link"),
                        prefix: header.getAttribute("data-prefix"),
                        separator: header.getAttribute("data-separator"),
                        extra: header.getAttribute("data-extra"),
                        placement: header.getAttribute("data-extra-placement"),
                        space: header.getAttribute("data-extra-space"),
                    }));

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
                        headerFields.forEach(header => {
                            if (header.field !== 'checkbox') {
                                const cell = document.createElement('td');
                                
                                // If the field is 'number', include prefix and separator
                                if (header.field === 'number' && header.prefix && header.separator) {
                                    const prefix = getNestedValue(dataRow, header.prefix);
                                    const separator = getNestedValue(dataRow, header.separator);
                                    
                                    cell.innerHTML = `<a class="link" href="${link[0]}${header.link}${dataRow._id}">${prefix}${separator}${getNestedValue(dataRow, header.field)}</a>`;
                                } else if (header.link) {
                                    cell.innerHTML = `<a class="link" href="${link[0]}${header.link}${dataRow._id}">${getNestedValue(dataRow, header.field)}</a>`;
                                } else {
                                    const fieldValue = getNestedValue(dataRow, header.field, header.extra, header.placement, header.space); // Dynamically get value from the data
                                    cell.innerHTML = fieldValue !== undefined ? fieldValue : '';
                                }

                                row.appendChild(cell);
                            }
                        });

                        tbody.appendChild(row);
                    });

                    // Toggle sort direction for the next click
                    ascending = !ascending;

                    // Update pagination links (if needed)
                    updatePaginationLinks(currentPage, column, sortOrder, link);
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
        // Retrieve the main value using the path
        const mainValue = path.split('.').reduce((value, key) => value && value[key], obj);
    
        // If there's an extra path, retrieve that value as well
        if (path_extra) {
            const extraValue = path_extra.split('.').reduce((value, key) => value && value[key], obj);
            if (placement == "before") {
                if (space === "true") {
                    return extraValue + " " + mainValue;
                } else {
                    return extraValue + mainValue;
                }
            } else {
                if (space === "true") {
                    return mainValue + " " + extraValue;
                } else {
                    return mainValue + extraValue;
                }
            }
        }
    
        // Return only the main value if no extra path is provided
        return mainValue;
    }    
});
