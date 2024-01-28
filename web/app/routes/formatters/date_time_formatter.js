function formatDateTime(date, user_settings) {
    const timeZone = user_settings.time_zone || 'Europe/Brussels';
  
    // Create a formatter with the specified time zone
    const dateTimeFormatter = new Intl.DateTimeFormat(user_settings.date_format, {
      timeZone,
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  
    // Format the provided date
    return dateTimeFormatter.format(date);
  }

module.exports = formatDateTime;