import React from "react";
import styles from "./Notifications.module.scss";

const dummyNotifications = [
  { message: "新しい応募が届きました", date: "2025/04/27" },
  { message: "イベントYが作成されました", date: "2025/04/26" },
  { message: "レビューが提出されました", date: "2025/04/25" },
];

export default function Notifications() {
  return (
    <div className={styles.notifications}>
      <h1 className={styles.notifications__title}>通知一覧</h1>
      <ul className={styles.notifications__list}>
        {dummyNotifications.map((n, i) => (
          <li key={i} className={styles.notifications__item}>
            <span className={styles.notifications__message}>{n.message}</span>
            <span className={styles.notifications__date}>{n.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
