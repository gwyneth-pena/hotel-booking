import { Helmet } from "react-helmet-async";
import "./Property.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import AdminPropertyInfo from "../../components/AdminPropertyInfo/AdminPropertyInfo";
import Rooms from "../../components/Rooms/Rooms";

const Property = () => {
  const apiURL = config.apiUrl;
  const [propertyInfo, setPropertyInfo] = useState<any | null>(null);
  const [tab, setTab] = useState("info");
  const { id } = useParams();

  useEffect(() => {
    getPropertyInfo(id);
  }, []);

  const getPropertyInfo = async (id: string | undefined) => {
    try {
      if (!id) {
        setPropertyInfo(null);
        return;
      }

      const res = await axios.get(`${apiURL}/hotels/${id}?withRoomInfo=true`);
      if (res.status !== 200) {
        setPropertyInfo(null);
        return;
      }

      setPropertyInfo(res.data);
    } catch (error) {
      console.error(error);
      setPropertyInfo(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>{propertyInfo?.name || "--"} | ComfyCorners</title>
        <meta name="description" content={`${propertyInfo?.name || "--"}`} />
      </Helmet>

      <div className="container info-container py-3">
        <div className="row">
          <div className="col">
            <h3 className="fw-bold">
              <Link to={"/properties"}>
                <i className="ti ti-arrow-narrow-left"></i>
              </Link>{" "}
              {propertyInfo?.name || "---"}
            </h3>
            <p>
              <i className="ti ti-map-pin text-primary"></i>{" "}
              {propertyInfo?.address || "---"}
            </p>
          </div>
        </div>

        <div className="row property-tab">
          <div className="col-3">
            <nav>
              <li
                onClick={() => {
                  setTab("info");
                  getPropertyInfo(id);
                }}
                className={tab === "info" ? "active" : ""}
              >
                Property Info
              </li>
              <li
                onClick={() => setTab("rooms")}
                className={tab === "rooms" ? "active" : ""}
              >
                Rooms
              </li>
            </nav>
          </div>
          <div className="col-9 mt-3 mb-5">
            {tab == "info" && <AdminPropertyInfo data={propertyInfo} />}
            {tab == "rooms" && (
              <Rooms propertyId={id} rooms={propertyInfo.rooms} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Property;
