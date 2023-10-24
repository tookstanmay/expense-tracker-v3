import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { calculateSpentByBudget, fetchData } from "../helper";
ChartJS.register(ArcElement, Tooltip, Legend);

// Function to convert HSL values to CSS-compatible RGB strings
function hslToRgb(hsl) {
  // Split the HSL string into its components
  const [hue, saturation, lightness] = hsl.split(" ");

  // Extract numeric values and remove any '%' signs
  const h = parseFloat(hue);
  const s = parseFloat(saturation);
  const l = parseFloat(lightness);

  // Ensure the values are within valid ranges
  const hueValue = ((h % 360) + 360) % 360; // Ensure hue is within [0, 360]
  const saturationValue = Math.min(100, Math.max(0, s)); // Clamp saturation between 0 and 100
  const lightnessValue = Math.min(100, Math.max(0, l)); // Clamp lightness between 0 and 100

  // Convert HSL to RGB
  const c =
    (1 - Math.abs((2 * lightnessValue) / 100 - 1)) * (saturationValue / 100);
  const x = c * (1 - Math.abs(((hueValue / 60) % 2) - 1));
  const m = lightnessValue / 100 - c / 2;

  let r, g, b;

  if (hueValue >= 0 && hueValue < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (hueValue >= 60 && hueValue < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (hueValue >= 120 && hueValue < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (hueValue >= 180 && hueValue < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (hueValue >= 240 && hueValue < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `rgb(${r},${g},${b})`;
}

const PieChart = () => {
  const completeData = fetchData("budgets");
  const user_details = fetchData("user_details");
  const remainingBalance = user_details.balance;
  const options = {};
  const categoryNames = completeData.map((category) => category.category_name);
  categoryNames.push("Balance Left");
  const myDATA = completeData.map((category) =>
    calculateSpentByBudget(category.category_id)
  );
  myDATA.push(remainingBalance);

  // Convert HSL values to RGB strings
  const backgroundColor = completeData.map((category) =>
    hslToRgb(category.category_color)
  );
  backgroundColor.push("RGB(135, 152, 163)");

  const data = {
    labels: categoryNames,
    datasets: [
      {
        data: myDATA,
        backgroundColor: backgroundColor, // Use the converted RGB strings
      },
    ],
  };

  return (
    <>
      <div>Data Representation</div>
      <div style={{ padding: "20px", width: "50%" }}>
        <Doughnut data={data} options={options}></Doughnut>
      </div>
    </>
  );
};

export default PieChart;
