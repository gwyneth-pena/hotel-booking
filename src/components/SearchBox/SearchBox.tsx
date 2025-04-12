import { useCallback, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import _ from "lodash";
import "./SearchBox.css";

import config from "../../config";
import { useNavigate } from "react-router-dom";
import { formatDate, isSameDate } from "../../utils/dates";

const SearchBox = ({ ...props }: any) => {
  const placesUrl = config.placesUrl;
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(props.city || null);
  const [dates, setDates] = useState<any>(props.dates || [today, tomorrow]);
  const [numberOfPax, setNumberOfPax] = useState(props.pax || 0);
  const navigate = useNavigate();

  const searchCity = async (event: any) => {
    const query = event.query;
    if (!query) return;

    const response = await fetch(
      `${placesUrl}?country=Philippines&city=${query}&format=json`
    );
    const data = await response.json();

    const cities = data.map((item: any) => ({
      name: item.display_name,
      shortname: item.name,
      lat: item.lat,
      lon: item.lon,
    }));

    setFilteredCities(cities);
  };

  const debouncedFetch = useCallback(_.debounce(searchCity, 500), []);

  const search: any = (e: Event) => {
    e.preventDefault();

    const city = selectedCity?.shortname || selectedCity;
    const checkInDate = formatDate(dates[0]);
    const defaultEndDate = new Date(checkInDate);
    defaultEndDate.setDate(defaultEndDate.getDate() + 1);
    let checkOutDate = dates[1];
    checkOutDate = checkOutDate
      ? formatDate(dates[1])
      : formatDate(defaultEndDate);
    const numOfPax = numberOfPax.toString();

    const params = new URLSearchParams({
      place: city,
      checkInDate,
      checkOutDate,
      pax: numOfPax,
    });
    if (props.handleSearchEvent) {
      props.handleSearchEvent();
    }
    navigate(`/searchresults?${params.toString()}`, { state: { place: city } });
  };

  const handleDateChange = (e: any) => {
    const selectedDate = e.value;

    if (selectedDate && selectedDate[0]) {
      const start = selectedDate[0];
      const end = selectedDate[1];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const picked = new Date(start);
      picked.setHours(0, 0, 0, 0);

      if (picked.getTime() < tomorrow.getTime()) {
        start.setHours(0, 0, 0, 0);
      } else {
        start.setHours(23, 59, 59, 999);
      }

      const sameAsToday = isSameDate(today, start) && isSameDate(today, end);
      if (start?.getTime() === end?.getTime() || sameAsToday) {
        end.setDate(end.getDate() + 1);
        selectedDate[1] = end;
        if (sameAsToday) {
          selectedDate[0] = today;
        }
      }
    }

    setDates(selectedDate);
  };

  return (
    <>
      <div className="container bg-yellow py-2">
        <form className="row" onSubmit={search}>
          <div className="col-12 col-md-4 mt-2 mt-md-0">
            <AutoComplete
              value={selectedCity}
              suggestions={filteredCities}
              field="name"
              completeMethod={debouncedFetch}
              onChange={(e) => setSelectedCity(e.value)}
              style={{ width: "100%" }}
              inputStyle={{
                height: "50px",
                width: "100%",
                fontSize: "16px",
                paddingLeft: "15px",
                paddingRight: "15px",
                outline: "none",
              }}
              placeholder="Where are you going?"
              required
            />
          </div>
          <div className="col-12 col-md-3 mt-2 mt-md-0">
            <Calendar
              value={dates}
              dateFormat="yy-mm-dd"
              numberOfMonths={2}
              minDate={new Date(new Date().setUTCHours(0, 0, 0, 0))}
              onChange={handleDateChange}
              selectionMode="range"
              readOnlyInput
              hideOnRangeSelection
              inputStyle={{
                height: "50px",
                width: "100%",
                fontSize: "16px",
                textAlign: "center",
                paddingLeft: "15px",
                paddingRight: "15px",
                outline: "none",
              }}
              style={{ width: "100%" }}
              placeholder="Check-in and Check-out Dates"
            />
          </div>
          <div className="col-12 col-md-4 mt-2 mt-md-0">
            <InputNumber
              value={numberOfPax}
              onValueChange={(e: any) => setNumberOfPax(e.value)}
              showButtons
              buttonLayout="horizontal"
              step={1}
              min={1}
              decrementButtonClassName="btn-increment-decrement"
              incrementButtonClassName="btn-increment-decrement"
              incrementButtonIcon="ti ti-plus"
              decrementButtonIcon="ti ti-minus"
              inputStyle={{
                height: "50px",
                width: "100%",
                padding: "0 15px",
                fontSize: "16px",
              }}
              style={{
                width: "100%",
              }}
              placeholder="Number of Pax"
            />
          </div>
          <div className="col-12 col-md-1 mt-2 mt-md-0">
            <button className="btn-search" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SearchBox;
