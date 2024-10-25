function dateToISO(dateString, dateFormat) {
    let day, month, year;

    // Handle different date formats
    if (dateFormat === 'en-GB') {
        // For en-GB (DD/MM/YYYY)
        [day, month, year] = dateString.split('/');
    } else if (dateFormat === 'en-US') {
        // For en-US (MM/DD/YYYY)
        [month, day, year] = dateString.split('/');
    } else if (dateFormat === 'zh-Hans-CN') {
        // For zh-Hans-CN (YYYY/MM/DD)
        [year, month, day] = dateString.split('/');
    } else {
        throw new Error('Unsupported date format');
    }

    // Convert to ISO format (YYYY-MM-DD) which can be safely passed to the server function
    return `${year}-${month}-${day}`;
}

module.exports = dateToISO;