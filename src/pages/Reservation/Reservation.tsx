import { useEffect, useState } from "react";
import "./Reservation.css";
import { useLocation, useNavigate } from "react-router-dom";
import PhotoGallery from "../../components/PhotoGallery/PhotoGallery";
import { getTotalNights } from "../../utils/strings";
import { toLongDateString } from "../../utils/dates";

const Reservation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!state) {
      navigate("/");
    } else {
      const totalNights =
        getTotalNights(state?.checkOutDate, state?.checkInDate) || 0;
      setTotalNights(totalNights);
      const totalPrice = Object.keys(state?.selectedRooms || {}).reduce(
        (acc: number, key: string) => {
          const room = state.selectedRooms[key];
          return acc + (room?.price || 0);
        },
        0
      );
      setTotalPrice(totalPrice);
    }
  }, [navigate, state]);

  return (
    <div className="booking container pt-4 py-5">
      <div className="row">
        <h4 className="fw-bold mb-5">Booking Details</h4>
      </div>
      <div className="row">
        <div className="col-12 col-md-8">
          <PhotoGallery photos={state?.propertyInfo?.photos?.slice(0, 3)} />
          <h5 className="my-3 fw-bold">{state?.propertyInfo?.name}</h5>
          <p>
            <i className="ti ti-map-pin text-primary"></i>{" "}
            {state?.propertyInfo?.address || "---"}
          </p>
          <div className="card mt-4">
            <div className="card-header">
              <p className="fw-bold">Your Checkin & Checkout Details</p>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <p className="fw-bold">Check-in</p>
                </div>
                <div className="col-6">
                  <p>{toLongDateString(state?.checkInDate)}</p>
                </div>
                <div className="col-6">
                  <p className="fw-bold">Check-out</p>
                </div>
                <div className="col-6">
                  <p>{toLongDateString(state?.checkOutDate)}</p>
                </div>
                <div className="col-6">
                  <p className="fw-bold">Total length of stay</p>
                </div>
                <div className="col-6">
                  <p>
                    {totalNights} {totalNights == 1 ? "night" : "nights"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card mt-3 mt-md-0">
            <div className="card-header">
              <p className="fw-bold">Your Price Summary</p>
            </div>
            <div className="card-body">
              <div className="row">
                {Object.keys(state?.selectedRooms).map((room: any) => {
                  return (
                    <>
                      <div className="col-6">
                        <p>{state?.selectedRooms[room]?.name}</p>
                      </div>
                      <div className="col-6">
                        <p>
                          Php{" "}
                          {state?.selectedRooms[room]?.price?.toLocaleString()}
                        </p>
                      </div>
                      <div className="col-6">
                        <h5 className="fw-bold">Total</h5>
                      </div>
                      <div className="col-6">
                        <h5 className="fw-bold">
                          Php {totalPrice.toLocaleString()}
                        </h5>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="card mt-3 mt-md-4">
            <div className="card-header">
              <p className="fw-bold">Review Your Booking Conditions</p>
            </div>
            <div className="card-body">
              <div className="row px-3">
                <ul>
                  <li>You'll pay securely today</li>
                  <li>Login to your account before you can book this reservation</li>
                  <li>
                    Changes to your personal or booking details won't be
                    possible after your booking is complete
                  </li>
                  <li>The invoice will be issued by our partner company</li>
                </ul>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-dark-blue ms-auto w-100 my-4"
          >
            Confirm Reservation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
