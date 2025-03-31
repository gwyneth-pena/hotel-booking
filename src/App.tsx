import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar/Navbar";
import SearchResults from "./pages/SearchResults/SearchResults";

function App() {
  return (
    <>
      <HelmetProvider>
        <Navbar />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/searchresults" element={<SearchResults />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </>
  );
}

export default App;
