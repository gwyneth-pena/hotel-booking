import config from "../config";

export const fetchHotelsSearchResult = async (props: {
  city?: string;
  type?: string;
  checkInDate: string;
  checkOutDate: string;
  minPax: number | string | null;
}) => {
  const { city, type, checkInDate, checkOutDate, minPax } = props;
  const apiURL = config.apiUrl;

  const field = city ? "city" : type ? "type" : null;
  const value = city || type;

  if (!field || !value) return [];

  const params = new URLSearchParams({
    field,
    values: value,
    withRoomInfo: "true",
    checkInDate,
    checkOutDate,
    minPax: String(minPax),
  });

  const response = await fetch(`${apiURL}/hotels?${params.toString()}`);
  return response.json();
};
