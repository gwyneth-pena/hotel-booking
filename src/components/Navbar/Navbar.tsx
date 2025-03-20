import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary py-2 py-md-3">
        <div className="container d-flex justify-content-between">
          <a className="navbar-brand text-white" href="/">
            Hotel Booking
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvas"
            aria-controls="offcanvas"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="ti ti-menu-2"></i>
          </button>
          <div className="collapse navbar-collapse d-sm-none">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <button type="button" className="btn me-3">
                Register
              </button>
              <button type="button" className="btn">
                Sign in
              </button>
            </ul>
          </div>
        </div>
      </nav>
      <div
        className="offcanvas offcanvas-start"
        id="offcanvas"
        aria-labelledby="offcanvasLabel"
      >
        <div className="offcanvas-header bg-primary">
          <h5 className="offcanvas-title text-white" id="offcanvasLabel">
            Hotel Booking
          </h5>
          <button
            type="button"
            className="custom-close-btn ms-auto"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ><i className="ti ti-x"></i></button>
        </div>
        <div className="offcanvas-body">
          <div className="row">
            <a className="col-12">
              <i className="ti ti-users-plus me-4"></i>Register
            </a>
          </div>
          <div className="row">
            <a className="col-12">
              <i className="ti ti-login me-4"></i>Sign in
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
