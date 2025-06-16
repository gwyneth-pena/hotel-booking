import clsx from "clsx";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import "./SignUpForm.css";

const SignUpForm = ({
  title,
  subtitle,
  passSubmittedInfos,
  message = "",
}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    username: "",
    password: "",
    isLoading: false,
  });

  useEffect(() => {
    if (message !== "") {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [message]);

  return (
    <div className="row signup-form-container py-5">
      <div className="col-12 mb-3">
        <h4 className="fw-bold">{title}</h4>
        <p>{subtitle}</p>
      </div>
      <form
        className="col-12"
        onSubmit={(e) => {
          setFormState({ ...formState, isLoading: true });
          passSubmittedInfos(e, formState);
        }}
      >
        {message != "" && (
          <Alert
            className="mb-4"
            severity={
              message.toLowerCase().includes("invalid") ? "error" : "success"
            }
          >
            {message}
          </Alert>
        )}
        <div className="form-group mb-4">
          <label htmlFor="firstName" className="fw-bold mb-2">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            id="firstName"
            placeholder="Enter your first name"
            onChange={(e) =>
              setFormState({ ...formState, firstName: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="lastName" className="fw-bold mb-2">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            id="lastName"
            placeholder="Enter your last name"
            onChange={(e) =>
              setFormState({ ...formState, lastName: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="mobileNumber" className="fw-bold mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            className="form-control"
            name="mobileNumber"
            id="mobileNumber"
            placeholder="Enter your mobile number"
            onChange={(e) =>
              setFormState({ ...formState, mobileNumber: e.target.value })
            }
          />
        </div>

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
            autoComplete="username"
            onChange={(e) =>
              setFormState({ ...formState, username: e.target.value })
            }
            required
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
              onChange={(e) =>
                setFormState({ ...formState, password: e.target.value })
              }
              autoComplete="current-password"
              minLength={8}
              required
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
        <button
          className={clsx("btn btn-dark-blue w-100", {
            "p-2": formState.isLoading,
          })}
          type="submit"
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <img className="loader" src="/images/loader.gif" />
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
