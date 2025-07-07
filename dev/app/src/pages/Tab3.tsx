import * as React from "react";

// 新しく作成した InternParticipantsHorizontalBarChart コンポーネントをインポート
import InternParticipantsHorizontalBarChart from "../stories/Charts/InternParticipantsHorizontalBarChart";
import AiDiagnosisResult from "../stories/Charts/AiDiagnosisResult";
import { Gauge } from "@mui/x-charts/Gauge";
import { gameProgressData } from "@/dataset/chartData";
import {
	Typography,
	useMediaQuery,
	createTheme,
	ThemeProvider,
	CssBaseline,
} from "@mui/material";
import GameLog from "../stories/Charts/GameLog";
import CompanyEvaluations from "../stories/Charts/CompanyEvaluations";

import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab3.css";

// components
import { MenuTile } from "../stories/Menu/MenuTile";
import { FeedbackTab } from "../stories/Feedback/FeedbackTab";

const Tab3: React.FC = () => {
	// システムのカラーテーマを検出
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

	// テーマを作成
	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: prefersDarkMode ? "dark" : "light",
					primary: {
						main: prefersDarkMode ? "#90CAF9" : "#1976D2",
					},
					background: {
						default: prefersDarkMode ? "#121212" : "#FAFAFA",
						paper: prefersDarkMode ? "#1E1E1E" : "#FFFFFF",
					},
				},
			}),
		[prefersDarkMode],
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<IonPage>
				<IonHeader>
					<IonToolbar>
						<IonTitle>Tab 3</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent fullscreen>
					<IonHeader collapse="condense">
						<IonToolbar>
							<IonTitle size="large">Tab 3</IonTitle>
						</IonToolbar>
					</IonHeader>
					{/* <ExploreContainer name="Tab 3 page" /> */}

					<p>ここはあしあと機能の画面です。</p>

					<FeedbackTab
						primary
						color="#6100ff"
						backgroundColor="#6100ff"
						width="100%"
						height="100%"
						// user_id="11111111-1111-1111-1111-111111111111" // テスト用のUUID
						aiReview="AIによるレビュー内容がここに表示されます。"
						onClick={() => {}}
					/>

					{/* --- ゲーム進捗グラフ --- */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							padding: "24px 0",
						}}
					>
						<Typography variant="h6" component="h2" gutterBottom>
							ゲームの進捗
						</Typography>
						<Gauge
							width={200}
							height={200}
							value={gameProgressData.value}
							startAngle={-110}
							endAngle={110}
							sx={{
								"& .MuiGauge-valueText": {
									fontSize: 40,
									transform: "translate(0px, 0px)",
								},
							}}
							text={`${gameProgressData.value}%`}
						/>
					</div>

					{/* --- ゲームログ --- */}
					<div style={{ padding: "8px 0" }}>
						<GameLog />
					</div>

					{/* --- インターン参加数グラフ --- */}
					{/* ここに InternParticipantsHorizontalBarChart コンポーネントを配置 */}
					<div style={{ padding: "16px" }}>
						<InternParticipantsHorizontalBarChart />
					</div>

					{/* --- 企業評価 --- */}
					<div style={{ padding: "16px" }}>
						<CompanyEvaluations />
					</div>

					{/* --- AI診断結果 --- */}
					<div style={{ padding: "16px" }}>
						<AiDiagnosisResult />
					</div>
					{/* --- この部分が可変で伸びるコンテンツエリア --- */}
					<div
						style={{
							flexGrow: 1,
							overflowY: "auto",
							paddingBottom: "200px", // ★ スクロール下部の余白を追加
						}}
					/>

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
		</ThemeProvider>
	);
};

export default Tab3;
