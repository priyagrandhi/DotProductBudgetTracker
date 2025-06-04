import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axiosInstance from "../api/axiosInstance";

const BudgetChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState({ budget: 0, actual_expense: 0, month: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const res = await axiosInstance.get("monthly-budget-vs-expense/");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching budget data:", err);
        setError("Failed to load budget data");
      }
    };

    fetchBudgetData();
  }, []);

  useEffect(() => {
    if (!data) return;

    d3.select(chartRef.current).selectAll("*").remove();

    const chartData = [
      { label: "Budget", value: data.budget || 0 },
      { label: "Actual Expense", value: data.actual_expense || 0 },
    ];

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };

    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

    const x = d3
      .scaleBand()
      .domain(chartData.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.value) * 1.1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // Y Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Bars
    svg.selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", (d) => d.label === "Budget" ? "#4caf50" : "#f44336");
  }, [data]);

  // Format month to readable string like "June 2025"
  const formatMonth = (monthStr) => {
    if (!monthStr) return "";
    const date = new Date(`${monthStr}-01`);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  return (
    <div>
      <h3>Budget vs Actual Expense</h3>
      {data.month && (
        <p>
          <strong>Month:</strong> {formatMonth(data.month)} &nbsp;|&nbsp; 
          <strong>Budget:</strong> ₹{data.budget}
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default BudgetChart;
