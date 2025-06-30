"""
Gemini API client utility for review summarization.
Provides customizable prompt templates and integration with Google Gemini API.
"""

import os
import logging
from typing import Optional, List, Dict, Any
from dataclasses import dataclass

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    GENAI_AVAILABLE = False

# Configure logging
logger = logging.getLogger(__name__)

class GeminiAPIError(Exception):
    """Custom exception for Gemini API related errors."""
    
class GeminiConnectionError(GeminiAPIError):
    """Exception for Gemini API connection issues."""

@dataclass
class SummarizationConfig:
    """Configuration for review summarization."""
    temperature: float = 0.7
    max_output_tokens: int = 1000
    model: str = "gemini-1.5-flash"

class PromptTemplate:
    """Template system for customizable prompts."""
    
    DEFAULT_PROMPT = """
製造業の工場のイベントにおけるレビューコメントを分析し、要約を生成します。
以下のレビューコメントを分析し、有用で建設的な要約を日本語で提供してください。
回答の冒頭は必ず厳守して下さい。冒頭の宣言はいりません。要約の内容のみ生成して下さい。すべて口語調で書いてください。

要約には以下の要素を含めてください：
1. 主な強み・長所
2. 改善すべき点・成長の機会
3. 全体的な評価の傾向
4. 今後の成長に向けた提案

レビューコメント：
{comments}

回答の冒頭：
あなたは、


要約は500文字以内で、ポジティブで建設的なトーンを心がけてください。
"""

    CUSTOM_PROMPT_TEMPLATE = """
{custom_prompt}

レビューコメント：
{comments}
"""

    @classmethod
    def get_default_prompt(cls, comments: str) -> str:
        """Get default prompt with comments inserted."""
        return cls.DEFAULT_PROMPT.format(comments=comments)
    
    @classmethod
    def get_custom_prompt(cls, custom_prompt: str, comments: str) -> str:
        """Get custom prompt with comments inserted."""
        return cls.CUSTOM_PROMPT_TEMPLATE.format(
            custom_prompt=custom_prompt,
            comments=comments
        )
    
    @classmethod
    def format_comments(cls, review_comments: List[str]) -> str:
        """Format review comments for prompt insertion."""
        if not review_comments:
            return "レビューコメントがありません。"
        
        formatted_comments = []
        for i, comment in enumerate(review_comments, 1):
            if comment and comment.strip():
                formatted_comments.append(f"{i}. {comment.strip()}")
        
        if not formatted_comments:
            return "有効なレビューコメントがありません。"
        
        return "\n".join(formatted_comments)

class GeminiClient:
    """Client for Google Gemini API integration."""
    
    def __init__(self, api_key: Optional[str] = None, config: Optional[SummarizationConfig] = None):
        """
        Initialize Gemini client.
        
        Args:
            api_key: Google Gemini API key. If None, reads from GEMINI_API_KEY environment variable.
            config: Summarization configuration.
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.config = config or SummarizationConfig()
        self._model = None
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables or provided as parameter")
        
        if not GENAI_AVAILABLE or genai is None:
            raise ImportError("google-generativeai package not installed. Please install it with: pip install google-generativeai")
        
        try:
            # Configure Gemini API
            genai.configure(api_key=self.api_key)
            logger.info("Successfully configured Gemini API")
        except Exception as e:
            logger.error("Failed to configure Gemini API: %s", str(e))
            raise GeminiConnectionError(f"Failed to configure Gemini API: {str(e)}") from e
        
    def _get_model(self):
        """Get or create Gemini model instance."""
        if self._model is None:
            generation_config = {
                "temperature": self.config.temperature,
                "max_output_tokens": self.config.max_output_tokens,
            }
            
            self._model = genai.GenerativeModel(
                model_name=self.config.model,
                generation_config=generation_config
            )
        
        return self._model
    
    async def summarize_reviews(
        self, 
        review_comments: List[str], 
        custom_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Summarize review comments using Gemini API.
        
        Args:
            review_comments: List of review comments to summarize.
            custom_prompt: Optional custom prompt. If None, uses default prompt.
        
        Returns:
            Dictionary containing summary and metadata.
        
        Raises:
            ValueError: If no valid comments provided.
            Exception: If API call fails.
        """
        try:
            logger.info("Starting summarize_reviews with %d comments", len(review_comments))
            
            # Format comments
            formatted_comments = PromptTemplate.format_comments(review_comments)
            logger.info("Formatted comments: %s", formatted_comments[:200] + "..." if len(formatted_comments) > 200 else formatted_comments)
            
            if formatted_comments == "レビューコメントがありません。" or formatted_comments == "有効なレビューコメントがありません。":
                raise ValueError("No valid review comments provided for summarization")
            
            # Generate prompt
            if custom_prompt:
                prompt = PromptTemplate.get_custom_prompt(custom_prompt, formatted_comments)
                logger.info("Using custom prompt")
            else:
                prompt = PromptTemplate.get_default_prompt(formatted_comments)
                logger.info("Using default prompt")
            
            logger.info("Generated prompt length: %d characters", len(prompt))
            logger.info("Calling Gemini API...")
            
            # Call Gemini API
            model = self._get_model()
            response = model.generate_content(prompt)
            
            logger.info("Received response from Gemini API")
            
            if not response.text:
                raise GeminiAPIError("Empty response from Gemini API")
            
            result = {
                "summary": response.text.strip(),
                "prompt_type": "custom" if custom_prompt else "default",
                "comments_count": len([c for c in review_comments if c and c.strip()]),
                "model_used": self.config.model,
                "success": True
            }
            
            logger.info("Successfully generated review summary")
            return result
            
        except ValueError as e:
            logger.error("Validation error in summarize_reviews: %s", str(e))
            raise
        except (GeminiAPIError, GeminiConnectionError) as e:
            logger.error("Gemini API error: %s", str(e))
            raise GeminiAPIError(f"Failed to generate summary: {str(e)}") from e
        except Exception as e:
            logger.error("Unexpected error in Gemini API call: %s", str(e))
            raise GeminiAPIError(f"Failed to generate summary: {str(e)}") from e
    
    def test_connection(self) -> Dict[str, Any]:
        """
        Test connection to Gemini API.
        
        Returns:
            Dictionary with connection test results.
        """
        try:
            model = self._get_model()
            test_prompt = "こんにちは。短く応答してください。"
            response = model.generate_content(test_prompt)
            
            return {
                "success": True,
                "model": self.config.model,
                "response_preview": response.text[:100] if response.text else "No response"
            }
        except (GeminiAPIError, GeminiConnectionError) as e:
            logger.error("Connection test failed (Gemini API error): %s", str(e))
            return {
                "success": False,
                "error": str(e)
            }
        except (ImportError, ValueError, AttributeError) as e:
            logger.error("Connection test failed (configuration error): %s", str(e))
            return {
                "success": False,
                "error": str(e)
            }

