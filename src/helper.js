// wait
export const waait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 800));

// color
const generateRandomColor = () => {
  const existingBudgetsLength = fetchData("budgets")?.length ?? 0;
  return `${existingBudgetsLength * 50} 80% 40%`;
};

//local Storage

export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// create budget
export const createBudget = ({ category_name, category_limit }) => {
  const newItem = {
    category_id: crypto.randomUUID(),
    category_name: category_name,
    category_created_at: Date.now(),
    category_limit: +category_limit,
    category_color: generateRandomColor(),
  };

  const existingBudgets = fetchData("budgets") ?? [];
  return localStorage.setItem(
    "budgets",
    JSON.stringify([...existingBudgets, newItem])
  );
};

// create Expense
export const createExpense = ({
  expense_name,
  expense_amount,
  category_id,
}) => {
  const newItem = {
    expense_id: crypto.randomUUID(),
    expense_name: expense_name,
    expense_created_at: Date.now(),
    expense_amount: +expense_amount,
    category_id: category_id,
  };

  const existingExpenses = fetchData("expenses") ?? [];
  return localStorage.setItem(
    "expenses",
    JSON.stringify([...existingExpenses, newItem])
  );
};

// formatting

//   formatting date
export const formatDateToLocaleString = (epoch) =>
  new Date(epoch).toLocaleDateString();

//   formatting currency
export const formatCurrency = (amt) => {
  return parseFloat(amt).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
};

//   formatting percentages
export const formatPercentage = (amt) => {
  amt = parseFloat(amt);
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

// total spent by budget
export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    // check if budget.id === expense.id
    if (budgetId !== expense.category_id) return acc;

    // add the current amount to my total
    return (acc += parseFloat(expense.expense_amount));
  }, 0);
  return budgetSpent;
};

// Get all items from local storage
export const getAllMatchingItems = ({ category, key, value }) => {
  const data = fetchData(category) ?? [];
  return data.filter((item) => item[key] === value);
};

// delete item from local storage
export const deleteCategory = ({ key, id }) => {
  const existingData = fetchData(key);
  if (id) {
    const newData = existingData.filter((item) => item.category_id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
};

export const deleteExpense = ({ key, id }) => {
  const existingData = fetchData(key);
  if (id) {
    const newData = existingData.filter((item) => item.expense_id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
};

export const deleteUser = ({ key }) => {
  const existingUser = fetchData(key);
  if (existingUser) {
    return localStorage.removeItem(key);
  }
};
