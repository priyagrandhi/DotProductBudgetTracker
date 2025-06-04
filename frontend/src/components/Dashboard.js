
import React, { useState, useEffect, useRef} from "react";
import * as d3 from "d3";
import axiosInstance from "../api/axiosInstance";
import BudgetChart from "../components/BudgetChart";
import BudgetForm from "../components/BudgetForm";
function Dashboard() {
  const [refreshChart, setRefreshChart] = useState(false);
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    monthly_expense: 0,
  });
  const [budgetData, setBudgetData] = useState(null);
  const [error, setError] = useState("");
  const chartRef = useRef(null);
  const ChartBudgetRef = useRef(null); 
  const fetchSummary = async () => {
      try {
        const res = await axiosInstance.get("summary/");
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
        setError("Failed to load summary");
      }
    };
    const fetchBudgetComparison = async () => {
    try {
      const res = await axiosInstance.get("monthly-budget-vs-expense/");
      setBudgetData({
        month: res.data.month,
        budget: res.data.budget,
        actual_expense: res.data.actual_expense,
      });
    } catch (err) {
      console.error("Error fetching budget data:", err);
      setError("Failed to load budget data");
    }
  };

useEffect(()=>{
    fetchSummary();
    fetchBudgetComparison();
  }, []);

  useEffect(() => {
    if (!summary) return;

    // Clear previous chart before drawing
    d3.select(chartRef.current).selectAll("*").remove();

    const data = [
      { label: "Income", value: summary.income || 0 },
      { label: "Expenses", value: summary.expense || 0 },
      { label: "Monthly Expense", value: summary.monthly_expense || 0 },
    ];

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };

    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow","visible");

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) * 1.1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(0,5)")
      .style("text-anchor", "middle");

    // Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", (d) => (d.label === "Income" ? "green" : "red"));
  }, [summary]);

   // Chart 2: Budget vs Actual Expense Bar Chart
  useEffect(() => {
    if (!budgetData || !ChartBudgetRef.current) return;

    d3.select(ChartBudgetRef.current).selectAll("*").remove();

    const data = [
      { label: "Budget", value: budgetData.budget  },
      { label: "Actual Expense", value: budgetData.actual_expense  },
    ];

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };

    const svg = d3
      .select(ChartBudgetRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow","visible");

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) * 1.1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", (d) => (d.label === "Budget" ? "blue" : "orange"));
  }, [budgetData]);

   return (
    <div>
      <h2>Dashboard</h2>

      {/* Summary Section */}
      <div>
        <h3>Financial Summary</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
          <li><strong>Total Income:</strong> ₹{Number(summary.income).toFixed(2)}</li>
          <li><strong>Total Expense:</strong> ₹{Number(summary.expense).toFixed(2)}</li>
          <li><strong>Balance:</strong> ₹{Number(summary.income - summary.expense).toFixed(2)}</li> 
          <li><strong>This Month's Expense:</strong> ₹{Number(summary.monthly_expense).toFixed(2)}</li>
        </ul>
      </div>
       
      {/* Transaction Add + List */}
     {/* D3.js Chart */}
      <svg ref={chartRef}  style={{ overflow: "visible" }}></svg>
    <div>
        <BudgetForm onBudgetSet={() => setRefreshChart(!refreshChart)} />
      <BudgetChart refreshTrigger={refreshChart} />
      </div>
      
    </div>
  );
}

export default Dashboard;