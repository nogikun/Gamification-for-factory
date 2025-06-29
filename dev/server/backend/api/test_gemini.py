#!/usr/bin/env python3
"""
Quick test script for Gemini API functionality
"""

import sys
import os
sys.path.append('.')

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

from src.utils.gemini_client import GeminiClient, create_review_summary

def test_gemini_connection():
    """Test basic Gemini API connection."""
    try:
        print("Testing Gemini API connection...")
        
        # Read API key directly from .env file
        api_key = None
        with open('.env', 'r') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    api_key = line.split('=', 1)[1].strip().strip('"')
                    break
        
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")
        
        print(f"Found API key: {api_key[:10]}...")
        
        # Test 1: Connection test
        client = GeminiClient(api_key=api_key)
        connection_result = client.test_connection()
        print(f"Connection test result: {connection_result}")
        
        # Test 2: Simple summary
        test_comments = [
            "とても良いチームワークでした。",
            "時間管理に改善の余地があります。",
            "技術的なスキルが高く、信頼できます。"
        ]
        
        print("\nTesting review summary...")
        summary_result = create_review_summary(test_comments, api_key=api_key)
        print(f"Summary result: {summary_result}")
        
        return True
        
    except ValueError as ve:
        print(f"Configuration error: {ve}")
        return False
    except (ImportError, AttributeError) as ie:
        print(f"Import/configuration error: {ie}")
        return False

if __name__ == "__main__":
    test_gemini_connection()
