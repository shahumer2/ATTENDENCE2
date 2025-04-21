import React from "react";
import { useLocation, Routes, Route, Outlet } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import routes from "routes.js";

function Admin() {
  const location = useLocation();
  const mainPanel = React.useRef(null);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            key={key}
            path={prop.path}
            element={<prop.component />}
          />
        );
      }
      return null;
    });
  };

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanel.current) {
      mainPanel.current.scrollTop = 0;
    }
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      const element = document.getElementById("bodyClick");
      if (element) {
        element.parentNode.removeChild(element);
      }
    }
  }, [location]);

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="main-panel" ref={mainPanel}>
        <div className="content">
          <Routes>
            {getRoutes(routes)}
          </Routes>
          <Outlet /> {/* For nested routes */}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Admin;