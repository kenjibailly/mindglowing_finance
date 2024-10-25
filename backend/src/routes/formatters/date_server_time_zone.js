function formatDateToServerTimezone(dateString, user_settings) {
    const date = new Date(dateString);

    // Set the time zone based on user_settings or default to 'Europe/Brussels'
    const timeZone = user_settings.time_zone || 'Europe/Brussels';
    
    // Use Intl.DateTimeFormat to format the date in the desired way
    const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
    });

    // Format the date using the formatter
    const formattedDate = dateTimeFormatter.format(date);

    // Return the formatted date as a JavaScript Date object
    return new Date(formattedDate);
}

module.exports = formatDateToServerTimezone;