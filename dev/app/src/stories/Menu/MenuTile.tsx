import React from 'react';
import { useIonRouter } from '@ionic/react';

// css
import './MenuTile.css'; // cssファイルのインポート

// Components
import { Button } from './Button';
import { Accordion } from './Accordion';

export interface MenuTileProps {
    primary?: boolean; // プライマリーボタンかどうか
    label: string;
    variant?: 'primary' | 'secondary'; // ボタンの種類（選択肢）
    backgroundColor?: string; // 背景色
    width?: string; // ボタンの幅
    height?: string; // ボタンの高さ
    
    // 親コンテナの位置設定
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'; // 親コンテナの配置方法（relative, absoluteなど）
    
    // 中央アコーディオンの設定
    menuBtnTop?: string; // メニューボタンの上からの位置
    menuBtnLeft?: string; // メニューボタンの左からの位置
    menuTransform?: string; // メニューボタンの変形
    menuZIndex?: number; // メニューボタンの重なり順序
    menuMargin?: string; // メニューボタンのマージン
    menuJustifyContent?: string; // メニューボタン内の水平方向の配置
    menuAlignItems?: string; // メニューボタン内の垂直方向の配置
    
    // 下部ボタンの設定
    bottomMarginTop?: string; // 下部ボタンの上マージン
    
    onClick?: () => void; // 今はvoid関数であるが、クリック時に実行される関数を指定するためのもの
}

function add(a: number, b: number): number {
    console.log("add function called with arguments:", a, b); // 引数をログに出力
    return a + b;
}

export const MenuTile = ({
    primary = false,
    label,
    backgroundColor,
    width,
    height,
    position = 'relative', // デフォルト値を設定
    menuBtnTop,
    menuBtnLeft,
    menuTransform,
    menuZIndex = 10, // デフォルト値を設定
    menuMargin = '20px 0', // デフォルト値を設定
    menuJustifyContent = 'center', // デフォルト値を設定
    menuAlignItems = 'center', // デフォルト値を設定
    bottomMarginTop = '-0px', // デフォルト値を設定
    onClick,
}: MenuTileProps) => {
    const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';

    return (
        <div style={{
            width: `${width}`,
            height: `${height}`,
            position: 'relative'
        }} >
            <div className="top-buttons"> {/* 上段 */}
                <Button
                    alt=""
                    backgroundColor="#FCAA1B"
                    borderRadiusBottomLeft="0px"
                    borderRadiusBottomRight="0px"
                    borderRadiusTopLeft="80px"
                    borderRadiusTopRight="0px"
                    color="#ffffff"
                    fontSize="24px"
                    width="50vw"
                    height="80px"
                    icon={"Crown"}
                    label="ランク"
                    onClickPath="/tab3"
                    primary
                    variant="primary"
                />
                
                <Button
                    alt=""
                    backgroundColor="#A3A3A3"
                    borderRadiusBottomLeft="0px"
                    borderRadiusBottomRight="0px"
                    borderRadiusTopLeft="0px"
                    borderRadiusTopRight="80px"
                    color="#ffffff"
                    fontSize="24px"
                    width="50vw"
                    height="80px"
                    icon={"Settings"}
                    label="設定"
                    onClickPath="/tab4"
                    primary
                    variant="primary"
                />
            </div>

            <div style={{
                position: position,
                justifyContent: menuJustifyContent,
                alignItems: menuAlignItems,
                margin: menuMargin,
                top: menuBtnTop,
                left: menuBtnLeft,
                transform: menuTransform,
                zIndex: menuZIndex
                }}
                // className="middle-accordion"
                >
                <Accordion
                    backgroundColor="#262626"
                    borderRadius={50}
                    height={100}
                    icon={"Menu"}
                    label=""
                    onClick={() => {}}
                    primary
                    textcolor="#ffffff"
                    width={100}
                />
            </div>

            <div className="bottom-buttons" style={{ marginTop: bottomMarginTop }}> {/* 下段 */}
                <Button
                    alt=""
                    backgroundColor="#34AFB8"
                    borderRadiusBottomLeft="0px"
                    borderRadiusBottomRight="80px"
                    borderRadiusTopLeft="0px"
                    borderRadiusTopRight="0px"
                    color="#ffffff"
                    fontSize="24px"
                    width="50vw"
                    height="80px"
                    icon={"Search"}
                    label="探す"
                    onClickPath="/tab1"
                    primary
                    variant="primary"
                />

                <Button
                    backgroundColor="#FF8587"
                    borderRadiusBottomLeft="80px"
                    borderRadiusBottomRight="0px"
                    borderRadiusTopLeft="0px"
                    borderRadiusTopRight="0px"
                    color="#ffffff"
                    fontSize="24px"
                    width="50vw"
                    height="80px"
                    icon={"Battle"}
                    label="戦う"
                    onClickPath="/tab2"
                    primary
                    variant="primary"
                />

            </div>
        </div>
    );
}