import React from "react";
import styles from "./ApplicantDetailDrawer.module.scss";

export default function ApplicantDetailDrawer({ applicant, open, onClose, onApprove, onReject }) {
  if (!open || !applicant) return null;
  
  // 関連イベント情報
  const eventDetails = applicant.eventDetails || {};
  
  // ユーザー情報
  const user = applicant.user || {};
  
  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <h2>応募者詳細</h2>
        
        <div className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>応募者情報</h3>
          <div className={styles.detailField}>
            <span>氏名</span> {user.last_name} {user.first_name}
          </div>
          <div className={styles.detailField}>
            <span>メールアドレス</span> {user.email}
          </div>
          {user.phone && (
            <div className={styles.detailField}>
              <span>電話番号</span> {user.phone}
            </div>
          )}
          {user.university && (
            <div className={styles.detailField}>
              <span>大学</span> {user.university}
            </div>
          )}
          {user.skills && (
            <div className={styles.detailField}>
              <span>スキル</span> {user.skills}
            </div>
          )}
        </div>
        
        <div className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>応募イベント</h3>
          <div className={styles.detailField}>
            <span>イベント名</span> {eventDetails.title || "不明"}
          </div>
          <div className={styles.detailField}>
            <span>種類</span> {eventDetails.event_type || "不明"}
          </div>
          <div className={styles.detailField}>
            <span>開催期間</span> 
            {eventDetails.start_date 
              ? `${new Date(eventDetails.start_date).toLocaleDateString('ja-JP')} - ${new Date(eventDetails.end_date).toLocaleDateString('ja-JP')}` 
              : "不明"}
          </div>
          <div className={styles.detailField}>
            <span>場所</span> {eventDetails.location || "不明"}
          </div>
        </div>
        
        <div className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>応募状況</h3>
          <div className={styles.detailField}>
            <span>現在の状態</span> 
            <span className={`${styles.statusBadge} ${styles[`status_${applicant.status}`]}`}>
              {applicant.status}
            </span>
          </div>
          <div className={styles.detailField}>
            <span>応募日時</span> {new Date(applicant.created_at).toLocaleString('ja-JP')}
          </div>
          <div className={styles.detailField}>
            <span>最終更新</span> {new Date(applicant.updated_at).toLocaleString('ja-JP')}
          </div>
        </div>
        
        <div className={styles.buttonRow}>
          <button 
            className={styles.approve} 
            onClick={() => onApprove(applicant.application_id)}
          >
            承認
          </button>
          <button 
            className={styles.reject} 
            onClick={() => onReject(applicant.application_id)}
          >
            拒否
          </button>
          <button 
            className={styles.close} 
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
