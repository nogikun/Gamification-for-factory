import React from 'react';

import './Accordion.css';
import { P } from 'storybook/internal/components';
import { color } from 'storybook/internal/theming';

// プロパティの型を定義
export interface AccordionProps {
	/** これはページの主要なアクションコールですか？ */
	primary?: boolean;
	/** 使用するテキストの色 */
	textcolor?: string;
	/** 使用する背景色 */
	backgroundColor?: string;
	/** ボーダーを表示するかどうか */
	bordered?: boolean;
	/** ボタンの内容 */
	label: string;
	/** 角丸の大きさ (px) */
  borderRadius?: number;
	/** 幅（px または % など） */
	width?: string | number;
	/** 高さ（px または % など） */
	height?: string | number;
	/** オプションのクリックハンドラー */
	onClick?: () => void;
}

/** ユーザー操作のための主要なUIコンポーネント */
export const Accordion = ({
	primary = false,
	textcolor,
	backgroundColor,
	label,
	bordered,
	borderRadius,
	width,
	height,
	...props
}: AccordionProps) => {
	const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
	return (
		<button
			style={{
				backgroundColor : backgroundColor,
				color : textcolor,
				border : bordered ? '1px solid' : 'none',
				borderRadius : borderRadius ? `${borderRadius}px` : '0px',
				width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
				height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
				} 
			}
			onClick={props.onClick}
			{...props}
		>
			<p>{label}</p>
		</button>
	);
};
