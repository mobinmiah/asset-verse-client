import React from "react";
import { Outlet } from "react-router";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/NavBar/NavBar";

const AuthLayout = () => {
  return (
    <div className="max-w-11/12 md:max-w-10/12 mx-auto">
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default AuthLayout;
