import React from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styles from "./EventCalendar.module.scss";

// ダミーイベント（本番はAPI連携可）
const events = [
  { date: "2025-04-29", title: "会社説明会" },
  { date: "2025-05-02", title: "面接会" },
  { date: "2025-05-10", title: "インターン開始" }
];

function tileContent({ date, view }) {
  if (view === 'month') {
    const found = events.find(e => e.date === date.toISOString().slice(0, 10));
    return found ? <span className={styles.eventDot} title={found.title}>●</span> : null;
  }
  return null;
}

export default function EventCalendar() {
  return (
    <div className={styles.calendarWrap}>
      <Calendar
        locale="ja-JP"
        tileContent={tileContent}
      />
      <ul className={styles.eventList}>
        {events.map(e => (
          <li key={e.date}><span>{e.date}</span>：{e.title}</li>
        ))}
      </ul>
    </div>
  );
}
