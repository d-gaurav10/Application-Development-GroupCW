import React from "react";

export default function SummaryCard({ title, value }) {
  return (
    <div className="summary-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}