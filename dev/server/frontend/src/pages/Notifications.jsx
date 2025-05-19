import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Notifications.module.scss";
import { usePageAnimation } from "../hooks/usePageAnimation";

export default function Notifications() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  usePageAnimation({
    containerRef,
    titleRef,
    contentRefs: [listRef]
  });

  // 通知データを取得
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // APIからデータを取得
        const response = await fetch('/api/notifications');
        
        if (!response.ok) {
          throw new Error('通知データの取得に失敗しました');
        }
        
        const data = await response.json();
        
        // 取得したデータを日付の新しい順に並べ替え
        const sortedData = data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        setNotifications(sortedData);
      } catch (err) {
        console.error('通知データ取得エラー:', err);
        setError(`データの取得中にエラーが発生しました: ${err.message}`);
        
        // エラー時はダミーデータを表示（本番環境では削除）
        setNotifications([
          { 
            notification_id: 1,
            type: "application",
            title: "新しい応募が届きました",
            message: "イベント「プログラミングコンテスト」に新しい応募があります",
            created_at: "2025-04-27T10:00:00",
            is_read: false,
            related_id: 123,
            target_route: "applicants"
          },
          { 
            notification_id: 2,
            type: "event",
            title: "イベントが作成されました",
            message: "新しいイベント「チームビルディングワークショップ」が作成されました",
            created_at: "2025-04-26T15:30:00",
            is_read: true,
            related_id: 456,
            target_route: "events/new"
          },
          { 
            notification_id: 3,
            type: "review",
            title: "レビュー提出のお願い",
            message: "イベント「技術セミナー」の参加者レビューを提出してください",
            created_at: "2025-04-25T09:15:00",
            is_read: false,
            related_id: 789,
            target_route: "reviews"
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);

  // 通知をクリックしたときの処理
  const handleNotificationClick = async (notification) => {
    try {
      // 既読状態をAPIに送信
      if (!notification.is_read) {
        await fetch(`/api/notifications/${notification.notification_id}/read`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // 既読状態を更新
        setNotifications(prevNotifications => 
          prevNotifications.map(item => 
            item.notification_id === notification.notification_id 
              ? {...item, is_read: true} 
              : item
          )
        );
      }
    } catch (err) {
      console.error('既読処理エラー:', err);
    }
  };

  // 関連するタブへ移動する処理
  const navigateToTarget = (targetRoute) => {
    navigate(`/${targetRoute}`);
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 通知タイプに応じたアイコンクラスを返す関数
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application':
        return styles.iconApplication;
      case 'event':
        return styles.iconEvent;
      case 'review':
        return styles.iconReview;
      default:
        return styles.iconDefault;
    }
  };

  return (
    <div ref={containerRef} className={styles.notifications}>
      <h1 ref={titleRef} className={styles.notifications__title}>通知一覧</h1>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {isLoading ? (
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingSpinner}></div>
          <p>通知を読み込み中...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className={styles.emptyState}>
          <p>通知はありません</p>
        </div>
      ) : (
        <ul ref={listRef} className={styles.notifications__list}>
          {notifications.map((notification) => (
            <li 
              key={notification.notification_id} 
              className={`${styles.notifications__item} ${!notification.is_read ? styles.unread : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={styles.notifications__content}>
                <div className={styles.notifications__header}>
                  <span className={`${styles.notifications__icon} ${getNotificationIcon(notification.type)}`}></span>
                  <span className={styles.notifications__title}>{notification.title}</span>
                  {!notification.is_read && <span className={styles.unreadBadge}></span>}
                </div>
                <p className={styles.notifications__message}>{notification.message}</p>
                <div className={styles.notifications__footer}>
                  <span className={styles.notifications__date}>{formatDate(notification.created_at)}</span>
                  <button 
                    className={styles.notifications__actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToTarget(notification.target_route);
                    }}
                  >
                    対応する
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
