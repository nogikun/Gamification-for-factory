import React from "react";
import DashboardCalendar from "../components/DashboardCalendar";
import styles from "./Dashboard.module.scss";
import { UserPlus, CalendarCheck, HourglassMedium } from "phosphor-react";

const Dashboard = () => {
  const kpi = [
    { icon: <UserPlus size={28} />, label: "応募者", value: 12, sub: "本日 +2名" },
    { icon: <CalendarCheck size={28} />, label: "今後のイベント", value: 3, sub: "今週 1件" },
    { icon: <HourglassMedium size={28} />, label: "未対応レビュー", value: 5, sub: "昨日 -1件" },
  ];
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.dashboard__title}>ダッシュボード概要</h1>
      <div className={styles.dashboard__kpiRow}>
        {kpi.map((item, i) => (
          <div className={`${styles.kpiCard} shadow-md rounded-md`} key={i}>
            <div className={styles.kpiCard__icon}>{item.icon}</div>
            <div className={styles.kpiCard__label}>{item.label}</div>
            <div className={styles.kpiCard__value}>{item.value}</div>
            <div className={styles.kpiCard__sub}>{item.sub}</div>
          </div>
        ))}
      </div>
      <div className={styles.dashboard__calendarRow}>
        <DashboardCalendar />
        <section className={styles.dashboard__activity}>
          <h2 className={styles.dashboard__sectionTitle}>最近のアクティビティ</h2>
          <ul className={styles.activityList}>
            <li>ユーザーAがイベントXに応募しました</li>
            <li>イベントYが作成されました</li>
            <li>ユーザーBのレビューが提出されました</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
