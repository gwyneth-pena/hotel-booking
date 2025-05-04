import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import "./Navbar.css";
import useScreenWidth from "../../hooks/useScreenWidth";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const avatarMenuRef: any = useRef(null);
  const screenWidth = useScreenWidth();

  const toggleOffcanvas = (isOpen: boolean = true) => {
    const backdrop: any = document.querySelector(".offcanvas-backdrop");
    if (backdrop) {
      backdrop.style.display = isOpen ? "block" : "none";
    }
    setIsOffcanvasVisible(isOpen);
  };

  useEffect(() => {
    if (screenWidth < 621) {
      setHideOverlay(false);
    } else {
      setHideOverlay(true);
    }
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary py-2 py-md-3">
        <div className="container d-flex justify-content-between">
          <a className="navbar-brand text-white" href="/">
            ComfyCorners
          </a>
          {!isAuthenticated ? (
            <div className="collapse navbar-collapse d-sm-none">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <button type="button" className="btn me-3">
                  Register
                </button>
                <Link to="/login" className="btn">
                  Sign in
                </Link>
              </ul>
            </div>
          ) : (
            <div className="flex justify-content-end">
              {hideOverlay && (
                <>
                  <p
                    className="bg-primary text-white fw-bold m-0 p-0 cursor-pointer no-outline border-0"
                    onClick={(e) => avatarMenuRef.current.toggle(e)}
                  >
                    <i className="ti ti-user me-2"></i>
                    {user?.firstName}
                  </p>
                  <OverlayPanel ref={avatarMenuRef}>
                    <div className="py-2 px-4">
                      <p className="my-1 p-0 cursor-pointer" onClick={logout}>
                        <i className="ti ti-logout me-2" /> Logout
                      </p>
                    </div>
                  </OverlayPanel>
                </>
              )}
            </div>
          )}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvas"
            onClick={() => {
              toggleOffcanvas(true);
            }}
            aria-expanded={isOffcanvasVisible}
            aria-label="Toggle navigation"
          >
            <i className="ti ti-menu-2"></i>
          </button>
        </div>
      </nav>
      <div
        className={`offcanvas offcanvas-start ${
          isOffcanvasVisible ? "show" : ""
        }`}
        id="offcanvas"
        aria-labelledby="offcanvasLabel"
        style={{ visibility: isOffcanvasVisible ? "visible" : "hidden" }}
      >
        <div className="offcanvas-header bg-primary">
          <h5 className="offcanvas-title text-white" id="offcanvasLabel">
            ComfyCorners
          </h5>
          <button
            type="button"
            className="custom-close-btn ms-auto"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="ti ti-x"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <p className="text-primary fw-bold mx-0 px-0 no-outline border-0">
            <i className="ti ti-user me-4"></i>
            {user?.firstName}
          </p>
          {!isAuthenticated ? (
            <>
              {" "}
              <div className="row">
                <Link
                  to="/"
                  onClick={() => {
                    toggleOffcanvas(false);
                  }}
                  className="col-12"
                >
                  <i className="ti ti-home me-4"></i>Main Page
                </Link>
              </div>
              <div className="row">
                <Link
                  to=""
                  onClick={() => {
                    toggleOffcanvas(false);
                  }}
                  className="col-12"
                >
                  <i className="ti ti-users-plus me-4"></i>Register
                </Link>
              </div>
              <div className="row">
                <Link
                  to="/login"
                  onClick={() => {
                    toggleOffcanvas(false);
                  }}
                  className="col-12"
                >
                  <i className="ti ti-login me-4"></i>Sign in
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="row">
                <Link
                  to=""
                  onClick={() => {
                    logout(true);
                    toggleOffcanvas(false);
                  }}
                  className="col-12"
                >
                  <i className="ti ti-logout me-4"></i>Log out
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
