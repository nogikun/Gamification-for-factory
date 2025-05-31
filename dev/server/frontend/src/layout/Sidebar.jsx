import React from "react";
import { NavLink } from "react-router-dom";
import { ChartLineUp, CalendarPlus, Users, Star, Bell, SignOut, Buildings } from "phosphor-react";
import styles from "./Sidebar.module.scss";

const nav = [
  { to: "/dashboard", icon: <ChartLineUp size={20} />, label: "ダッシュボード" },
  { to: "/events/new", icon: <CalendarPlus size={20} />, label: "イベント登録" },
  { to: "/applicants", icon: <Users size={20} />, label: "応募者一覧" },
  { to: "/reviews", icon: <Star size={20} />, label: "レビュー" },
  { to: "/notifications", icon: <Bell size={20} />, label: "通知" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside
      className={[
        styles.sidebar,
        open ? styles["sidebar--open"] : ""
      ].join(" ")}
      role="navigation"
      aria-label="メインナビゲーション"
      tabIndex={-1}
    >
      <div className={styles["sidebar__brand"]}>
        <Buildings size={28} style={{ marginRight: 8 }} />
        <span>インターン管理</span>
      </div>
      <nav className={styles["sidebar__nav"]}>
        <ul>
          {nav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    styles["sidebar__link"],
                    isActive ? styles["sidebar__link--active"] : ""
                  ].join(" ")
                }
                tabIndex={0}
              >
                <span className={styles["sidebar__icon"]}>{item.icon}</span>
                <span className={styles["sidebar__label"]}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles["sidebar__footer"]}>
        <button className={styles["sidebar__link"]} tabIndex={0}>
          <SignOut size={20} className={styles["sidebar__icon"]} />
          <span className={styles["sidebar__label"]}>ログアウト</span>
        </button>
      </div>
      {/* モバイル時: サイドバー外クリックで閉じる用途 */}
      {open && (
        <button
          className={styles["sidebar__close"]}
          aria-label="サイドバーを閉じる"
          onClick={onClose}
          tabIndex={0}
        >×</button>
      )}
    </aside>
  );
}
