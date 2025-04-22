import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar/Navbar";
import SearchResults from "./pages/SearchResults/SearchResults";
import PropertyInfo from "./pages/PropertyInfo/PropertyInfo";
import Login from "./pages/Login/Login";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <HelmetProvider>
        <AuthProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/searchresults" element={<SearchResults />} />
              <Route path="/property/:id" element={<PropertyInfo />} />
            </Routes>
          </Router>
        </AuthProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
