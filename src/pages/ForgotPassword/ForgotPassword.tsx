import { Helmet } from "react-helmet-async";
import "./ForgotPassword.css";
import ForgotPasswordForm from "../../components/ForgotPasswordForm/ForgotPasswordForm";
import axios from "axios";
import config from "../../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const apiURL = config.apiUrl;
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const generateOTP = async (email: string) => {
    try {
      const res = await axios.post(`${apiURL}/users/forgot-password/otp`, {
        email,
      });
      const data = res.data;
      const message = data.message;
      if (message) {
        setIsRegistered(true);
        setMessage(message);
      }
    } catch (e: any) {
      setIsRegistered(false);
      setMessage(e.response.data.message);
    }
  };

  const verifyOTP = async (otp: string, email: string) => {
    try {
      const res = await axios.post(`${apiURL}/users/forgot-password/verify`, {
        otp,
        email,
      });
      const data = res.data;
      const isVerified = data.isVerified;
      setIsVerified(isVerified);
      if (!isVerified) {
        setMessage("Invalid OTP. Try again.");
        return;
      }
      setMessage("You can now change your password.");
      setResetToken(data.resetToken);
    } catch (e: any) {
      console.error(e);
    }
  };

  const changePassword = async (password: any, token: any, email: any) => {
    try {
      const res = await axios.post(`${apiURL}/users/forgot-password/reset`, {
        email,
        token,
        password,
      });

      const data = res.data;
      const message = data.message;
      if (message) {
        setIsRegistered(false);
        setIsVerified(false);
        setMessage(message);
        navigate("/login");
      }
    } catch (e: any) {
      setMessage(e.response.data.message);
    }
  };

  const getSumittedInfos = (e: any, data: any) => {
    e.preventDefault();
    const { email, otp, new_password } = data;
    setMessage("");

    if (email && !otp && !new_password) {
      generateOTP(email);
    }
    if (otp && email && !new_password) {
      verifyOTP(otp, email);
    }
    if (new_password) {
      changePassword(new_password, resetToken, email);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | ComfyCorners</title>
        <meta name="description" content="Change your password" />
      </Helmet>
      <div className="container d-flex align-items-center justify-content-center">
        <ForgotPasswordForm
          title={"Change Password"}
          subtitle={
            "Please change your password to regain access to your account."
          }
          message={message}
          passSubmittedInfos={getSumittedInfos}
          isRegistered={isRegistered}
          isVerified={isVerified}
        />
      </div>
    </>
  );
};

export default ForgotPassword;
