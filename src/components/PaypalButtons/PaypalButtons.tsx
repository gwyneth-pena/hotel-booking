import { useEffect, useRef, useState } from "react";
import "./PaypalButtons.css";
import { useAuth } from "../../context/AuthContext";
import { Toast } from "primereact/toast";
import config from "../../config";

declare global {
  interface Window {
    paypal: any;
  }
}

const PaypalButtons = ({ data }: { data: any }) => {
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const { isAuthenticated } = useAuth();
  const toast: any = useRef(null);
  const clientId = config.paypalClientId;

  useEffect(() => {
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => console.error("Failed to load PayPal SDK");

    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (
      window.paypal &&
      paypalLoaded &&
      !paypalButtonRendered &&
      data.totalPrice > 0 &&
      isAuthenticated
    ) {
      window.paypal
        .Buttons({
          createOrder: (_: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: data.totalPrice.toString(),
                  },
                },
              ],
            });
          },
          onApprove: (_: any, actions: any) => {
            return actions.order.capture().then(() => {
              console.log(data);
            });
          },
          onError: (err: any) => {
            console.error("PayPal Checkout Error:", err);
            toast.current.show({
              severity: "error",
              detail: "Something wrong please try again later",
              life: 3000,
            });
          },
        })
        .render("#paypal-button-container");
      setPaypalButtonRendered(true);
    }
  }, [data]);
  return (
    <>
      <div id="paypal-button-container" className="mt-4"></div>
      <Toast className="p-4" ref={toast} />
    </>
  );
};

export default PaypalButtons;
