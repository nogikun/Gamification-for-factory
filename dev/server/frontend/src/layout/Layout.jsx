import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "./Layout.module.scss";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Sidebar className={styles.sidebar} />
      <main className={styles.main}>
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}
