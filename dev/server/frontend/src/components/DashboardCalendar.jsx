import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styles from "./DashboardCalendar.module.scss";

// ダミーイベントデータ（すべてインターンシップ関連）
const events = [
  { 
    date: "2025-06-10", 
    title: "町工場ものづくり体験インターンシップ",
    organizer: "技術部 山田",
    location: "本町工場 第一作業場",
  },
  { 
    date: "2025-05-20", 
    title: "インターンシップ事前説明会",
    organizer: "人事部 佐藤",
    location: "オンライン（Zoom）",
  },
  { 
    date: "2025-07-05", 
    title: "インターンシップ成果発表会",
    organizer: "技術部 鈴木",
    location: "本社会議室",
  },
  { 
    date: "2025-05-15", 
    title: "インターンシップ応募締切",
    organizer: "人事部 田中",
    location: "-",
  }
];

const jaWeekdays = ['日', '月', '火', '水', '木', '金', '土'];

export default function DashboardCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // 日付をクリックしたときの処理
  const handleDayClick = date => {
    // 日付をYYYY-MM-DD形式に変換（タイムゾーン調整）
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    setSelectedDate(date);
    setActiveStartDate(date); // カレンダーの表示月も更新
  };

  // 予定一覧のアイテムをクリックしたときの処理
  const handleEventClick = (date) => {
    const eventDate = new Date(date);
    setSelectedDate(eventDate);
    setActiveStartDate(eventDate); // カレンダーの表示月を更新
  };

  // カレンダーのタイル内容をカスタマイズ
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      // 日付をYYYY-MM-DD形式に変換（タイムゾーン調整）
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const found = events.find(e => e.date === dateStr);
      
      // 予定がある日は背景色を変える
      if (found) {
        return (
          <div className={styles.eventTileContent}>
            <div className={styles.eventIndicator}></div>
          </div>
        );
      }
    }
    return null;
  };

  // タイルのクラス名をカスタマイズ
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // 日付をYYYY-MM-DD形式に変換（タイムゾーン調整）
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const found = events.find(e => e.date === dateStr);
      return found ? styles['react-calendar__tile--hasEvent'] : null;
    }
    return null;
  };

  // 全てのイベントを日付順に並べ替え
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarLayout}>
        <div className={styles.calendarWrap}>
          <Calendar
            locale="ja-JP"
            calendarType="gregory"
            formatShortWeekday={(_, date) => jaWeekdays[date.getDay()]}
            tileContent={tileContent}
            tileClassName={tileClassName}
            onClickDay={handleDayClick}
            value={selectedDate}
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
          />
        </div>
        
        <div className={styles.allEventsContainer}>
          <h3 className={styles.allEventsTitle}>予定一覧</h3>
          <div className={styles.allEventsList}>
            {sortedEvents.map((event, index) => (
              <div 
                key={index} 
                className={`${styles.allEventsItem} ${
                  // 日付をYYYY-MM-DD形式に変換（タイムゾーン調整）
                  (() => {
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                    const day = String(selectedDate.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;
                    return event.date === dateStr ? styles.selectedEvent : '';
                  })()
                }`}
                onClick={() => handleEventClick(event.date)}
              >
                <div className={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </div>
                <div className={styles.eventTitle}>{event.title}</div>
                <div className={styles.eventOrganizer}>{event.organizer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
