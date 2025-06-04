import React, { useState, useEffect, useRef } from "react";
import ApplicantDetailDrawer from "./ApplicantDetailDrawer";
import styles from "./Applicants.module.scss";
import { usePageAnimation } from "../hooks/usePageAnimation";
import { apiRequest, API_BASE_URL } from "../config";

// ステータスの定義（バックエンドのapplication_statusに合わせる）
const APPLICATION_STATUS = {
  PENDING: "未対応",
  APPROVED: "承認",
  REJECTED: "否認",
};

export default function Applicants() {
  const containerRef = useRef(null);
  const tableWrapperRef = useRef(null);

  // Apply animation hook (No explicit title, using table as main content)
  usePageAnimation({ 
    containerRef, 
    contentRefs: [tableWrapperRef] 
  });

  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [events, setEvents] = useState([]);

  // 応募者データと関連イベントデータを取得
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 応募者一覧を取得
        const applicantsResponse = await fetch(`${API_BASE_URL}/applications`);
        
        if (!applicantsResponse.ok) {
          throw new Error('応募者データの取得に失敗しました');
        }
        
        const applicantsData = await applicantsResponse.json();
        
        // データが配列かどうかを確認
        if (Array.isArray(applicantsData)) {
          setApplicants(applicantsData);
        } else if (applicantsData && Array.isArray(applicantsData.applications)) {
          setApplicants(applicantsData.applications);
        } else if (applicantsData && Array.isArray(applicantsData.data)) {
          setApplicants(applicantsData.data);
        } else {
          console.warn('APIから期待される配列形式のデータが返されませんでした:', applicantsData);
          setApplicants([]);
        }
        
        // イベント一覧を取得（フィルター用）
        const eventsResponse = await fetch(`${API_BASE_URL}/event`);
        
        if (!eventsResponse.ok) {
          throw new Error('イベントデータの取得に失敗しました');
        }
        
        const eventsData = await eventsResponse.json();
        
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
        
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError(`データの取得中にエラーが発生しました: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 詳細ボタンでDrawerを開く
  const handleDetail = (applicationId) => {
    setSelectedId(applicationId);
    setDrawerOpen(true);
  };

  // Drawer閉じる
  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedId(null);
  };

  // 応募ステータス更新（承認/拒否など）
  const handleUpdateStatus = async (applicationId, newStatus) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 現在のログインユーザーID（実装環境で適宜取得）
      const currentUserId = "11111111-1111-1111-1111-111111111111"; // テスト用固定UUID
      
      // 更新データを作成
      const updateData = {
        status: newStatus,
        processed_by: currentUserId
      };
      
      // PUT リクエストでステータス更新
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'ステータス更新に失敗しました');
      }
      
      // 成功したら更新された応募データを取得
      const updatedApplication = await response.json();
      
      // 応募一覧を更新（該当するアプリケーションのみ更新）
      setApplicants(applicants.map(app => 
        app.application_id === applicationId 
          ? { ...app, ...updatedApplication } 
          : app
      ));
      
      // 成功メッセージ
      alert(`応募者のステータスを「${newStatus}」に更新しました`);
      
      // データを再取得して最新の状態を反映
      fetchData();
      
    } catch (err) {
      console.error('ステータス更新エラー:', err);
      setError(`ステータス更新中にエラーが発生しました: ${err.message}`);
      alert(`エラー: ${err.message}`);
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  // 応募データを再取得
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/applications`);
      if (!response.ok) {
        throw new Error('応募データの再取得に失敗しました');
      }
      const data = await response.json();
      setApplicants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('データ再取得エラー:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 承認処理
  const handleApprove = (applicationId) => {
    handleUpdateStatus(applicationId, APPLICATION_STATUS.APPROVED);
  };
  
  // 拒否処理
  const handleReject = (applicationId) => {
    handleUpdateStatus(applicationId, APPLICATION_STATUS.REJECTED);
  };
  
  // フィルター適用
  const filteredApplicants = applicants.filter(app => {
    // ステータスでフィルター
    if (filterStatus && app.status !== filterStatus) {
      return false;
    }
    
    // イベントでフィルター
    if (filterEvent && app.event_id !== parseInt(filterEvent)) {
      return false;
    }
    
    return true;
  });
  
  // 選択された応募者情報を取得
  const selectedApplicant = applicants.find(a => a.application_id === selectedId);
  
  // 選択された応募者のイベント情報を取得
  const selectedEvent = selectedApplicant ? 
    events.find(e => e.event_id === selectedApplicant.event_id) : null;

  // ユーザー情報とイベント情報を組み合わせた詳細データ
  const selectedApplicantWithDetails = selectedApplicant ? {
    ...selectedApplicant,
    eventDetails: selectedEvent
  } : null;

  return (
    <div ref={containerRef} className={styles.applicantsPage}>
      <h1 className={styles.applicants__title}>応募者一覧</h1>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.filtersContainer}>
        <div className={styles.filterControl}>
          <label>ステータス:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">すべて</option>
            {Object.values(APPLICATION_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterControl}>
          <label>イベント:</label>
          <select 
            value={filterEvent} 
            onChange={(e) => setFilterEvent(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">すべて</option>
            {events.map(event => (
              <option key={event.event_id} value={event.event_id}>{event.title}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div ref={tableWrapperRef} className={styles.tableWrapper}>
        {isLoading ? (
          <div className={styles.loadingIndicator}>データを読み込み中...</div>
        ) : filteredApplicants.length === 0 ? (
          <div className={styles.noData}>該当する応募者データがありません</div>
        ) : (
          <table className={styles.applicantsTable}>
            <thead className={styles.tableHead}>
              <tr>
                <th>氏名</th>
                <th>イベント</th>
                <th>ステータス</th>
                <th>応募日時</th>
                <th>メッセージ</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map(applicant => (
                <tr key={applicant.application_id}>
                  <td>{applicant.applicant_name || '名前なし'}</td>
                  <td>{applicant.event_title || '不明なイベント'}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[applicant.status]}`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td>{new Date(applicant.applied_at).toLocaleString('ja-JP')}</td>
                  <td className={styles.messageCell}>
                    {applicant.message ? 
                      (applicant.message.length > 30 ? 
                        `${applicant.message.substring(0, 30)}...` : 
                        applicant.message) : 
                      'メッセージなし'}
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button 
                        className={styles.detailBtn}
                        onClick={() => handleDetail(applicant.application_id)}
                      >
                        詳細
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <ApplicantDetailDrawer 
        open={drawerOpen}
        onClose={handleClose}
        applicant={selectedApplicantWithDetails}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
