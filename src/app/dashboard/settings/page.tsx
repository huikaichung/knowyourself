'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, BirthInfo } from '@/components/AuthContext';
import Link from 'next/link';
import { CitySelector, City } from '@/components/CitySelector';
import styles from './settings.module.css';

export default function SettingsPage() {
  const { user, birthInfo, loading: authLoading, updateBirthInfo } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<BirthInfo>({
    birth_date: '',
    birth_time: '',
    birth_place: '',
    latitude: undefined,
    longitude: undefined,
    timezone: '',
    gender: '',
  });
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Load existing birth info
  useEffect(() => {
    if (birthInfo) {
      setFormData({
        birth_date: birthInfo.birth_date || '',
        birth_time: birthInfo.birth_time || '',
        birth_place: birthInfo.birth_place || '',
        latitude: birthInfo.latitude,
        longitude: birthInfo.longitude,
        timezone: birthInfo.timezone || '',
        gender: birthInfo.gender || '',
      });
    }
  }, [birthInfo]);

  const handleCityChange = (city: City | null) => {
    setSelectedCity(city);
    if (city) {
      setFormData(prev => ({
        ...prev,
        birth_place: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        birth_place: '',
        latitude: undefined,
        longitude: undefined,
        timezone: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.birth_date) {
      setMessage({ type: 'error', text: '請填寫出生日期' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const success = await updateBirthInfo(formData);
      if (success) {
        setMessage({ type: 'success', text: '儲存成功！' });
      } else {
        setMessage({ type: 'error', text: '儲存失敗，請稍後再試' });
      }
    } catch {
      setMessage({ type: 'error', text: '發生錯誤' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return <div className={styles.loading}>載入中...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>
          ← 返回
        </Link>
        <h1>個人資料設定</h1>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 出生日期 */}
        <div className={styles.field}>
          <label htmlFor="birth_date">出生日期 *</label>
          <input
            type="date"
            id="birth_date"
            value={formData.birth_date}
            onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
            required
          />
        </div>

        {/* 出生時間 */}
        <div className={styles.field}>
          <label htmlFor="birth_time">出生時間</label>
          <input
            type="time"
            id="birth_time"
            value={formData.birth_time}
            onChange={(e) => setFormData(prev => ({ ...prev, birth_time: e.target.value }))}
          />
          <p className={styles.hint}>精確時間可提供上升星座、宮位等資訊</p>
        </div>

        {/* 出生地點 */}
        <div className={styles.field}>
          <label>出生地點</label>
          <CitySelector
            value={selectedCity}
            onChange={handleCityChange}
          />
          {formData.latitude && formData.longitude && (
            <p className={styles.hint}>
              座標: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              {formData.timezone && ` · ${formData.timezone}`}
            </p>
          )}
        </div>

        {/* 性別 */}
        <div className={styles.field}>
          <label>性別</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              />
              男
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              />
              女
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value=""
                checked={!formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              />
              不提供
            </label>
          </div>
          <p className={styles.hint}>紫微斗數需要性別資訊</p>
        </div>

        {/* 訊息 */}
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* 送出按鈕 */}
        <button type="submit" disabled={saving} className={styles.submitBtn}>
          {saving ? '儲存中...' : '儲存'}
        </button>
      </form>
    </div>
  );
}
