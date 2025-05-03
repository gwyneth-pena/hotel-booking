import { useParams, useSearchParams, useLocation } from "react-router-dom";
import "./PropertyInfo.css";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import config from "../../config";
import SearchBox from "../../components/SearchBox/SearchBox";
import { getTotalNights } from "../../utils/strings";
import Footer from "../../components/Footer/Footer";
import { useModal } from "react-modal-hook";
import RoomInfo from "../../components/RoomInfo/RoomInfo";
import PhotoGallery from "../../components/PhotoGallery/PhotoGallery";
import { Dropdown } from "primereact/dropdown";

const PropertyInfo = () => {
  const apiURL = config.apiUrl;
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const [propertyInfo, setPropertyInfo] = useState<any>(undefined);
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(
    {}
  );

  const propertyInfoReq = useAxios(
    "GET",
    `${apiURL}/hotels?field=_id&values=${id}&withRoomInfo=true`
  );

  const [modalRoomData, setModalRoomData] = useState(null);
  const [modalType, setModalType] = useState("room");

  const [showModal, hideModal] = useModal(() => {
    switch (modalType) {
      case "room":
        return <RoomInfo hideModal={hideModal} data={modalRoomData} />;
      // case "reserve":
      //   return <ReservationInfo hideModal={hideModal} data={reserveData} />;
      default:
        return null;
    }
  }, [modalType, modalRoomData]);

  const handleRoomClick = (room: any) => {
    setModalType("room");
    setModalRoomData(room);
    showModal();
  };

  const handleReservationClick = () => {
    console.log(selectedRooms);
  };

  const generateChoiceRooms = (rooms: any, price: number) => {
    let choices = [{ label: "0", number: 0, price: 0 }];
    rooms.forEach((_: any, idx: number) => {
      const number = idx + 1;
      const totalPrice = price * number;
      choices.push({
        label: `${number} (Php ${totalPrice.toLocaleString()})`,
        number: number,
        price: totalPrice,
      });
    });
    return choices;
  };

  useEffect(() => {
    const propertyInfoRes: any = propertyInfoReq.response;
    const checkInDate = searchParams.get("checkInDate") || "";
    const checkOutDate = searchParams.get("checkOutDate") || "";

    if (propertyInfoRes) {
      const info = propertyInfoRes[0]?.documents?.[0];
      const totalNights = getTotalNights(checkOutDate, checkInDate);
      setPropertyInfo({ ...info, totalNights });
      const initialSelectedRooms: any = {};
      info.availableRooms.forEach((room: any) => {
        initialSelectedRooms[room._id] = { label: "0", number: 0, price: 0 };
      });
      setSelectedRooms(initialSelectedRooms);
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
          <div className="my-2">
            <PhotoGallery photos={propertyInfo?.photos} />
          </div>
        </div>
        <div className="row mb-3">
          <div
            className="col"
            dangerouslySetInnerHTML={{
              __html: propertyInfo?.description || "---",
            }}
          ></div>
        </div>
        <div className="row mb-3">
          <div className="col table-responsive">
            <h5 className="fw-bold mb-4">Available Rooms</h5>
            <table className="info-table">
              <thead>
                <tr>
                  <th className="col-3">Room</th>
                  <th className="col-2">Number of guests</th>
                  <th className="col-2">
                    Price for {propertyInfo?.totalNights}{" "}
                    {propertyInfo?.totalNights > 1 ? "nights" : "night"}
                  </th>
                  <th className="col-2">Select number of rooms</th>
                  <th className="col-3"></th>
                </tr>
              </thead>
              <tbody>
                {propertyInfo?.availableRooms.map((room: any, idx: number) => {
                  return (
                    <tr key={idx}>
                      <td className="align-top">
                        <a
                          className="text-primary fw-bold cursor-pointer"
                          onClick={() => {
                            handleRoomClick(room);
                          }}
                        >
                          {room.name}{" "}
                        </a>
                        <br />
                        <div
                          className="mt-3"
                          dangerouslySetInnerHTML={{ __html: room.description }}
                        ></div>
                      </td>
                      <td className="align-top">{room.maxPeople}</td>
                      <td className="fw-bold align-top">
                        Php{" "}
                        {(
                          propertyInfo?.totalNights * parseInt(room.price)
                        ).toLocaleString()}
                      </td>
                      <td className="align-top">
                        <Dropdown
                          value={selectedRooms[room._id]}
                          onChange={(e) =>
                            setSelectedRooms((prev) => ({
                              ...prev,
                              [room._id]: e.value,
                            }))
                          }
                          options={generateChoiceRooms(
                            room.roomNumbers,
                            room.price
                          )}
                          optionLabel="label"
                          className="w-full md:w-14rem"
                        />
                      </td>
                      <td
                        className="align-top"
                        rowSpan={propertyInfo?.availableRooms.length}
                      >
                        {idx == 0 && (
                          <button
                            onClick={handleReservationClick}
                            className="btn btn-dark-blue w-100"
                            type="button"
                          >
                            I'll reserve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PropertyInfo;
