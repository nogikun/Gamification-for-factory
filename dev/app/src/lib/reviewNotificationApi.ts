import apiClient from './apiClient';

// Review Notification型定義
export interface ReviewNotification {
  review_request_id: string;
  application_id: string;
  reviewee_id: string;
  reviewer_id: string;
  requested_at: string;
  request_message?: string;
  status: string;
  event_title?: string;
  applicant_name?: string;
}

// レビュー通知API関数
export const reviewNotificationApi = {
  /**
   * レビュー通知を取得する
   * @param userId オプション：特定ユーザーの通知のみ取得
   * @param skip ページング：スキップ数
   * @param limit ページング：取得件数
   * @returns レビュー通知リスト
   */
  getReviewNotifications: async (
    userId?: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<ReviewNotification[]> => {
    try {
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
      });
      
      if (userId) {
        params.append('user_id', userId);
      }
      
      const url = `/api/review-notification?${params.toString()}`;
      console.log('DEBUG: API URL:', url);
      
      const response = await apiClient.get(url);
      console.log('DEBUG: API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch review notifications:', error);
      throw error;
    }
  },

  /**
   * 特定ユーザーのレビュー通知数を取得する
   * @param userId ユーザーID
   * @returns 通知数
   */
  getNotificationCount: async (userId: string): Promise<number> => {
    try {
      const notifications = await reviewNotificationApi.getReviewNotifications(userId);
      return notifications.length;
    } catch (error) {
      console.error('Failed to get notification count:', error);
      return 0;
    }
  }
};

export default reviewNotificationApi;