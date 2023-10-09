import React from "react";

// assets
import wave from "../assets/wave.svg";

// react router dom imports
import { Link, Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import { BanknotesIcon } from "@heroicons/react/24/solid";

const Main = () => {
  return (
    <div className="layout">
      <Nav />
      <main>
        <Outlet />
      </main>
      <img src={wave} alt="" />
    </div>
  );
};

export default Main;
