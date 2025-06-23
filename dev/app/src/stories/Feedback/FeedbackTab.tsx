import React from "react";
import { useIonRouter } from "@ionic/react";
import { useSelector, useDispatch } from "react-redux";
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
    aiReview?: string; // AIレビューの内容
	onClick?: () => void; // クリック時のイベントハンドラー
	// 他のプロパティを追加
}

// コンポーネントの定義(props値を受け取る)
export const FeedbackTab = ({
	primary = false,
	color,
	backgroundColor,
    aiReview = "",
	onClick,
	...props
}: FeedbackTabProps) => {
	// router
	const ionRouter = useIonRouter();
	// Redux
	const dispatch = useDispatch(); // 状態を更新するためのdispatch関数を取得

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		dispatch({ type: 'feedbackTab/changeTab', payload: newValue }); // タブIDを更新
	};

	return (
		<div>
			<TabContext value={useSelector((state: RootState) => state.feedbackTab.TabId.toString())}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<TabList onChange={handleChange} aria-label="lab API tabs example">
						<Tab label="AIフィードバック" value="1" />
						{/* <Tab label="Item Two" value="2" />
						<Tab label="Item Three" value="3" /> */}
					</TabList>
				</Box>
				<TabPanel value="1">{aiReview}</TabPanel>
				<TabPanel value="2">Item Two</TabPanel>
				<TabPanel value="3">Item Three</TabPanel>
			</TabContext>
		</div>
	);
};
