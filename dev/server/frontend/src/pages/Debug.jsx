import React, { useState, useEffect } from "react";
import styles from "./Debug.module.scss";
import { apiRequest } from "../config";

export default function Debug() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ユーザー作成用のフォームデータ
  const [userData, setUserData] = useState({
    last_name: '',
    first_name: '',
    mail_address: '',
    phone_number: '',
    address: '',
    birth_date: '',
    license: ''
  });

  // 応募作成用のフォームデータ
  const [applicationData, setApplicationData] = useState({
    event_id: '',
    user_id: '',
    message: ''
  });

  // レビュー作成用のフォームデータ
  const [reviewData, setReviewData] = useState({
    application_id: '',
    reviewer_id: '',
    rating: 3,
    comment: ''
  });

  // 編集モード用のステート
  const [editMode, setEditMode] = useState({
    user: false,
    application: false,
    review: false
  });
  
  // 編集対象のID
  const [editId, setEditId] = useState({
    user: null,
    application: null,
    review: null
  });

  // 作成済みユーザー一覧
  const [users, setUsers] = useState([]);
  // 応募一覧
  const [applications, setApplications] = useState([]);
  // レビュー一覧
  const [reviews, setReviews] = useState([]);

  // APIリクエスト処理ラッパー
  const handleApiRequest = async (url, method = 'GET', data = null) => {
    setError('');
    try {
      setLoading(true);
      const result = await apiRequest(url, method, data);
      return result;
    } catch (error) {
      setError(`エラー: ${error.message || '通信に失敗しました'}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // イベント一覧を取得
  const fetchEvents = async () => {
    const data = await handleApiRequest('/event');
    if (data) setEvents(data);
  };

  // ユーザー一覧を取得
  const fetchUsers = async () => {
    const data = await handleApiRequest('/applicants');
    if (data) setUsers(data);
  };

  // 応募一覧を取得
  const fetchApplications = async () => {
    const data = await handleApiRequest('/applications');
    if (data) setApplications(data);
  };

  // レビュー一覧を取得
  const fetchReviews = async () => {
    const data = await handleApiRequest('/reviews');
    if (data) setReviews(data);
  };

  // 初期データ読み込み
  useEffect(() => {
    fetchEvents();
    fetchUsers();
    fetchApplications();
    fetchReviews();
  }, []);

  // ユーザーデータの入力ハンドラ
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  // 応募データの入力ハンドラ
  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplicationData({
      ...applicationData,
      [name]: value
    });
  };

  // レビューデータの入力ハンドラ
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]: value
    });
  };

  // ユーザー作成・更新処理
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (editMode.user) {
        // ユーザー更新
        const response = await handleApiRequest(`/applicant/${editId.user}`, 'PUT', userData);
        if (response) {
          setMessage('ユーザーが更新されました');
          setEditMode({ ...editMode, user: false });
          setEditId({ ...editId, user: null });
        }
      } else {
        // ユーザー新規作成
        const response = await handleApiRequest('/applicant', 'POST', userData);
        if (response) {
          setMessage('ユーザーが正常に作成されました');
          setUserData({
            last_name: '',
            first_name: '',
            mail_address: '',
            phone_number: '',
            address: '',
            birth_date: '',
            license: ''
          });
        }
      }
      // ユーザー一覧を再取得
      fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  // イベント応募処理
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (editMode.application) {
        // 応募更新
        const response = await handleApiRequest(`/application/${editId.application}`, 'PUT', applicationData);
        if (response) {
          setMessage('応募が更新されました');
          setEditMode({ ...editMode, application: false });
          setEditId({ ...editId, application: null });
        }
      } else {
        // 応募新規作成
        const response = await handleApiRequest('/application', 'POST', applicationData);
        if (response) {
          setMessage('応募が正常に作成されました');
          setApplicationData({
            event_id: '',
            user_id: '',
            message: ''
          });
        }
      }
      // 応募一覧を再取得
      fetchApplications();
    } finally {
      setLoading(false);
    }
  };

  // レビュー作成処理
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (editMode.review) {
        // レビュー更新
        const response = await handleApiRequest(`/review/${editId.review}`, 'PUT', reviewData);
        if (response) {
          setMessage('レビューが更新されました');
          setEditMode({ ...editMode, review: false });
          setEditId({ ...editId, review: null });
        }
      } else {
        // レビュー新規作成
        const response = await handleApiRequest('/review', 'POST', reviewData);
        if (response) {
          setMessage('レビューが正常に作成されました');
          setReviewData({
            application_id: '',
            reviewer_id: '',
            rating: 3,
            comment: ''
          });
        }
      }
      // レビュー一覧を再取得
      fetchReviews();
    } finally {
      setLoading(false);
    }
  };

  // ユーザー編集モード開始
  const handleEditUser = (user) => {
    setUserData({
      last_name: user.last_name,
      first_name: user.first_name,
      mail_address: user.mail_address || '',
      phone_number: user.phone_number || '',
      address: user.address || '',
      birth_date: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '',
      license: user.license || ''
    });
    setEditMode({ ...editMode, user: true });
    setEditId({ ...editId, user: user.user_id });
  };

  // 応募編集モード開始
  const handleEditApplication = (app) => {
    setApplicationData({
      event_id: app.event_id,
      user_id: app.user_id,
      message: app.message || ''
    });
    setEditMode({ ...editMode, application: true });
    setEditId({ ...editId, application: app.application_id });
  };

  // レビュー編集モード開始
  const handleEditReview = (review) => {
    setReviewData({
      application_id: review.application_id,
      reviewer_id: review.reviewer_id,
      rating: review.rating,
      comment: review.comment || ''
    });
    setEditMode({ ...editMode, review: true });
    setEditId({ ...editId, review: review.review_id });
  };

  // ユーザー削除処理
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('このユーザーを削除してもよろしいですか？')) return;
    
    setLoading(true);
    setError('');
    
    try {
      await handleApiRequest(`/applicant/${userId}`, 'DELETE');
      setMessage('ユーザーが削除されました');
      fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  // 応募削除処理
  const handleDeleteApplication = async (applicationId) => {
    if (!window.confirm('この応募を削除してもよろしいですか？')) return;
    
    setLoading(true);
    setError('');
    
    try {
      await handleApiRequest(`/application/${applicationId}`, 'DELETE');
      setMessage('応募が削除されました');
      fetchApplications();
    } finally {
      setLoading(false);
    }
  };

  // レビュー削除処理
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('このレビューを削除してもよろしいですか？')) return;
    
    setLoading(true);
    setError('');
    
    try {
      await handleApiRequest(`/review/${reviewId}`, 'DELETE');
      setMessage('レビューが削除されました');
      fetchReviews();
    } finally {
      setLoading(false);
    }
  };

  // 編集モードキャンセル
  const handleCancelEdit = (type) => {
    setEditMode({ ...editMode, [type]: false });
    setEditId({ ...editId, [type]: null });
    
    // フォームをリセット
    if (type === 'user') {
      setUserData({
        last_name: '',
        first_name: '',
        mail_address: '',
        phone_number: '',
        address: '',
        birth_date: '',
        license: ''
      });
    } else if (type === 'application') {
      setApplicationData({
        event_id: '',
        user_id: '',
        message: ''
      });
    } else if (type === 'review') {
      setReviewData({
        application_id: '',
        reviewer_id: '',
        rating: 3,
        comment: ''
      });
    }
  };

  return (
    <div className={styles.debugPage}>
      <h1>デバッグページ</h1>
      
      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      
      <div className={styles.section}>
        <h2>{editMode.user ? 'ユーザー編集' : 'ユーザー作成'}</h2>
        <form onSubmit={handleUserSubmit}>
          <div className={styles.formGroup}>
            <label>姓:</label>
            <input 
              type="text" 
              name="last_name" 
              value={userData.last_name}
              onChange={handleUserChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>名:</label>
            <input 
              type="text" 
              name="first_name" 
              value={userData.first_name}
              onChange={handleUserChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>メールアドレス:</label>
            <input 
              type="email" 
              name="mail_address" 
              value={userData.mail_address}
              onChange={handleUserChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>電話番号:</label>
            <input 
              type="tel" 
              name="phone_number" 
              value={userData.phone_number}
              onChange={handleUserChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>住所:</label>
            <input 
              type="text" 
              name="address" 
              value={userData.address}
              onChange={handleUserChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>生年月日:</label>
            <input 
              type="date" 
              name="birth_date" 
              value={userData.birth_date}
              onChange={handleUserChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>資格:</label>
            <input 
              type="text" 
              name="license" 
              value={userData.license}
              onChange={handleUserChange}
            />
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? '処理中...' : editMode.user ? 'ユーザー更新' : 'ユーザー作成'}
            </button>
            
            {editMode.user && (
              <button 
                type="button" 
                className={styles.cancelBtn}
                onClick={() => handleCancelEdit('user')}
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className={styles.section}>
        <h2>ユーザー一覧</h2>
        {users.length > 0 ? (
          <div className={styles.dataTable}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>氏名</th>
                  <th>メール</th>
                  <th>電話番号</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>{user.last_name} {user.first_name}</td>
                    <td>{user.mail_address}</td>
                    <td>{user.phone_number}</td>
                    <td>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEditUser(user)}
                      >
                        編集
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteUser(user.user_id)}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>ユーザーがありません</p>
        )}
      </div>
      
      <div className={styles.section}>
        <h2>{editMode.application ? '応募編集' : 'イベント応募'}</h2>
        <form onSubmit={handleApplicationSubmit}>
          <div className={styles.formGroup}>
            <label>イベント:</label>
            <select 
              name="event_id"
              value={applicationData.event_id}
              onChange={handleApplicationChange}
              required
            >
              <option value="">イベントを選択してください</option>
              {events.map(event => (
                <option key={event.event_id} value={event.event_id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>ユーザー:</label>
            <select 
              name="user_id"
              value={applicationData.user_id}
              onChange={handleApplicationChange}
              required
            >
              <option value="">ユーザーを選択してください</option>
              {users.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.last_name} {user.first_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>メッセージ:</label>
            <textarea 
              name="message" 
              value={applicationData.message}
              onChange={handleApplicationChange}
              rows={4}
            />
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? '処理中...' : editMode.application ? '応募更新' : 'イベントに応募'}
            </button>
            
            {editMode.application && (
              <button 
                type="button" 
                className={styles.cancelBtn}
                onClick={() => handleCancelEdit('application')}
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className={styles.section}>
        <h2>応募一覧</h2>
        {applications.length > 0 ? (
          <div className={styles.dataTable}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>イベント</th>
                  <th>応募者</th>
                  <th>ステータス</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.application_id}>
                    <td>{app.application_id}</td>
                    <td>{app.event_title}</td>
                    <td>{app.applicant_name}</td>
                    <td>{app.status}</td>
                    <td>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEditApplication(app)}
                      >
                        編集
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteApplication(app.application_id)}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>応募がありません</p>
        )}
      </div>

      <div className={styles.section}>
        <h2>{editMode.review ? 'レビュー編集' : 'レビュー作成'}</h2>
        <form onSubmit={handleReviewSubmit}>
          <div className={styles.formGroup}>
            <label>応募:</label>
            <select 
              name="application_id"
              value={reviewData.application_id}
              onChange={handleReviewChange}
              required
            >
              <option value="">応募を選択してください</option>
              {applications.map(app => (
                <option key={app.application_id} value={app.application_id}>
                  {app.event_title} - {app.applicant_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>レビュアー:</label>
            <select 
              name="reviewer_id"
              value={reviewData.reviewer_id}
              onChange={handleReviewChange}
              required
            >
              <option value="">レビュアーを選択してください</option>
              {users.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.last_name} {user.first_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>評価 (1-5):</label>
            <input 
              type="number" 
              name="rating" 
              min="1"
              max="5"
              step="0.5"
              value={reviewData.rating}
              onChange={handleReviewChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>コメント:</label>
            <textarea 
              name="comment" 
              value={reviewData.comment}
              onChange={handleReviewChange}
              rows={4}
            />
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? '処理中...' : editMode.review ? 'レビュー更新' : 'レビュー作成'}
            </button>
            
            {editMode.review && (
              <button 
                type="button" 
                className={styles.cancelBtn}
                onClick={() => handleCancelEdit('review')}
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <h2>レビュー一覧</h2>
        {reviews.length > 0 ? (
          <div className={styles.dataTable}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>イベント</th>
                  <th>応募者</th>
                  <th>評価</th>
                  <th>コメント</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review.review_id}>
                    <td>{review.review_id}</td>
                    <td>{review.event_title}</td>
                    <td>{review.applicant_name}</td>
                    <td>{review.rating}</td>
                    <td>{review.comment}</td>
                    <td>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEditReview(review)}
                      >
                        編集
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteReview(review.review_id)}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>レビューがありません</p>
        )}
      </div>
    </div>
  );
} 