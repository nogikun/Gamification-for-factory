import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { gsap } from "gsap";
import DashboardCalendar from "../components/DashboardCalendar";
import styles from "./Dashboard.module.scss";
import { UserPlus, CalendarCheck, HourglassMedium } from "phosphor-react";

const Dashboard = () => {
  const location = useLocation(); // Get location object
  const navigate = useNavigate(); // Get navigate function
  const titleRef = useRef(null); // Keep ref in case needed later, but element is removed
  const cardsRef = useRef([]);
  // Separate refs for calendar row elements
  const calendarRef = useRef(null);
  const activitySectionRef = useRef(null);
  const activityTitleRef = useRef(null);
  const activityListItemsRef = useRef([]);
  // 予定リスト用のrefs
  const eventListRef = useRef(null);
  const eventListTitleRef = useRef(null);
  const eventListItemRef = useRef(null);

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

  // Refs array for easier reset
  const animatedElements = useRef([]);
  useEffect(() => {
    animatedElements.current = [
      titleRef.current,
      ...cardsRef.current,
      calendarRef.current,
      eventListRef.current,
      eventListTitleRef.current,
      eventListItemRef.current,
      activitySectionRef.current,
      activityTitleRef.current,
      ...activityListItemsRef.current
    ].filter(Boolean); // Ensure only valid refs are included
  }, [titleRef, cardsRef, calendarRef, eventListRef, eventListTitleRef, eventListItemRef, activitySectionRef, activityTitleRef, activityListItemsRef]); // Update when refs change

  useEffect(() => {
    // 1. Set initial states for elements (off-screen/invisible)
    // Use autoAlpha for visibility and opacity control
    gsap.set(titleRef.current, { y: -20, autoAlpha: 0 });
    gsap.set(cardsRef.current, { y: 40, autoAlpha: 0 });
    gsap.set(calendarRef.current, { scale: 0.95, autoAlpha: 0 });
    // 予定リストの初期状態
    gsap.set(eventListRef.current, { y: 30, autoAlpha: 0 });
    gsap.set(eventListTitleRef.current, { y: -10, autoAlpha: 0 });
    gsap.set(eventListItemRef.current, { y: 20, autoAlpha: 0 });
    // 通知セクションの初期状態
    gsap.set(activitySectionRef.current, { x: 30, autoAlpha: 0 });
    gsap.set(activityTitleRef.current, { y: -10, autoAlpha: 0 }); // Already handled by section's autoAlpha, but specific y offset
    gsap.set(activityListItemsRef.current, { y: 20, autoAlpha: 0 });

    const tl = gsap.timeline();

    // Animate title
    tl.to(titleRef.current, { // Animate TO final state
      y: 0, // Target y
      autoAlpha: 1, // Target visibility
      duration: 0.8,
      ease: "power3.out",
    }, 0); // Start at 0s

    // Animate KPI cards staggered
    tl.to(cardsRef.current, { // Animate TO final state
      y: 0, // Target y
      autoAlpha: 1, // Target visibility
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.15,
    }, 0.2); // Start at 0.2s

    // Animate Calendar
    tl.to(calendarRef.current, { // Animate TO final state
      scale: 1, // Target scale
      autoAlpha: 1, // Target visibility
      duration: 0.8,
      ease: "power3.out",
    }, 0.5); // Start at 0.5s

    // 予定リストのアニメーション
    tl.to(eventListRef.current, { // Animate TO final state
      y: 0, // Target y
      autoAlpha: 1, // Target visibility
      duration: 0.8,
      ease: "power3.out",
    }, 0.6) // Start slightly after calendar
    .to(eventListTitleRef.current, { // Animate TO final state
      y: 0,
      autoAlpha: 1,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.6") // Start with section wrapper
    .to(eventListItemRef.current, { // Animate TO final state
      y: 0,
      autoAlpha: 1,
      duration: 0.7,
      ease: "power2.out",
    }, "-=0.4"); // Start slightly after title

    // Animate Activity Section (wrapper + title)
    tl.to(activitySectionRef.current, { // Animate TO final state
      x: 0, // Target x
      autoAlpha: 1, // Target visibility
      duration: 0.8,
      ease: "power3.out",
    }, 0.7) // Start slightly after event list
    .to(activityTitleRef.current, { // Animate TO final state (y and visibility)
      y: 0,
      autoAlpha: 1, // Although section handles visibility, ensure y is correct
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.6"); // Start with section wrapper

    // Animate Activity List Items staggered
    tl.to(activityListItemsRef.current, { // Animate TO final state
      y: 0, // Target y
      autoAlpha: 1, // Target visibility
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.1,
    }, 0.9); // Start after section title appears

    // Clean up timeline on component unmount or before re-run
    return () => {
      tl.kill();
    };
  }, [location.pathname]); // Re-run effect when pathname changes

  // Add target route to KPI data
  const kpiData = [
    { id: 'applicants', icon: <UserPlus size={28} />, label: "応募者", value: 12, sub: "本日 +2名", route: "/applicants" },
    { id: 'events', icon: <CalendarCheck size={28} />, label: "今後のイベント", value: 3, sub: "今週 1件", route: "/event-registration" },
    { id: 'reviews', icon: <HourglassMedium size={28} />, label: "未対応レビュー", value: 5, sub: "昨日 -1件", route: "/reviews" },
  ];

  // Navigation handler
  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard__kpiRow}>
        {kpiData.map((item) => (
          // Added onClick handler and key using item.id
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
        <div ref={calendarRef}>
          <DashboardCalendar />
        </div>
        
        <div className={styles.dashboard__contentColumn}>
          {/* 予定リスト */}
          <div ref={eventListRef} className={styles.dashboard__eventList}>
            <h2 ref={eventListTitleRef} className={styles.dashboard__sectionTitle}>予定リスト</h2>
            <div ref={eventListItemRef} className={styles.dashboard__eventItem}>
              <div className={styles.dashboard__eventLabel}>開催日</div>
              <div className={styles.dashboard__eventValue}>2025年5月15日</div>
              
              <div className={styles.dashboard__eventLabel}>イベント名</div>
              <div className={styles.dashboard__eventValue}>工場見学ツアー</div>
              
              <div className={styles.dashboard__eventLabel}>主催者</div>
              <div className={styles.dashboard__eventValue}>製造部 田中</div>
              
              <div className={styles.dashboard__eventLabel}>開催場所</div>
              <div className={styles.dashboard__eventValue}>第2工場</div>
              
              <div className={styles.dashboard__eventLabel}>イベント概要</div>
              <div className={styles.dashboard__eventValue}>新入社員向けの工場見学ツアーです。製造ラインの基本的な流れを学びます。</div>
            </div>
          </div>
          
          {/* 通知セクション */}
          <section ref={activitySectionRef} className={styles.dashboard__activity}>
            <h2 ref={activityTitleRef} className={styles.dashboard__sectionTitle}>通知</h2>
            <ul className={styles.activityList}> {/* No ref needed for ul itself */}
              <li ref={addToActivityListItemsRef}>ユーザーAがイベントXに応募しました</li>
              <li ref={addToActivityListItemsRef}>イベントYが作成されました</li>
              <li ref={addToActivityListItemsRef}>ユーザーBのレビューが提出されました</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
