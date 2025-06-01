import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import EventRegistration from "./pages/EventRegistration";
import Applicants from "./pages/Applicants";
import Reviews from "./pages/Reviews";
import Notifications from "./pages/Notifications";
import CompanyEdit from "./pages/CompanyEdit";
import Debug from "./pages/Debug";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="events/new" element={<EventRegistration />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="company" element={<CompanyEdit />} />
          <Route path="debug" element={<Debug />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
