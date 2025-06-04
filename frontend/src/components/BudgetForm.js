import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const BudgetForm = ({ onBudgetSet }) => {
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("budgets/", {
        month,
        amount,
      });
      alert("Budget saved successfully!");
      setMonth("");
      setAmount("");
      if (onBudgetSet) onBudgetSet(); // refresh chart if needed
    } catch (err) {
      console.error("Error saving budget:", err);
      alert("Failed to save budget. A record for this month may already exist.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Set Monthly Budget</h3>
      <label>
        Month (YYYY-MM):{" "}
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          min={new Date().toISOString().slice(0,7)}
          required
        />
      </label>
      <br />
      <label>
        Budget Amount (₹):{" "}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Save Budget</button>
    </form>
  );
};

export default BudgetForm;
