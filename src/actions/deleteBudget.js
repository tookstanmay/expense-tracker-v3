// rrd imports
import { redirect } from "react-router-dom";

// helper imports
import { deleteCategory, deleteExpense, getAllMatchingItems } from "../helper";

// library imports
import { toast } from "react-toastify";

export async function deleteBudgetAction({ params }) {
  try {
    // delete from local storage
    deleteCategory({
      key: "budgets",
      id: params.id,
    });

    const associatedExpenses = getAllMatchingItems({
      category: "expenses",
      key: "category_id",
      value: params.id,
    });

    associatedExpenses.forEach((expense) => {
      deleteExpense({
        key: "expenses",
        id: expense.expense_id,
      });
    });

    toast.success("Your Budget is deleted!");

    // redirect to home page
  } catch (e) {
    throw new Error("Error deleting budget!");
  }

  return redirect("/dashboard");
}
