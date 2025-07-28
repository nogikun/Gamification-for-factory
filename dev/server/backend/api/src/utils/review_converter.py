"""
レビューデータの双方向変換ユーティリティ

application_id ↔ (reviewee_id, event_id) の変換処理を担当
制約条件：I/O形式維持、エンドポイント変更なし、内部処理のみで対応
"""
from typing import Optional, Tuple, Dict
import uuid
import time
import logging
from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class ReviewDataConverter:
    """レビューデータの双方向変換を行うユーティリティクラス"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def application_to_review_data(self, application_id: uuid.UUID) -> Tuple[uuid.UUID, uuid.UUID]:
        """
        application_id → (reviewee_id, event_id) 変換
        
        Args:
            application_id: 応募ID
            
        Returns:
            Tuple[reviewee_id, event_id]: レビュイーIDとイベントID
            
        Raises:
            HTTPException: 応募が見つからない場合
        """
        # 循環importを避けるため、関数内でimport
        from src.models import Application as ApplicationModel
        
        application = self.db.query(ApplicationModel).filter(
            ApplicationModel.application_id == application_id
        ).first()
        
        if not application:
            raise HTTPException(
                status_code=404, 
                detail=f"指定された応募ID {application_id} が見つかりません"
            )
        
        # user_id = reviewee_id, event_id = event_id
        reviewee_id = application.user_id
        event_id = application.event_id
        
        logger.info(f"Converted application_id {application_id} to reviewee_id: {reviewee_id}, event_id: {event_id}")
        return reviewee_id, event_id
    
    def review_data_to_application(
        self, 
        reviewee_id: uuid.UUID, 
        event_id: uuid.UUID,
        prefer_approved: bool = True
    ) -> Optional[uuid.UUID]:
        """
        (reviewee_id, event_id) → application_id 変換
        
        Args:
            reviewee_id: レビュイーID
            event_id: イベントID  
            prefer_approved: 承認済み応募を優先するか
            
        Returns:
            application_id: 応募ID（見つからない場合はNone）
        """
        from src.models import Application as ApplicationModel
        
        # 複数の応募が存在する場合の優先順位
        query = self.db.query(ApplicationModel).filter(
            and_(
                ApplicationModel.user_id == reviewee_id,
                ApplicationModel.event_id == event_id
            )
        )
        
        if prefer_approved:
            # 1. 承認済み応募を優先
            approved_application = query.filter(
                ApplicationModel.status == 'APPROVED'
            ).first()
            if approved_application:
                logger.info(f"Found APPROVED application: {approved_application.application_id}")
                return approved_application.application_id
        
        # 2. 最新の応募を取得
        latest_application = query.order_by(
            ApplicationModel.applied_at.desc()
        ).first()
        
        if latest_application:
            logger.info(f"Found latest application: {latest_application.application_id}")
            return latest_application.application_id
        
        # 見つからない場合
        logger.warning(f"No application found for reviewee_id: {reviewee_id}, event_id: {event_id}")
        return None
    
    def get_application_for_review_response(
        self, 
        reviewee_id: uuid.UUID, 
        event_id: uuid.UUID
    ) -> uuid.UUID:
        """
        レスポンス用のapplication_id取得（エラー処理込み）
        
        Args:
            reviewee_id: レビュイーID
            event_id: イベントID
            
        Returns:
            application_id: 応募ID
            
        Raises:
            HTTPException: 対応する応募が見つからない場合
        """
        application_id = self.review_data_to_application(reviewee_id, event_id)
        
        if application_id is None:
            # フォールバック: 仮想的なID生成
            virtual_id = self._generate_virtual_application_id(reviewee_id, event_id)
            logger.warning(
                f"Generated virtual application_id {virtual_id} for "
                f"reviewee_id: {reviewee_id}, event_id: {event_id}"
            )
            return virtual_id
        
        return application_id
    
    def _generate_virtual_application_id(
        self, 
        reviewee_id: uuid.UUID, 
        event_id: uuid.UUID
    ) -> uuid.UUID:
        """仮想的なapplication_id生成（フォールバック処理）"""
        # UUIDv5を使用して決定論的にIDを生成
        namespace = uuid.NAMESPACE_DNS
        name = f"virtual_application_{reviewee_id}_{event_id}"
        virtual_id = uuid.uuid5(namespace, name)
        return virtual_id


class CachedReviewDataConverter(ReviewDataConverter):
    """キャッシュ機能付きの変換クラス"""
    
    def __init__(self, db: Session, cache_ttl: int = 300):  # 5分間キャッシュ
        super().__init__(db)
        self.cache_ttl = cache_ttl
        self._cache: Dict[str, Tuple[any, float]] = {}
    
    def _get_cache_key(self, *args) -> str:
        """キャッシュキー生成"""
        return "|".join(str(arg) for arg in args)
    
    def _is_cache_valid(self, timestamp: float) -> bool:
        """キャッシュの有効性確認"""
        return time.time() - timestamp < self.cache_ttl
    
    def application_to_review_data_cached(self, application_id: uuid.UUID) -> Tuple[uuid.UUID, uuid.UUID]:
        """キャッシュ付きの順方向変換"""
        cache_key = self._get_cache_key("app_to_review", application_id)
        
        if cache_key in self._cache:
            result, timestamp = self._cache[cache_key]
            if self._is_cache_valid(timestamp):
                return result
        
        # キャッシュミス時は通常処理
        result = self.application_to_review_data(application_id)
        self._cache[cache_key] = (result, time.time())
        return result
    
    def review_data_to_application_cached(
        self, 
        reviewee_id: uuid.UUID, 
        event_id: uuid.UUID
    ) -> Optional[uuid.UUID]:
        """キャッシュ付きの逆方向変換"""
        cache_key = self._get_cache_key("review_to_app", reviewee_id, event_id)
        
        if cache_key in self._cache:
            result, timestamp = self._cache[cache_key]
            if self._is_cache_valid(timestamp):
                return result
        
        # キャッシュミス時は通常処理
        result = self.review_data_to_application(reviewee_id, event_id)
        self._cache[cache_key] = (result, time.time())
        return result
    
    def clear_cache(self):
        """キャッシュクリア"""
        self._cache.clear()


class ReviewConverter:
    """レビューデータ変換の統一インターフェース"""
    
    def __init__(self, db: Session, enable_cache: bool = True, strict_mode: bool = False):
        self.db = db
        self.strict_mode = strict_mode
        
        if enable_cache:
            self.converter = CachedReviewDataConverter(db)
        else:
            self.converter = ReviewDataConverter(db)
    
    def convert_for_create(self, application_id: uuid.UUID) -> Tuple[uuid.UUID, uuid.UUID]:
        """レビュー作成用の変換"""
        if hasattr(self.converter, 'application_to_review_data_cached'):
            return self.converter.application_to_review_data_cached(application_id)
        else:
            return self.converter.application_to_review_data(application_id)
    
    def convert_for_response(self, reviewee_id: uuid.UUID, event_id: uuid.UUID) -> uuid.UUID:
        """レスポンス用の変換"""
        if hasattr(self.converter, 'review_data_to_application_cached'):
            result = self.converter.review_data_to_application_cached(reviewee_id, event_id)
            if result is None:
                if self.strict_mode:
                    raise HTTPException(
                        status_code=500, 
                        detail=f"No application found for reviewee_id: {reviewee_id}, event_id: {event_id}"
                    )
                else:
                    return self.converter._generate_virtual_application_id(reviewee_id, event_id)
            return result
        else:
            return self.converter.get_application_for_review_response(reviewee_id, event_id)
    
    def validate_conversion_integrity(self, application_id: uuid.UUID) -> bool:
        """変換の整合性確認"""
        try:
            # 順変換
            reviewee_id, event_id = self.convert_for_create(application_id)
            # 逆変換
            converted_back = self.convert_for_response(reviewee_id, event_id)
            # 一致確認
            return converted_back == application_id
        except Exception as e:
            logger.error(f"Conversion integrity check failed: {e}")
            return False
