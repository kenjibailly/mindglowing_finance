function formatDateTime(date, user_settings) {
  const timeZone = user_settings.time_zone || 'Europe/Brussels';

  // Create a formatter with the specified time zone
  const dateTimeFormatter = new Intl.DateTimeFormat(user_settings.date_format, {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
  });

  // Format the provided date
  const formattedDateTime = dateTimeFormatter.format(date);

  // Extract time and date components
  const [dayMonthYear, time] = formattedDateTime.split(',');

  // Concatenate time and date in the desired format
  return `${time.trim()}, ${dayMonthYear.trim()}`;
}

module.exports = formatDateTime;