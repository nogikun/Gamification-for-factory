import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./Main.module.scss";

export default function Main({ children }) {
  return (
    <main id="main-content" className={styles.main} tabIndex={-1}>
      {children || <Outlet />}
    </main>
  );
}
