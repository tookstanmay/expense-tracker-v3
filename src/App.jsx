import * as React from "react";

// rrd imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Library imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// pages imports
import Dashboard, { dashboardAction, dashboardLoader } from "./pages/Dashboard";
import Error from "./pages/Error";
import ExpensesPage, {
  expensesAction,
  expensesLoader,
} from "./pages/ExpensesPage";
import BudgetPage, { budgetAction, budgetLoader } from "./pages/BudgetPage";

// login import
import Login from "./components/Login";
import Register from "./components/Register";

// layouts imports
import Main from "./layouts/Main";

// actions imports
import { deleteBudgetAction } from "./actions/deleteBudget";
import Contributors from "./components/Contributors";
import ShowAllGroups from "./components/ShowAllGroups";
import UPItransactions from "./components/UPItransactions";
import GroupState from "../context/groups/GroupState";
import PieChart from "./components/PieChart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    // loader: mainLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        path: "dashboard",
        element: <Dashboard />,
        loader: dashboardLoader,
        action: dashboardAction,
        errorElement: <Error />,
      },
      {
        path: "register",
        element: <Register />,
        errorElement: <Error />,
      },
      {
        path: "login",
        element: <Login />,
        errorElement: <Error />,
      },
      {
        path: "allgroups",
        element: <ShowAllGroups />,
        errorElement: <Error />,
      },
      {
        path: "upitransactions",
        element: <UPItransactions />,
        errorElement: <Error />,
      },
      {
        path: "datachart",
        element: <PieChart />,
        errorElement: <Error />,
      },
      {
        path: "dashboard/expenses",
        element: <ExpensesPage />,
        loader: expensesLoader,
        action: expensesAction,
        errorElement: <Error />,
      },
      {
        path: "contribute",
        element: <Contributors />,
        errorElement: <Error />,
      },
      {
        path: "budget/:id",
        element: <BudgetPage />,
        loader: budgetLoader,
        action: budgetAction,
        errorElement: <Error />,
        children: [
          {
            path: "delete",
            action: deleteBudgetAction,
          },
        ],
      },
    ],
  },
]);
function App() {
  return (
    <>
      <GroupState>
        <RouterProvider router={router} />
        <ToastContainer />
      </GroupState>
    </>
  );
}

export default App;
