import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <>
      <HelmetProvider>
        <Navbar />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </>
  );
}

export default App;
