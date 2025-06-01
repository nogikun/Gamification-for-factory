import React, { useState, useEffect, useRef } from "react";
import styles from "./CompanyEdit.module.scss";
import { usePageAnimation } from "../hooks/usePageAnimation";

// APIベースURL
const API_BASE_URL = "http://localhost:8000";

export default function CompanyEdit() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  // 状態管理
  const [form, setForm] = useState({
    user_id: "",
    company_name: "",
    mail_address: "",
    phone_number: "",
    address: "",
    capital: 0,
    employees: 0,
    establishment_date: "",
    overview: "",
    updated_at: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  usePageAnimation({
    containerRef,
    titleRef,
    contentRefs: [formRef]
  });

  // コンポーネントマウント時に企業データを取得
  useEffect(() => {
    fetchCompanyData();
  }, []);

  // 企業データを取得する関数
  const fetchCompanyData = async () => {
    setIsLoading(true);
    setError(null);
    setSaveStatus(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies`);
      
      if (!response.ok) {
        throw new Error(`企業データの取得に失敗しました (${response.status})`);
      }
      
      const data = await response.json();
      
      // データが配列で返ってくる場合（1社分）
      if (Array.isArray(data) && data.length > 0) {
        const companyData = data[0];
        
        // establishment_dateをdate inputで使える形式に変換
        const formattedDate = companyData.establishment_date 
          ? companyData.establishment_date.split('T')[0] 
          : "";
        
        setForm({
          ...companyData,
          establishment_date: formattedDate,
          capital: companyData.capital || 0,
          employees: companyData.employees || 0
        });
        setIsDataLoaded(true);
      } else if (data && typeof data === 'object') {
        // 単一オブジェクトで返ってくる場合
        const formattedDate = data.establishment_date 
          ? data.establishment_date.split('T')[0] 
          : "";
        
        setForm({
          ...data,
          establishment_date: formattedDate,
          capital: data.capital || 0,
          employees: data.employees || 0
        });
        setIsDataLoaded(true);
      } else {
        // データが存在しない場合は空のフォームのまま
        console.log('企業データが見つかりませんでした。新規作成モードです。');
        setIsDataLoaded(true);
      }
    } catch (err) {
      console.error('企業データ取得エラー:', err);
      setError(`データの取得中にエラーが発生しました: ${err.message}`);
      setIsDataLoaded(true);
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
      // establishment_dateをISO形式に変換
      const submitData = {
        ...form,
        establishment_date: form.establishment_date 
          ? `${form.establishment_date}T00:00:00` 
          : "",
        capital: parseInt(form.capital) || 0,
        employees: parseInt(form.employees) || 0,
        updated_at: new Date().toISOString()
      };
      
      const response = await fetch(`${API_BASE_URL}/api/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`企業データの保存に失敗しました (${response.status}): ${errorData}`);
      }
      
      const responseData = await response.json();
      console.log('保存成功:', responseData);
      
      // 保存成功時にフォームの更新日時を更新
      const now = new Date();
      const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
      setForm(prevForm => ({
        ...prevForm,
        updated_at: formattedDate
      }));
      
      setSaveStatus({ type: 'success', message: '企業情報が正常に保存されました' });
    } catch (err) {
      console.error('企業データ保存エラー:', err);
      setError(`データの保存中にエラーが発生しました: ${err.message}`);
      setSaveStatus({ type: 'error', message: '企業情報の保存に失敗しました' });
    } finally {
      setIsLoading(false);
    }
  };

  // フォーム入力時の処理
  const handleChange = e => {
    const { name, value, type } = e.target;
    
    // 数値フィールドの処理
    if (type === 'number') {
      setForm({ ...form, [name]: value === '' ? 0 : parseInt(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // データを再取得する関数
  const handleRefresh = () => {
    fetchCompanyData();
  };

  return (
    <div ref={containerRef} className={styles.companyEdit}>
      <h1 ref={titleRef} className={styles.companyEdit__title}>企業情報編集</h1>
      
      {/* データ取得ボタン */}
      <div className={styles.dataActions}>
        <button 
          type="button" 
          onClick={handleRefresh}
          className={styles.refreshButton}
          disabled={isLoading}
        >
          {isLoading ? '読み込み中...' : 'データを再取得'}
        </button>
      </div>
      
      {/* エラーメッセージ */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {/* 保存状態メッセージ */}
      {saveStatus && (
        <div className={`${styles.statusMessage} ${styles[saveStatus.type]}`}>
          {saveStatus.message}
        </div>
      )}
      
      {!isDataLoaded ? (
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingSpinner}></div>
          <p>企業データを読み込み中...</p>
        </div>
      ) : isLoading ? (
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingSpinner}></div>
          <p>データを保存中...</p>
        </div>
      ) : (
        <form ref={formRef} className={styles.companyEdit__form} onSubmit={handleSubmit}>
          <label>
            ユーザーID
            <input 
              name="user_id" 
              value={form.user_id} 
              onChange={handleChange} 
              placeholder="ユーザーIDを入力" 
              required 
            />
          </label>
          <label>
            企業名
            <input 
              name="company_name" 
              value={form.company_name} 
              onChange={handleChange} 
              maxLength={100} 
              placeholder="企業名を入力" 
              required 
            />
          </label>
          <label>
            メールアドレス
            <input 
              name="mail_address" 
              value={form.mail_address} 
              onChange={handleChange} 
              type="email" 
              placeholder="メールアドレスを入力" 
              required 
            />
          </label>
          <label>
            電話番号
            <input 
              name="phone_number" 
              value={form.phone_number} 
              onChange={handleChange} 
              maxLength={20} 
              placeholder="電話番号を入力" 
              required 
            />
          </label>
          <label>
            住所
            <input 
              name="address" 
              value={form.address} 
              onChange={handleChange} 
              placeholder="住所を入力" 
              required 
            />
          </label>
          <label>
            資本金（円）
            <input 
              name="capital" 
              type="number" 
              value={form.capital} 
              onChange={handleChange} 
              required 
              min="0" 
              placeholder="資本金を入力" 
            />
          </label>
          <label>
            従業員数
            <input 
              name="employees" 
              type="number" 
              value={form.employees} 
              onChange={handleChange} 
              required 
              min="1" 
              placeholder="従業員数を入力" 
            />
          </label>
          <label>
            設立日
            <input 
              name="establishment_date" 
              type="date" 
              value={form.establishment_date} 
              onChange={handleChange} 
              required 
            />
          </label>
          <label>
            会社概要
            <textarea 
              name="overview" 
              value={form.overview} 
              onChange={handleChange} 
              placeholder="会社概要を入力" 
              required 
              rows={4}
            />
          </label>
          <label>
            更新日時
            <input 
              name="updated_at" 
              value={form.updated_at} 
              readOnly 
              placeholder="保存時に自動設定されます"
            />
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
