import React, { startTransition } from "react";
import "../css/Dashboard.css";
import { logout } from "../auth/Logout";
import DataFetch from "./data/Fetch";

const Dashboard = () => {
  let data;
  startTransition(() => {
    // Code that might suspend, e.g., fetching data
     data = DataFetch(); // Example of a long task
    // Update state based on data
  });
  return (
    <div>
      <h2>Dashboard</h2>
      <button className="btn bg-red-950" onClick={logout}>LOGOUT</button>
      <div>{data}</div>
    </div>
  );
};

export default Dashboard;
