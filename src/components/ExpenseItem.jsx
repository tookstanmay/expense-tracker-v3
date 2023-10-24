import React from "react";

// helper imports
import {
  formatCurrency,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helper";

// rrd imports
import { Link, useFetcher } from "react-router-dom";

// heroicons import
import { TrashIcon } from "@heroicons/react/24/solid";

const ExpenseItem = ({ expense, showBudget }) => {
  const fetcher = useFetcher();

  const budget = getAllMatchingItems({
    category: "budgets",
    key: "category_id",
    value: expense.category_id,
  })[0];

  return (
    <>
      <td>{expense.expense_name}</td>
      <td>{formatCurrency(parseFloat(expense.expense_amount))}</td>
      <td>{formatDateToLocaleString(parseInt(expense.expense_created_at))}</td>
      {showBudget && budget && (
        <td>
          {
            <Link
              to={`/budget/${budget.category_id}`}
              style={{ "--accent": budget.category_color }}
            >
              {budget.category_name}
            </Link>
          }
        </td>
      )}
      <td>
        <fetcher.Form method="post">
          <input type="hidden" name="_action" value={"deleteExpense"} />
          <input type="hidden" name="expenseId" value={expense.expense_id} />
          <input
            type="hidden"
            name="expenseAmt"
            value={expense.expense_amount}
          />
          <button
            className="btn btn--warning"
            type="submit"
            aria-label={`Delete ${expense.expense_id} expense`}
          >
            <TrashIcon width={20} />
          </button>
        </fetcher.Form>
      </td>
    </>
  );
};

export default ExpenseItem;
