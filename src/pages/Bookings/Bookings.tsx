import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { useEffect, useState } from "react";
import "./Bookings.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import config from "../../config";
import { useAuth } from "../../context/AuthContext";
import BookingInfo from "../../components/BookingInfo/BookingInfo";
import { useModal } from "react-modal-hook";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { Helmet } from "react-helmet-async";

const Bookings = () => {
  const apiUrl = config.apiUrl;
  const { user } = useAuth();
  const localizer = momentLocalizer(moment);
  const [bookingsMapped, setBookingsMapped] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [modalInfoData, setModalInfoData] = useState<any>(null);
  const [view, setView] = useState<any>(Views.MONTH);
  const [loading, setLoading] = useState(false);

  const [showModal, hideModal] = useModal(() => {
    return <BookingInfo hideModal={hideModal} data={modalInfoData} />;
  }, [modalInfoData]);

  useEffect(() => {
    const currentDate = new Date();
    getBookings(currentDate);
  }, []);

  const getBookings = async (date: Date) => {
    const [monthStart, monthEnd] = getStartAndEndMonth(date);

    try {
      setLoading(true);
      const bookingsResponse = await axios(`${apiUrl}/booking/my-data`, {
        params: {
          userId: user.id,
          fromDate: monthStart,
          toDate: monthEnd,
        },
      });

      setBookings(bookingsResponse.data);

      const bookingsMapped = bookingsResponse.data.map((booking: any) => {
        return {
          title: booking.bookedRooms[0].hotel.name,
          start: new Date(booking.bookedRooms[0].checkInDate),
          end: new Date(booking.bookedRooms[0].checkOutDate),
          id: booking._id,
        };
      });

      setBookingsMapped(bookingsMapped);
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

  const getBookingInfo = (bookingId: string) => {
    return bookings.find((booking: any) => booking._id === bookingId);
  };

  const handleSelectEvent = (event: any) => {
    const bookingInfo = getBookingInfo(event.id);
    setModalInfoData(bookingInfo);
    showModal();
  };

  const handleShowMore = () => {
    setView(Views.AGENDA);
  };

  return (
    <>
      <Helmet>
        <title>My Bookings | ComfyCorners</title>
        <meta name="description" content="My Bookings" />
      </Helmet>
      <div className="container py-5">
        <h4>My Bookings</h4>

        <div className="row mt-5 h-full" style={{ height: "600px" }}>
          <div className="col">
            <Calendar
              events={bookingsMapped}
              localizer={localizer}
              onNavigate={(date: Date) => {
                getBookings(date);
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
        {loading && <LoadingOverlay />}
      </div>
    </>
  );
};

export default Bookings;
