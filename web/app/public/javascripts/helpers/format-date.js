// Helper function to format date based on the specified format (en-GB, en-US, zh-Hans-CN, etc.)
function formatDate(date, format) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    if (format === 'en-GB') {
        return `${day}/${month}/${year}`; // dd/mm/yyyy format
    } else if (format === 'en-US') {
        return `${month}/${day}/${year}`; // mm/dd/yyyy format
    } else if (format === 'zh-Hans-CN') {
        return `${year}/${month}/${day}`; // yyyy/mm/dd format
    } else {
        // Default to ISO (yyyy-mm-dd)
        return `${year}-${month}-${day}`;
    }
}