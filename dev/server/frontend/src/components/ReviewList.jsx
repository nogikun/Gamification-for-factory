import React from "react";
import styles from "./ReviewList.module.scss";

// 仮データ
const reviews = [
  {
    id: 1,
    applicant: "山田 太郎",
    reviewer: "佐藤 拓也",
    updated_at: "2025-04-25",
    comment: "積極的な姿勢が印象的でした。協調性も高いです。"
  },
  {
    id: 2,
    applicant: "佐藤 花子",
    reviewer: "田中 美咲",
    updated_at: "2025-04-20",
    comment: "論理的思考力があり、課題への取り組みも丁寧でした。"
  }
];

export default function ReviewList() {
  return (
    <div className={styles.reviewList}>
      <h2 className={styles.title}>レビュー一覧</h2>
      <ul>
        {reviews.map(r => (
          <li key={r.id} className={styles.reviewItem}>
            <div className={styles.row}>
              <span className={styles.label}>応募者</span>
              <span>{r.applicant}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>レビュワー</span>
              <span>{r.reviewer}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>日付</span>
              <span>{r.updated_at}</span>
            </div>
            <div className={styles.comment}>{r.comment}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
