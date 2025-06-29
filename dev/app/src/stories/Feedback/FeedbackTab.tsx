import React, { useState, useEffect } from "react";
import { useIonRouter } from "@ionic/react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import type { RootState } from "../../redux/store";

// components
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";

// css
import "./FeedbackTab.css";

// コンポーネントの型定義
export interface FeedbackTabProps {
	// props（パラメータ）の型定義
	primary?: boolean; // プライマリーかどうか
	color?: string; // 色
	backgroundColor?: string; // 背景色
    width?: string; // 幅
    height?: string; // 高さ
    maxHeight?: string; // 最大高さ（スクロール制御用）
    darkMode?: 'auto' | boolean; // ダークモード ('auto': システム設定に従う, true: 強制有効, false: 強制無効)
    user_id?: string; // ユーザーID（オプション）
    aiReview?: string; // AIレビューの内容
	onClick?: () => void; // クリック時のイベントハンドラー
	// 他のプロパティを追加
}

// コンポーネントの定義(props値を受け取る)
export const FeedbackTab = ({
	primary = false,
	color,
	backgroundColor,
    user_id,
    aiReview = "",
    width = "100%", // デフォルトの幅
    height = "100%", // デフォルトの高さ
    maxHeight = "300px", // デフォルトの最大高さ
    darkMode = 'auto', // デフォルトの自動ダークモード設定
	onClick,
	...props
}: FeedbackTabProps) => {
	// router
	const ionRouter = useIonRouter();
	// Redux
	const dispatch = useDispatch(); // 状態を更新するためのdispatch関数を取得
	
	// システムダークモード検知
	const [systemDarkMode, setSystemDarkMode] = useState<boolean>(false);
	
	// システムダークモード検知のuseEffect
	useEffect(() => {
		// メディアクエリでシステムのダークモード設定を検知
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		setSystemDarkMode(mediaQuery.matches);
		
		// システム設定の変更をリアルタイムで検知
		const handleChange = (e: MediaQueryListEvent) => {
			setSystemDarkMode(e.matches);
		};
		
		mediaQuery.addEventListener('change', handleChange);
		
		// クリーンアップ
		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, []);
	
	// 最終的なダークモード判定
	const isDarkMode = darkMode === 'auto' ? systemDarkMode : Boolean(darkMode);
	
	// ダークモード用のテーマ定義
	const theme = {
		light: {
			background: '#ffffff',
			text: '#000000',
			border: '#e0e0e0',
			tabBackground: '#ffffff',
			tabText: '#000000',
			errorBackground: '#ffe6e6',
			errorText: '#d32f2f',
			loadingText: '#666666'
		},
		dark: {
			background: '#1e1e1e',
			text: '#ffffff',
			border: '#424242',
			tabBackground: '#2d2d2d',
			tabText: '#ffffff',
			errorBackground: '#4a1a1a',
			errorText: '#ff6b6b',
			loadingText: '#b0b0b0'
		}
	};
	
	const currentTheme = isDarkMode ? theme.dark : theme.light;
	
	// Redux stateから必要な値を取得
	const host = useSelector((state: RootState) => state.server.host);
	const port = useSelector((state: RootState) => state.server.port);
	const reduxUserId = useSelector((state: RootState) => state.user.userId);
	
	// propsのuser_idを優先し、なければRedux stateのuserIdを使用
	const userId = user_id || reduxUserId;
	
	// ローカル状態管理
	const [aiReviewData, setAiReviewData] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	// AIレビューデータ取得関数
	const fetchAiReview = async () => {
		if (!userId) {
			setError("ユーザーIDが設定されていません");
			return;
		}

		setLoading(true);
		setError("");
		
		try {
			const apiUrl = `${host}:${port}/func/ai-review/${userId}`;
			const response = await axios.get(apiUrl);
			
			if (response.data && response.data.comment) {
				setAiReviewData(response.data.comment);
			} else {
				setError("AIレビューデータの取得に失敗しました");
			}
		} catch (err) {
			console.error("AIレビュー取得エラー:", err);
			setError("APIエラー: " + (err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	// コンポーネントマウント時にAPIを呼び出し
	useEffect(() => {
		fetchAiReview();
	}, [userId]); // userIdが変更された場合も再取得

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		dispatch({ type: 'feedbackTab/changeTab', payload: newValue }); // タブIDを更新
	};

	return (
		<Box sx={{ 
			width: width, 
			height: height,
			maxHeight: maxHeight,
			display: 'flex',
			flexDirection: 'column',
			overflow: 'hidden',
			backgroundColor: currentTheme.background,
			color: currentTheme.text
		}}>
			<TabContext value={useSelector((state: RootState) => state.feedbackTab.TabId.toString())}>
				<Box sx={{ 
					borderBottom: 1, 
					borderColor: currentTheme.border, 
					flexShrink: 0,
					backgroundColor: currentTheme.tabBackground
				}}>
					<TabList 
						onChange={handleChange} 
						aria-label="lab API tabs example"
						variant="scrollable"
						scrollButtons="auto"
						sx={{
							'& .MuiTab-root': {
								color: currentTheme.tabText,
								'&.Mui-selected': {
									color: isDarkMode ? '#90caf9' : '#1976d2'
								}
							},
							'& .MuiTabs-indicator': {
								backgroundColor: isDarkMode ? '#90caf9' : '#1976d2'
							}
						}}
					>
						<Tab label="AIフィードバック" value="1" />

                        {/* 新規に表示するものがあれば以下のような形式でタブを設定する。 */}

						<Tab label="人事の方のフィードバック" value="2" />
						<Tab label="短期的な学習プラン" value="3" />
                        <Tab label="長期的な学習プラン" value="4" />
					</TabList>
				</Box>
				
				{/* スクロール可能なコンテンツエリア */}
				<Box sx={{ 
					flex: 1, 
					overflow: 'hidden',
					backgroundColor: currentTheme.background,
					'& .MuiTabPanel-root': {
						height: '100%',
						overflow: 'auto',
						padding: 0,
						backgroundColor: currentTheme.background,
						color: currentTheme.text
					}
				}}>
					<TabPanel value="1">
						<div style={{ 
							height: '100%',
							overflowY: 'auto',
							padding: '20px', 
							lineHeight: '1.6',
							backgroundColor: currentTheme.background,
							color: currentTheme.text
						}}>
							{loading ? (
								<div style={{ 
									textAlign: 'center', 
									color: currentTheme.loadingText
								}}>
									AIレビューを読み込み中...
								</div>
							) : error ? (
								<div style={{ 
									color: currentTheme.errorText, 
									backgroundColor: currentTheme.errorBackground, 
									borderRadius: '4px',
									padding: '10px'
								}}>
									エラー: {error}
								</div>
							) : (
								<div style={{ 
									whiteSpace: 'pre-wrap',
									color: currentTheme.text
								}}>
									{aiReviewData || aiReview || "AIレビューデータがありません"}
								</div>
							)}
						</div>
					</TabPanel>

					{/* 以下はTabがアクティベートされると表示されるようになる。文字列のみでなく、コンポーネントを設定しても良い。 */}
					<TabPanel value="2">
						<div style={{ 
							height: '100%',
							overflowY: 'auto',
							padding: '20px', 
							lineHeight: '1.6',
							backgroundColor: currentTheme.background,
							color: currentTheme.text
						}}>
							Item Two
						</div>
					</TabPanel>
					<TabPanel value="3">
						<div style={{ 
							height: '100%',
							overflowY: 'auto',
							padding: '20px', 
							lineHeight: '1.6',
							backgroundColor: currentTheme.background,
							color: currentTheme.text
						}}>
							短期的には ~~~ を学習すると良いですよ！
						</div>
					</TabPanel>
					<TabPanel value="4">
						<div style={{ 
							height: '100%',
							overflowY: 'auto',
							padding: '20px', 
							lineHeight: '1.6',
							backgroundColor: currentTheme.background,
							color: currentTheme.text
						}}>
							長期的には どんなことを学びたいか 明確にすると良いです！
						</div>
					</TabPanel>
				</Box>
			</TabContext>
		</Box>
	);
};
