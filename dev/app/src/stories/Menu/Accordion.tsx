import React from 'react';
import './Accordion.css';

// アイコンコンポーネントのインポート
import { ReactComponent as Menu } from './assets/menu.svg';

// アイコンコンポーネントの型を定義
type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

// アイコンマッピングをエクスポート（Storybookで使用するため）
export const Icons = {
	Menu
	// 他のアイコンも追加
};

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
    /** ラベルを有効にするか */
    labelEnabled?: boolean;
    /** アイコン */
    icon?: IconComponent | keyof typeof Icons; // アイコンコンポーネントまたはアイコン名
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
	labelEnabled = true,
	icon: IconProp = Menu,
	onClick,
	...props
}: AccordionProps) => {
	const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
	const Icon = typeof IconProp === 'string' ? Icons[IconProp as keyof typeof Icons] : IconProp;

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
			onClick={onClick}
			{...props}
		>
			{/* アイコン */}
			<Icon />
			
			{/* ラベル */}
			{labelEnabled && (
				<span style={{ color: textcolor }}>
					{label}
				</span>
			)}
		</button>
	);
};