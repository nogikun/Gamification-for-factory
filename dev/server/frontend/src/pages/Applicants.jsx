import React, { useState, useEffect, useRef } from "react";
import ApplicantDetailDrawer from "./ApplicantDetailDrawer";
import styles from "./Applicants.module.scss";
import { usePageAnimation } from "../hooks/usePageAnimation";

// ステータスの定義
const APPLICATION_STATUS = {
  PENDING: "保留中",
  APPROVED: "承認",
  REJECTED: "不承認",
  WITHDRAW: "辞退",
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
        const applicantsResponse = await fetch('http://localhost:1880/applications');
        
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
        const eventsResponse = await fetch('http://localhost:1880/event');
        
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
      // 現在の応募者データを取得
      const currentApplicant = applicants.find(app => app.application_id === applicationId);
      if (!currentApplicant) {
        throw new Error('応募者データが見つかりません');
      }
      
      // 更新されたデータを作成
      const updatedApplicant = {
        ...currentApplicant,
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      const response = await fetch('http://localhost:1880/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedApplicant)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'ステータス更新に失敗しました');
      }
      
      // 成功したら全リストを再取得（POST /applicationは全リストを返すため）
      const updatedData = await response.json();
      
      // レスポンスデータの配列チェック
      if (Array.isArray(updatedData)) {
        setApplicants(updatedData);
      } else if (updatedData && Array.isArray(updatedData.applications)) {
        setApplicants(updatedData.applications);
      } else if (updatedData && Array.isArray(updatedData.data)) {
        setApplicants(updatedData.data);
      } else {
        // ローカルでの更新をフォールバック
        setApplicants(applicants.map(app => 
          app.application_id === applicationId 
            ? { ...app, status: newStatus, updated_at: new Date().toISOString() } 
            : app
        ));
      }
      
      alert(`応募者のステータスを「${newStatus}」に更新しました`);
      
    } catch (err) {
      console.error('ステータス更新エラー:', err);
      setError(`ステータス更新中にエラーが発生しました: ${err.message}`);
      alert(`エラー: ${err.message}`);
    } finally {
      setIsLoading(false);
      handleClose();
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
    if (filterEvent && app.event_id !== filterEvent) {
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
                <th>メールアドレス</th>
                <th>イベント</th>
                <th>ステータス</th>
                <th>応募日時</th>
                <th>最終更新</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map(applicant => {
                // 関連するイベント情報を取得
                const relatedEvent = events.find(e => e.event_id === applicant.event_id);
                
                return (
                  <tr key={applicant.application_id}>
                    <td>{applicant.last_name} {applicant.first_name}</td>
                    <td>{applicant.email}</td>
                    <td>{relatedEvent ? relatedEvent.title : '不明なイベント'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[applicant.status]}`}>
                        {applicant.status}
                      </span>
                    </td>
                    <td>{new Date(applicant.created_at).toLocaleString('ja-JP')}</td>
                    <td>{new Date(applicant.updated_at).toLocaleString('ja-JP')}</td>
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
                );
              })}
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
