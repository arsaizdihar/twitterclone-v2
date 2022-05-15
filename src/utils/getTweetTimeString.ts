export const getTweetTimeString = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const differenceTime = Math.max(
    0,
    Math.floor((now.getTime() - date.getTime()) / 1000)
  );
  const yearsDif = now.getFullYear() - date.getFullYear();
  const days = Math.floor(differenceTime / 3600 / 24);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  if (days > 0) {
    if (yearsDif > 0) options.year = "numeric";
    return date.toLocaleDateString("en-us", options);
  } else if (days === 1) {
    return "yesterday";
  }
  const hours = Math.floor(differenceTime / 3600);
  if (hours > 0) {
    return `${hours}h`;
  }
  const minutes = Math.floor(differenceTime / 60);
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${differenceTime}s`;
};
