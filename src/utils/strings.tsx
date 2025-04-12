export const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getTotalNights = (endDate: string, startDate: string) => {
  if (startDate === "" || endDate === "") {
    return "";
  }

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (end < start) return 0;

  const diffMil = end - start;
  const diffDay = diffMil / (1000 * 60 * 60 * 24);
  return Math.floor(diffDay);
};
