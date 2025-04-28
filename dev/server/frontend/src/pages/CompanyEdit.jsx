import React, { useState } from "react";
import styles from "./CompanyEdit.module.scss";

const initial = {
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
  const [form, setForm] = useState(initial);
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div className={styles.companyEdit}>
      <h1 className={styles.companyEdit__title}>企業情報編集</h1>
      <form className={styles.companyEdit__form} onSubmit={e => e.preventDefault()}>
        <label>
          ユーザーID（UUID）
          <input name="user_id" value={form.user_id} readOnly />
        </label>
        <label>
          企業名
          <input name="company_name" value={form.company_name} onChange={handleChange} maxLength={50} />
        </label>
        <label>
          メールアドレス
          <input name="mail_address" value={form.mail_address} onChange={handleChange} />
        </label>
        <label>
          電話番号
          <input name="phone_number" value={form.phone_number} onChange={handleChange} maxLength={50} />
        </label>
        <label>
          住所
          <input name="address" value={form.address} onChange={handleChange} />
        </label>
        <label>
          資本金（円）
          <input name="capital" type="number" value={form.capital} onChange={handleChange} />
        </label>
        <label>
          従業員数
          <input name="employees" type="number" value={form.employees} onChange={handleChange} />
        </label>
        <label>
          設立日
          <input name="establishment_date" type="date" value={form.establishment_date} onChange={handleChange} />
        </label>
        <label>
          会社概要
          <textarea name="overview" value={form.overview} onChange={handleChange} />
        </label>
        <label>
          更新日時
          <input name="updated_at" value={form.updated_at} readOnly />
        </label>
        <div className={styles.companyEdit__actions}>
          <button type="submit">保存</button>
        </div>
      </form>
    </div>
  );
}
