import { Helmet } from "react-helmet-async";
import { useLocation, useSearchParams } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SearchBox from "../../components/SearchBox/SearchBox";
import "./SearchResults.css";
import { fetchHotelsSearchResult } from "../../utils/hotels";
import { useEffect, useState } from "react";
import { getTotalNights, toTitleCase } from "../../utils/strings";
import clsx from "clsx";
import useScreenWidth from "../../hooks/useScreenWidth";
import Footer from "../../components/Footer/Footer";
import { Filters } from "../../components/Filters/Filters";
import ResultCard from "../../components/ResultCard/ResultCard";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [initResults, setInitResults] = useState([]);
  const [isList, setIsList] = useState(true);
  const [searchParams] = useSearchParams();
  const screenWidth = useScreenWidth();
  const location = useLocation();
  const state = location.state;

  useEffect(() => {
    if (screenWidth < 621) {
      setIsList(false);
    }
    fetchHotels();
  }, [searchParams]);

  const fetchHotels = async () => {
    const checkInDate = searchParams.get("checkInDate") || "";
    const checkOutDate = searchParams.get("checkOutDate") || "";

    const res = await fetchHotelsSearchResult({
      city: searchParams.get("place") || state?.place,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      minPax: searchParams.get("pax"),
    });
    const data =
      res?.[0]?.documents?.map((item: any) => {
        return {
          ...item,
          totalNights: getTotalNights(checkOutDate, checkInDate),
        };
      }) || [];
    setInitResults(data);
    setResults(data);
  };

  const filterData = (data: any) => {
    const filters = Object.keys(data).filter((key: string) => {
      return data[key].checked;
    });
    if (filters.length == 0) {
      setResults(initResults);
      return;
    }
    const newResults = initResults.filter((res: any) => {
      return filters.some((filter: string) =>
        res.type?.toLowerCase().includes(filter.toLowerCase())
      );
    });
    setResults(newResults);
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
          <div className="d-block d-md-none d-lg-block col-lg-3">
            <Filters onChangeFilter={filterData} />
          </div>
          <div className="col col-lg-9">
            <div className="row">
              <div className="col-12 col-md-9 d-flex justify-content-start ms-md-0 ps-md-0">
                <h5 className="fw-bold">
                  {toTitleCase(searchParams.get("place") || "")}:{" "}
                  {results.length} properties found
                </h5>
              </div>
              <div className="d-none d-md-flex col-md-3 justify-content-end">
                <ToggleButtonGroup
                  color="primary"
                  value={isList}
                  exclusive
                  onChange={(event: any, data: boolean) => {
                    if (data !== null) {
                      setIsList(data);
                    }
                  }}
                  aria-label="isList"
                  sx={{
                    backgroundColor: "#ddd",
                    borderRadius: "8px",
                    padding: "5px",
                    "& .MuiToggleButton-root": {
                      color: "black",
                      border: "1px solid #ddd",
                      "&.Mui-selected": {
                        backgroundColor: "#fff",
                        color: "var(--primary-color)",
                        fontWeight: "bold",
                      },
                    },
                  }}
                >
                  <ToggleButton
                    sx={{
                      fontSize: "12px !important",
                      padding: "5px 8px",
                      "&:hover": {
                        backgroundColor: "#ddd",
                      },
                    }}
                    value={true}
                  >
                    List
                  </ToggleButton>
                  <ToggleButton
                    sx={{
                      fontSize: "12px !important",
                      padding: "5px 8px",
                    }}
                    value={false}
                  >
                    Grid
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <div className="col-12 py-3">
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div
                        className={clsx({
                          "col-12": isList || (!isList && screenWidth < 621),
                          "col-4": !isList,
                          "px-4": !isList && screenWidth < 621,
                        })}
                      >
                        {results.map((data: any, idx: number) => {
                          return (
                            <ResultCard
                              key={idx}
                              data={{
                                ...data,
                                targetPax: searchParams.get("pax"),
                                isList: isList,
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SearchResults;
