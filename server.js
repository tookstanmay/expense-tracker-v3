import express from "express";
import cors from "cors";
import session from "express-session";
import groupRoutes from "./routes/groupRoutes.js";
import fs from "fs";

// import categoryRoutes from "./routes/categoryRoutes.js";
import {
  deleteUserController,
  fetchBudgets,
  loginController,
  logout,
  registerController,
  setZeroBalance,
  userDetails,
} from "./controllers/authController.js";
import {
  contributeAmount,
  contributor,
} from "./controllers/ContributeController.js";
import {smsEntryController} from "./controllers/smsController.js"
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/category", categoryRoutes);

app.post("/register", registerController);
app.post("/login", loginController);
app.post("/delete", deleteUserController);
app.get("/getuser/:id", userDetails);
app.post("/logout", logout);
app.post("/setzerobalance", setZeroBalance);

app.post("/contribute/email", contributor);
app.post("/contribute/amount", contributeAmount);

app.post("/fetchBudgets", fetchBudgets);
app.post("/smsEntry",smsEntryController);
// group routes
app.use("/api/groups", groupRoutes);

app.post("/save-image", (req, res) => {
  const { image } = req.body;

  // Decode the data URL and save the image to the public/images/ directory
  const base64Data = image.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(
    "public/images/captured-chart.png",
    base64Data,
    "base64",
    (err) => {
      if (err) {
        console.error("Error saving the image:", err);
        res.status(500).json({ error: "Failed to save the image" });
      } else {
        console.log("Image saved successfully");
        res.status(200).json({ message: "Image saved successfully" });
      }
    }
  );
});
