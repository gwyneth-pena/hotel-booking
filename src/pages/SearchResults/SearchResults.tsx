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

  const handleOnChangeFilter = (data: any) => {
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
            <Filters onChangeFilter={handleOnChangeFilter} />
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
                            <div
                              key={idx}
                              className={clsx("row result-card", {
                                "d-flex": !isList,
                                "flex-column": !isList,
                              })}
                            >
                              <div
                                className={clsx("col-4 image", {
                                  "col-12": !isList,
                                })}
                              >
                                <img
                                  src={
                                    data.photos?.length > 0
                                      ? data.photos[0]
                                      : "/src/assets/images/default-img.jpg"
                                  }
                                  alt={data?.name}
                                  width={"100%"}
                                />
                              </div>
                              <div
                                className={clsx("col-6 body", {
                                  "col-12": !isList,
                                })}
                              >
                                <p
                                  className={clsx("title", {
                                    "mt-2": !isList,
                                  })}
                                >
                                  {toTitleCase(data?.name)}
                                </p>
                                <p className="address">
                                  {toTitleCase(data?.address)}
                                </p>
                                <div className="desc">
                                  {data.availableRooms?.map(
                                    (room: any, idx: number) => {
                                      return (
                                        <p key={idx}>
                                          <span className="bg-dirty-white p-1 me-2">
                                            {room.maxPeople + "x"}
                                          </span>
                                          {room.description}
                                        </p>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                              <div
                                className={clsx("col-2", {
                                  "col-12 d-flex justify-content-between":
                                    !isList,
                                })}
                              >
                                <div
                                  className={clsx("d-flex", {
                                    "justify-content-end": isList,
                                    "justify-content-start mt-3": !isList,
                                  })}
                                >
                                  <p>
                                    <span className="rating-text">
                                      Very Good
                                    </span>
                                    <span className="text-end rating">
                                      {data?.rating || 0}/5
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  <p className="purchase">
                                    {data?.totalNights}{" "}
                                    {data?.totalNights > 1 ? "nights" : "night"}
                                    , {searchParams.get("pax")}{" "}
                                    {parseInt(searchParams.get("pax") || "1") >
                                    1
                                      ? "adults"
                                      : "adult"}
                                  </p>
                                  <p className="price">
                                    Php{" "}
                                    {data?.availableRooms[0]?.price *
                                      data?.totalNights}
                                  </p>
                                  <button
                                    className={clsx("link", {
                                      "d-none": !isList,
                                    })}
                                  >
                                    See Availability{" "}
                                    <i className="ti ti-chevrons-right"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
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
