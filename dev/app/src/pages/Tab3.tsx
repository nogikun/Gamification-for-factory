import * as React from "react";
import axios from "axios";
import { useSelector } from "react-redux";

// Charts コンポーネントをインポート
import InternParticipantsHorizontalBarChart from "../stories/Charts/InternParticipantsHorizontalBarChart";
import GameLog from "../stories/Charts/GameLog";
import CompanyEvaluations from "../stories/Charts/CompanyEvaluations";
import { Gauge } from "@mui/x-charts/Gauge";
import { gameProgressData, dataset, gameLogData as dummyGameLogData, companyEvaluations as dummyCompanyEvaluations } from "@/dummy_data/chartData";

// エラーレポートユーティリティのインポート
import { sendErrorReport, createErrorReportFromAxiosError } from "../utils/errorReporting";

// 型定義
interface ParticipationData {
	month: string;
	internParticipants: number;
	[key: string]: string | number; // インデックスシグネチャを追加
}
import {
	Typography,
	Paper,
	Box,
	useMediaQuery,
	createTheme,
	ThemeProvider,
} from "@mui/material";

// アイコンのインポート
import { Refresh } from "@mui/icons-material";

import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import "./Tab3.css";

// components
import { MenuTile } from '../stories/Menu/MenuTile';
import { FeedbackTab } from '../stories/Feedback/FeedbackTab';

// テーマカスタマイゼーション
const createCustomTheme = (mode: 'light' | 'dark') => {
	const theme = createTheme({
		palette: {
			mode,
			primary: {
				main: '#6100ff',
			},
			secondary: {
				main: '#ff6100',
			},
			background: {
				default: mode === 'light' ? '#f5f5f5' : '#121212',
				paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
			},
		},
		breakpoints: {
			values: {
				xs: 0,
				sm: 600,
				md: 900,
				lg: 1200,
				xl: 1536,
			},
		},
		typography: {
			h4: {
				fontSize: '2.125rem',
				'@media (max-width:900px)': {
					fontSize: '1.75rem',
				},
				'@media (max-width:600px)': {
					fontSize: '1.5rem',
				},
			},
		},
		components: {
			MuiPaper: {
				styleOverrides: {
					root: {
						borderRadius: 12,
						transition: 'all 0.3s ease-in-out',
						'&:hover': {
							transform: 'translateY(-2px)',
							boxShadow: mode === 'light' 
								? '0 8px 25px rgba(0,0,0,0.15)' 
								: '0 8px 25px rgba(255,255,255,0.1)',
						},
					},
				},
			},
		},
	});
	return theme;
};

