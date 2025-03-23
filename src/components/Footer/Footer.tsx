import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="bg-dirty-white">
      <div className="container py-5 mt-5">
        <div className="row">
          <div className="col-12 pb-4">
            <div className="row">
              <div className="col-12 col-md-1 mb-2 mb-md-0"></div>
              <div className="col-12 col-md-2 mb-2 mb-md-0">
                <p className="fw-bold my-0 py-0">Support</p>
                <a className="footer-link">Coronavirus (COVID-19) FAQs</a>
                <br />
                <a className="footer-link">Manage your trips</a>
                <br />
                <a className="footer-link">Contact Customer Service</a>
                <br />
                <a className="footer-link">Safety resource center</a>
                <br />
              </div>
              <div className="col-12 col-md-2 mb-2 mb-md-0">
                <p className="fw-bold my-0 py-0">Discover</p>
                <a className="footer-link">Genius loyalty programme</a>
                <br />
                <a className="footer-link">Seasonal and holiday deals</a>
                <br />
                <a className="footer-link">Travel articles</a>
                <br />
                <a className="footer-link">Booking.com for Business</a>
                <br />
              </div>
              <div className="col-12 col-md-2 mb-2 mb-md-0">
                <p className="fw-bold my-0 py-0">Terms and Settings</p>
                <a className="footer-link">Genius loyalty programme</a>
                <br />
                <a className="footer-link">Seasonal and holiday deals</a>
                <br />
                <a className="footer-link">Travel articles</a>
                <br />
                <a className="footer-link">Booking.com for Business</a>
                <br />
              </div>
              <div className="col-12 col-md-2 mb-2 mb-md-0">
                <p className="fw-bold my-0 py-0">Partners</p>
                <a className="footer-link">List your property</a>
                <br />
                <a className="footer-link">Become an affiliate</a>
                <br />
                <a className="footer-link">Extranet login</a>
                <br />
                <a className="footer-link">Sustainability</a>
                <br />
              </div>
              <div className="col-12 col-md-2 mb-2 mb-md-0">
                <p className="fw-bold my-0 py-0">About</p>
                <a className="footer-link">Who we are</a>
                <br />
                <a className="footer-link">How we work</a>
                <br />
                <a className="footer-link">Careers</a>
                <br />
                <a className="footer-link">Sustainability</a>
                <br />
              </div>
              <div className="col-12 col-md-1 mb-2 mb-md-0"></div>
            </div>
          </div>
          <hr className="text-muted" />
          <div className="col-12 text-center text-muted">
            <small>
              ComfyCorners is part of Fictional Holdings Inc., the world leader
              in online travel and related services. Copyright © {year}
              <br />
              ComfyCorners. All rights reserved.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
