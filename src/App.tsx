import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import SearchResults from "./pages/SearchResults/SearchResults";
import { PropertyInfo } from "./pages/PropertyInfo/PropertyInfo";

function App() {
  return (
    <>
      <HelmetProvider>
        <Navbar />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/searchresults" element={<SearchResults />} />
            <Route path="/property/:id" element={<PropertyInfo />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </>
  );
}

export default App;