const Tab3: React.FC = () => {
	// システムのダークモード設定を検出
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const theme = React.useMemo(() => createCustomTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	
	// Redux storeからサーバー設定を取得
	const { host, port } = useSelector((state: any) => state.server);
	
	// ベースURLを構築
	const baseUrl = React.useMemo(() => {
		return port ? `${host}:${port}` : host;
	}, [host, port]);
	
	// 参加データのステート管理
	const [participationData, setParticipationData] = React.useState<ParticipationData[]>(dataset);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	
	// ゲーム進捗のステート管理
	const [gameProgress, setGameProgress] = React.useState(gameProgressData.value);
	const [gameProgressLoading, setGameProgressLoading] = React.useState(false);

	// 企業評価のステート管理
	const [companyEvaluations, setCompanyEvaluations] = React.useState(dummyCompanyEvaluations);
	const [evaluationsLoading, setEvaluationsLoading] = React.useState(false);

	// ゲームログのステート管理
	const [gameLogData, setGameLogData] = React.useState(dummyGameLogData);
	const [gameLogLoading, setGameLogLoading] = React.useState(false);
	
	// 再取得用のリフレッシュキー
	const [refreshKey, setRefreshKey] = React.useState(0);
	
	// 固定のユーザーID
	const userId = "11111111-1111-1111-1111-111111111111";
	
	// APIからデータを取得する関数
	const fetchParticipationData = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);
		
		const apiEndpoint = `${baseUrl}/charts/participation_internship/${userId}`;
		
		try {
			const response = await axios.get(apiEndpoint);
			if (response.data?.internships) {
				setParticipationData(response.data.internships);
			}
		} catch (err) {
			console.error('Failed to fetch participation data:', err);
			
			// エラーレポートを送信
			const errorReport = createErrorReportFromAxiosError(err, {
				user_id: userId,
				api_endpoint: apiEndpoint,
				request_method: 'GET',
				component: 'Tab3',
				function: 'fetchParticipationData'
			});
			
			await sendErrorReport(errorReport);
			
			setError('データの取得に失敗しました');
			// エラー時はダミーデータを使用
			setParticipationData(dataset);
		} finally {
			setIsLoading(false);
		}
	}, [baseUrl, userId]);
	
	// ゲーム進捗を取得する関数
	const fetchGameProgress = React.useCallback(async () => {
		setGameProgressLoading(true);
		
		try {
			const response = await axios.get(`${baseUrl}/charts/game_progress/${userId}`);
			if (response.data?.value !== undefined) {
				setGameProgress(response.data.value);
			}
		} catch (err) {
			console.error('Failed to fetch game progress:', err);
			// エラー時はデフォルト値を使用
			setGameProgress(gameProgressData.value);
		} finally {
			setGameProgressLoading(false);
		}
	}, [baseUrl]);

	// 企業評価を取得する関数
	const fetchCompanyEvaluations = React.useCallback(async () => {
		setEvaluationsLoading(true);
		try {
			const response = await axios.get(`${baseUrl}/charts/company_evaluations/${userId}`);
			if (response.data?.evaluations) {
				setCompanyEvaluations(response.data.evaluations);
			}
		} catch (err) {
			console.error('Failed to fetch company evaluations:', err);
			setCompanyEvaluations(dummyCompanyEvaluations); // エラー時はダミーデータ
		} finally {
			setEvaluationsLoading(false);
		}
	}, [baseUrl, userId]);

	// ゲームログを取得する関数
	const fetchGameLogData = React.useCallback(async () => {
		setGameLogLoading(true);
		try {
			const response = await axios.get(`${baseUrl}/charts/game_log/${userId}`);
			if (response.data?.logs) {
				setGameLogData(response.data.logs);
			}
		} catch (err) {
			console.error('Failed to fetch game log data:', err);
			setGameLogData(dummyGameLogData); // エラー時はダミーデータ
		} finally {
			setGameLogLoading(false);
		}
	}, [baseUrl, userId]);
	
	// コンポーネントマウント時にデータを取得
	React.useEffect(() => {
		fetchParticipationData();
		fetchGameProgress();
		fetchCompanyEvaluations();
		fetchGameLogData();
	}, [fetchParticipationData, fetchGameProgress, fetchCompanyEvaluations, fetchGameLogData]);
	
	// すべてのデータを再取得する関数
	const refreshAllData = React.useCallback(() => {
		// リフレッシュキーを更新して子コンポーネントを再マウント
		setRefreshKey(prevKey => prevKey + 1);
		
		// 自身が管理しているデータを再取得
		fetchParticipationData();
		fetchGameProgress();
		fetchCompanyEvaluations();
		fetchGameLogData();
	}, [fetchParticipationData, fetchGameProgress, fetchCompanyEvaluations, fetchGameLogData]);
	
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					{/* <IonTitle>Tab 3</IonTitle> */}
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Tab 3</IonTitle>
					</IonToolbar>
				</IonHeader>

				<div style={{
					justifyContent: 'space-between',
					padding: 'auto 20px',
					textAlign: 'center',
				}}>
					<ThemeProvider theme={theme}>
						<Box sx={{ 
							width: '100%',
							maxWidth: '100%',
							overflow: 'hidden',
							boxSizing: 'border-box',
							m: 0,
							p: { xs: 1, md: 2 },
						}}>
						<Typography 
							variant="h4" 
							component="h1" 
							gutterBottom
							sx={{
								textAlign: { xs: 'center', md: 'left' },
								mb: { xs: 2, md: 3 },
							}}
						>
							あしあと機能 - ダッシュボード
						</Typography>
						<Typography 
							variant="body1" 
							color="text.secondary" 
							sx={{ 
								mb: { xs: 3, md: 4 },
								textAlign: { xs: 'center', md: 'left' },
							}}
						>
							ここはあしあと機能の画面です。各種チャートとゲーム進捗を確認できます。
						</Typography>

						<Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
							{/* 上段: ゲーム進捗ゲージとインターン参加回数グラフ */}
							<Box sx={{ 
								display: 'flex', 
								flexDirection: { xs: 'column', md: 'row' }, 
								gap: { xs: 2, md: 3 } 
							}}>
								{/* ゲーム進捗ゲージ */}
								<Paper sx={{ 
									py: { xs: 2, md: 3 }, 
									px: { xs: 2, md: 3 },
									flex: 1,
									minHeight: { xs: 'auto', md: '400px' },
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
									<Typography 
										variant="h6" 
										gutterBottom
										sx={{ 
											textAlign: 'center',
											fontSize: { xs: '1.1rem', md: '1.25rem' },
											mb: { xs: 2, md: 3 }
										}}
									>
										ゲーム進捗
									</Typography>
									{gameProgressLoading && (
										<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
											進捗を読み込み中...
										</Typography>
									)}
									<Box sx={{ 
										display: 'flex', 
										justifyContent: 'center', 
										alignItems: 'center',
										my: { xs: 1, md: 2 },
										flex: 1,
									}}>
										<Gauge
											width={isMobile ? 150 : 200}
											height={isMobile ? 150 : 200}
											value={gameProgress}
											startAngle={-110}
											endAngle={110}
											text={({ value }) => `${value}%`}
										/>
									</Box>
								</Paper>

								{/* インターン参加回数グラフ */}
								<Paper sx={{ 
									py: { xs: 2, md: 3 }, 
									px: { xs: 2, md: 3 },
									flex: 1,
									minHeight: { xs: 'auto', md: '400px' },
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
									{isLoading ? (
										<Typography>データを読み込み中...</Typography>
									) : error ? (
										<Box sx={{ textAlign: 'center', mb: 2 }}>
											<Typography color="error" variant="body2" sx={{ mb: 1 }}>
												{error}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												ダミーデータを表示しています
											</Typography>
										</Box>
									) : null}
									<InternParticipantsHorizontalBarChart
										key={`participants-${refreshKey}`}
										data={participationData}
										title="インターン参加回数"
										height={isMobile ? 280 : 330}
										maxWidth="100%"
										width="100%"
										containerJustify="center"
										titleAlign="center"
										rightMargin={5}
									/>
								</Paper>
							</Box>

							{/* 下段: 企業からの評価とゲームログ */}
							<Box sx={{ 
								display: 'flex', 
								flexDirection: { xs: 'column', md: 'row' }, 
								gap: { xs: 2, md: 3 } 
							}}>
								{/* 企業からの評価 */}
								<Paper sx={{ 
									py: { xs: 2, md: 3 }, 
									px: { xs: 2, md: 3 },
									flex: 1,
									minHeight: { xs: 'auto', md: '400px' },
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
									<CompanyEvaluations
										key={`evaluations-${refreshKey}`}
										evaluations={companyEvaluations}
										title="企業からの評価"
										userId={userId}
										loading={evaluationsLoading}
									/>
								</Paper>

								{/* ゲームログ */}
								<Paper sx={{ 
									py: { xs: 2, md: 3 }, 
									px: { xs: 2, md: 3 },
									flex: 1,
									minHeight: { xs: 'auto', md: '400px' },
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
									<GameLog
										key={`gamelog-${refreshKey}`}
										logs={gameLogData}
										title="最近のゲームログ"
										titleAlign="center"
										maxItems={isMobile ? 5 : 7}
										userId={userId}
										loading={gameLogLoading}
									/>
								</Paper>
							</Box>
						</Box>
					</Box>
				</ThemeProvider>
				</div>
                
                {/* 空白分を確保する必要がある（現在は臨時） */}
                <br />

                {/* リロードボタン */}
                <Box sx={{ padding: { xs: '0 16px', md: '0 24px' }, marginBottom: 2 }}>
                    <Paper 
                        sx={{
                            p: 2,
                            backgroundColor: '#6100ff',
                            color: 'white',
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: '#5000d9',
                            }
                        }}
                        onClick={refreshAllData}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Refresh sx={{ mr: 1 }} />
                            <Typography variant="body1">データを更新</Typography>
                        </Box>
                    </Paper>
                </Box>

                {/* フィードバックタブ */}
				<FeedbackTab
					primary
					color="#6100ff"
					backgroundColor="#6100ff"
					width="100%"
					height="100%"
					aiReview="AIによるレビュー内容がここに表示されます。"
					onClick={() => {}}
				/>

				{/* 空白分を確保する必要がある（現在は臨時） */}
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />

				<MenuTile
					primary
					backgroundColor="#6100ff"
					bottomMarginTop=""
					height="100%"
					label="Button"
					menuAlignItems="center"
					menuBtnLeft="50%"
					menuBtnTop=""
					menuJustifyContent="center"
					menuMargin="0em"
					menuTransform="translate(-50%, -50%)"
					menuZIndex={10}
					onClick={() => {}}
					position="fixed"
					accordionPosition="absolute"
					bottom="0px"
					variant="primary"
					width="100vw"
				/>
			</IonContent>
		</IonPage>
	);
};

export default Tab3;