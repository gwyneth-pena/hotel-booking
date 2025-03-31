import config from "../config";

export const fetchHotelsSearchResult = async (props: any) => {
  const apiURL = config.apiUrl;
  const response = await fetch(
    `${apiURL}/hotels?field=city&values=${props.city}&withRoomInfo=true&checkInDate=${props.checkInDate}&checkOutDate=${props.checkOutDate}&minPax=${props.minPax}`
  );
  return response.json();
};
