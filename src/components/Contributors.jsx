import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// heroicons import
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";

// assets
import problemSolving from "../assets/problemSolving.gif";
import { toast } from "react-toastify";

const Contributors = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [proceed, setProceed] = useState(false);
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState(0);

  const onSubmitFormEmail = async (e) => {
    e.preventDefault();
    try {
      const body = { email };
      // console.log(body);
      const response = await fetch("http://localhost:5000/contribute/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        const data = await response.json();
        setProceed(true);
        setUsername(data.username);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const onSubmitFormAmount = async (e) => {
    e.preventDefault();
    try {
      const user_details = await JSON.parse(
        localStorage.getItem("user_details")
      );
      const user_id = await user_details.id;
      const initial_balance = await user_details.balance;
      const body = { user_id, email, amount, initial_balance };
      // console.log(body);
      const response = await fetch("http://localhost:5000/contribute/amount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        // console.log(response.json());
        user_details.balance = parseFloat(initial_balance) - parseFloat(amount);
        localStorage.setItem("user_details", JSON.stringify(user_details));
        window.alert("Amount send!");
      }

      // handle alert for not sufficient balance
      if (response.status === 300) {
        return toast.error("User doesn't have sufficient balance!");
      }

      // eslint-disable-next-line no-restricted-globals
      location.reload(true);
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <>
      <div style={{ display: "block", height: "40px" }}></div>
      <div className="intro" style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <p>Find user by email to contribute and send money.</p>
          <form onSubmit={onSubmitFormEmail}>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="What is the email?"
              aria-label="receiver's email"
              autoComplete="off"
            />
            <button className="btn btn--dark" type="submit">
              <span>Search</span>
              <MagnifyingGlassIcon width={20} />
            </button>
          </form>
          {proceed ? (
            <div>
              <div className="form-wrapper" style={{ fontSize: "20px" }}>
                <span>
                  <strong>Username:</strong> {username}
                </span>
                <span>
                  <strong>Email:</strong> {email}
                </span>
                <form onSubmit={onSubmitFormAmount}>
                  <div className="grid-xs">
                    <label htmlFor="newBudgetAmount">Amount</label>
                    <input
                      type="number"
                      name="newBudgetAmount"
                      id="newBudgetAmount"
                      step={0.01}
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                      placeholder="e.g., $350"
                      required
                      inputMode="decimal"
                      autoComplete="off"
                    />
                  </div>
                  <button className="btn btn--dark" type="submit">
                    <span>Send</span>
                    <PaperAirplaneIcon width={20} />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
        <img
          src={problemSolving}
          height={450}
          width={450}
          alt="Person's image"
        />
      </div>
    </>
  );
};

export default Contributors;
