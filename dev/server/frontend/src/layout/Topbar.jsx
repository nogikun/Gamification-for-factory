import React from "react";
import { List, Bell, Buildings } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import styles from "./Topbar.module.scss";

export default function Topbar({ onMenu }) {
  const navigate = useNavigate();
  return (
    <header className={styles.topbar} role="banner" aria-label="トップバー">
      <button
        className={styles.topbar__menuButton}
        onClick={onMenu}
        aria-label="メニューを開く"
        tabIndex={0}
      >
        <List size={24} />
      </button>
      <div className={styles.topbar__title}>ダッシュボード</div>
      <div className={styles.topbar__actions}>
        <button aria-label="通知" tabIndex={0} onClick={() => navigate("/notifications")}> 
          <Bell size={20} />
        </button>
        <button aria-label="会社情報編集" tabIndex={0} onClick={() => navigate("/company")}> 
          <Buildings size={20} />
        </button>
      </div>
    </header>
  );
}
