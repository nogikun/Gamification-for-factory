import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styles from "./EventRegistration.module.scss";
import { usePageAnimation } from "../hooks/usePageAnimation";
import { Pencil, Trash, Upload } from "phosphor-react";
import { apiRequest, API_BASE_URL } from "../config";

const jaWeekdays = ['日', '月', '火', '水', '木', '金', '土'];

// イベントタイプの定義
const EVENT_TYPES = {
  INTERNSHIP: "インターンシップ",
  SEMINAR: "説明会"
};

// タグのカラーパレット
const TAG_COLORS = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
  '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'
];

function formatDateYMD(date) {
  // date: Date → 'YYYY-MM-DD' で返す（タイムゾーン影響なし）
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateTimeLocal(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const h = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}`;
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
    contentRefs: [calendarRef, formRef, eventsListRef]
  });

  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const [startDate, setStartDate] = useState("");
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newTagInput, setNewTagInput] = useState("");
  const [selectedTagColor, setSelectedTagColor] = useState(TAG_COLORS[0]);
  const [formData, setFormData] = useState({
    event_id: null,
    company_id: "12345678-1234-1234-1234-123456789012", // 仮のUUID
    event_type: EVENT_TYPES.INTERNSHIP,
    title: "",
    image: null,
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    reward: "",
    required_qualifications: "",
    available_spots: 0,
    tags: []
  });
  const [editMode, setEditMode] = useState(false);

  // イベントデータを取得
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/event`);
      if (!response.ok) {
        throw new Error('イベントの取得に失敗しました');
      }
      const data = await response.json();
      
      // データが配列かどうかを確認
      if (Array.isArray(data)) {
        setEvents(data);
      } else if (data && Array.isArray(data.events)) {
        // dataオブジェクトの中にeventsプロパティがある場合
        setEvents(data.events);
      } else if (data && Array.isArray(data.data)) {
        // dataオブジェクトの中にdataプロパティがある場合
        setEvents(data.data);
      } else {
        // 期待される構造でない場合
        console.warn('APIから期待される配列形式のデータが返されませんでした:', data);
        setEvents([]);
      }
    } catch (err) {
      setError('イベントの取得中にエラーが発生しました: ' + err.message);
      console.error(err);
      setEvents([]); // エラー時は空配列をセット
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (dateParam) {
      const d = new Date(dateParam);
      setStartDate(formatDateYMD(d));
      setActiveStartDate(d);
      
      // 時刻部分をセット（デフォルトは9:00開始、17:00終了）
      const startDateTime = new Date(d);
      startDateTime.setHours(9, 0, 0);
      
      const endDateTime = new Date(d);
      endDateTime.setHours(17, 0, 0);
      
      setFormData({
        ...formData, 
        start_date: startDateTime.toISOString(),
        end_date: endDateTime.toISOString()
      });
    }
  }, [dateParam]);

  const handleCalendarClick = (date) => {
    const formattedDate = formatDateYMD(date);
    setStartDate(formattedDate);
    setActiveStartDate(date);
    
    // 時刻部分をセット（デフォルトは9:00開始、17:00終了）
    const startDateTime = new Date(date);
    startDateTime.setHours(9, 0, 0);
    
    const endDateTime = new Date(date);
    endDateTime.setHours(17, 0, 0);
    
    setFormData({
      ...formData, 
      start_date: startDateTime.toISOString(),
      end_date: endDateTime.toISOString()
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'available_spots') {
      // 数値型の処理
      setFormData({...formData, [name]: parseInt(value) || 0});
    } else if (type === 'datetime-local') {
      // 日時入力の処理
      if (value) {
        const dateObj = new Date(value);
        setFormData({...formData, [name]: dateObj.toISOString()});
        
        if (name === 'start_date') {
          setStartDate(formatDateYMD(dateObj));
          setActiveStartDate(dateObj);
        }
      }
    } else {
      // その他の通常入力
      setFormData({...formData, [name]: value});
    }
  };

  const handleNewTagInputChange = (e) => {
    setNewTagInput(e.target.value);
  };

  const handleTagColorChange = (color) => {
    setSelectedTagColor(color);
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    
    const newTag = {
      color: selectedTagColor,
      label: newTagInput.trim()
    };
    
    setFormData({
      ...formData,
      tags: [...formData.tags, newTag]
    });
    
    // 入力欄をクリアし、次の色を選択
    setNewTagInput("");
    const nextColorIndex = (TAG_COLORS.indexOf(selectedTagColor) + 1) % TAG_COLORS.length;
    setSelectedTagColor(TAG_COLORS[nextColorIndex]);
  };

  const handleRemoveTag = (indexToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleEventTypeChange = (e) => {
    const eventType = e.target.value;
    
    // イベントタイプが説明会の場合、報酬と必要資格をnullに設定
    if (eventType === EVENT_TYPES.SEMINAR) {
      setFormData({
        ...formData, 
        event_type: eventType,
        reward: null,
        required_qualifications: null
      });
    } else {
      setFormData({
        ...formData, 
        event_type: eventType,
        reward: formData.reward || "",
        required_qualifications: formData.required_qualifications || ""
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 画像のプレビュー用URL生成
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // ファイルをBase64変換
    const reader = new FileReader();
    reader.onloadend = () => {
      // Base64文字列を保存
      setUploadedImage(reader.result);
      setFormData({...formData, image: reader.result});
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // FormDataオブジェクト作成
      const apiFormData = {
        ...formData,
        // タグをJSONとして送信
        tags: JSON.stringify(formData.tags),
        // required_qualificationsを文字列からリストに変換
        required_qualifications: formData.required_qualifications 
          ? formData.required_qualifications.split(',').map(q => q.trim()).filter(q => q.length > 0)
          : []
      };
      
      const url = editMode 
        ? `${API_BASE_URL}/event/${formData.event_id}`
        : `${API_BASE_URL}/event`;
      
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiFormData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'APIへの送信に失敗しました');
      }
      
      // 成功したら再取得
      await fetchEvents();
      alert(editMode ? "イベントを更新しました" : "イベントを登録しました");
      resetForm();
      
    } catch (err) {
      setError('送信中にエラーが発生しました: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (event) => {
    // 日付文字列をDateオブジェクトに変換
    const startDate = new Date(event.start_date);
    
    // タグがJSON文字列の場合、オブジェクトに変換
    let tags = event.tags;
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (err) {
        tags = [];
      }
    }
    
    // タグがオブジェクト配列でない場合、変換する
    if (Array.isArray(tags) && tags.length > 0 && typeof tags[0] !== 'object') {
      tags = tags.map(tag => ({
        color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
        label: tag
      }));
    }
    
    setFormData({
      ...event,
      tags
    });
    
    setStartDate(formatDateYMD(startDate));
    setActiveStartDate(startDate);
    setEditMode(true);
    
    // 画像があればプレビューを設定
    if (event.image) {
      setImagePreview(event.image);
      setUploadedImage(event.image);
    } else {
      setImagePreview(null);
      setUploadedImage(null);
    }
    
    // フォームにスクロール
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("このイベントを削除してもよろしいですか？")) {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/event/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'イベントの削除に失敗しました');
        }
        
        // 成功したら再取得
        await fetchEvents();
        alert("イベントを削除しました");
        
        if (formData.event_id === id) {
          resetForm();
        }
      } catch (err) {
        setError('削除中にエラーが発生しました: ' + err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      event_id: null,
      company_id: "12345678-1234-1234-1234-123456789012", // 仮のUUID
      event_type: EVENT_TYPES.INTERNSHIP,
      title: "",
      image: null,
      description: "",
      start_date: startDate ? (() => {
        const d = new Date(startDate);
        d.setHours(9, 0, 0);
        return d.toISOString();
      })() : "",
      end_date: startDate ? (() => {
        const d = new Date(startDate);
        d.setHours(17, 0, 0);
        return d.toISOString();
      })() : "",
      location: "",
      reward: "",
      required_qualifications: "",
      available_spots: 0,
      tags: []
    });
    setEditMode(false);
    setImagePreview(null);
    setUploadedImage(null);
  };

  // カレンダーのタイル内容をカスタマイズ
  const tileContent = ({ date, view }) => {
    if (view === 'month' && Array.isArray(events)) {
      const dateStr = formatDateYMD(date);
      const found = events.some(e => formatDateYMD(new Date(e.start_date)) === dateStr);
      
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
    if (!Array.isArray(events)) return undefined;
    
    const dateStr = formatDateYMD(date);
    const found = events.some(e => formatDateYMD(new Date(e.start_date)) === dateStr);
    return found ? styles.eventTile : undefined;
  };

  // 日付に関連するイベントを取得
  const getEventsForDate = (dateStr) => {
    if (!dateStr || !Array.isArray(events)) return [];
    return events.filter(event => formatDateYMD(new Date(event.start_date)) === dateStr);
  };

  // 選択日のイベント
  const selectedDateEvents = getEventsForDate(startDate);

  return (
    <div ref={containerRef} className={styles.eventRegWrap}>
      <h1 ref={titleRef} className={styles.title}>イベント{editMode ? '編集' : '登録'}</h1>
      {error && <div className={styles.errorMessage}>{error}</div>}
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
              value={startDate ? new Date(startDate) : new Date()}
              activeStartDate={activeStartDate}
              onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
            />
          </div>
          
          <div ref={eventsListRef} className={styles.eventsListCard}>
            <div className={styles.eventsListTitle}>
              {startDate ? `${new Date(startDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}のイベント` : 'すべてのイベント'}
            </div>
            {isLoading ? (
              <div className={styles.loading}>読み込み中...</div>
            ) : selectedDateEvents.length > 0 ? (
              <div className={styles.eventsList}>
                {selectedDateEvents.map(event => (
                  <div key={event.event_id} className={styles.eventItem}>
                    <div className={styles.eventHeader}>
                      <div className={styles.eventTitle}>{event.title}</div>
                      <div className={styles.eventType}>{event.event_type}</div>
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
                          onClick={() => handleDelete(event.event_id)}
                          title="削除"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                    {event.image && (
                      <div className={styles.eventImage}>
                        <img src={event.image} alt={event.title} />
                      </div>
                    )}
                    <div className={styles.eventDetail}>
                      <span className={styles.eventLabel}>開催場所:</span> {event.location}
                    </div>
                    <div className={styles.eventDetail}>
                      <span className={styles.eventLabel}>開始日時:</span> {new Date(event.start_date).toLocaleString('ja-JP')}
                    </div>
                    <div className={styles.eventDetail}>
                      <span className={styles.eventLabel}>終了日時:</span> {new Date(event.end_date).toLocaleString('ja-JP')}
                    </div>
                    <div className={styles.eventDetail}>
                      <span className={styles.eventLabel}>募集人数:</span> {event.available_spots}名
                    </div>
                    {event.event_type === EVENT_TYPES.INTERNSHIP && (
                      <>
                        <div className={styles.eventDetail}>
                          <span className={styles.eventLabel}>報酬:</span> {event.reward}
                        </div>
                        <div className={styles.eventDetail}>
                          <span className={styles.eventLabel}>必要資格:</span> {event.required_qualifications}
                        </div>
                      </>
                    )}
                    <div className={styles.eventDetail}>
                      <span className={styles.eventLabel}>概要:</span> {event.description}
                    </div>
                    {event.tags && event.tags.length > 0 && (
                      <div className={styles.eventTags}>
                        {typeof event.tags === 'string' 
                          ? JSON.parse(event.tags).map((tag, idx) => (
                              <span 
                                key={idx} 
                                className={styles.tag}
                                style={{ 
                                  backgroundColor: tag.color || '#eeeeee',
                                  color: tag.color ? '#fff' : '#555'
                                }}
                              >
                                {tag.label || tag}
                              </span>
                            ))
                          : event.tags.map((tag, idx) => (
                              <span 
                                key={idx} 
                                className={styles.tag}
                                style={{ 
                                  backgroundColor: tag.color || '#eeeeee',
                                  color: tag.color ? '#fff' : '#555'
                                }}
                              >
                                {tag.label || tag}
                              </span>
                            ))
                        }
                      </div>
                    )}
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
            <label className={styles.formLabel}>イベントタイプ
              <select 
                name="event_type"
                value={formData.event_type}
                onChange={handleEventTypeChange}
                required
                className={styles.formSelect}
              >
                <option value={EVENT_TYPES.INTERNSHIP}>{EVENT_TYPES.INTERNSHIP}</option>
                <option value={EVENT_TYPES.SEMINAR}>{EVENT_TYPES.SEMINAR}</option>
              </select>
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
            <label className={styles.formLabel}>サムネイル画像
              <div className={styles.imageUploadWrap}>
                <input 
                  type="file" 
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.imageInput}
                />
                <label htmlFor="imageUpload" className={styles.imageUploadBtn}>
                  <Upload size={18} />
                  画像を選択
                </label>
                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="イベントサムネイル" />
                  </div>
                )}
              </div>
            </label>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>開始日時
                <input 
                  type="datetime-local" 
                  name="start_date"
                  value={formatDateTimeLocal(formData.start_date)} 
                  onChange={handleInputChange} 
                  required 
                  className={styles.formInput} 
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>終了日時
                <input 
                  type="datetime-local" 
                  name="end_date"
                  value={formatDateTimeLocal(formData.end_date)} 
                  onChange={handleInputChange} 
                  required 
                  className={styles.formInput} 
                />
              </label>
            </div>
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
            <label className={styles.formLabel}>募集人数
              <input 
                type="number" 
                name="available_spots"
                value={formData.available_spots}
                onChange={handleInputChange}
                min="1"
                placeholder="募集人数を入力" 
                required
                className={styles.formInput} 
              />
            </label>
          </div>
          
          {formData.event_type === EVENT_TYPES.INTERNSHIP && (
            <>
              <div className={styles.formField}>
                <label className={styles.formLabel}>報酬
                  <input 
                    type="text" 
                    name="reward"
                    value={formData.reward || ""}
                    onChange={handleInputChange}
                    placeholder="例：1000円/時" 
                    required
                    className={styles.formInput} 
                  />
                </label>
              </div>
              
              <div className={styles.formField}>
                <label className={styles.formLabel}>必要資格
                  <textarea 
                    name="required_qualifications"
                    value={formData.required_qualifications || ""}
                    onChange={handleInputChange}
                    placeholder="必要な資格や条件をカンマ区切りで入力（例：普通自動車免許, 英語検定2級, パソコン操作）" 
                    required
                    className={styles.formTextarea} 
                    rows={2} 
                  />
                </label>
              </div>
            </>
          )}
          
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
          
          <div className={styles.formField}>
            <label className={styles.formLabel}>タグ</label>
            <div className={styles.tagInputContainer}>
              <div className={styles.tagInputRow}>
                <input 
                  type="text" 
                  value={newTagInput}
                  onChange={handleNewTagInputChange}
                  placeholder="タグを入力して追加" 
                  className={styles.formInput} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button 
                  type="button" 
                  className={styles.addTagButton}
                  onClick={handleAddTag}
                >
                  追加
                </button>
              </div>
              
              <div className={styles.tagColorSection}>
                <span className={styles.colorPickerLabel}>色を選択:</span>
                <div className={styles.colorPicker}>
                  {TAG_COLORS.map(color => (
                    <button 
                      key={color} 
                      type="button"
                      className={`${styles.colorOption} ${color === selectedTagColor ? styles.selectedColor : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleTagColorChange(color)}
                      title={`タグの色: ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {formData.tags.length > 0 && (
              <div className={styles.tagPreview}>
                {formData.tags.map((tag, index) => (
                  <div
                    key={index} 
                    className={styles.tagWithRemove}
                  >
                    <span 
                      className={styles.tag}
                      style={{ 
                        backgroundColor: tag.color || '#eeeeee',
                        color: tag.color ? '#fff' : '#555'
                      }}
                    >
                      {tag.label || tag}
                    </span>
                    <button 
                      type="button" 
                      className={styles.removeTagButton}
                      onClick={() => handleRemoveTag(index)}
                      title="削除"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "処理中..." : (editMode ? '更新' : '登録')}
          </button>
        </form>
      </div>
    </div>
  );
}

