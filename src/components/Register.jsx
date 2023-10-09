/* eslint-disable jsx-a11y/img-redundant-alt */

import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";

// heroicons import
import { UserPlusIcon } from "@heroicons/react/24/solid";

// assets
import problemSolving from "../assets/problemSolving.gif";

const Intro = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState(0);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { username, email, password, balance };
      // console.log(body);
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="intro">
      <div>
        <h1>
          Take control of <span className="accent">Your Money</span>
        </h1>
        <p>
          Personal budgeting is the secret to financial success. Start your
          journey with us now.
        </p>
        <form onSubmit={onSubmitForm}>
          <input
            type="text"
            name="username"
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="What is your name?"
            aria-label="Your Name"
            autoComplete="off"
          />
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="What is your email?"
            aria-label="Your email"
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="🤫🤫 Password?"
            aria-label="Your Password"
            autoComplete="off"
          />
          <input
            type="numeric"
            name="balance"
            required
            value={balance}
            onChange={(e) => {
              setBalance(e.target.value);
            }}
            placeholder="Your Balance?"
            aria-label="Your balance"
            autoComplete="off"
          />
          {/* <input type="hidden" name="_action" value={"newUser"} /> */}
          <button className="btn btn--dark" type="submit">
            <span>Create Account</span>
            <UserPlusIcon width={20} />
          </button>
        </form>
      </div>
      <img src={problemSolving} height={450} width={450} alt="Person's image" />
    </div>
  );
};

export default Intro;
