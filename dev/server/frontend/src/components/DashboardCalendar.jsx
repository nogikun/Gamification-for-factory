import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styles from "./DashboardCalendar.module.scss";

const jaWeekdays = ['日', '月', '火', '水', '木', '金', '土'];

export default function DashboardCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // イベントデータを取得
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [eventsResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:8000/event'),
          fetch('http://localhost:8000/api/users')
        ]);

        let eventsData = [];
        let usersData = [];

        if (eventsResponse.ok) {
          eventsData = await eventsResponse.json();
          eventsData = Array.isArray(eventsData) ? eventsData : [];
        }

        if (usersResponse.ok) {
          usersData = await usersResponse.json();
          usersData = Array.isArray(usersData) ? usersData : [];
        }

        // ユーザー名取得ヘルパー
        const getUserName = (userId) => {
          const user = usersData.find(u => u.user_id === userId);
          return user ? `${user.last_name} ${user.first_name}` : '運営者';
        };

        // イベントデータを変換
        const formattedEvents = eventsData.map(event => ({
          date: event.start_date ? event.start_date.split('T')[0] : event.date,
          title: event.title || event.name,
          organizer: getUserName(event.organizer_id || event.created_by) || '運営者',
          location: event.location || 'オンライン',
          event_id: event.event_id
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error('イベントデータ取得エラー:', err);
        setError('イベントデータの取得に失敗しました');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 日付をクリックしたときの処理
  const handleDayClick = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    setSelectedDate(date);
    setActiveStartDate(date);
  };

  // 予定一覧のアイテムをクリックしたときの処理
  const handleEventClick = (date) => {
    const eventDate = new Date(date);
    setSelectedDate(eventDate);
    setActiveStartDate(eventDate);
  };

  // カレンダーのタイル内容をカスタマイズ
  const tileContent = ({ date, view }) => {
    if (view === 'month' && Array.isArray(events)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const found = events.find(e => e.date === dateStr);
      
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
    if (view === 'month' && Array.isArray(events)) {
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
  const sortedEvents = Array.isArray(events) ? 
    [...events].sort((a, b) => new Date(a.date) - new Date(b.date)) : [];

  if (isLoading) {
    return (
      <div className={styles.calendarContainer}>
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingSpinner}></div>
          <p>イベントを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.calendarContainer}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      
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
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event, index) => (
                <div 
                  key={event.event_id || index} 
                  className={`${styles.allEventsItem} ${
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
              ))
            ) : (
              <div className={styles.noEvents}>
                予定されているイベントはありません
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
