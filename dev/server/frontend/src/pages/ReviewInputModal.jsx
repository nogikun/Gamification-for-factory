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
  // 企業レビュー用の固定オプション
  const companyOption = { 
    id: "00000000-0000-0000-0000-000000000099", 
    name: "企業",
    isCompany: true 
  };

  const [formData, setFormData] = useState({
    reviewer_id: "", // レビュアーを選択式
    reviewee_id: "",
    event_id: "",
    rating: 3, // デフォルト評価: 3/5
    comment: "",
    advice: ""
  });

  // レビュアーの候補を取得する関数
  const getReviewerOptions = () => {
    if (!users || users.length === 0) return [];
    return users;
  };

  // 評価対象者の候補を取得する関数（レビュアーと同じユーザーは選択不可）
  const getRevieweeOptions = () => {
    if (!users || users.length === 0) return [];
    
    // 選択されたレビュアーのIDを取得
    const selectedReviewerId = formData.reviewer_id;
    
    // レビュアーと異なるユーザーのみをフィルタリング
    return users.filter(user => user.user_id !== selectedReviewerId);
  };
  
  // モーダルが開いたときに選択されたユーザーとイベントを設定
  useEffect(() => {
    if (open) {
      // 選択されたユーザーが応募者の場合、評価対象者を企業に設定
      const isSelectedUserApplicant = selectedUser && selectedUser.user_type === 'applicant';
      
      setFormData(prev => ({
        ...prev,
        reviewee_id: isSelectedUserApplicant ? companyOption.id : (selectedUser ? selectedUser.user_id : ""),
        event_id: selectedEvent ? selectedEvent.event_id : "",
        // 詳細ボタンからの場合、レビュアーID情報も引き継ぐ
        reviewer_id: isSelectedUserApplicant ? selectedUser.user_id : (prev.reviewer_id || "")
      }));
    }
  }, [open, selectedUser, selectedEvent]); 

  // レビュアーが変更されたときに、評価対象者が同じだった場合はリセット
  useEffect(() => {
    if (formData.reviewer_id && formData.reviewer_id === formData.reviewee_id) {
      setFormData(prev => ({
        ...prev,
        reviewee_id: ""
      }));
    }
  }, [formData.reviewer_id]);

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
    
    if (formData.reviewer_id === formData.reviewee_id) {
      alert('レビュアーと評価対象者に同じユーザーは選択できません');
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

  // 選択されたユーザーが応募者かどうかを判定
  const isApplicantReviewing = selectedUser && selectedUser.user_type === 'applicant';
  
  // レビュアーオプション（応募者がレビューする場合は応募者自身のみ）
  const currentReviewerOptions = isApplicantReviewing 
    ? [{ id: selectedUser.user_id, name: `${selectedUser.last_name} ${selectedUser.first_name}` }]
    : getReviewerOptions();
  
  // 評価対象者オプション（応募者がレビューする場合は企業のみ、それ以外はレビュアー以外のユーザー）
  const revieweeOptions = isApplicantReviewing 
    ? [companyOption] // 応募者が評価する場合は企業のみ
    : getRevieweeOptions();

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
              disabled={isApplicantReviewing} // 応募者がレビューする場合は固定
            >
              <option value="">-- レビュアーを選択 --</option>
              {currentReviewerOptions.map(user => (
                <option key={user.user_id || user.id || 'empty'} value={user.user_id || user.id || ''}>
                  {user.isCompany ? '企業' : `${user.last_name} ${user.first_name}`}
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
              disabled={selectedUser !== null || isApplicantReviewing} // 応募者がレビューする場合は固定
            >
              <option value="">-- 評価対象者を選択 --</option>
              {revieweeOptions.map(user => (
                <option key={user.user_id || user.id || 'empty'} value={user.user_id || user.id || ''}>
                  {user.isCompany ? '企業' : `${user.last_name} ${user.first_name}`}
                </option>
              ))}
            </select>
            {formData.reviewer_id && !formData.reviewee_id && (
              <p className={styles.formHint}>※レビュアーと同じユーザーは選択できません</p>
            )}
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
                <option key={event.event_id || 'empty'} value={event.event_id || ''}>
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
