import React, { useState, useEffect } from "react";
import styles from "./Reviews.module.scss";

export default function ReviewInputModal({ 
  open, 
  onClose, 
  onSubmit, 
  selectedUser, 
  selectedEvent,
  users,
  events
}) {
  // 決め打ちのレビュアーリスト
  const reviewerOptions = [
    { id: "hr_manager", name: "田中 美咲（人事部長）" },
    { id: "dept_manager", name: "佐藤 拓也（技術部門長）" },
    { id: "factory_manager", name: "鈴木 健太（工場長）" }
  ];

  const [formData, setFormData] = useState({
    reviewer_id: "", // レビュアーを選択式
    reviewee_id: "",
    event_id: "",
    rating: 3, // デフォルト評価: 3/5
    comment: "",
    advice: ""
  });
  
  // モーダルが開いたときに選択されたユーザーとイベントを設定
  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        reviewee_id: selectedUser ? selectedUser.user_id : "",
        event_id: selectedEvent ? selectedEvent.event_id : ""
      }));
    }
  }, [open, selectedUser, selectedEvent]);

  if (!open) return null;
  
  // 入力値の変更を処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    });
  };

  // フォーム送信処理
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.reviewer_id) {
      alert('レビュアーを選択してください');
      return;
    }
    
    if (!formData.reviewee_id) {
      alert('評価対象者を選択してください');
      return;
    }
    
    if (!formData.event_id) {
      alert('イベントを選択してください');
      return;
    }
    
    onSubmit(formData);
    
    // フォームリセット
    setFormData({
      reviewer_id: "",
      reviewee_id: "",
      event_id: "",
      rating: 3,
      comment: "",
      advice: ""
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>レビュー入力</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label>レビュアー</label>
            <select
              name="reviewer_id"
              value={formData.reviewer_id}
              onChange={handleChange}
              required
              className={styles.formSelect}
            >
              <option value="">-- レビュアーを選択 --</option>
              {reviewerOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formField}>
            <label>評価対象者</label>
            <select
              name="reviewee_id"
              value={formData.reviewee_id}
              onChange={handleChange}
              required
              className={styles.formSelect}
              disabled={selectedUser !== null}
            >
              <option value="">-- 評価対象者を選択 --</option>
              {users && users.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.last_name} {user.first_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formField}>
            <label>イベント</label>
            <select
              name="event_id"
              value={formData.event_id}
              onChange={handleChange}
              required
              className={styles.formSelect}
              disabled={selectedEvent !== null}
            >
              <option value="">-- イベントを選択 --</option>
              {events && events.map(event => (
                <option key={event.event_id} value={event.event_id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formField}>
            <label>評価（5段階）</label>
            <div className={styles.ratingInput}>
              {[1, 2, 3, 4, 5].map(num => (
                <label key={num} className={styles.ratingLabel}>
                  <input
                    type="radio"
                    name="rating"
                    value={num}
                    checked={formData.rating === num}
                    onChange={handleChange}
                    className={styles.ratingRadio}
                  />
                  <span className={styles.ratingText}>{num}</span>
                </label>
              ))}
            </div>
            <div className={styles.ratingPreview}>
              {"★".repeat(formData.rating)}{"☆".repeat(5 - formData.rating)}
            </div>
          </div>
          
          <div className={styles.formField}>
            <label>コメント</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="評価コメントを入力してください"
              rows={3}
              required
              className={styles.reviewTextarea}
            />
          </div>
          
          <div className={styles.formField}>
            <label>アドバイス・改善点</label>
            <textarea
              name="advice"
              value={formData.advice}
              onChange={handleChange}
              placeholder="アドバイスや改善点を入力してください"
              rows={3}
              className={styles.reviewTextarea}
            />
          </div>
          
          <div className={styles.modalActions}>
            <button type="submit" className={styles.submitBtn}>送信</button>
            <button type="button" className={styles.closeBtn} onClick={onClose}>閉じる</button>
          </div>
        </form>
      </div>
    </div>
  );
}
