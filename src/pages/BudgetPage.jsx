import React from "react";

// helper imports
import { createExpense, deleteExpense, getAllMatchingItems } from "../helper";

// rrd imports
import { useLoaderData } from "react-router-dom";

// components imports
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import AddExpenseForm from "../components/AddExpenseForm";

// library imports
import { toast } from "react-toastify";

// loader
export async function budgetLoader({ params }) {
  const budget = await getAllMatchingItems({
    category: "budgets",
    key: "category_id",
    value: params.id,
  })[0];

  const expenses = await getAllMatchingItems({
    category: "expenses",
    key: "category_id",
    value: params.id,
  });

  if (!budget) {
    throw new Error("The page you're trying to access doesn't exists.");
  }

  return { budget, expenses };
}

// action
export async function budgetAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "deleteExpense") {
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
  }
}

const BudgetPage = () => {
  const { budget, expenses } = useLoaderData();

  return (
    <div className="grid-lg" style={{ "--accent": budget.category_color }}>
      <h1 className="h2">
        <span className="accent">{budget.category_name}</span> Overview
      </h1>
      <div className="flex-lg">
        <BudgetItem budget={budget} showDelete={true} />
        <AddExpenseForm budgets={[budget]} />
      </div>
      {expenses && expenses.length > 0 && (
        <div className="grid-md">
          <h2>
            <span className="accent">{budget.category_name}</span> Expenses
          </h2>
          <Table expenses={expenses} showBudget={false} />
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
