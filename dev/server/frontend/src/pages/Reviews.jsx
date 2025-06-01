import React, { useState, useEffect, useRef } from "react";
import styles from "./Reviews.module.scss";
import ReviewInputModal from "./ReviewInputModal";
import { usePageAnimation } from "../hooks/usePageAnimation";
import { apiRequest } from "../config";

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
  const [applications, setApplications] = useState([]);
  
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
        // APIリクエストをconfig.jsのapiRequest関数を使用して統一
        // レビューデータを取得（Debugページで作成したレビューも含める）
        const [apiReviews, debugReviews] = await Promise.all([
          apiRequest('/api/reviews').catch(() => []),
          apiRequest('/reviews').catch(() => [])
        ]);
        
        // レビューデータを結合
        let allReviews = [];
        
        // APIレビューデータの処理
        if (Array.isArray(apiReviews)) {
          allReviews = [...apiReviews];
        } else if (apiReviews && Array.isArray(apiReviews.reviews)) {
          allReviews = [...apiReviews.reviews];
        } else if (apiReviews && Array.isArray(apiReviews.data)) {
          allReviews = [...apiReviews.data];
        }
        
        // デバッグレビューデータの処理
        if (Array.isArray(debugReviews)) {
          allReviews = [...allReviews, ...debugReviews];
        } else if (debugReviews && Array.isArray(debugReviews.reviews)) {
          allReviews = [...allReviews, ...debugReviews.reviews];
        } else if (debugReviews && Array.isArray(debugReviews.data)) {
          allReviews = [...allReviews, ...debugReviews.data];
        }
        
        // 重複を削除（review_idに基づく）
        const uniqueReviews = allReviews.reduce((acc, review) => {
          if (!acc.some(r => r.review_id === review.review_id)) {
            acc.push(review);
          }
          return acc;
        }, []);
        
        // 日付降順で並べ替え
        uniqueReviews.sort((a, b) => 
          new Date(b.created_at || b.updated_at || 0) - 
          new Date(a.created_at || a.updated_at || 0)
        );
        
        setReviews(uniqueReviews);
        
        // イベントデータを取得
        const eventsData = await apiRequest('/event').catch(() => []);
        
        // イベントデータも配列チェック
        if (Array.isArray(eventsData)) {
          setEvents(eventsData);
        } else if (eventsData && Array.isArray(eventsData.events)) {
          setEvents(eventsData.events);
        } else if (eventsData && Array.isArray(eventsData.data)) {
          setEvents(eventsData.data);
        } else {
          console.warn('イベントAPIから期待される配列形式のデータが返されませんでした:', eventsData);
          setEvents([]);
        }
        
        // ユーザーデータを取得
        const [apiUsers, applicantsData] = await Promise.all([
          apiRequest('/api/users').catch(() => []),
          apiRequest('/applicants').catch(() => [])
        ]);
        
        // ユーザーデータを結合
        let allUsers = [];
        
        // APIユーザーデータの処理
        if (Array.isArray(apiUsers)) {
          allUsers = [...apiUsers];
        } else if (apiUsers && Array.isArray(apiUsers.users)) {
          allUsers = [...apiUsers.users];
        } else if (apiUsers && Array.isArray(apiUsers.data)) {
          allUsers = [...apiUsers.data];
        }
        
        // 応募者データの処理（Debugページで作成したユーザー）
        if (Array.isArray(applicantsData)) {
          // 応募者データをユーザーデータ形式に変換
          const applicantUsers = applicantsData.map(applicant => ({
            user_id: applicant.user_id,
            first_name: applicant.first_name,
            last_name: applicant.last_name,
            user_type: 'applicant'
          }));
          allUsers = [...allUsers, ...applicantUsers];
        }
        
        // 重複を削除（user_idに基づく）
        const uniqueUsers = allUsers.reduce((acc, user) => {
          if (!acc.some(u => u.user_id === user.user_id)) {
            acc.push(user);
          }
          return acc;
        }, []);
        
        setUsers(uniqueUsers);
        
        // 応募データを取得（application_idを取得するため）
        const applicationsData = await apiRequest('/applications').catch(() => []);
        
        // 応募データの処理
        let applications = [];
        if (Array.isArray(applicationsData)) {
          applications = applicationsData;
        } else if (applicationsData && Array.isArray(applicationsData.applications)) {
          applications = applicationsData.applications;
        } else if (applicationsData && Array.isArray(applicationsData.data)) {
          applications = applicationsData.data;
        }
        
        // 応募データを保存
        setApplications(applications);
        
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError(`データの取得中にエラーが発生しました: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // ユーザー名を取得する関数（役職付きの場合は役職も表示）
  const getUserName = (userId) => {
    const user = users.find(u => u.user_id === userId);
    if (!user) return '不明なユーザー';
    
    const fullName = `${user.last_name} ${user.first_name}`;
    if (user.user_type === 'employee' && user.position) {
      return `${fullName}（${user.position}）`;
    }
    return fullName;
  };
  
  // レビュー対象者の表示名を取得する関数
  const getRevieweeName = (review) => {
    // 応募情報からユーザー情報を取得
    const app = review.application_id && applications.find(a => a.application_id === review.application_id);
    const userId = review.reviewee_id || (app ? app.user_id : null);
    
    // レビュアーのIDを取得
    const reviewerId = review.reviewer_id;
    
    // ユーザーがいない場合は「不明」を返す
    if (!userId) return '不明な対象';
    
    // レビュアーのユーザー情報を取得
    const reviewer = users.find(u => u.user_id === reviewerId);
    
    // 評価対象者のユーザー情報を取得
    const reviewee = users.find(u => u.user_id === userId);
    if (!reviewee) return '不明なユーザー';
    
    // レビュアーが応募者（applicant）の場合、評価対象者は「企業」と表示
    if (reviewer && reviewer.user_type === 'applicant') {
      return '企業';
    }
    
    // それ以外の場合（企業側からのレビュー）は、評価対象者の名前を表示
    const fullName = `${reviewee.last_name} ${reviewee.first_name}`;
    if (reviewee.user_type === 'employee' && reviewee.position) {
      return `${fullName}（${reviewee.position}）`;
    }
    return fullName;
  };
  
  // イベント名を取得する関数
  const getEventName = (eventId) => {
    const event = events.find(e => e.event_id === eventId);
    return event ? event.title : '不明なイベント';
  };

  // レビュー入力モーダルを開く
  const handleOpenModal = (userId, eventId, reviewerId) => {
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
  
  // 選択されたユーザーとイベントのapplication_idを見つける
  const findApplicationId = (userId, eventId) => {
    const application = applications.find(
      app => app.user_id === userId && app.event_id.toString() === eventId.toString()
    );
    return application ? application.application_id : null;
  };
  
  // レビュー送信処理
  const handleSubmitReview = async (reviewData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 必要なapplication_idを見つける
      const applicationId = findApplicationId(reviewData.reviewee_id, reviewData.event_id);
      
      if (!applicationId) {
        throw new Error('選択されたユーザーとイベントに対応する応募情報が見つかりませんでした');
      }
      
      // レビューデータにapplication_idを追加
      const reviewDataWithAppId = {
        application_id: applicationId,
        reviewer_id: reviewData.reviewer_id,
        rating: reviewData.rating,
        comment: reviewData.comment
      };
      
      // APIリクエストをconfig.jsのapiRequest関数を使用
      const updatedReviews = await apiRequest('/review', 'POST', reviewDataWithAppId);
      
      // レスポンスデータの配列チェック
      if (Array.isArray(updatedReviews)) {
        setReviews(updatedReviews);
      } else if (updatedReviews && Array.isArray(updatedReviews.reviews)) {
        setReviews(updatedReviews.reviews);
      } else if (updatedReviews && Array.isArray(updatedReviews.data)) {
        setReviews(updatedReviews.data);
      } else {
        // フォールバック: 新しいレビューを現在のリストに追加
        const newReview = {
          review_id: `review_${Date.now()}`,
          application_id: applicationId,
          reviewer_id: reviewData.reviewer_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setReviews([...reviews, newReview]);
      }
      
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
                <tr key={review.review_id || `review-${review.application_id || Math.random()}`}>
                  <td>{getUserName(review.reviewer_id)}</td>
                  <td>{getRevieweeName(review)}</td>
                  <td className={styles.eventCell} title={getEventName(review.event_id || (review.application_id && applications.find(a => a.application_id === review.application_id)?.event_id))}>
                    {getEventName(review.event_id || (review.application_id && applications.find(a => a.application_id === review.application_id)?.event_id))}
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
                    {new Date(review.created_at || review.updated_at || Date.now()).toLocaleDateString('ja-JP')}
                  </td>
                  <td>
                    <button 
                      className={styles.inputBtn} 
                      onClick={() => {
                        // アプリケーションからユーザーIDとイベントIDを取得
                        const app = applications.find(a => a.application_id === review.application_id);
                        const userId = review.reviewee_id || (app ? app.user_id : null);
                        const eventId = review.event_id || (app ? app.event_id : null);
                        if (userId && eventId) {
                          handleOpenModal(userId, eventId, review.reviewer_id);
                        } else {
                          alert('ユーザーまたはイベント情報が見つかりません');
                        }
                      }}
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
