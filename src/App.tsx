import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar/Navbar";
import SearchResults from "./pages/SearchResults/SearchResults";
import PropertyInfo from "./pages/PropertyInfo/PropertyInfo";
import Login from "./pages/Login/Login";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "react-modal-hook";
import axios from "axios";
import PublicRoute from "./utils/PublicRoute";

axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <ModalProvider>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route path="/searchresults" element={<SearchResults />} />
                <Route path="/property/:id" element={<PropertyInfo />} />
              </Routes>
            </ModalProvider>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </>
  );
}

export default App;
