import React, { useState, useEffect, useRef } from "react";
import styles from "./CompanyEdit.module.scss";
import { usePageAnimation } from "../hooks/usePageAnimation";

// ダミーデータ
const initialDummyData = {
  user_id: "d1b2c3e4-5678-1234-9abc-123456789abc",
  company_name: "株式会社サンプル",
  mail_address: "sample@example.com",
  phone_number: "03-1234-5678",
  address: "東京都千代田区1-2-3",
  capital: 10000000,
  employees: 50,
  establishment_date: "2000-04-01",
  overview: "インターンシップを通じて成長できる環境を提供しています。",
  updated_at: "2025-04-28 10:00:00",
};

export default function CompanyEdit() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  // 状態管理
  const [form, setForm] = useState(initialDummyData);
  const [apiUrl, setApiUrl] = useState("/api/company");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // 保存状態（成功/失敗）
  const [useDummyData, setUseDummyData] = useState(false);

  usePageAnimation({
    containerRef,
    titleRef,
    contentRefs: [formRef]
  });

  // コンポーネントマウント時にデータ取得
  useEffect(() => {
    fetchCompanyData();
  }, []);

  // APIからデータを取得する関数
  const fetchCompanyData = async () => {
    setIsLoading(true);
    setError(null);
    setSaveStatus(null);
    
    try {
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('企業データの取得に失敗しました');
      }
      
      const data = await response.json();
      setForm(data);
      setUseDummyData(false);
    } catch (err) {
      console.error('企業データ取得エラー:', err);
      setError(`データの取得中にエラーが発生しました: ${err.message}`);
      
      // エラー時はダミーデータを使用
      if (!useDummyData) {
        setForm(initialDummyData);
        setUseDummyData(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSaveStatus(null);
    
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) {
        throw new Error('企業データの保存に失敗しました');
      }
      
      const updatedData = await response.json();
      setForm(updatedData);
      setSaveStatus({ type: 'success', message: '企業情報が正常に保存されました' });
      setUseDummyData(false);
    } catch (err) {
      console.error('企業データ保存エラー:', err);
      setError(`データの保存中にエラーが発生しました: ${err.message}`);
      setSaveStatus({ type: 'error', message: '企業情報の保存に失敗しました' });
      
      // ダミーデータの場合は更新日時を更新
      if (useDummyData) {
        const now = new Date();
        const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
        setForm(prevForm => ({
          ...prevForm,
          updated_at: formattedDate
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // フォーム入力時の処理
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // API URL入力時の処理
  const handleApiUrlChange = (e) => {
    setApiUrl(e.target.value);
  };

  // API URLをリセットする処理
  const handleResetApiUrl = () => {
    setApiUrl("/api/company");
  };

  // データを再取得する処理
  const handleRefresh = () => {
    fetchCompanyData();
  };

  // ダミーデータに切り替える処理
  const handleSwitchToDummy = () => {
    setForm(initialDummyData);
    setUseDummyData(true);
    setSaveStatus({ type: 'info', message: 'ダミーデータに切り替えました' });
  };

  return (
    <div ref={containerRef} className={styles.companyEdit}>
      <h1 ref={titleRef} className={styles.companyEdit__title}>企業情報編集</h1>
      
      {/* API URL設定セクション */}
      <div className={styles.apiUrlSection}>
        <label>
          API URL
          <div className={styles.apiUrlInputGroup}>
            <input 
              type="text" 
              value={apiUrl} 
              onChange={handleApiUrlChange} 
              className={styles.apiUrlInput}
              placeholder="APIのURLを入力"
            />
            <button 
              type="button" 
              onClick={handleResetApiUrl}
              className={styles.resetButton}
            >
              リセット
            </button>
          </div>
        </label>
        <div className={styles.apiActions}>
          <button 
            type="button" 
            onClick={handleRefresh}
            className={styles.refreshButton}
            disabled={isLoading}
          >
            {isLoading ? '読み込み中...' : 'データを再取得'}
          </button>
          <button 
            type="button" 
            onClick={handleSwitchToDummy}
            className={styles.dummyButton}
          >
            ダミーデータに切替
          </button>
        </div>
      </div>
      
      {/* エラーメッセージ */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {/* 保存状態メッセージ */}
      {saveStatus && (
        <div className={`${styles.statusMessage} ${styles[saveStatus.type]}`}>
          {saveStatus.message}
        </div>
      )}
      
      {/* ダミーデータ使用中の表示 */}
      {useDummyData && (
        <div className={styles.dummyDataNotice}>
          <span>ダミーデータを使用中</span>
        </div>
      )}
      
      {isLoading ? (
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingSpinner}></div>
          <p>データを読み込み中...</p>
        </div>
      ) : (
        <form ref={formRef} className={styles.companyEdit__form} onSubmit={handleSubmit}>
          <label>
            ユーザーID（UUID）
            <input name="user_id" value={form.user_id} readOnly />
          </label>
          <label>
            企業名
            <input name="company_name" value={form.company_name} onChange={handleChange} maxLength={50} required />
          </label>
          <label>
            メールアドレス
            <input name="mail_address" value={form.mail_address} onChange={handleChange} type="email" required />
          </label>
          <label>
            電話番号
            <input name="phone_number" value={form.phone_number} onChange={handleChange} maxLength={50} required />
          </label>
          <label>
            住所
            <input name="address" value={form.address} onChange={handleChange} required />
          </label>
          <label>
            資本金（円）
            <input name="capital" type="number" value={form.capital} onChange={handleChange} required min="0" />
          </label>
          <label>
            従業員数
            <input name="employees" type="number" value={form.employees} onChange={handleChange} required min="1" />
          </label>
          <label>
            設立日
            <input name="establishment_date" type="date" value={form.establishment_date} onChange={handleChange} required />
          </label>
          <label>
            会社概要
            <textarea name="overview" value={form.overview} onChange={handleChange} required />
          </label>
          <label>
            更新日時
            <input name="updated_at" value={form.updated_at} readOnly />
          </label>
          <div className={styles.companyEdit__actions}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
