import React, { useEffect, useState } from "react";
import "../index.css";

// heroicons import
import {
  TrashIcon,
  BanknotesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

// assets
import invoice from "../assets/invoice.png";

// rrd imports
import { NavLink, useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user_details"));

  const onSubmitForm = async (e) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      e.preventDefault();
      const id = user.id;
      const user_details = await JSON.parse(
        localStorage.getItem("user_details")
      );
      const budgets = await JSON.parse(localStorage.getItem("budgets"));
      const expenses = await JSON.parse(localStorage.getItem("expenses"));
      const balance = await user_details.balance;
      const body = { budgets, expenses, id, balance };
      const response = await fetch(`http://localhost:5000/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log(body);
      if (response.status === 200) {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav>
      <NavLink to={"/dashboard"} aria-label="Go to Home page">
        <img src={invoice} alt="" height={30} />
        <span style={{ color: "#0A3E73" }}>BudgetBook</span>
      </NavLink>
      {user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "auto",
          }}
        >
          <div style={{ margin: "0 10px" }}>
            <NavLink
              to={"upitransactions"}
              style={{
                boxShadow: "none",
              }}
            >
              <button className="btn btn--danger">
                <BanknotesIcon width={20} />
                <span>UPI Record</span>
              </button>
            </NavLink>
          </div>
          <div style={{ margin: "0 10px" }}>
            <NavLink
              to={"contribute"}
              style={{
                boxShadow: "none",
              }}
            >
              <button className="btn btn--success">
                <BanknotesIcon width={20} />
                <span>Contribute</span>
              </button>
            </NavLink>
          </div>
          <div style={{ margin: "0 10px" }}>
            <NavLink
              to={"allgroups"}
              style={{
                boxShadow: "none",
              }}
            >
              <button className="btn btn--primary">
                <UserGroupIcon width={20} />
                <span>Groups</span>
              </button>
            </NavLink>
          </div>
          <div style={{ margin: "0 15px" }}>
            <form onSubmit={onSubmitForm}>
              <button type="submit" className="btn btn--warning">
                <TrashIcon width={20} />
                <span>Log out user</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
