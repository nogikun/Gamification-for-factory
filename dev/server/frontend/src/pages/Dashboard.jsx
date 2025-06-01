import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import DashboardCalendar from "../components/DashboardCalendar";
import styles from "./Dashboard.module.scss";
import { UserPlus, CalendarCheck, HourglassMedium } from "phosphor-react";
import { apiRequest } from "../config";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const calendarRef = useRef(null);
  const activitySectionRef = useRef(null);
  const activityTitleRef = useRef(null);
  const activityListItemsRef = useRef([]);

  // 状態管理
  const [dashboardData, setDashboardData] = useState({
    applicantsCount: 0,
    eventsCount: 0,
    reviewsCount: 0,
    recentActivities: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Collect refs for KPI cards
  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  // Collect refs for Activity list items
  const addToActivityListItemsRef = (el) => {
    if (el && !activityListItemsRef.current.includes(el)) {
      activityListItemsRef.current.push(el);
    }
  };

  // データ取得処理
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 並列で全てのAPIからデータを取得
        const [eventsResponse, applicationsResponse, reviewsResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:8000/event'),
          fetch('http://localhost:8000/applications'),
          fetch('http://localhost:8000/api/reviews'),
          fetch('http://localhost:8000/api/users')
        ]);

        // レスポンスチェック
        const eventsData = eventsResponse.ok ? await eventsResponse.json() : [];
        const applicationsData = applicationsResponse.ok ? await applicationsResponse.json() : [];
        const reviewsData = reviewsResponse.ok ? await reviewsResponse.json() : [];
        const usersData = usersResponse.ok ? await usersResponse.json() : [];

        // 配列チェック
        const events = Array.isArray(eventsData) ? eventsData : [];
        const applications = Array.isArray(applicationsData) ? applicationsData : [];
        const reviews = Array.isArray(reviewsData) ? reviewsData : [];
        const users = Array.isArray(usersData) ? usersData : [];

        // ユーザー名取得ヘルパー
        const getUserName = (userId) => {
          const user = users.find(u => u.user_id === userId);
          return user ? `${user.last_name} ${user.first_name}` : '不明なユーザー';
        };

        // イベント名取得ヘルパー
        const getEventName = (eventId) => {
          const event = events.find(e => e.event_id === eventId);
          return event ? event.title : '不明なイベント';
        };

        // 今後のイベント数（今日以降）
        const now = new Date();
        const upcomingEvents = events.filter(event => 
          new Date(event.start_date) >= now
        );

        // 最近のアクティビティを生成（最新5件）
        const recentActivities = [];

        // 最近の応募（最新3件）
        const recentApplications = applications
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        
        recentApplications.forEach(app => {
          const userName = getUserName(app.user_id);
          const eventName = getEventName(app.event_id);
          recentActivities.push(`${userName}さんが「${eventName}」に応募しました`);
        });

        // 最近のイベント作成（最新2件）
        const recentEvents = events
          .sort((a, b) => new Date(b.created_at || b.start_date) - new Date(a.created_at || a.start_date))
          .slice(0, 2);
        
        recentEvents.forEach(event => {
          recentActivities.push(`イベント「${event.title}」が作成されました`);
        });

        // 最近のレビュー（最新2件）
        const recentReviews = reviews
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 2);
        
        recentReviews.forEach(review => {
          const reviewerName = getUserName(review.reviewer_id);
          const revieweeName = getUserName(review.reviewee_id);
          recentActivities.push(`${reviewerName}さんが${revieweeName}さんをレビューしました`);
        });

        setDashboardData({
          applicantsCount: applications.length,
          eventsCount: upcomingEvents.length,
          reviewsCount: reviews.length,
          recentActivities: recentActivities.slice(0, 5) // 最新5件に制限
        });

      } catch (err) {
        console.error('ダッシュボードデータ取得エラー:', err);
        setError(`データの取得中にエラーが発生しました: ${err.message}`);
        
        // エラー時のフォールバック
        setDashboardData({
          applicantsCount: 0,
          eventsCount: 0,
          reviewsCount: 0,
          recentActivities: ['データの取得に失敗しました']
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // アニメーション処理
  const animatedElements = useRef([]);
  useEffect(() => {
    animatedElements.current = [
      titleRef.current,
      ...cardsRef.current,
      calendarRef.current,
      activitySectionRef.current,
      activityTitleRef.current,
      ...activityListItemsRef.current
    ].filter(Boolean);
  }, [titleRef, cardsRef, calendarRef, activitySectionRef, activityTitleRef, activityListItemsRef]);

  useEffect(() => {
    // アニメーション処理（データ読み込み完了後に実行）
    if (!isLoading) {
      gsap.set(titleRef.current, { y: -20, autoAlpha: 0 });
      gsap.set(cardsRef.current, { y: 40, autoAlpha: 0 });
      gsap.set(calendarRef.current, { scale: 0.95, autoAlpha: 0 });
      gsap.set(activitySectionRef.current, { x: 30, autoAlpha: 0 });
      gsap.set(activityTitleRef.current, { y: -10, autoAlpha: 0 });
      gsap.set(activityListItemsRef.current, { y: 20, autoAlpha: 0 });

      const tl = gsap.timeline();

      tl.to(titleRef.current, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
      }, 0)
      .to(cardsRef.current, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
      }, 0.2)
      .to(calendarRef.current, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
      }, 0.5)
      .to(activitySectionRef.current, {
        x: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
      }, 0.7)
      .to(activityTitleRef.current, {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.6")
      .to(activityListItemsRef.current, {
        y: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      }, 0.9);

      return () => {
        tl.kill();
      };
    }
  }, [location.pathname, isLoading]);

  // KPIデータ（実際のデータを使用）
  const kpiData = [
    { 
      id: 'applicants', 
      icon: <UserPlus size={28} />, 
      label: "応募者", 
      value: dashboardData.applicantsCount, 
      sub: "総応募数", 
      route: "/applicants" 
    },
    { 
      id: 'events', 
      icon: <CalendarCheck size={28} />, 
      label: "今後のイベント", 
      value: dashboardData.eventsCount, 
      sub: "予定済み", 
      route: "/events/new" 
    },
    { 
      id: 'reviews', 
      icon: <HourglassMedium size={28} />, 
      label: "レビュー", 
      value: dashboardData.reviewsCount, 
      sub: "投稿済み", 
      route: "/reviews" 
    },
  ];

  // Navigation handler
  const handleCardClick = (route) => {
    navigate(route);
  };

  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingSpinner}></div>
          <p>ダッシュボードを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.dashboard__kpiRow}>
        {kpiData.map((item) => (
          <div 
            ref={addToCardsRef} 
            className={`${styles.kpiCard} shadow-md rounded-md`} 
            key={item.id} 
            onClick={() => handleCardClick(item.route)}
          >
            <div className={styles.kpiCard__icon}>{item.icon}</div>
            <div className={styles.kpiCard__label}>{item.label}</div>
            <div className={styles.kpiCard__value}>{item.value}</div>
            <div className={styles.kpiCard__sub}>{item.sub}</div>
          </div>
        ))}
      </div>
      
      <div className={styles.dashboard__calendarRow}>
        <div ref={calendarRef} className={styles.dashboard__calendarContainer}>
          <DashboardCalendar />
        </div>
        
        <section ref={activitySectionRef} className={styles.dashboard__activity}>
          <h2 ref={activityTitleRef} className={styles.dashboard__sectionTitle}>最近の活動</h2>
          <ul className={styles.activityList}>
            {dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities.map((activity, index) => (
                <li key={index} ref={addToActivityListItemsRef}>{activity}</li>
              ))
            ) : (
              <li ref={addToActivityListItemsRef}>最近の活動はありません</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
