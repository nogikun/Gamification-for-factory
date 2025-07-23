import { useIonToast } from '@ionic/react';
import { useState, useCallback } from 'react';
import { reviewNotificationApi, ReviewNotification } from '../lib/reviewNotificationApi';

/**
 * レビュー通知管理用のカスタムフック
 * IonToastを使用して通知を表示し、API呼び出しを管理する
 */
export const useReviewNotification = () => {
  const [present] = useIonToast();
  const [notifications, setNotifications] = useState<ReviewNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 成功通知を表示する
   * @param message 表示メッセージ
   */
  const showSuccessNotification = useCallback((message: string) => {
    present({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'success',
      buttons: [{ text: '✓', handler: () => {} }]
    });
  }, [present]);

  /**
   * エラー通知を表示する
   * @param message エラーメッセージ
   */
  const showErrorNotification = useCallback((message: string) => {
    present({
      message: `エラー: ${message}`,
      duration: 5000,
      position: 'bottom',
      color: 'danger',
      buttons: [{ text: '✗', handler: () => {} }]
    });
  }, [present]);

  /**
   * レビュー通知を表示する
   * @param notification 通知データ
   */
  const showReviewNotification = useCallback((notification: ReviewNotification) => {
    const message = `新しいレビューが届きました！
📋 ${notification.event_title || 'イベント'}
👤 ${notification.applicant_name || '申請者'}より`;

    present({
      message,
      duration: 6000,
      position: 'top',
      color: 'primary',
      buttons: [
        { 
          text: '確認', 
          handler: () => {
            // ここで詳細画面への遷移などを実装可能
            console.log('Review notification clicked:', notification);
          }
        },
        { text: '閉じる', handler: () => {} }
      ]
    });
  }, [present]);

  /**
   * レビュー通知を取得してトーストで表示する
   * @param userId オプション：特定ユーザーの通知のみ取得
   * @param showToast 通知をトーストで表示するかどうか（デフォルト: true）
   */
  const fetchAndShowNotifications = useCallback(async (
    userId?: string, 
    showToast: boolean = true
  ) => {
    setLoading(true);
    setError(null);

    try {
      console.log('DEBUG: Fetching notifications for userId:', userId);
      const fetchedNotifications = await reviewNotificationApi.getReviewNotifications(userId);
      console.log('DEBUG: Fetched notifications:', fetchedNotifications);
      setNotifications(fetchedNotifications);

      if (showToast && fetchedNotifications.length > 0) {
        // 最新の通知を表示
        fetchedNotifications.forEach((notification, index) => {
          // 複数の通知がある場合は少し間隔をあけて表示
          setTimeout(() => {
            showReviewNotification(notification);
          }, index * 1000);
        });

        showSuccessNotification(`${fetchedNotifications.length}件の新しいレビュー通知があります`);
      } else if (showToast && fetchedNotifications.length === 0) {
        showSuccessNotification('新しい通知はありません');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '通知の取得に失敗しました';
      setError(errorMessage);
      if (showToast) {
        showErrorNotification(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [showReviewNotification, showSuccessNotification, showErrorNotification]);

  /**
   * 通知数のみを取得する（トーストなし）
   * @param userId ユーザーID
   * @returns 通知数
   */
  const getNotificationCount = useCallback(async (userId: string): Promise<number> => {
    try {
      return await reviewNotificationApi.getNotificationCount(userId);
    } catch (error) {
      console.error('Failed to get notification count:', error);
      return 0;
    }
  }, []);

  return {
    // データ
    notifications,
    loading,
    error,
    
    // アクション
    fetchAndShowNotifications,
    getNotificationCount,
    showSuccessNotification,
    showErrorNotification,
    showReviewNotification
  };
};

export default useReviewNotification;