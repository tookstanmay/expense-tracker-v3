import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  fetchData,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helper";
import budgetBookLogo from "./../../public/images/BudgetBook.png";

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

  // Add the copyright text
  pdf.setFontSize(10);
  pdf.text(`BudgetBook copyrighted 2023`, 10, copyrightY);

  pdf.save("BudgetBook_report.pdf");
};

const PDFReport = () => {
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const expenses = await fetchData("expenses");
      setExpense(expenses);
    };

    fetchExpenses();
  }, [expense]);

  return (
    <div>
      {expense && (
        <button onClick={() => generatePDF(expense)}>Generate PDF</button>
      )}
    </div>
  );
};

export default PDFReport;
