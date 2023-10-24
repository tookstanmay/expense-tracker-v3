/* eslint-disable no-restricted-globals */
import React from "react";

// helper imports
import {
  calculateSpentByBudget,
  formatCurrency,
  formatPercentage,
} from "../helper";

// rrd imports
import { Form, Link } from "react-router-dom";

// heroicons imports
import { BanknotesIcon, TrashIcon } from "@heroicons/react/24/outline";

const BudgetItem = ({ budget, showDelete = false }) => {
  const { category_id, category_name, category_limit, category_color } = budget;
  const spent = calculateSpentByBudget(category_id);

  return (
    <div
      className="budget"
      style={{
        "--accent": spent > category_limit ? "0, 100%, 40%" : category_color,
        animation:
          spent > category_limit ? "blink-gray 2s linear infinite" : "none",
      }}
    >
      <div className="progress-text">
        <h3>{category_name}</h3>
        <p>{formatCurrency(category_limit)} Budgeted</p>
      </div>
      <progress max={parseFloat(category_limit)} value={parseFloat(spent)}>
        {formatPercentage(parseFloat(spent) / parseFloat(category_limit))}
      </progress>
      <div className="progress-text">
        <small>{formatCurrency(parseFloat(spent))} spent</small>
        <small>
          {formatCurrency(parseFloat(category_limit - spent))} remaining
        </small>
      </div>
      {showDelete ? (
        <div className="flex-sm">
          <Form
            method="post"
            action="delete"
            onSubmit={(event) => {
              if (
                !confirm("Are you sure want to delete this budget permanently?")
              ) {
                event.preventDefault();
              }
            }}
          >
            <button className="btn">
              <span>Delete Category</span>
              <TrashIcon width={20} />
            </button>
          </Form>
        </div>
      ) : (
        <div className="flex-sm">
          <Link to={`/budget/${category_id}`} className="btn">
            <span>View Details</span>
            <BanknotesIcon width={20} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default BudgetItem;
