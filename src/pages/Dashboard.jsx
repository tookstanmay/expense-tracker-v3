import React, { useEffect, useState } from "react";
import {
  createBudget,
  createExpense,
  deleteExpense,
  fetchData,
  getAllMatchingItems,
  waait,
} from "../helper";

import { UserIcon } from "@heroicons/react/24/solid";

// react router dom imports
import { Link, useLoaderData } from "react-router-dom";

// components import
import AddBudgetForm from "../components/AddBudgetForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import AddExpenseForm from "../components/AddExpenseForm";

// toastify imports
import { toast } from "react-toastify";
import Alert from "../components/Alert";

// loader
export async function dashboardLoader() {
  const budgets = await fetchData("budgets");
  const expenses = await fetchData("expenses");
  return { budgets, expenses };
}

// action
export async function dashboardAction({ request }) {
  await waait();
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "createBudget") {
    try {
      // check if user has sufficient balance
      const user_details = await JSON.parse(
        localStorage.getItem("user_details")
      );
      if (
        parseFloat(await user_details.balance) >=
        parseFloat(values.newBudgetAmount)
      ) {
        // create budget
        createBudget({
          category_name: values.newBudget,
          category_limit: values.newBudgetAmount,
        });

        return toast.success("Your budget is created!");
      } else {
        return toast.error("Insufficient Balance");
      }
    } catch (e) {
      throw new Error("There was a problem creating your budget!");
    }
  } else if (_action === "createExpense") {
    try {
      const user_details = await JSON.parse(
        localStorage.getItem("user_details")
      );

      const balance = parseFloat(await user_details.balance);
      const value_balance = parseFloat(await values.newBudgetAmount);

      if (balance >= value_balance) {
        createExpense({
          expense_name: values.newExpense,
          expense_amount: values.newExpenseAmount,
          category_id: values.newExpenseBudget,
        });

        user_details.balance = balance - value_balance;
        console.log("Updated Balance:", user_details.balance);

        const updatedDetails = JSON.stringify(user_details);
        localStorage.setItem("user_details", updatedDetails);

        return toast.success(`${values.newExpense} added!`);
      } else {
        return toast.error("Insufficient Balance!");
      }
    } catch (e) {
      throw new Error("There was a problem adding your Expense!");
    }
  } else if (_action === "deleteExpense") {
    try {
      deleteExpense({
        key: "expenses",
        id: values.expenseId,
      });

      const user_details = await JSON.parse(
        localStorage.getItem("user_details")
      );

      const balance = await user_details.balance;
      user_details.balance = balance + parseFloat(values.expenseAmt);

      const updatedDetails = JSON.stringify(user_details);
      localStorage.setItem("user_details", updatedDetails);

      return toast.success(`Expense deleted!`);
    } catch (e) {
      throw new Error("There was a problem deleting your Expense!");
    }
  }
}

const Dashboard = () => {
  const { budgets, expenses } = useLoaderData();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDetails = await JSON.parse(
        localStorage.getItem("user_details")
      );
      const userID = await userDetails.id;
      const userEmail = await userDetails.email;
      setBalance(parseFloat(await userDetails.balance));
      if (userID) {
        try {
          const response = await fetch(
            `http://localhost:5000/getuser/${userID}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setUsername(data.user_name);
          setEmail(userEmail);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [username, balance]);

  return (
    <>
      {username ? (
        <div className="dashboard">
          {balance <= 0 && <Alert type={"danger"} msg={"Low Balance!"} />}
          <h1>
            Welcome back, <span className="accent">{username}</span>
          </h1>
          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm />
                  <AddExpenseForm budgets={budgets} />
                </div>
                <h2>Existing Categories</h2>
                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem key={budget.category_id} budget={budget} />
                  ))}
                </div>
                {expenses && expenses.length > 0 && (
                  <div className="grid-md">
                    <h2>Recent Expenses</h2>
                    <Table
                      expenses={expenses
                        .sort(
                          (a, b) =>
                            parseInt(b.expense_created_at) -
                            parseInt(a.expense_created_at)
                        )
                        .slice(0, 8)}
                    />
                    {expenses.length > 8 && (
                      <Link to={"expenses"} className="btn btn--dark">
                        View all expenses
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Track your expenses by creating a category for expense.</p>
                <AddBudgetForm />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-sm">
          <Link to={"/login"} className="btn btn--dark">
            <span>Login</span>
            <UserIcon width={20} />
          </Link>
        </div>
      )}
    </>
  );
};

export default Dashboard;