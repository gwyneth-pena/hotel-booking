import { useEffect, useRef, useState } from "react";
import "./PaypalButtons.css";
import { useAuth } from "../../context/AuthContext";
import { Toast } from "primereact/toast";
import config from "../../config";
import axios from "axios";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    paypal: any;
  }
}

const PaypalButtons = ({ data }: { data: any }) => {
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const toast: any = useRef(null);
  const clientId = config.paypalClientId;
  const apiURL = config.apiUrl;
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.paypal) {
      loadPaypalScript();
    } else {
      setPaypalLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (
      window.paypal &&
      isAuthenticated &&
      paypalLoaded &&
      !paypalButtonRendered
    ) {
      window.paypal
        .Buttons({
          createOrder,
          onApprove: onPaypalApprove,
          onError: onPaypalError,
        })
        .render("#paypal-button-container");
      setPaypalButtonRendered(true);
    }
  }, [paypalLoaded, paypalButtonRendered, isAuthenticated]);

  const loadPaypalScript = () => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&currency=PHP`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => console.error("Failed to load PayPal SDK");

    document.body.appendChild(script);
  };

  const createOrder = (_: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "PHP",
            value: data.totalPrice.toString(),
          },
        },
      ],
    });
  };

  const onPaypalApprove = async (_: any, actions: any) => {
    const rooms = await getAllAvailableRooms();
    const requests = prepareBookedRoomsRequests(rooms);
    actions.order
      .capture()
      .then(() => {
        saveBooking(requests);
      })
      .catch(onPaypalError);
  };

  const onPaypalError = (err: any) => {
    console.error("PayPal Checkout Error:", err);
    showErrorMessage();
  };

  const prepareBookedRoomsRequests = (availableRooms: any) => {
    availableRooms = availableRooms.reduce((acc: any, item: any) => {
      acc[item._id] = item;
      return acc;
    }, {});

    const hotelId = data.state.propertyInfo._id;
    const checkIn = data.state.checkInDate;
    const checkOut = data.state.checkOutDate;
    const selectedRooms = data.state.selectedRooms;
    let roomsRequest: any[] = [];

    Object.keys(selectedRooms).forEach((roomId: any) => {
      const roomInfo = {
        room: roomId,
        roomNumbers: availableRooms[roomId].roomNumbers
          .slice(0, selectedRooms[roomId].number)
          .map((num: any) => num.number),
      };
      roomsRequest.push(roomInfo);
    });

    const requests = {
      user: user.id,
      status: "CONFIRMED",
      rooms: [
        {
          hotel: hotelId,
          rooms: roomsRequest,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          totalPrice: data.totalPrice,
        },
      ],
    };

    return requests;
  };

  const showErrorMessage = () => {
    toast.current.show({
      severity: "error",
      detail: "Something wrong please try again later",
      life: 3000,
    });
  };

  const saveBooking = async (request: any) => {
    setLoading(true);
    try {
      
      if (user.isAdmin) {
        showErrorMessage();
        return;
      }

      const response = await axios.post(`${apiURL}/booking`, request);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          detail: "Booking confirmed.",
          life: 5000,
        });
        window.history.replaceState(null, "", window.location.pathname);
        navigateToBookings();
      }
    } catch (error) {
      console.error(error);
      showErrorMessage();
    } finally {
      setLoading(false);
    }
  };

  const navigateToBookings = () => {
    setTimeout(() => {
      navigate("/bookings");
    }, 3000);
  };

  const getAllAvailableRooms = async () => {
    setLoading(true);
    try {
      const selectedRooms = data.state.selectedRooms || [];
      const checkIn = data.state.checkInDate;
      const checkOut = data.state.checkOutDate;
      const requests: any = [];
      Object.keys(selectedRooms).map((key: string) => {
        requests.push(getAvailableRooms(key, checkIn, checkOut));
      });

      return await Promise.all(requests).then((data: any) => {
        if (
          data.every(
            (room: any) =>
              room.roomNumbers.length == 0 &&
              room.roomNumbers.length >= selectedRooms[room._id].number
          )
        ) {
          showErrorMessage();
          return [];
        } else {
          return data;
        }
      });
    } catch (e) {
      showErrorMessage();
    } finally {
      setLoading(false);
    }
  };

  const getAvailableRooms = (
    roomId: string,
    checkInDate: string,
    checkOutDate: string
  ) => {
    return new Promise(async (resolve) => {
      const response = await axios.get(`${apiURL}/rooms/${roomId}`, {
        params: {
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
        },
      });
      resolve(response.data);
    });
  };

  return (
    <>
      <div id="paypal-button-container" className="mt-4"></div>
      <Toast className="p-4" ref={toast} />
      {loading && <LoadingOverlay />}
    </>
  );
};

export default PaypalButtons;
