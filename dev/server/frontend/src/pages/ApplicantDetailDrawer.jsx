import React from "react";
import styles from "./ApplicantDetailDrawer.module.scss";

export default function ApplicantDetailDrawer({ applicant, open, onClose, onApprove, onReject }) {
  if (!open || !applicant) return null;
  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <h2>応募者詳細</h2>
        <div className={styles.detailField}><span>氏名</span> {applicant.last_name} {applicant.first_name}</div>
        <div className={styles.detailField}><span>大学</span> {applicant.university}</div>
        <div className={styles.detailField}><span>メールアドレス</span> {applicant.mail_address}</div>
        <div className={styles.detailField}><span>資格・スキル</span> {applicant.license}</div>
        <div className={styles.detailField}><span>選考状況</span> {applicant.status}</div>
        <div className={styles.detailField}><span>最終更新</span> {applicant.updated_at?.slice(0,10).replace(/-/g,'/')}</div>
        <div className={styles.buttonRow}>
          <button className={styles.approve} onClick={()=>onApprove(applicant.id)}>承認</button>
          <button className={styles.reject} onClick={()=>onReject(applicant.id)}>拒否</button>
          <button className={styles.close} onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
}
