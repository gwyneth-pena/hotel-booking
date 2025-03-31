import { Helmet } from "react-helmet-async";
import { useLocation, useSearchParams } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SearchBox from "../../components/SearchBox/SearchBox";
import "./SearchResults.css";
import { fetchHotelsSearchResult } from "../../utils/hotels";
import { useEffect, useState } from "react";
import { toTitleCase } from "../../utils/strings";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [isList, setIsList] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const state = location.state;

  useEffect(() => {
    fetchHotels();
  }, [searchParams]);

  const fetchHotels = async () => {
    const res = await fetchHotelsSearchResult({
      city: searchParams.get("place") || state?.place,
      checkInDate: searchParams.get("checkInDate"),
      checkOutDate: searchParams.get("checkOutDate"),
      minPax: searchParams.get("pax"),
    });
    setResults(res?.[0]?.documents || []);
  };

  return (
    <>
      <Helmet>
        <title>
          Find the best deals in {searchParams.get("place")} | ComfyCorners
        </title>
        <meta
          name="description"
          content="Find the best hotel deals in the Philippines"
        />
      </Helmet>

      <div className="box-header bg-primary">
        <div className="container">
          <div className="row">
            <div className="col" style={{ marginTop: "25px" }}>
              <SearchBox
                city={state?.place || searchParams.get("place")}
                pax={searchParams.get("pax")}
                dates={[
                  new Date(searchParams.get("checkInDate") || new Date()),
                  new Date(searchParams.get("checkOutDate") || new Date()),
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container results-container py-3">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-9">
            <div className="row">
              <div className="col-9">
                <h5 className="fw-bold">
                  {toTitleCase(searchParams.get("place") || "")}:{" "}
                  {results.length} properties found
                </h5>
              </div>
              <div className="col-3">
                <ToggleButtonGroup
                  color="primary"
                  value={isList}
                  exclusive
                  onChange={(event: any, data: boolean) => {
                    setIsList(data);
                  }}
                  aria-label="Platform"
                >
                  <ToggleButton value={true}>List</ToggleButton>
                  <ToggleButton value={false}>Grid</ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-3">
        <div className="row">
          
        </div>
      </div>
    </>
  );
};

export default SearchResults;
