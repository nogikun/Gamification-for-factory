import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styles from "./EventRegistration.module.scss";

const jaWeekdays = ['日', '月', '火', '水', '木', '金', '土'];

function formatDateYMD(date) {
  // date: Date → 'YYYY-MM-DD' で返す（タイムゾーン影響なし）
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function EventRegistration() {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    if (dateParam) {
      const d = new Date(dateParam);
      d.setDate(d.getDate() + 1);
      setStartDate(d.toISOString().slice(0,10));
    }
  }, [dateParam]);

  const handleCalendarClick = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setStartDate(d.toISOString().slice(0,10));
  };

  let badge = null;
  if (dateParam) {
    const d = new Date(dateParam);
    badge = (
      <div className={styles.badge}>
        <span>◉ {d.getMonth()+1}/{d.getDate()} で作成中</span>
      </div>
    );
  }

  return (
    <div className={styles.eventRegWrap}>
      <h1 className={styles.title}>イベント登録</h1>
      {badge}
      <div className={styles.gridRow}>
        <div className={styles.calendarCard}>
          <div className={styles.calendarTitle}>開催日を選択</div>
          <Calendar
            locale="ja-JP"
            calendarType="gregory"
            formatShortWeekday={(_, date) => jaWeekdays[date.getDay()]}
            onClickDay={handleCalendarClick}
            tileClassName={({ date }) => {
              // 選択日だけ色付け（時差のズレも回避）
              return startDate && formatDateYMD(date) === startDate ? styles.selectedTile : undefined;
            }}
            tileContent={({ date, view }) => null}
            prev2Label={null}
            next2Label={null}
          />
        </div>
        <form className={styles.formCard} onSubmit={e => e.preventDefault()}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>開催日
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className={styles.formInput} />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>イベント名
              <input type="text" placeholder="イベント名を入力" className={styles.formInput} />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>主催者
              <input type="text" placeholder="主催者名を入力" className={styles.formInput} />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>開催場所
              <input type="text" placeholder="会場・オンライン等" className={styles.formInput} />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>イベント概要
              <textarea placeholder="イベントの説明を入力" className={styles.formTextarea} rows={4} />
            </label>
          </div>
          <button type="submit" className={styles.submitBtn}>登録</button>
        </form>
      </div>
    </div>
  );
}
