import { Helmet } from "react-helmet-async";
import "./Login.css";
import LoginForm from "../../components/LoginForm/LoginForm";
import config from "../../config";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const apiURL = config.apiUrl;
  const [loginMsg, setLoginMsg] = useState<string>("");
  const { login } = useAuth();
  const getSumittedInfos = (e: any, data: any) => {
    e.preventDefault();
    submitData(data);
  };

  const submitData = async (data: { email: string; password: string }) => {
    const { email, password } = data;
    try {
      setLoginMsg("");
      const response = await axios.post(`${apiURL}/auth/login`, {
        username: email,
        password,
      });
      setLoginMsg(response.data.message);
      const { token, firstName, lastName } = response.data.data;
      login({
        token,
        user: { firstName, lastName },
      }, true);
    } catch (e) {
      setLoginMsg("Invalid login credentials.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | ComfyCorners</title>
        <meta
          name="description"
          content="Sign in to book affordable stays anywhere in the Philippines."
        />
      </Helmet>
      <div className="container d-flex align-items-center justify-content-center">
        <LoginForm
          title="Sign in"
          subtitle="You can sign in using your account to access our services."
          message={loginMsg}
          passSubmittedInfos={getSumittedInfos}
        />
      </div>
    </>
  );
};

export default Login;
