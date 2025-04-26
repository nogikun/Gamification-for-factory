import React from 'react'; // 絶対必要

import './Button.css'; // cssファイルのインポート

{/* images */}
import { ReactComponent as Crown } from './assets/crown.svg'; // 画像のインポート
import { ReactComponent as Search } from './assets/manage_search.svg';
import { ReactComponent as Battle } from './assets/swords.svg';
import { ReactComponent as Settings } from './assets/settings_applications.svg';

import { Component } from '@storybook/blocks';

// アイコンコンポーネントの型を定義
type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

// Buttonの型定義
export interface ButtonProps { // Buttonのprops（パラメータ）の型定義
    primary?: boolean; // プライマリーボタンかどうか
    label: string;
    variant?: 'primary' | 'secondary'; // ボタンの種類（選択肢）
    disabled?: boolean;
		fontSize ?: string; // フォントサイズ
		color ?: string; // ボタンの色
		backgroundColor?: string; // ボタンの背景色
		width?: string; // ボタンの幅
		height?: string; // ボタンの高さ
		borderRadiusTopLeft?: string; // 左上の角の丸み
		borderRadiusTopRight?: string; // 右上の角の丸み
		borderRadiusBottomLeft?: string; // 左下の角の丸み
		borderRadiusBottomRight?: string; // 右下の角の丸み
		icon?: IconComponent | keyof typeof Icons; // アイコンコンポーネントまたはアイコン名
		alt?: string; // 画像のalt属性
    onClick?: () => void; // 今はvoid関数であるが、クリック時に実行される関数を指定するためのもの
}

export const Button = ({
	primary = false,
  label,
	color,
	backgroundColor,
	borderRadiusTopLeft,
	borderRadiusTopRight,
	borderRadiusBottomLeft,
	borderRadiusBottomRight,
	icon: IconProp = Crown, // デフォルトは適当なアイコン
  ...props
}: ButtonProps) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  const Icon = typeof IconProp === 'string' ? Icons[IconProp as keyof typeof Icons] : IconProp;
    
	return (
    <button
      type="button"
      className={['storybook-button', mode].join(' ')}
      style={{
				backgroundColor: backgroundColor,
				width: props.width,
				height: props.height,
				borderRadius: `${borderRadiusTopLeft} ${borderRadiusTopRight} ${borderRadiusBottomLeft} ${borderRadiusBottomRight}`,
			}}
      {...props}
    >
			<div style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '15px',
				height: props.height,
			}}>

					
				{/* アイコン */}
				<Icon />

				{/* ラベル */}
				<span style={{
					color: color,
					fontSize: props.fontSize,
					fontWeight: 'bold',
				}}
				>
					{label}
				</span>

			</div>

    </button>
  );
};

// アイコンコンポーネントをエクスポート（Storybookで使用するため）
export const Icons = {
	Crown,
	Search,
	Battle,
	Settings
	// 他のアイコンも追加
};