import "./App.css";
import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
const Loader = lazy(() => import("./components/Loader"));
const Error = lazy(() => import("./pages/Error"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotPassword = lazy(() => import("./pages/ForgotPasswordPage"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Inventory = lazy(() => import("./components/Inventory"));
const Settings = lazy(() => import("./components/Settings"));
const Orders = lazy(() => import("./components/Orders"));
const CustomerPage = lazy(() => import("./pages/Customer"));
const AdminPage = lazy(() => import("./pages/Admin"));
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";
import SellerPage from "./pages/Seller";

function App() {
  return (
    <>
      <Suspense fallback={<Loader></Loader>}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer"
                element={
                  <ProtectedRoute>
                    <CustomerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller"
                element={
                  <ProtectedRoute>
                    <SellerPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Error />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </Suspense>
    </>
  );
}

export default App;
