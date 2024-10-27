function formatDate(
  date: Date,
  userSettings: { time_zone?: string; date_format: string } | null
) {
  const timeZone = userSettings?.time_zone || "Europe/Brussels";
  const dateFormat = userSettings?.date_format || "en-US";

  const dateFormatter = new Intl.DateTimeFormat(dateFormat, {
    timeZone,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return dateFormatter.format(date);
}

export default formatDate;
