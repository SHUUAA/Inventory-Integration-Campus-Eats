import React from "react";
import "../css/Dashboard.css";
import { logout } from "../auth/Logout";

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <button className="btn bg-red-950" onClick={logout}>LOGOUT</button>
    </div>
  );
};

export default Dashboard;
