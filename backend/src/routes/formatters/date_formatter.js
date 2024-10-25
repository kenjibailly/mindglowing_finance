function formatDate(date, user_settings) {
    const timeZone = user_settings.time_zone || 'Europe/Brussels';
  
    // Create a formatter with the specified time zone (excluding time components)
    const dateFormatter = new Intl.DateTimeFormat(user_settings.date_format, {
      timeZone,
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  
    // Format the provided date without time
    return dateFormatter.format(date);
}

module.exports = formatDate;