import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Book Hotels at the Best Prices | Hotel Booking</title>
        <meta
          name="description"
          content="Find the best hotel deals. Compare prices, book luxury stays, and enjoy exclusive offers on Hotel Booking"
        />
      </Helmet>
      <div>Home</div>
    </div>
  );
};

export default Home;
