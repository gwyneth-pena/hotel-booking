export const isSameDate = (date1: Date, date2: Date) => {
  return (
    date1?.getFullYear() === date2?.getFullYear() &&
    date1?.getMonth() === date2?.getMonth() &&
    date1?.getDate() === date2?.getDate()
  );
};

export const formatDate = (date: Date) => {
  const year = date?.getFullYear();
  const month = String(date?.getMonth() + 1).padStart(2, "0");
  const day = String(date?.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
