import "./App.css";
import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AdminLayout from "./layout/AdminLayout";
import SellerLayout from "./layout/SellerLayout";
import { UserProvider } from "./auth/UserContext";
import CustomerLayout from "./layout/CustomerLayout";
import ProtectedRoute from "./auth/ProtectedRoute";
const Loader = lazy(() => import("./components/Loader"));
const Error = lazy(() => import("./pages/Error"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotPassword = lazy(() => import("./pages/ForgotPasswordPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Settings = lazy(() => import("./components/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const Supplier = lazy(() => import("./pages/Supplier"));
const Products = lazy(() => import("./pages/Products"));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
      <Suspense fallback={<Loader></Loader>}>
        <UserProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />

                {/* Seller Layout */}
                <Route
                  element={
                    <Suspense fallback={<Loader></Loader>}>
                      <ProtectedRoute>
                        <SellerLayout />
                      </ProtectedRoute>
                    </Suspense>
                  }
                >
                  <Route
                    path="/seller/dashboard"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/seller/profile"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/seller/inventory"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Inventory />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/seller/settings"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/seller/supplier"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Supplier />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/products/*"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <Products />
                      </Suspense>
                    }
                  />
                </Route>

                {/* Customer Layout */}
                <Route
                  element={
                    <Suspense fallback={<Loader></Loader>}>
                      <ProtectedRoute>
                        <CustomerLayout />
                      </ProtectedRoute>
                    </Suspense>
                  }
                >
                  <Route
                    path="/customer/dashboard"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/customer/profile"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/customer/inventory"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Inventory />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/customer/settings"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                </Route>

                {/* Admin Layout */}
                <Route
                  element={
                    <Suspense fallback={<Loader></Loader>}>
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    </Suspense>
                  }
                >
                  <Route
                    path="/admin/dashboard"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/profile"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/inventory"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Inventory />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <Suspense fallback={<Loader></Loader>}>
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  />
                </Route>

                <Route path="*" element={<Error />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </UserProvider>
      </Suspense>
  );
}

export default App;
