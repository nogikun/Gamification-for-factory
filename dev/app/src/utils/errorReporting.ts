/**
 * エラーレポート送信ユーティリティ
 * プロジェクト全体で使用可能な汎用エラーログ送信機能
 */
import axios from 'axios';

// エラーレポート用の型定義
export interface ErrorReportData {
	error_message: string;
	error_type?: string;
	stack_trace?: string;
	user_id?: string;
	api_endpoint?: string;
	request_method?: string;
	response_status?: number;
	browser_info?: string;
	page_url?: string;
	additional_context?: Record<string, unknown>;
}

// エラーレポート送信設定
const ERROR_REPORT_CONFIG = {
	endpoint: 'http://localhost:3000/debug/error-report',
	timeout: 5000, // 5秒でタイムアウト
	retries: 2, // 最大2回リトライ
};

/**
 * エラーレポートをバックエンドに送信する汎用関数
 * @param errorData エラー情報
 * @param options 送信オプション（オプション）
 */
export const sendErrorReport = async (
	errorData: ErrorReportData,
	options?: {
		endpoint?: string;
		timeout?: number;
		retries?: number;
	}
): Promise<void> => {
	const config = { ...ERROR_REPORT_CONFIG, ...options };
	let lastError: Error | null = null;

	for (let attempt = 0; attempt <= config.retries; attempt++) {
		try {
			await axios.post(
				config.endpoint,
				{
					...errorData,
					browser_info: errorData.browser_info || navigator.userAgent,
					page_url: errorData.page_url || window.location.href,
					timestamp: new Date().toISOString(),
				},
				{
					timeout: config.timeout,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			return; // 成功した場合は関数を終了
		} catch (error) {
			lastError = error instanceof Error ? error : new Error('Unknown error');
			
			// 最後の試行でない場合は少し待つ
			if (attempt < config.retries) {
				await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
			}
		}
	}

	// すべてのリトライが失敗した場合はコンソールログのみ
	console.error('Failed to send error report after all retries:', lastError);
};

/**
 * AxiosエラーからErrorReportDataを生成するヘルパー関数
 * @param error Axiosエラー
 * @param context 追加のコンテキスト情報
 * @returns ErrorReportData
 */
export const createErrorReportFromAxiosError = (
	error: unknown,
	context: {
		user_id?: string;
		api_endpoint?: string;
		request_method?: string;
		component?: string;
		function?: string;
	}
): ErrorReportData => {
	let errorMessage = 'Unknown error occurred';
	let errorType = 'UnknownError';
	let responseStatus: number | undefined;
	let stackTrace: string | undefined;

	if (axios.isAxiosError(error)) {
		errorType = 'NetworkError';
		responseStatus = error.response?.status;
		errorMessage = error.message || 'Network request failed';
		stackTrace = error.stack;
	} else if (error instanceof Error) {
		errorType = error.name || 'JavaScriptError';
		errorMessage = error.message || 'JavaScript error occurred';
		stackTrace = error.stack;
	} else if (typeof error === 'string') {
		errorMessage = error;
		errorType = 'StringError';
	}

	return {
		error_message: errorMessage,
		error_type: errorType,
		stack_trace: stackTrace,
		user_id: context.user_id,
		api_endpoint: context.api_endpoint,
		request_method: context.request_method,
		response_status: responseStatus,
		additional_context: {
			component: context.component,
			function: context.function,
			error_details: axios.isAxiosError(error) ? {
				code: error.code,
				response_data: error.response?.data,
				request_url: error.config?.url,
				request_method: error.config?.method,
			} : undefined,
		},
	};
};

/**
 * 一般的なJavaScriptエラーからErrorReportDataを生成するヘルパー関数
 * @param error エラーオブジェクト
 * @param context 追加のコンテキスト情報
 * @returns ErrorReportData
 */
export const createErrorReportFromJSError = (
	error: Error,
	context: {
		user_id?: string;
		component?: string;
		function?: string;
		action?: string;
	}
): ErrorReportData => {
	return {
		error_message: error.message || 'JavaScript error occurred',
		error_type: error.name || 'JavaScriptError',
		stack_trace: error.stack,
		user_id: context.user_id,
		additional_context: {
			component: context.component,
			function: context.function,
			action: context.action,
		},
	};
};

/**
 * React Error Boundary用のエラーレポート生成関数
 * @param error エラーオブジェクト
 * @param errorInfo React Error Boundary の追加情報
 * @param context 追加のコンテキスト情報
 * @returns ErrorReportData
 */
export const createErrorReportFromReactError = (
	error: Error,
	errorInfo: { componentStack: string },
	context: {
		user_id?: string;
		component?: string;
	}
): ErrorReportData => {
	return {
		error_message: error.message || 'React component error occurred',
		error_type: 'ReactError',
		stack_trace: error.stack,
		user_id: context.user_id,
		additional_context: {
			component: context.component,
			react_component_stack: errorInfo.componentStack,
			error_boundary: true,
		},
	};
};

export default {
	sendErrorReport,
	createErrorReportFromAxiosError,
	createErrorReportFromJSError,
	createErrorReportFromReactError,
};

// Copyright (c) 2025 nogi
// All rights reserved.
