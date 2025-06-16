import { useEffect, useState } from "react";
import "./ForgotPasswordForm.css";
import clsx from "clsx";
import { Alert } from "@mui/material";

const ForgotPasswordForm = ({
  title,
  subtitle,
  passSubmittedInfos,
  isVerified,
  isRegistered,
  message = "",
}: any) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
    otp: "",
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
    <div className="row login-form-container py-5 mt-5">
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
              message.toLowerCase().includes("not") ||
              message.toLowerCase().includes("error") ||
              message.toLowerCase().includes("invalid")
                ? "error"
                : "success"
            }
          >
            {message}
          </Alert>
        )}

        {!isRegistered && (
          <div className="form-group mb-4">
            <label htmlFor="email" className="fw-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
              placeholder="Enter your registered email address"
              autoComplete="username"
              onChange={(e) =>
                setFormState({ ...formState, email: e.target.value })
              }
              required
            />
          </div>
        )}

        {isRegistered && !isVerified && (
          <div className="form-group mb-1">
            <label htmlFor="otp" className="fw-bold mb-2">
              OTP
            </label>
            <input
              type="text"
              name="otp"
              id="otp"
              className="form-control"
              placeholder="Enter 6 digit OTP"
              onChange={(e) =>
                setFormState({ ...formState, otp: e.target.value })
              }
              maxLength={6}
              pattern="\d{6}"
              required
            />
          </div>
        )}

        {isVerified && (
          <>
            <div className="form-group mb-3">
              <label htmlFor="new_password" className="fw-bold mb-2">
                New Password
              </label>
              <div className="input-group mb-2">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="new_password"
                  id="new_password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      new_password: e.target.value?.trim(),
                    })
                  }
                  autoComplete="current-password"
                  minLength={8}
                  required
                />
                <span className="input-group-text">
                  <i
                    onClick={() => {
                      setShowNewPassword(!showNewPassword);
                    }}
                    className={clsx("ti", {
                      "ti-eye": showNewPassword,
                      "ti-eye-closed": !showNewPassword,
                    })}
                  ></i>
                </span>
              </div>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="confirm_password" className="fw-bold mb-2">
                Confirm Password
              </label>
              <div className="input-group mb-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  id="confirm_password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      confirm_password: e.target.value?.trim(),
                    })
                  }
                  autoComplete="current-password"
                  minLength={8}
                  required
                />
                <span className="input-group-text">
                  <i
                    onClick={() => {
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                    className={clsx("ti", {
                      "ti-eye": showConfirmPassword,
                      "ti-eye-closed": !showConfirmPassword,
                    })}
                  ></i>
                </span>
              </div>
            </div>
            {formState.new_password !== formState.confirm_password && (
              <p className="text-danger">Passwords should matched.</p>
            )}
          </>
        )}

        <button
          className={clsx("btn btn-dark-blue w-100 mt-2", {
            "p-2": formState.isLoading,
          })}
          type="submit"
          disabled={
            formState.isLoading ||
            formState.new_password !== formState.confirm_password
          }
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

export default ForgotPasswordForm;
