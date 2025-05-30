import React, { useState, useEffect } from "react";
import styles from "./Debug.module.scss";

export default function Debug() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  // 作成済みユーザー一覧
  const [users, setUsers] = useState([]);

  // イベント一覧を取得
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8000/event');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('イベント取得エラー:', error);
      }
    };

    fetchEvents();
  }, []);

  // ユーザー一覧を取得（サーバーAPIが実装されていれば）
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // このエンドポイントが実装されていることが前提
      const response = await fetch('http://localhost:8000/applicants');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  // ユーザー作成処理
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // このエンドポイントが実装されていることが前提
      const response = await fetch('http://localhost:8000/applicant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const newUser = await response.json();
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
        // ユーザー一覧を再取得
        fetchUsers();
      } else {
        const errorData = await response.json().catch(() => ({ detail: '不明なエラー' }));
        setMessage(`エラー: ${typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('ユーザー作成エラー:', error);
      setMessage(`エラー: ${error.message || '不明なエラー'}`);
    } finally {
      setLoading(false);
    }
  };

  // イベント応募処理
  const handleCreateApplication = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // このエンドポイントが実装されていることが前提
      const response = await fetch('http://localhost:8000/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (response.ok) {
        setMessage('応募が正常に作成されました');
        setApplicationData({
          event_id: '',
          user_id: '',
          message: ''
        });
      } else {
        const errorData = await response.json().catch(() => ({ detail: '不明なエラー' }));
        setMessage(`エラー: ${typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('応募作成エラー:', error);
      setMessage(`エラー: ${error.message || '不明なエラー'}`);
    } finally {
      setLoading(false);
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
      
      <div className={styles.section}>
        <h2>ユーザー作成</h2>
        <form onSubmit={handleCreateUser}>
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
          
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? '作成中...' : 'ユーザー作成'}
          </button>
        </form>
      </div>
      
      <div className={styles.section}>
        <h2>イベント応募</h2>
        <form onSubmit={handleCreateApplication}>
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
          
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? '応募中...' : 'イベントに応募'}
          </button>
        </form>
      </div>
    </div>
  );
} 