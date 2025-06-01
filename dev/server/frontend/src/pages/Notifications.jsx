import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Notifications.module.scss";
import { usePageAnimation } from "../hooks/usePageAnimation";
import { apiRequest } from "../config";

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

  // 全ての通信データを取得して通知形式に変換
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 並列で全てのAPIからデータを取得
        const [eventsResponse, applicationsResponse, reviewsResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:3000/event'),
          fetch('http://localhost:3000/applications'),
          fetch('http://localhost:3000/api/reviews'),
          fetch('http://localhost:3000/api/users')
        ]);

        // レスポンスのエラーチェック
        if (!eventsResponse.ok) throw new Error('イベントデータの取得に失敗');
        if (!applicationsResponse.ok) throw new Error('応募者データの取得に失敗');
        if (!reviewsResponse.ok) throw new Error('レビューデータの取得に失敗');
        if (!usersResponse.ok) throw new Error('ユーザーデータの取得に失敗');

        // JSONデータを取得
        let eventsData = await eventsResponse.json();
        let applicationsData = await applicationsResponse.json();
        let reviewsData = await reviewsResponse.json();
        let usersData = await usersResponse.json();

        // 配列チェック（安全性のため）
        eventsData = Array.isArray(eventsData) ? eventsData : [];
        applicationsData = Array.isArray(applicationsData) ? applicationsData : [];
        reviewsData = Array.isArray(reviewsData) ? reviewsData : [];
        usersData = Array.isArray(usersData) ? usersData : [];

        // ユーザー名取得用のヘルパー関数
        const getUserName = (userId) => {
          const user = usersData.find(u => u.user_id === userId);
          return user ? `${user.last_name} ${user.first_name}` : '不明なユーザー';
        };

        // イベント名取得用のヘルパー関数
        const getEventName = (eventId) => {
          const event = eventsData.find(e => e.event_id === eventId);
          return event ? event.title : '不明なイベント';
        };

        // 全データを通知形式に変換
        const allNotifications = [];

        // イベントデータを通知に変換
        eventsData.forEach(event => {
          allNotifications.push({
            id: `event_${event.event_id}`,
            type: "event",
            title: "新しいイベントが作成されました",
            message: `イベント「${event.title}」が作成されました`,
            created_at: event.created_at || event.start_date,
            target_route: "events/new",
            related_data: event,
            action_label: "イベント管理"
          });
        });

        // 応募データを通知に変換
        applicationsData.forEach(application => {
          const eventName = getEventName(application.event_id);
          const userName = getUserName(application.user_id);
          
          allNotifications.push({
            id: `application_${application.application_id}`,
            type: "application",
            title: "新しい応募が届きました",
            message: `${userName}さんからイベント「${eventName}」への応募があります`,
            created_at: application.created_at,
            target_route: "applicants",
            related_data: application,
            action_label: "応募者確認"
          });
        });

        // レビューデータを通知に変換
        reviewsData.forEach(review => {
          const reviewerName = getUserName(review.reviewer_id);
          const revieweeName = getUserName(review.reviewee_id);
          const eventName = getEventName(review.event_id);
          
          allNotifications.push({
            id: `review_${review.review_id}`,
            type: "review",
            title: "新しいレビューが投稿されました",
            message: `${reviewerName}さんから${revieweeName}さんへのレビューが投稿されました（${eventName}）`,
            created_at: review.created_at,
            target_route: "reviews",
            related_data: review,
            action_label: "レビュー確認"
          });
        });

        // 時系列で並び替え（新しい順）
        const sortedNotifications = allNotifications.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );

        setNotifications(sortedNotifications);
        
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError(`データの取得中にエラーが発生しました: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

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

  // 通知タイプに応じた色を返す関数
  const getNotificationColor = (type) => {
    switch (type) {
      case 'application':
        return '#2196f3'; // 青
      case 'event':
        return '#4caf50'; // 緑
      case 'review':
        return '#ff9800'; // オレンジ
      default:
        return '#666';
    }
  };

  return (
    <div ref={containerRef} className={styles.notifications}>
      <h1 ref={titleRef} className={styles.notifications__title}>
        活動通知一覧
        <span className={styles.notifications__count}>
          （{notifications.length}件）
        </span>
      </h1>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {isLoading ? (
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingSpinner}></div>
          <p>データを読み込み中...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className={styles.emptyState}>
          <p>通知はありません</p>
        </div>
      ) : (
        <ul ref={listRef} className={styles.notifications__list}>
          {notifications.map((notification) => (
            <li 
              key={notification.id} 
              className={styles.notifications__item}
              style={{ borderLeft: `4px solid ${getNotificationColor(notification.type)}` }}
            >
              <div className={styles.notifications__content}>
                <div className={styles.notifications__header}>
                  <span 
                    className={`${styles.notifications__icon} ${getNotificationIcon(notification.type)}`}
                    style={{ backgroundColor: getNotificationColor(notification.type) }}
                  ></span>
                  <span className={styles.notifications__title}>{notification.title}</span>
                  <span className={styles.notifications__type}>{notification.type}</span>
                </div>
                <p className={styles.notifications__message}>{notification.message}</p>
                <div className={styles.notifications__footer}>
                  <span className={styles.notifications__date}>
                    {formatDate(notification.created_at)}
                  </span>
                  <button 
                    className={styles.notifications__actionButton}
                    onClick={() => navigateToTarget(notification.target_route)}
                  >
                    {notification.action_label}
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
