import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// heroicons import
import { UserPlusIcon } from "@heroicons/react/24/solid";

// assets
import problemSolving from "../assets/problemSolving.gif";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      // console.log(body);
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        const user_id = await data.user_id;
        const balance = parseFloat(await data.balance);
        const user_name = await data.user_name;
        const user_details = {
          id: user_id,
          email: email,
          balance: balance,
          user_name: user_name,
        };

        localStorage.setItem("user_details", JSON.stringify(user_details));

        try {
          const category_body = { user_id };
          const category_response = await fetch(
            "http://localhost:5000/fetchBudgets",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(category_body),
            }
          );

          if (category_response.status === 200) {
            const category_data = await category_response.json();
            const budgets = await category_data.budgets;
            const expenses = await category_data.expenses;
            localStorage.setItem("budgets", JSON.stringify(budgets));
            localStorage.setItem("expenses", JSON.stringify(expenses));
          }
        } catch (err) {
          console.error(err);
        }
        navigate("/dashboard");
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
        <p>Login to continue to dashboard.</p>
        <form onSubmit={onSubmitForm}>
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
            placeholder="Password?"
            aria-label="Your Password"
            autoComplete="off"
          />
          {/* <input type="hidden" name="_action" value={"loginUser"} /> */}
          <button className="btn btn--dark" type="submit">
            <span>Log in</span>
            <UserPlusIcon width={20} />
          </button>
        </form>
      </div>
      {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
      <img src={problemSolving} height={450} width={450} alt="Person's image" />
    </div>
  );
};

export default Login;
