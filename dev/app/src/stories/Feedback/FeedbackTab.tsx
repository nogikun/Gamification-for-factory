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
    width?: string; // 幅
    height?: string; // 高さ
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
    width = "100%", // デフォルトの幅
    height = "100%", // デフォルトの高さ
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
		<Box sx={{ width: width, height: height }}>
			<TabContext value={useSelector((state: RootState) => state.feedbackTab.TabId.toString())}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<TabList 
						onChange={handleChange} 
						aria-label="lab API tabs example"
						variant="scrollable"
						scrollButtons="auto"
					>
						<Tab label="AIフィードバック" value="1" />

                        {/* 新規に表示するものがあれば以下のような形式でタブを設定する。 */}

						<Tab label="人事の方のフィードバック" value="2" />
						<Tab label="短期的な学習プラン" value="3" />
                        <Tab label="長期的な学習プラン" value="4" />
					</TabList>
				</Box>
				<TabPanel value="1">{aiReview}</TabPanel>

                {/* 以下はTabがアクティベートされると表示されるようになる。文字列のみでなく、コンポーネントを設定しても良い。 */}
				<TabPanel value="2">Item Two</TabPanel>
				<TabPanel value="3">短期的には ~~~ を学習すると良いですよ！</TabPanel>
				<TabPanel value="4">長期的には どんなことを学びたいか 明確にすると良いです！</TabPanel>
			</TabContext>
		</Box>
	);
};
