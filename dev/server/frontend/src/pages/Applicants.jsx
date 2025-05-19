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

// ダミーデータの定義
const DUMMY_APPLICANTS = [
  {
    application_id: "app001",
    user_id: "user001",
    event_id: "event001",
    first_name: "太郎",
    last_name: "山田",
    email: "taro.yamada@example.com",
    status: APPLICATION_STATUS.PENDING,
    created_at: "2025-04-20T10:30:00",
    updated_at: "2025-04-20T10:30:00",
    resume_url: "https://example.com/resume/1",
    message: "御社のインターンシップに興味があります。よろしくお願いします。"
  },
  {
    application_id: "app002",
    user_id: "user002",
    event_id: "event002",
    first_name: "花子",
    last_name: "佐藤",
    email: "hanako.sato@example.com",
    status: APPLICATION_STATUS.APPROVED,
    created_at: "2025-04-18T14:20:00",
    updated_at: "2025-04-19T09:15:00",
    resume_url: "https://example.com/resume/2",
    message: "プログラミング経験を活かして貢献したいと思います。"
  },
  {
    application_id: "app003",
    user_id: "user003",
    event_id: "event001",
    first_name: "次郎",
    last_name: "鈴木",
    email: "jiro.suzuki@example.com",
    status: APPLICATION_STATUS.REJECTED,
    created_at: "2025-04-15T11:45:00",
    updated_at: "2025-04-17T16:30:00",
    resume_url: "https://example.com/resume/3",
    message: "ものづくりに情熱があります。御社で学びたいです。"
  },
  {
    application_id: "app004",
    user_id: "user004",
    event_id: "event003",
    first_name: "恵",
    last_name: "高橋",
    email: "megumi.takahashi@example.com",
    status: APPLICATION_STATUS.WITHDRAW,
    created_at: "2025-04-12T09:00:00",
    updated_at: "2025-04-13T10:45:00",
    resume_url: "https://example.com/resume/4",
    message: "チームでの作業が好きです。インターンで成長したいです。"
  },
];

// ダミーイベントデータ
const DUMMY_EVENTS = [
  {
    event_id: "event001",
    title: "夏季インターンシップ（プログラミング）",
    start_date: "2025-07-01T09:00:00",
    end_date: "2025-07-15T17:00:00",
    event_type: "インターンシップ",
    location: "東京本社"
  },
  {
    event_id: "event002",
    title: "秋季インターンシップ（ものづくり）",
    start_date: "2025-09-01T09:00:00",
    end_date: "2025-09-30T17:00:00",
    event_type: "インターンシップ",
    location: "大阪工場"
  },
  {
    event_id: "event003",
    title: "会社説明会",
    start_date: "2025-06-15T13:00:00",
    end_date: "2025-06-15T16:00:00",
    event_type: "説明会",
    location: "オンライン"
  },
];

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
  const [useDummyData, setUseDummyData] = useState(false);

  // 応募者データと関連イベントデータを取得
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 応募者一覧を取得
        const applicantsResponse = await fetch('/api/applications');
        
        if (!applicantsResponse.ok) {
          throw new Error('応募者データの取得に失敗しました');
        }
        
        const applicantsData = await applicantsResponse.json();
        setApplicants(applicantsData);
        
        // イベント一覧を取得（フィルター用）
        const eventsResponse = await fetch('/api/events');
        
        if (!eventsResponse.ok) {
          throw new Error('イベントデータの取得に失敗しました');
        }
        
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
        
        // 通信成功したので、ダミーデータフラグをリセット
        setUseDummyData(false);
        
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError(`データの取得中にエラーが発生しました: ${err.message}`);
        
        // エラー時はダミーデータを使用
        setApplicants(DUMMY_APPLICANTS);
        setEvents(DUMMY_EVENTS);
        setUseDummyData(true);
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
      if (useDummyData) {
        // ダミーデータの場合はローカルで処理
        setTimeout(() => {
          // ローカルの状態を更新
          setApplicants(applicants.map(app => 
            app.application_id === applicationId 
              ? { ...app, status: newStatus, updated_at: new Date().toISOString() } 
              : app
          ));
          
          setIsLoading(false);
          handleClose();
          alert(`応募者のステータスを「${newStatus}」に更新しました (ダミーデータ)`);
        }, 500);
        
        return;
      }
      
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'ステータス更新に失敗しました');
      }
      
      // 成功したら応募者データを更新
      const updatedData = await response.json();
      
      // ローカルの状態を更新
      setApplicants(applicants.map(app => 
        app.application_id === applicationId 
          ? { ...app, status: newStatus, updated_at: new Date().toISOString() } 
          : app
      ));
      
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
  
  // ダミーデータへの切り替え処理
  const handleSwitchToDummy = () => {
    setApplicants(DUMMY_APPLICANTS);
    setEvents(DUMMY_EVENTS);
    setUseDummyData(true);
  };
  
  // データ再取得処理
  const handleRefresh = () => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 応募者一覧を取得
        const applicantsResponse = await fetch('/api/applications');
        
        if (!applicantsResponse.ok) {
          throw new Error('応募者データの取得に失敗しました');
        }
        
        const applicantsData = await applicantsResponse.json();
        setApplicants(applicantsData);
        
        // イベント一覧を取得（フィルター用）
        const eventsResponse = await fetch('/api/events');
        
        if (!eventsResponse.ok) {
          throw new Error('イベントデータの取得に失敗しました');
        }
        
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
        
        // 通信成功したので、ダミーデータフラグをリセット
        setUseDummyData(false);
        
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError(`データの取得中にエラーが発生しました: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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
      
      {/* ダミーデータ使用中の表示 */}
      {useDummyData && (
        <div className={styles.dummyDataNotice}>
          <span>ダミーデータを使用中</span>
          <button 
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? '読み込み中...' : 'データを再取得'}
          </button>
        </div>
      )}
      
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
        
        {/* ダミーデータ切替ボタン */}
        {!useDummyData && (
          <div className={styles.actionButtons}>
            <button 
              className={styles.dummyButton}
              onClick={handleSwitchToDummy}
            >
              ダミーデータに切替
            </button>
          </div>
        )}
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
