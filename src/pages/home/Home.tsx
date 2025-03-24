import { Helmet } from "react-helmet-async";
import "./Home.css";
import ImageGridCarousel from "../../components/ImageGridCarousel/ImageGridCarousel";
import useAxios from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import config from "../../config";
import countByCityPhotos from "../../assets/json/countByCityPhotos.json";
import countByPropertyPhotos from "../../assets/json/countByPropertyPhotos.json";
import Footer from "../../components/Footer/Footer";
import SearchBox from "../../components/SearchBox/SearchBox";

const Home = () => {
  const apiURL = config.apiUrl;
  const [countByCity, setCountByCity] = useState<any[]>([]);
  const [countByProperty, setCountByProperty] = useState<any[]>([]);

  const countByCityReq: any = useAxios(
    "GET",
    `${apiURL}/hotels?field=city&values=boracay,baguio,siargao,iloilo,palawan,cebu,manila,batangas&countOnly=true`
  );

  const countByPropertyReq: any = useAxios(
    "GET",
    `${apiURL}/hotels?field=type&values=hotel,homestay,apartment,resort,villa,campsite,hostel,guest house&countOnly=true`
  );

  useEffect(() => {
    if (countByCityReq.response) {
      setCountByCity(countByCityReq.response);
      setCountByProperty(countByPropertyReq.response);
    }
  }, [countByCityReq.response, countByPropertyReq.response]);

  return (
    <div>
      <Helmet>
        <title>
          Book Hotels, Villas and Homestay at the Best Prices | ComfyCorners
        </title>
        <meta
          name="description"
          content="Find the best hotel deals. Compare prices, book luxury stays, and enjoy exclusive offers on ComfyCorners"
        />
      </Helmet>
      <div className="home-banner">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-7 py-5 my-4">
              <h1 className="mb-4 fw-bold">
                Live the dream where comfort meets convenience
              </h1>
              <p className="mb-5">
                Unwind and indulge in the comfort of home at these hotels and
                homestays in the Philippines.
              </p>
              <button className="btn btn-dark-blue">Book yours</button>
            </div>
          </div>
        </div>
      </div>
      <SearchBox/>
      <div className="container py-3 mt-5">
        <div className="row">
          <div className="col-12">
            <h4 className="fw-bold">Browse by property type</h4>
            <p className="text-gray">
              These popular destinations have a lot to offer
            </p>
          </div>
          <div className="col-12 mt-3">
            <ImageGridCarousel
              info={countByProperty}
              photos={countByPropertyPhotos}
            />
          </div>
        </div>
      </div>
      <div className="container py-3">
        <div className="row">
          <div className="col-12">
            <h5 className="fw-bold">Explore the Philippines</h5>
            <p className="text-gray">
              These popular destinations have a lot to offer
            </p>
          </div>
          <div className="col-12 mt-3">
            <ImageGridCarousel info={countByCity} photos={countByCityPhotos} />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
