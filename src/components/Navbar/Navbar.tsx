import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import useScreenWidth from "../../hooks/useScreenWidth";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const avatarMenuRef = useRef<OverlayPanel>(null);
  const screenWidth = useScreenWidth();
  const navigate = useNavigate();

  useEffect(() => {
    setHideOverlay(screenWidth >= 621);
  }, [screenWidth]);

  const handleNav = (path: string) => {
    toggleOffcanvas(false);
    navigate(path);
  };

  const toggleOffcanvas = (isOpen: boolean = true) => {
    const backdrop = document.querySelector(
      ".offcanvas-backdrop"
    ) as HTMLElement;
    if (backdrop) {
      backdrop.style.display = isOpen ? "block" : "none";
    }
    setIsOffcanvasVisible(isOpen);
  };

  const renderAdminLinks = () => (
    <>
      <p
        onClick={() => handleNav("/properties")}
        className="pt-2 mb-1 px-4 d-block cursor-pointer"
      >
        <i className="ti ti-map-2 me-2" />
        Properties
      </p>
      <p
        onClick={() => handleNav("/reservation-masterlist")}
        className="pt-0 mb-1 px-4 d-block cursor-pointer"
      >
        <i className="ti ti-list-details me-2" />
        Reservation Masterlist
      </p>
    </>
  );

  const renderUserLinks = () => (
    <p
      onClick={() => handleNav("/bookings")}
      className="pt-2 px-4 mb-1 d-block cursor-pointer"
    >
      <i className="ti ti-map-2 me-2" />
      Bookings
    </p>
  );

  const renderOverlayMenu = () => (
    <>
      <p
        className="bg-primary text-white fw-bold m-0 p-0 cursor-pointer no-outline border-0"
        onClick={(e) => avatarMenuRef.current?.toggle(e)}
      >
        <i className="ti ti-user me-2"></i>
        {user?.firstName}
      </p>
      <OverlayPanel ref={avatarMenuRef}>
        {user?.isAdmin ? renderAdminLinks() : renderUserLinks()}
        <div className="pb-2 px-4">
          <p className="my-1 p-0 cursor-pointer" onClick={logout}>
            <i className="ti ti-logout me-2" /> Logout
          </p>
        </div>
      </OverlayPanel>
    </>
  );

  const renderUnauthenticatedLinks = () => (
    <>
      <Link to="/register" className="btn me-2">
        Register
      </Link>
      <Link to="/login" className="btn">
        Sign in
      </Link>
    </>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary py-2 py-md-3">
        <div className="container d-flex justify-content-between">
          <Link className="navbar-brand text-white" to="/">
            ComfyCorners
          </Link>
          <div className="d-none d-sm-block">
            {!isAuthenticated
              ? renderUnauthenticatedLinks()
              : hideOverlay && renderOverlayMenu()}
          </div>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => toggleOffcanvas(true)}
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
        style={{ visibility: isOffcanvasVisible ? "visible" : "hidden" }}
      >
        <div className="offcanvas-header bg-primary">
          <h5 className="offcanvas-title text-white">ComfyCorners</h5>
          <button
            type="button"
            className="custom-close-btn ms-auto"
            onClick={() => toggleOffcanvas(false)}
            aria-label="Close"
          >
            <i className="ti ti-x"></i>
          </button>
        </div>

        <div className="offcanvas-body">
          {isAuthenticated && (
            <p className="text-primary fw-bold">
              <i className="ti ti-user me-4"></i>
              {user?.firstName}
            </p>
          )}
          {!isAuthenticated ? (
            <>
              <p
                onClick={() => handleNav("/")}
                className="d-block mb-2 cursor-pointer"
              >
                <i className="ti ti-home me-4"></i>Home Page
              </p>
              <p
                onClick={() => handleNav("/register")}
                className="d-block mb-2 cursor-pointer"
              >
                <i className="ti ti-users-plus me-4"></i>Register
              </p>
              <p
                onClick={() => handleNav("/login")}
                className="d-block mb-2 cursor-pointer"
              >
                <i className="ti ti-login me-4"></i>Sign in
              </p>
            </>
          ) : (
            <>
              {user?.isAdmin ? renderAdminLinks() : renderUserLinks()}
              <p
                onClick={() => {
                  logout(true);
                  toggleOffcanvas(false);
                }}
                className="d-block mt-3 cursor-pointer"
              >
                <i className="ti ti-logout me-4"></i>Log out
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
