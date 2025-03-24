import { useCallback, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import _ from "lodash";
import './SearchBox.css';

import config from "../../config";

const SearchBox = () => {
  const placesUrl = config.placesUrl;
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [dates, setDates] = useState<any>(null);
  const [numberOfPax, setNumberOfPax] = useState(0);

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

  return (
    <>
      <div className="container bg-yellow py-2">
        <div className="row">
          <div className="col-12 col-md-4">
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
            />
          </div>
          <div className="col-12 col-md-3">
            <Calendar
              value={dates}
              onChange={(e) => setDates(e.value)}
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
          <div className="col-12 col-md-4">
            <InputNumber
              value={numberOfPax}
              onValueChange={(e: any) =>
                setNumberOfPax(e.value)
              }
              showButtons
              buttonLayout="horizontal"
              step={1}
              min={0}
              decrementButtonClassName="bg-dark-primary"
              incrementButtonClassName="bg-dark-primary"
              incrementButtonIcon="ti ti-plus"
              decrementButtonIcon="ti ti-minus"
              inputStyle={{
                height:'50px',
                width: '100%',
                padding: '0 15px',
                fontSize: "16px"
              }}
              style={{
                width: '100%'
              }}
            />
          </div>
          <button className="col-12 col-md-1 search-btn" type="button">
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchBox;
