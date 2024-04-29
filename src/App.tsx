import "./App.css";
import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
const Loader = lazy(() => import("./components/Loader"));
const Error = lazy(() => import("./pages/Error"));
const Auth = lazy(() => import ("./pages/Auth"));
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {



  return  (
    <>
      <Suspense fallback={<Loader></Loader>}>
        <BrowserRouter>
          <Routes>
            <Route path ="/" element={<ProtectedRoute/>} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />

            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  );
}

export default App;
