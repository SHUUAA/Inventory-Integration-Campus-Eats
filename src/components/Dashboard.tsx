import React from "react";
import "../css/Dashboard.css";
import { logout } from "../auth/Logout";
import DataFetch from "./data/Fetch";

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <button className="btn bg-red-950" onClick={logout}>LOGOUT</button>
      <DataFetch></DataFetch>
    </div>
  );
};

export default Dashboard;
