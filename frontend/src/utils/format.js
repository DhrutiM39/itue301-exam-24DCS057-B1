export function formatDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const parts = [];

  if (hours > 0) parts.push(`${hours} h`);
  if (remainingMinutes > 0) parts.push(`${remainingMinutes} min`);

  return parts.length > 0 ? parts.join(" ") : "0 min";
}
