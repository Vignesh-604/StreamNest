import Cookies from "js-cookie";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/AppComponents/Sidebar";
import ErrorPage from "./components/AppComponents/ErrorPage";
import { useNetworkStatus, useAxiosInterceptor } from "./components/Utils/networkUtility.js";

function App() {
  const navigate = useNavigate();
  const isOffline = useNetworkStatus();
  const axiosOffline = useAxiosInterceptor();
  const user = Cookies.get("user");

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [])

  return (
    <div>
      {!user ? (
        <Outlet />                          // Allow login/signup pages to render
      ) : isOffline || axiosOffline ? (     // Checking for network connection
        <ErrorPage />
      ) : (
          <Sidebar />
      )}
    </div>
  );
}

export default App;
