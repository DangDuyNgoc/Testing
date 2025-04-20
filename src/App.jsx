import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Order from "./pages/Order/Order";
import Update from "./pages/Update/Update";
import Category from "./pages/Category/Category";
import Food from "./pages/Add/Food";
import Add from "./pages/Add/Add";
import Login from "./components/Login/Login";
import StoreContextProvider from "./context/StoreContext";

import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const url = `${import.meta.env.VITE_API_BACKEND}`;

  return (
    <StoreContextProvider>
      <div>
        <ToastContainer />
        <Navbar setShowLogin={setShowLogin} />
        <hr />
        {showLogin ? <Login setShowLogin={setShowLogin} /> : <></>}
        <div className="app-content">
          <Sidebar setShowLogin={setShowLogin} />
          <Routes>
            <Route path="/product" element={<Food url={url} />} />
            <Route path="/add-product" element={<Add url={url} />} />
            <Route path="/category" element={<Category url={url} />} />
            <Route path="/order" element={<Order url={url} />} />
            <Route path="/update/:id" element={<Update url={url} />} />
          </Routes>
        </div>
      </div>
    </StoreContextProvider>
  );
};

export default App;
