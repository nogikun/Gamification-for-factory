import React from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import styles from "./DashboardCalendar.module.scss";

const events = [
  { date: "2025-04-29", title: "会社説明会" },
  { date: "2025-05-02", title: "面接会" },
  { date: "2025-05-10", title: "インターン開始" }
];

const jaWeekdays = ['日', '月', '火', '水', '木', '金', '土'];

export default function DashboardCalendar() {
  const navigate = useNavigate();
  const handleDayClick = date => {
    const ymd = date.toISOString().slice(0,10);
    navigate(`/events/new?date=${ymd}`);
  };
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const found = events.find(e => e.date === date.toISOString().slice(0, 10));
      return found ? <span className={styles.eventDot} title={found.title}>●</span> : null;
    }
    return null;
  };
  return (
    <div className={styles.calendarWrap}>
      <Calendar
        locale="ja-JP"
        calendarType="gregory"
        formatShortWeekday={(_, date) => jaWeekdays[date.getDay()]}
        tileContent={tileContent}
        onClickDay={handleDayClick}
      />
    </div>
  );
}