# Convenience function for easy import and usage
def create_review_summary(
    review_comments: List[str], 
    custom_prompt: Optional[str] = None,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Convenience function to create review summary.
    Note: This is a synchronous wrapper around the async method.
    
    Args:
        review_comments: List of review comments to summarize.
        custom_prompt: Optional custom prompt.
        api_key: Optional API key. If None, reads from environment.
    
    Returns:
        Dictionary containing summary and metadata.
    """
    try:
        logger.info("Creating review summary for %d comments", len(review_comments))
        
        client = GeminiClient(api_key=api_key)
        
        # Use synchronous version of the API call
        formatted_comments = PromptTemplate.format_comments(review_comments)
        
        if formatted_comments in ["レビューコメントがありません。", "有効なレビューコメントがありません。"]:
            raise ValueError("No valid review comments provided for summarization")
        
        # Generate prompt
        if custom_prompt:
            prompt = PromptTemplate.get_custom_prompt(custom_prompt, formatted_comments)
        else:
            prompt = PromptTemplate.get_default_prompt(formatted_comments)
        
        logger.info("Calling Gemini API synchronously...")
        
        # Call Gemini API synchronously
        try:
            model = client._get_model()  # pylint: disable=protected-access
            response = model.generate_content(prompt)
        except (GeminiAPIError, GeminiConnectionError) as api_error:
            logger.error("Gemini API error: %s", str(api_error))
            raise GeminiAPIError(f"API call failed: {str(api_error)}") from api_error
        
        if not response.text:
            raise GeminiAPIError("Empty response from Gemini API")
        
        result = {
            "summary": response.text.strip(),
            "prompt_type": "custom" if custom_prompt else "default",
            "comments_count": len([c for c in review_comments if c and c.strip()]),
            "model_used": client.config.model,
            "success": True
        }
        
        logger.info("Successfully generated review summary")
        return result
        
    except ValueError as ve:
        logger.error("Validation error in create_review_summary: %s", str(ve))
        return {
            "success": False,
            "error": str(ve),
            "summary": "",
            "prompt_type": "custom" if custom_prompt else "default",
            "comments_count": len([c for c in review_comments if c and c.strip()]),
            "model_used": "unknown"
        }
    except (GeminiAPIError, GeminiConnectionError) as ge:
        logger.error("Gemini API error in create_review_summary: %s", str(ge))
        return {
            "success": False,
            "error": str(ge),
            "summary": "",
            "prompt_type": "custom" if custom_prompt else "default",
            "comments_count": len([c for c in review_comments if c and c.strip()]),
            "model_used": "unknown"
        }
    except (ImportError, AttributeError, TypeError) as ie:
        logger.error("Configuration error in create_review_summary: %s", str(ie))
        return {
            "success": False,
            "error": str(ie),
            "summary": "",
            "prompt_type": "custom" if custom_prompt else "default",
            "comments_count": len([c for c in review_comments if c and c.strip()]),
            "model_used": "unknown"
        }
