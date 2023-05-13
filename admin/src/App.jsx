import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import List from "./pages/List";
import SingleProduct from "./pages/SingleProduct";
import NewProduct from "./pages/NewProduct";
import NewClient from "./pages/NewClient";
import SingleClient from "./pages/SingleClient";
import NewSale from "./pages/NewSale";
import Sales from "./pages/Sales";

function App() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <BrowserRouter>
      {user ? (
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/products" element={<List />} />
          <Route path="/clients" element={<List />} />
          <Route path="/newsale" element={<NewSale />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/products/new" element={<NewProduct />} />
          <Route path="/clients/new" element={<NewClient />} />
          <Route path="/products/:id" element={<SingleProduct />} />
          <Route path="/clients/:id" element={<SingleClient />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
