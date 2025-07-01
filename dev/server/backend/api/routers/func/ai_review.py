from fastapi import APIRouter, HTTPException, Query
import os
from datetime import datetime
from typing import List, Dict, Optional

# local imports
from src.classes.db_connector import DBConnector
from src.schemas.api.ai_review import (
    Review,
    ReviewList,
    AIReview
)

# Routerを作成
router = APIRouter()

@router.get("/func/ai-review/{user_id}", response_model=AIReview)
async def ai_review(
    user_id: str,
    custom_prompt: Optional[str] = Query(None, description="カスタムプロンプト（オプション）")
) -> AIReview:
    """
    AIレビューエンドポイント - レビュー用のデータを受け取り、AIによるレビュー結果を返します
    指定されたuser_idのreviewee_idが同じであるレビューを取得し、ReviewListに格納します
    """
    
    try:
        # user_idの基本的な検証
        if not user_id or user_id.strip() == "":
            return AIReview(comment="ユーザーIDが指定されていません。")
        
        # UUIDフォーマットの簡単な検証
        import uuid
        try:
            uuid.UUID(user_id)
        except ValueError:
            return AIReview(comment=f"無効なユーザーID形式です: {user_id}")
        
        # データベース接続の準備
        db_url = os.getenv("DATABASE_URL")
        db_connector = DBConnector(db_url, debug=True)
        
        # reviewee_idが指定されたuser_idと一致するレビューを取得
        # JOINクエリでreviewer情報（company_id）も取得
        where_clause = f"""
            reviews.reviewee_id = '{user_id}'
        """
        
        # DBConnectorのselectメソッドは単一テーブルの選択なので、
        # まずreviewsテーブルから基本データを取得
        reviews_data = db_connector.select("reviews", where_clause)
        
        # レビューデータをReviewスキーマ形式に変換
        review_list = []
        
        for review_record in reviews_data:
            # reviewer_idからcompany情報を取得
            reviewer_id = str(review_record.reviewer_id)
            
            # reviewer_idに対応するcompany情報を取得
            company_id = reviewer_id  # デフォルトはreviewer_id
            
            try:
                # usersテーブルからuser_typeを確認
                user_where = f"users.user_id = '{reviewer_id}'"
                user_data = db_connector.select("users", user_where)
                
                if user_data and len(user_data) > 0:
                    user_record = user_data[0]
                    # ユーザータイプがCOMPANYの場合、companyテーブルから情報を取得
                    if hasattr(user_record, 'user_type') and user_record.user_type:
                        # user_typeは文字列として格納されている場合の処理
                        user_type_str = str(user_record.user_type)
                        if user_type_str == "企業":
                            # このreviewer_idがcompany_idとして有効
                            company_id = reviewer_id
                        else:
                            # 個人ユーザーの場合は、reviewer_idをそのまま使用（または特別な処理）
                            company_id = reviewer_id
                        
            except Exception as e:
                # エラーが発生した場合は、デフォルトのreviewer_idを使用
                print(f"Company情報取得エラー (reviewer_id: {reviewer_id}): {e}")
                company_id = reviewer_id
            
            # Reviewスキーマに合わせてデータを構築
            review = Review(
                review_id=str(review_record.review_id),
                company_id=company_id,
                event_id=str(review_record.event_id) if review_record.event_id else "",
                rating=int(review_record.rating),
                comment=review_record.comment or "",
                created_at=review_record.created_at.date() if review_record.created_at else datetime.now().date(),
                updated_at=review_record.updated_at.date() if review_record.updated_at else None
            )
            review_list.append(review)
        
        # ReviewListを作成
        review_list_obj = ReviewList(
            reviews=review_list,
            total_count=len(review_list)
        )
        
        # AI分析結果を生成（Gemini APIを使用した要約機能のみ）
        if review_list_obj.total_count == 0:
            ai_comment = "このユーザーに対するレビューは見つかりませんでした。レビューが投稿されていないため、評価を行うことができません。"
        else:
            # レビューコメントを収集してGemini APIで要約を生成
            comments = [r.comment for r in review_list_obj.reviews if r.comment and r.comment.strip()]
            
            if comments:
                try:
                    # Gemini APIインポートをここで行う（エラーハンドリングのため）
                    from src.utils.gemini_client import create_review_summary, GeminiAPIError
                    
                    # Gemini APIを使用してレビューを要約（同期呼び出し）
                    summary_result = create_review_summary(comments, custom_prompt)
                    
                    if summary_result.get("success", False):
                        ai_comment = summary_result.get("summary", "")
                    else:
                        # Gemini API呼び出しが失敗した場合
                        error_msg = summary_result.get("error", "不明なエラー")
                        ai_comment = f"AI要約機能でエラーが発生しました。エラー詳細: {error_msg}"
                        
                except (ImportError, GeminiAPIError) as gemini_error:
                    # Gemini API関連のエラーの場合
                    ai_comment = f"AI要約機能が利用できません。エラー詳細: {str(gemini_error)}"
                    
                except Exception as gemini_general_error:
                    # その他のGemini関連エラー
                    ai_comment = f"AI要約中に予期しないエラーが発生しました。エラー詳細: {str(gemini_general_error)}"
            else:
                # コメントがない場合
                ai_comment = "有効なレビューコメントがありません。数値評価のみでテキストコメントが含まれていないため、詳細な分析を行うことができません。"
        
        # AIReviewレスポンスを作成
        res = AIReview(
            comment=ai_comment
        )
        
        return res
        
    except ValueError as ve:
        # UUID形式エラーやデータ変換エラー
        error_message = f"無効なユーザーIDまたはデータ形式エラー: {str(ve)}"
        return AIReview(comment=error_message)
        
    except ConnectionError as ce:
        # データベース接続エラー
        error_message = f"データベース接続エラー: {str(ce)}"
        return AIReview(comment=error_message)
        
    except Exception as e:
        # その他の予期しないエラー
        error_message = f"レビューデータの取得中に予期しないエラーが発生しました: {str(e)}"
        return AIReview(comment=error_message)