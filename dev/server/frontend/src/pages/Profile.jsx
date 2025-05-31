import React, { useState, useRef } from "react";
import styles from "./Profile.module.scss";

const initial = {
  user_id: "d1b2c3e4-5678-1234-9abc-123456789abc",
  user_type: "企業",
  user_name: "株式会社サンプル",
  logo: null,
};

export default function Profile() {
  const [form, setForm] = useState(initial);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, logo: file });
      const reader = new FileReader();
      reader.onload = ev => setLogoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.profile}>
      <h1 className={styles.profile__title}>企業情報編集</h1>
      <form className={styles.profile__form} onSubmit={e => e.preventDefault()}>
        <label>
          ユーザーID（UUID）
          <input name="user_id" value={form.user_id} readOnly />
        </label>
        <label>
          ユーザータイプ
          <select name="user_type" value={form.user_type} onChange={handleChange}>
            <option value="参加者">参加者</option>
            <option value="企業">企業</option>
          </select>
        </label>
        <label>
          企業名
          <input name="user_name" value={form.user_name} onChange={handleChange} maxLength={50} />
        </label>
        <label>
          企業ロゴ画像
          <div className={styles.profile__logoUpload}>
            {logoPreview ? (
              <img src={logoPreview} alt="企業ロゴプレビュー" className={styles.profile__logoImg} />
            ) : (
              <div className={styles.profile__logoPlaceholder}>画像未選択</div>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleLogoChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className={styles.profile__logoBtn}
            >画像を選択</button>
          </div>
        </label>
        <div className={styles.profile__actions}>
          <button type="submit">保存</button>
        </div>
      </form>
    </div>
  );
}
