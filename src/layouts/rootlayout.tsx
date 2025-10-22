import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main id="main" className="flex-1">
        {/* TEMP sanity text so we always see something */}
        <div className="container-safe py-4 text-sm text-neutral-600">
          <span>Layout mounted ✔</span>
        </div>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
