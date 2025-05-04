import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styles from "./EventRegistration.module.scss";
import { usePageAnimation } from "../hooks/usePageAnimation";
import { Pencil, Trash } from "phosphor-react";

const jaWeekdays = ['日', '月', '火', '水', '木', '金', '土'];

// ダミーイベントデータ（すべてインターンシップ関連）
const eventsData = [
  { 
    id: 1,
    date: "2025-06-10", 
    title: "町工場ものづくり体験インターンシップ",
    organizer: "技術部 山田",
    location: "本町工場 第一作業場",
    description: "地元の学生向け3日間の町工場体験インターンシップ。金属加工の基礎技術と職人技を実際に体験できます。少人数制で丁寧に指導します。"
  },
  { 
    id: 2,
    date: "2025-05-20", 
    title: "インターンシップ事前説明会",
    organizer: "人事部 佐藤",
    location: "オンライン（Zoom）",
    description: "夏季インターンシップの事前説明会です。持ち物や注意事項について説明します。"
  },
  { 
    id: 3,
    date: "2025-07-05", 
    title: "インターンシップ成果発表会",
    organizer: "技術部 鈴木",
    location: "本社会議室",
    description: "インターンシップ参加者による成果発表会。製作した作品の展示と発表を行います。"
  },
  { 
    id: 4,
    date: "2025-05-15", 
    title: "インターンシップ応募締切",
    organizer: "人事部 田中",
    location: "-",
    description: "夏季インターンシップの応募締切日です。応募書類を人事部までご提出ください。"
  }
];

function formatDateYMD(date) {
  // date: Date → 'YYYY-MM-DD' で返す（タイムゾーン影響なし）
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function EventRegistration() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const calendarRef = useRef(null);
  const formRef = useRef(null);
  const eventsListRef = useRef(null);
  const navigate = useNavigate();

  // Apply animation hook
  usePageAnimation({ 
    containerRef, 
    titleRef, 
    contentRefs: [calendarRef, formRef, eventsListRef] // Pass refs for main content blocks
  });

  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const [startDate, setStartDate] = useState("");
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [events, setEvents] = useState(eventsData);
  const [formData, setFormData] = useState({
    id: null,
    date: "",
    title: "",
    organizer: "",
    location: "",
    description: ""
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (dateParam) {
      const d = new Date(dateParam);
      setStartDate(formatDateYMD(d));
      setActiveStartDate(d);
      setFormData({...formData, date: formatDateYMD(d)});
    }
  }, [dateParam]);

  const handleCalendarClick = (date) => {
    const formattedDate = formatDateYMD(date);
    setStartDate(formattedDate);
    setActiveStartDate(date);
    setFormData({...formData, date: formattedDate});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    
    if (name === 'date') {
      setStartDate(value);
      setActiveStartDate(new Date(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editMode) {
      // 編集モード：既存のイベントを更新
      const updatedEvents = events.map(event => 
        event.id === formData.id ? {...formData} : event
      );
      setEvents(updatedEvents);
      alert("イベントを更新しました");
    } else {
      // 新規作成モード：新しいイベントを追加
      const newEvent = {
        ...formData,
        id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1
      };
      setEvents([...events, newEvent]);
      alert("イベントを登録しました");
    }
    
    resetForm();
  };

  const handleEdit = (event) => {
    setFormData(event);
    setStartDate(event.date);
    setActiveStartDate(new Date(event.date));
    setEditMode(true);
    
    // フォームにスクロール
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("このイベントを削除してもよろしいですか？")) {
      const filteredEvents = events.filter(event => event.id !== id);
      setEvents(filteredEvents);
      
      if (formData.id === id) {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      date: startDate, // 現在選択されている日付は保持
      title: "",
      organizer: "",
      location: "",
      description: ""
    });
    setEditMode(false);
  };

  // カレンダーのタイル内容をカスタマイズ
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = formatDateYMD(date);
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
  const tileClassName = ({ date }) => {
    const dateStr = formatDateYMD(date);
    const found = events.find(e => e.date === dateStr);
    return found ? styles.eventTile : undefined;
  };

  // 日付に関連するイベントを取得
  const getEventsForDate = (dateStr) => {
    return events.filter(event => event.date === dateStr);
  };

  // 選択日のイベント
  const selectedDateEvents = getEventsForDate(startDate);

  return (
    <div ref={containerRef} className={styles.eventRegWrap}>
      <h1 ref={titleRef} className={styles.title}>イベント{editMode ? '編集' : '登録'}</h1>
      <div className={styles.gridRow}>
        <div className={styles.leftColumn}>
          <div ref={calendarRef} className={styles.calendarCard}>
            <div className={styles.calendarTitle}>開催日を選択</div>
            <Calendar
              locale="ja-JP"
              calendarType="gregory"
              formatShortWeekday={(_, date) => jaWeekdays[date.getDay()]}
              onClickDay={handleCalendarClick}
              tileClassName={tileClassName}
              tileContent={tileContent}
              prev2Label={null}
              next2Label={null}
              value={new Date(startDate || Date.now())}
              activeStartDate={activeStartDate}
              onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
            />
          </div>
          
          <div ref={eventsListRef} className={styles.eventsListCard}>
            <div className={styles.eventsListTitle}>
              {startDate ? `${new Date(startDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}のイベント` : 'すべてのイベント'}
            </div>
            {selectedDateEvents.length > 0 ? (
              <div className={styles.eventsList}>
                {selectedDateEvents.map(event => (
                  <div key={event.id} className={styles.eventItem}>
                    <div className={styles.eventHeader}>
                      <div className={styles.eventTitle}>{event.title}</div>
                      <div className={styles.eventActions}>
                        <button 
                          className={styles.editButton} 
                          onClick={() => handleEdit(event)}
                          title="編集"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          className={styles.deleteButton} 
                          onClick={() => handleDelete(event.id)}
                          title="削除"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                    <div className={styles.eventDetail}>
                      <span className={styles.eventLabel}>主催者:</span> {event.organizer}
                    </div>
                    <div className={styles.eventDetail}>
                      <span className={styles.eventLabel}>場所:</span> {event.location}
                    </div>
                    <div className={styles.eventDetail}>
                      <span className={styles.eventLabel}>概要:</span> {event.description}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noEvents}>
                <p>この日のイベントはありません</p>
                <p>フォームから新しいイベントを登録できます</p>
              </div>
            )}
          </div>
        </div>
        
        <form ref={formRef} className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.formTitle}>
            {editMode ? 'イベント編集' : '新規イベント登録'}
            {editMode && (
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={resetForm}
              >
                キャンセル
              </button>
            )}
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>開催日
              <input 
                type="date" 
                name="date"
                value={formData.date} 
                onChange={handleInputChange} 
                required 
                className={styles.formInput} 
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>イベント名
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="イベント名を入力" 
                required
                className={styles.formInput} 
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>主催者
              <input 
                type="text" 
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                placeholder="主催者名を入力" 
                required
                className={styles.formInput} 
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>開催場所
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="会場・オンライン等" 
                required
                className={styles.formInput} 
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>イベント概要
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="イベントの説明を入力" 
                required
                className={styles.formTextarea} 
                rows={4} 
              />
            </label>
          </div>
          <button type="submit" className={styles.submitBtn}>
            {editMode ? '更新' : '登録'}
          </button>
        </form>
      </div>
    </div>
  );
}
