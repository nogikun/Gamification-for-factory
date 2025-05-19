import React, { useState, useEffect, useRef } from "react";
import styles from "./Reviews.module.scss";
import ReviewInputModal from "./ReviewInputModal";
import { usePageAnimation } from "../hooks/usePageAnimation";

export default function Reviews() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const tableRef = useRef(null);

  usePageAnimation({ 
    containerRef, 
    titleRef, 
    contentRefs: [tableRef] 
  });

  const [reviews, setReviews] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // 評価スコアの表示フォーマット
  const formatRating = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // データを取得
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // レビューデータを取得
        const reviewsResponse = await fetch('/api/reviews');
        if (!reviewsResponse.ok) {
          throw new Error('レビューデータの取得に失敗しました');
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
        
        // イベントデータを取得
        const eventsResponse = await fetch('/api/events');
        if (!eventsResponse.ok) {
          throw new Error('イベントデータの取得に失敗しました');
        }
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
        
        // ユーザーデータを取得
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) {
          throw new Error('ユーザーデータの取得に失敗しました');
        }
        const usersData = await usersResponse.json();
        setUsers(usersData);
        
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError(`データの取得中にエラーが発生しました: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // ユーザー名を取得する関数
  const getUserName = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? `${user.last_name} ${user.first_name}` : '不明なユーザー';
  };
  
  // イベント名を取得する関数
  const getEventName = (eventId) => {
    const event = events.find(e => e.event_id === eventId);
    return event ? event.title : '不明なイベント';
  };

  // レビュー入力モーダルを開く
  const handleOpenModal = (userId, eventId) => {
    setSelectedUser(users.find(u => u.user_id === userId));
    setSelectedEvent(events.find(e => e.event_id === eventId));
    setModalOpen(true);
  };
  
  // モーダルを閉じる
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setSelectedEvent(null);
  };
  
  // レビュー送信処理
  const handleSubmitReview = async (reviewData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewer_id: reviewData.reviewer_id, // 現在のユーザーID
          reviewee_id: selectedUser.user_id,
          event_id: selectedEvent.event_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          advice: reviewData.advice
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'レビュー送信に失敗しました');
      }
      
      // 成功したらレビューデータを再取得
      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      
      alert('レビューが送信されました');
      handleCloseModal();
      
    } catch (err) {
      console.error('レビュー送信エラー:', err);
      setError(`レビュー送信中にエラーが発生しました: ${err.message}`);
      alert(`エラー: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 新しいレビューを追加するボタン
  const handleAddReview = () => {
    // デフォルトでは選択なし
    setSelectedUser(null);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  return (
    <div ref={containerRef} className={styles.reviews}>
      <h1 ref={titleRef} className={styles.reviews__title}>レビューリスト</h1>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.tableActions}>
        <button className={styles.addButton} onClick={handleAddReview}>
          新規レビュー作成
        </button>
      </div>
      
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loadingIndicator}>データを読み込み中...</div>
        ) : reviews.length === 0 ? (
          <div className={styles.noData}>レビューデータがありません</div>
        ) : (
          <table ref={tableRef} className={styles.reviews__table}>
            <thead>
              <tr>
                <th>レビュアー</th>
                <th>評価対象者</th>
                <th>イベント</th>
                <th>評価</th>
                <th>コメント</th>
                <th>作成日</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.review_id}>
                  <td>{getUserName(review.reviewer_id)}</td>
                  <td>{getUserName(review.reviewee_id)}</td>
                  <td className={styles.eventCell} title={getEventName(review.event_id)}>
                    {getEventName(review.event_id)}
                  </td>
                  <td className={styles.ratingCell}>
                    <span className={styles.ratingStars}>
                      {formatRating(review.rating)}
                    </span>
                    <span className={styles.ratingNumber}>
                      {review.rating}/5
                    </span>
                  </td>
                  <td className={styles.commentCell} title={review.comment}>
                    {review.comment}
                  </td>
                  <td>
                    {new Date(review.created_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td>
                    <button 
                      className={styles.inputBtn} 
                      onClick={() => handleOpenModal(review.reviewee_id, review.event_id)}
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <ReviewInputModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
        selectedUser={selectedUser}
        selectedEvent={selectedEvent}
        users={users}
        events={events}
      />
    </div>
  );
}
