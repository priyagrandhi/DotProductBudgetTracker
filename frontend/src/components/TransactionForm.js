import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function TransactionForm({ onAdd, fetchTransactions ,onSuccess}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("expense");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!description || !amount || !date || !type) {
      setError("Please fill all fields.");
      return;
    }
    
    try {
      const data = {
        description,
        amount: parseFloat(amount),
        date,
        type,
      };

      const response = await axiosInstance.post("transactions/", data);

      onAdd && onAdd(response.data);
      setSuccess("Transaction added successfully!");
      setError("");

      // Reset form
      setDescription("");
      setAmount("");
      setDate("");
      setType("expense");
      if(onAdd){
        onAdd();
      }
      if(onSuccess) onSuccess();
      
      //fetchTransactions && fetchTransactions();
    } catch (err) {
      console.error("Failed to add transaction:", err.response?.data || err.message);
      setError("Failed to add transaction. Please try again.");
      setSuccess("");
    }
  };

  // Auto clear success/error messages after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, success]);
  const today = new Date().toISOString().split("T")[0];
  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>

      <input
        type="text"
        placeholder="Category Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        step="0.01"
      />

      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e)=> setDate(e.target.value)}
        min={today}
      />

      <select value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="">Select Category Type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <button type="submit" >Add</button>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default TransactionForm;
