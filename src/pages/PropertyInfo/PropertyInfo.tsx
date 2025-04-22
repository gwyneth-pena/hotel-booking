import { useParams, useSearchParams, useLocation } from "react-router-dom";
import "./PropertyInfo.css";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import config from "../../config";
import SearchBox from "../../components/SearchBox/SearchBox";
import { getTotalNights } from "../../utils/strings";

const PropertyInfo = () => {
  const apiURL = config.apiUrl;
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const [propertyInfo, setPropertyInfo] = useState<any>(undefined);

  const propertyInfoReq = useAxios(
    "GET",
    `${apiURL}/hotels?field=_id&values=${id}&withRoomInfo=true`
  );

  useEffect(() => {
    const propertyInfoRes: any = propertyInfoReq.response;
    const checkInDate = searchParams.get("checkInDate") || "";
    const checkOutDate = searchParams.get("checkOutDate") || "";

    if (propertyInfoRes) {
      const info = propertyInfoRes[0]?.documents?.[0];
      const totalNights = getTotalNights(checkOutDate, checkInDate);
      setPropertyInfo({ ...info, totalNights });
    }
  }, [propertyInfoReq.response]);

  return (
    <>
      <Helmet>
        <title>
          Book your stay in {propertyInfo?.name || "---"} | ComfyCorners
        </title>
        <meta
          name="description"
          content={`Book your stay in ${propertyInfo?.name || "---"}`}
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

      <div className="container info-container py-3">
        <div className="row">
          <div className="col">
            <h3 className="fw-bold">{propertyInfo?.name || "---"}</h3>
            <p>
              <i className="ti ti-map-pin text-primary"></i>{" "}
              {propertyInfo?.address || "---"}
            </p>
          </div>
        </div>
        <div className="row mb-3">
          {propertyInfo?.photos?.length === 0 && (
            <div className="col">
              <div>No photos available.</div>
            </div>
          )}
          {propertyInfo?.photos?.map((photo: any, idx: number) => {
            return (
              <div className="col-3">
                <img key={idx} alt={propertyInfo?.name + "-idx"} src={photo} />
              </div>
            );
          })}
        </div>
        <div className="row mb-3">
          <div className="col">
            <p>{propertyInfo?.description || "---"}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col table-responsive">
            <h5 className="fw-bold mb-4">Available Rooms</h5>
            <table className="info-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Number of guests</th>
                  <th>
                    Price for {propertyInfo?.totalNights}{" "}
                    {propertyInfo?.totalNights > 1 ? "nights" : "night"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {propertyInfo?.availableRooms.map((room: any) => {
                  return (
                    <tr>
                      <td>
                        <p className="text-primary fw-bold">{room.name} </p>
                        {room.description}
                      </td>
                      <td>{room.maxPeople}</td>
                      <td className="fw-bold">
                        Php {(propertyInfo?.totalNights * parseInt(room.price)).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyInfo;
