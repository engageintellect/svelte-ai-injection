export function getFormattedDateTime(): string {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because months are 0-indexed.
  const date = now.getDate().toString().padStart(2, '0');
  const year = now.getFullYear().toString().slice(-2); // Get the last two digits of the year.

  const hour = now.getHours();
  const minute = now.getMinutes().toString().padStart(2, '0');

  // Convert 24-hour time to 12-hour time format
  const hour12 = hour % 12 || 12;
  // Determine the period of the day (AM/PM)
  const period = hour < 12 ? 'am' : 'pm';

  return `${month}/${date}/${year}, ${hour12}:${minute}${period}`;
}

console.log(getFormattedDateTime());
