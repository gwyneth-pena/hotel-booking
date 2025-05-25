import { Helmet } from "react-helmet-async";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import config from "../../config";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const apiURL = config.apiUrl;
  const [signUpMessage, setSignUpMessage] = useState<string>("");
  const { login } = useAuth();

  const getSumittedInfos = (e: any, data: any) => {
    e.preventDefault();
    submitData(data);
  };

  const submitData = async (data: any) => {
    try {
      setSignUpMessage("");
      const signUpRes = await axios.post(`${apiURL}/auth/signup`, data);
      setSignUpMessage(signUpRes.data.message);

      const response = await axios.post(`${apiURL}/auth/login`, {
        username: data.username,
        password: data.password,
      });

      const { token, firstName, lastName, id } = response.data.data;
      login(
        {
          token,
          user: { firstName, lastName, id },
        },
        true
      );
    } catch (e) {
      setSignUpMessage("Invalid. User already exists.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | ComfyCorners</title>
        <meta
          name="description"
          content="Register to book affordable stays anywhere in the Philippines."
        />
      </Helmet>
      <div className="container d-flex align-items-center justify-content-center">
        <SignUpForm
          title="Register"
          subtitle="Sign up today and find your perfect stay."
          message={signUpMessage}
          passSubmittedInfos={getSumittedInfos}
        />
      </div>
    </>
  );
};

export default SignUp;
