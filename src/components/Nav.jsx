import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  fetchData,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helper";
import budgetBookLogo from "./../../public/images/BudgetBook.png";
import ChartImage from "./../../public/images/captured-chart.png";

import "../index.css";

// heroicons import
import {
  TrashIcon,
  BanknotesIcon,
  UserGroupIcon,
  ChartPieIcon,
} from "@heroicons/react/24/solid";

// assets
import invoice from "../assets/invoice.png";

// rrd imports
import { NavLink, useNavigate } from "react-router-dom";

const generatePDF = (data) => {
  const user_details = fetchData("user_details");
  const user_name = user_details.user_name;
  const user_balance = user_details.balance;
  const email = user_details.email;

  const pdf = new jsPDF();

  // Define the columns and set their positions and widths
  const columns = ["Name", "Amount", "Category", "Date"]; // Add more columns as needed

  // Create an array of data for the table
  const tableData = data.map((expense) => {
    const budget = getAllMatchingItems({
      category: "budgets",
      key: "category_id",
      value: expense.category_id,
    })[0];

    // Check if a matching budget was found and get the category name
    const categoryName = budget ? budget.category_name : "Category Not Found";

    return [
      expense.expense_name,
      expense.expense_amount,
      categoryName,
      formatDateToLocaleString(parseInt(expense.expense_created_at)),
    ];
  });

  const imgData = budgetBookLogo;
  pdf.addImage(imgData, 10, 10, 60, 13);

  pdf.setFontSize(12);
  pdf.text(`Name: ${user_name}`, 10, 35);
  pdf.text(`Email: ${email}`, 10, 43);
  pdf.text(`Balance Left: $ ${user_balance}`, 10, 51);

  //   Add the table using autoTable
  pdf.autoTable({
    startY: 65,
    head: [columns],
    body: tableData,
  });

  // Calculate the page height
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Set the Y offset from the bottom of the page (e.g., 20 pixels from the bottom)
  const yOffsetFromBottom = 20;

  // Calculate the Y-coordinate relative to the bottom of the page
  const copyrightY = pageHeight - yOffsetFromBottom;

  // add the pie chart
  const pieChartYOffset = pageHeight - 120 - 50;
  const chartData = ChartImage;
  pdf.addImage(chartData, 40, pieChartYOffset, 120, 120);

  // Add the copyright text
  pdf.setFontSize(10);
  pdf.text(`BudgetBook copyrighted 2023`, 10, copyrightY);

  pdf.save("BudgetBook_report.pdf");
};

const Nav = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user_details"));

  const onSubmitForm = async (e) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      e.preventDefault();
      const id = user.id;
      const user_details = await JSON.parse(
        localStorage.getItem("user_details")
      );
      const budgets = await JSON.parse(localStorage.getItem("budgets"));
      const expenses = await JSON.parse(localStorage.getItem("expenses"));
      const balance = await user_details.balance;
      const body = { budgets, expenses, id, balance };
      const response = await fetch(`http://localhost:5000/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log(body);
      if (response.status === 200) {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [expense, setExpense] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const expenses = await fetchData("expenses");
      setExpense(expenses);
    };

    fetchExpenses();
  }, [expense]);

  return (
    <nav>
      <NavLink to={"/dashboard"} aria-label="Go to Home page">
        <img src={invoice} alt="" height={30} />
        <span style={{ color: "#0A3E73" }}>BudgetBook</span>
      </NavLink>
      {user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "auto",
          }}
        >
          <div style={{ margin: "0 10px" }}>
            <button
              className="btn btn--mandarin"
              onClick={() => generatePDF(expense)}
            >
              <ChartPieIcon width={20} />
              <span style={{ fontWeight: "bold" }}>PDF Report</span>
            </button>
          </div>
          <div style={{ margin: "0 10px" }}>
            <NavLink
              to={"datachart"}
              style={{
                boxShadow: "none",
              }}
            >
              <button className="btn btn--eleven">
                <ChartPieIcon width={20} />
                <span>Data</span>
              </button>
            </NavLink>
          </div>
          <div style={{ margin: "0 10px" }}>
            <NavLink
              to={"upitransactions"}
              style={{
                boxShadow: "none",
              }}
            >
              <button className="btn btn--danger">
                <BanknotesIcon width={20} />
                <span>UPI Record</span>
              </button>
            </NavLink>
          </div>
          <div style={{ margin: "0 10px" }}>
            <NavLink
              to={"contribute"}
              style={{
                boxShadow: "none",
              }}
            >
              <button className="btn btn--success">
                <BanknotesIcon width={20} />
                <span>Contribute</span>
              </button>
            </NavLink>
          </div>
          <div style={{ margin: "0 10px" }}>
            <NavLink
              to={"allgroups"}
              style={{
                boxShadow: "none",
              }}
            >
              <button className="btn btn--primary">
                <UserGroupIcon width={20} />
                <span>Groups</span>
              </button>
            </NavLink>
          </div>
          <div style={{ margin: "0 15px" }}>
            <form onSubmit={onSubmitForm}>
              <button type="submit" className="btn btn--warning">
                <TrashIcon width={20} />
                <span>Log out user</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
