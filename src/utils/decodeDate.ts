export const decodeDate = (
  dateString: string | null | undefined
): string | null => {
  if (!dateString) return null;

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid date format";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  if (hours !== 12 || minutes !== "00" || seconds !== "00" || amPm === "PM") {
    return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
  }

  return `${day}-${month}-${year}`;
};
