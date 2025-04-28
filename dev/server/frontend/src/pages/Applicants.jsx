import React, { useState } from "react";
import ApplicantDetailDrawer from "./ApplicantDetailDrawer";
import styles from "./Applicants.module.scss";

const mockApplicants = [
  { id: 1, last_name: "山田", first_name: "太郎", university: "東京大学", mail_address: "taro@example.com", license: "英検2級", status: "書類選考中", updated_at: "2025-04-27T18:22:00" },
  { id: 2, last_name: "佐藤", first_name: "花子", university: "京都大学", mail_address: "hanako@example.com", license: "TOEIC 800", status: "面接待ち", updated_at: "2025-04-25T13:10:00" },
  { id: 3, last_name: "鈴木", first_name: "一郎", university: "大阪大学", mail_address: "ichiro@example.com", license: "簿記3級", status: "合格", updated_at: "2025-04-20T09:00:00" },
];

export default function Applicants() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 詳細ボタンでDrawerを開く
  const handleDetail = (applicantId) => {
    setSelectedId(applicantId);
    setDrawerOpen(true);
  };

  // Drawer閉じる
  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedId(null);
  };

  // 承認/拒否ボタン（ダミーAPI）
  const handleApprove = (id) => {
    alert(`承認: ${id}`);
    handleClose();
  };
  const handleReject = (id) => {
    alert(`拒否: ${id}`);
    handleClose();
  };

  const applicantList = mockApplicants;
  const selectedApplicant = applicantList.find(a => a.id === Number(selectedId));

  return (
    <div className={styles.applicantsPage}>
      <div className={styles.tableWrapper}>
        <table className={styles.applicantsTable}>
          <thead className={styles.tableHead}>
            <tr>
              <th>氏名</th>
              <th>大学</th>
              <th>メールアドレス</th>
              <th>資格・スキル</th>
              <th>選考状況</th>
              <th>最終更新</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {applicantList.map(applicant => (
              <tr key={applicant.id}>
                <td>{applicant.last_name} {applicant.first_name}</td>
                <td>{applicant.university}</td>
                <td style={{maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={applicant.mail_address}>{applicant.mail_address}</td>
                <td>{applicant.license}</td>
                <td>{applicant.status}</td>
                <td>{applicant.updated_at.slice(0,10).replace(/-/g,'/')}</td>
                <td>
                  <button type="button" className={styles.detailBtn} onClick={() => handleDetail(applicant.id)}>
                    詳細
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ApplicantDetailDrawer
        applicant={selectedApplicant}
        open={drawerOpen}
        onClose={handleClose}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
