import { Helmet } from "react-helmet-async";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { useModal } from "react-modal-hook";
import GuestReservationInfo from "../../components/GuestReservationInfo/GuestReservationInfo";

const ReservationMasterList = () => {
  const apiURL = config.apiUrl;
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState("");
  const localizer = momentLocalizer(moment);
  const [hotels, setHotels] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [view, setView] = useState<any>(Views.MONTH);
  const [reservationsMapped, setReservationsMapped] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalInfoData, setModalInfoData] = useState<any>();

  useEffect(() => {
    getHotels();
  }, []);

  useEffect(() => {
    getReservations(selectedDate);
  }, [selectedHotel, selectedDate]);

  const [showModal, hideModal] = useModal(() => {
    return <GuestReservationInfo hideModal={hideModal} data={modalInfoData} />;
  }, [modalInfoData]);

  const getReservations = async (date: Date) => {
    const [monthStart, monthEnd] = getStartAndEndMonth(date);

    try {
      setLoading(true);
      const reservationResponse = await axios(`${apiURL}/booking`, {
        params: {
          hotelId: selectedHotel,
          fromDate: monthStart,
          toDate: monthEnd,
        },
      });

      setReservations(reservationResponse.data);

      const reservationsMapped = reservationResponse.data.map(
        (reservation: any) => {
          const roomName = reservation.bookedRooms[0].rooms
            .map((room: any) => room.room.name)
            .join(", ");

          return {
            title: `${reservation.user.firstName} ${reservation.user.lastName} - ${reservation.bookedRooms[0].hotel.name} (${roomName})`,
            start: new Date(reservation.bookedRooms[0].checkInDate),
            end: new Date(reservation.bookedRooms[0].checkOutDate),
            id: reservation._id,
          };
        }
      );

      setReservationsMapped(reservationsMapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStartAndEndMonth = (date: Date) => {
    const monthStart = format(startOfMonth(date), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(date), "yyyy-MM-dd");
    return [monthStart, monthEnd];
  };

  const getHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/hotels`);
      setHotels(response.data);
    } catch (e) {
      console.error(e);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (event: any) => {
    const reservation = reservations.find((res: any) => res._id == event.id);
    setModalInfoData(reservation);
    showModal();
  };

  const handleShowMore = () => {
    setView(Views.AGENDA);
  };

  return (
    <>
      <Helmet>
        <title>Reservation Masterlist | ComfyCorners</title>
        <meta name="description" content="Reservation Masterlist" />
      </Helmet>
      <div className="container py-5">
        <h4>Reservation Masterlist</h4>
        <div className="row my-5">
          <div className="col-12">
            <div className="form-group mb-3 col-3">
              <label htmlFor="hotel" className="fw-bold mb-2">
                Hotel:
              </label>
              <select
                className="form-control"
                name="hotel"
                value={selectedHotel}
                onChange={(e: any) => {
                  setSelectedHotel(e.target.value || "");
                }}
                id="hotel"
              >
                <option value="">All</option>
                {hotels.map((hotel: any, idx: number) => {
                  return (
                    <option key={idx} value={hotel._id}>
                      {hotel.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
        <div className="row mt-5 h-full" style={{ height: "600px" }}>
          <div className="col">
            <Calendar
              events={reservationsMapped}
              localizer={localizer}
              onNavigate={(date: Date) => {
                setSelectedDate(date);
                getReservations(date);
              }}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              views={["month", "agenda"]}
              onSelectEvent={handleSelectEvent}
              onShowMore={handleShowMore}
            />
          </div>
        </div>
        <div className="row mt-5 h-full" style={{ height: "600px" }}></div>
        {loading && <LoadingOverlay />}
      </div>
    </>
  );
};

export default ReservationMasterList;
