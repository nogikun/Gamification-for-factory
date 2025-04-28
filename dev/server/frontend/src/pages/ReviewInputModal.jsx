import React from "react";
import styles from "./Reviews.module.scss";

export default function ReviewInputModal({ open, onClose, onSubmit, target }) {
  const [reviewer, setReviewer] = React.useState("");
  const [comment, setComment] = React.useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reviewer.trim() && comment.trim()) {
      onSubmit({ reviewer, target, comment });
      setComment("");
      setReviewer("");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>レビュー入力（{target}さん）</h2>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.reviewerInput}
            type="text"
            value={reviewer}
            onChange={e => setReviewer(e.target.value)}
            placeholder="レビュアー名を入力"
            required
            autoFocus
            style={{marginBottom: 12, width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #e0e0e0', fontSize: '1rem'}}
          />
          <textarea
            className={styles.reviewTextarea}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="レビュー内容を入力してください"
            rows={5}
            required
          />
          <div className={styles.modalActions}>
            <button type="submit" className={styles.submitBtn}>送信</button>
            <button type="button" className={styles.closeBtn} onClick={onClose}>閉じる</button>
          </div>
        </form>
      </div>
    </div>
  );
}
