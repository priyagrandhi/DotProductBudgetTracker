import React, { useRef } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

function TransactionsPage() {
  // Create a ref to call refresh method on TransactionList
  const refreshRef = useRef();

  // This function will be called after a successful add in the form
  const handleAddSuccess = () => {
    refreshRef.current?.refresh(); // Call refresh on TransactionList
  };

  return (
    <div>
      <h2> Transactions Page </h2>
      {/* Pass the success callback to the form */}
      <TransactionForm onSuccess={handleAddSuccess} />
      {/* Pass the ref to the transaction list */}
      <TransactionList ref={refreshRef} />
    </div>
  );
}

export default TransactionsPage;
