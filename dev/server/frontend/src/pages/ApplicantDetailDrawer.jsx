import React from "react";
import styles from "./ApplicantDetailDrawer.module.scss";

export default function ApplicantDetailDrawer({ applicant, open, onClose, onApprove, onReject }) {
  if (!open || !applicant) return null;
  
  // 関連イベント情報
  const eventDetails = applicant.eventDetails || {};
  
  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <h2>応募者詳細</h2>
        
        <div className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>応募者情報</h3>
          <div className={styles.detailField}>
            <span>氏名</span> {applicant.applicant_name || "不明"}
          </div>
          <div className={styles.detailField}>
            <span>メールアドレス</span> {applicant.applicant_email || "不明"}
          </div>
          {applicant.applicant_phone && (
            <div className={styles.detailField}>
              <span>電話番号</span> {applicant.applicant_phone}
            </div>
          )}
        </div>
        
        <div className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>応募イベント</h3>
          <div className={styles.detailField}>
            <span>イベント名</span> {applicant.event_title || eventDetails.title || "不明"}
          </div>
          <div className={styles.detailField}>
            <span>種類</span> {applicant.event_type || eventDetails.event_type || "不明"}
          </div>
          <div className={styles.detailField}>
            <span>開催期間</span> 
            {applicant.event_start_date 
              ? `${new Date(applicant.event_start_date).toLocaleDateString('ja-JP')} - ${new Date(applicant.event_end_date).toLocaleDateString('ja-JP')}` 
              : eventDetails.start_date 
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
            <span className={`${styles.statusBadge} ${styles[applicant.status]}`}>
              {applicant.status}
            </span>
          </div>
          <div className={styles.detailField}>
            <span>応募日時</span> {new Date(applicant.applied_at).toLocaleString('ja-JP')}
          </div>
          {applicant.processed_at && (
            <div className={styles.detailField}>
              <span>処理日時</span> {new Date(applicant.processed_at).toLocaleString('ja-JP')}
            </div>
          )}
        </div>
        
        {applicant.message && (
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>応募メッセージ</h3>
            <div className={styles.messageBox}>
              {applicant.message}
            </div>
          </div>
        )}
        
        <div className={styles.buttonRow}>
          {applicant.status === "未対応" && (
            <>
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
                否認
              </button>
            </>
          )}
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
