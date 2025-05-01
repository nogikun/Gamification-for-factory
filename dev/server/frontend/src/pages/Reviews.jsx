import React, { useState, useRef } from "react";
import styles from "./Reviews.module.scss";
import ReviewInputModal from "./ReviewInputModal";
import { usePageAnimation } from "../hooks/usePageAnimation";

const dummyReviews = [
  { reviewer: "管理者A", target: "山田 太郎", comment: "積極的な姿勢が印象的でした。", status: "承認済み" },
  { reviewer: "管理者B", target: "佐藤 花子", comment: "論理的思考力がありました。", status: "未承認" },
  { reviewer: "あなた", target: "鈴木 一郎", comment: "協調性が高いです。", status: "未承認" },
];

export default function Reviews() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const tableRef = useRef(null);

  usePageAnimation({ 
    containerRef, 
    titleRef, 
    contentRefs: [tableRef] 
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState("");

  const handleOpenModal = (target) => {
    setModalTarget(target);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalTarget("");
  };
  const handleSubmitReview = ({ reviewer, target, comment }) => {
    alert(`【${reviewer}】→「${target}」さんへのレビュー: ${comment}`);
    handleCloseModal();
  };

  return (
    <div ref={containerRef} className={styles.reviews}>
      <h1 ref={titleRef} className={styles.reviews__title}>レビューリスト</h1>
      <table ref={tableRef} className={styles.reviews__table}>
        <thead>
          <tr>
            <th>レビュアー</th>
            <th>対象者</th>
            <th>コメント</th>
            <th>ステータス</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dummyReviews.map((r, i) => (
            <tr key={i}>
              <td>{r.reviewer}</td>
              <td>{r.target}</td>
              <td>{r.comment}</td>
              <td>{r.status}</td>
              <td>
                <button className={styles.inputBtn} onClick={() => handleOpenModal(r.target)}>
                  レビュー入力
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReviewInputModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
        target={modalTarget}
      />
    </div>
  );
}
