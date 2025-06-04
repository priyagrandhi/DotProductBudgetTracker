import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ description: "", amount: "", date: "" });

  const PAGE_SIZE = 5;

  const fetchTransactions = useCallback(
    async (page = 1) => {
      setError("");
      try {
        let url = `transactions/?page=${page}`;
        if (typeFilter) url += `&type=${typeFilter}`;
        if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

        const response = await axiosInstance.get(url);
        const data = response.data;

        const count = data.count || 0;
        const calculatedTotalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
        setTotalPages(calculatedTotalPages);

        if (page > calculatedTotalPages) {
          setCurrentPage(calculatedTotalPages);
          return;
        }

        setTransactions(data.results || []);
        setCurrentPage(page);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions. Please try again.");
        setTransactions([]);
        setTotalPages(1);
      }
    },
    [typeFilter, searchQuery]
  );

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [typeFilter, searchQuery, currentPage, fetchTransactions]);

  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleEditClick = (txn) => {
    setEditingId(txn.id);
    setEditData({
      description: txn.description,
      amount: txn.amount,
      date: txn.date,
    });
    setError("");
    setSuccess("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      if (!editData.description.trim() || !editData.amount || !editData.date) {
        setError("Please fill all fields.");
        return;
      }

      const originalTransaction = transactions.find((t) => t.id === editingId);
      if (!originalTransaction) {
        setError("Original transaction not found.");
        return;
      }

      const payload = {
        description: editData.description.trim(),
        amount: parseFloat(editData.amount),
        date: editData.date,
        type: originalTransaction.type,
      };

      await axiosInstance.patch(`transactions/${editingId}/`, payload);

      setSuccess("Transaction updated successfully.");
      setEditingId(null);
      fetchTransactions(currentPage);
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError("Failed to update transaction.");
      setSuccess("");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await axiosInstance.delete(`transactions/${id}/`);
      setSuccess("Transaction deleted successfully.");
      if (transactions.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchTransactions(currentPage);
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError("Failed to delete transaction.");
      setSuccess("");
    }
  };

  return (
    <div>
      <h3>Transaction List</h3>

      {/* Filters */}
      <div style={{ marginBottom: "10px" }}>
        <label>Filter by Type: </label>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="text"
          placeholder="Search by description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {transactions.length === 0 && !error ? (
        <p>No transactions found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount (₹)</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) =>
              editingId === txn.id ? (
                <tr key={txn.id}>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={editData.date}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="amount"
                      value={editData.amount}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>{txn.type}</td>
                  <td>
                    <button onClick={handleEditSave}>Save</button>
                    <button onClick={handleEditCancel} style={{ marginLeft: "5px" }}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={txn.id}>
                  <td>{txn.date}</td>
                  <td>{txn.description}</td>
                  <td>{Number(txn.amount).toFixed(2)}</td>
                  <td>{txn.type}</td>
                  <td>
                    <button onClick={() => handleEditClick(txn)}>Edit</button>
                    <button
                      onClick={() => handleDelete(txn.id)}
                      style={{ marginLeft: "5px", color: "red" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        <button disabled={currentPage === 1} onClick={goToPrevPage}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button disabled={currentPage === totalPages} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}

export default TransactionList;
