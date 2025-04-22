import { Helmet } from "react-helmet-async";
import "./Login.css";
import { useState } from "react";
import clsx from "clsx";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="row login-form-container py-5 mt-5">
          <div className="col-12 mb-3">
            <h4 className="fw-bold">Sign in</h4>
            <p>You can sign in using your account to access our services.</p>
          </div>
          <form className="col-12">
            <div className="form-group mb-4">
              <label htmlFor="email" className="fw-bold mb-2">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                placeholder="Enter your email address"
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password" className="fw-bold mb-2">
                Password
              </label>
              <div className="input-group mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter password"
                />
                <span className="input-group-text">
                  <i
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    className={clsx("ti", {
                      "ti-eye": showPassword,
                      "ti-eye-closed": !showPassword,
                    })}
                  ></i>
                </span>
              </div>
            </div>
            <button className="btn btn-dark-blue w-100" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
