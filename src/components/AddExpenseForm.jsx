import React, { useEffect, useReducer, useRef } from "react";

// heroicons imports
import { PlusCircleIcon } from "@heroicons/react/24/solid";

// rrd imports
import { useFetcher } from "react-router-dom";

const AddExpenseForm = ({ budgets }) => {
  const fetcher = useFetcher();
  const formRef = useRef();
  const focusRef = useRef();

  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (!isSubmitting) {
      // clear form
      formRef.current.reset();

      // reset focus
      focusRef.current.focus();
    }
  }, [isSubmitting]);

  return (
    <div className="form-wrapper">
      <h2 className="h3">
        Add New{" "}
        <span className="accent">
          {budgets.length === 1 &&
            `${budgets.map((budg) => budg.category_name)}`}
        </span>{" "}
        Expense
      </h2>
      <fetcher.Form method="post" className="grid-sm" ref={formRef}>
        <div className="expense-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Expense Name</label>
            <input
              type="text"
              name="newExpense"
              id="newExpense"
              ref={focusRef}
              placeholder="e.g., Coffee"
              required
              autoComplete="off"
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newExpenseAmount">Amount</label>
            <input
              type="number"
              name="newExpenseAmount"
              id="newExpenseAmount"
              step={0.01}
              inputMode="decimal"
              placeholder="e.g., $3.5"
              required
              autoComplete="off"
            />
          </div>
          <div className="grid-xs" hidden={budgets.length === 1}>
            <label htmlFor="newExpenseBudget">Select Category</label>
            <select name="newExpenseBudget" id="newExpenseBudget" required>
              {budgets
                .sort((a, b) => a.category_created_at - b.category_created_at)
                .map((budget) => {
                  return (
                    <option value={budget.category_id} key={budget.category_id}>
                      {budget.category_name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
        <input type="hidden" name="_action" value={"createExpense"} />
        <button className="btn btn--dark" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span>Creating budget...</span>
          ) : (
            <>
              <span>Add Expense</span>
              <PlusCircleIcon width={20} />
            </>
          )}
        </button>
      </fetcher.Form>
    </div>
  );
};

export default AddExpenseForm;
