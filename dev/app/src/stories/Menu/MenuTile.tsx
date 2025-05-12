import React, { useEffect, useState } from 'react';
import { useIonRouter } from '@ionic/react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';

// css
import './MenuTile.css';

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
    accordionPosition?: 'absolute' | 'fixed' | 'relative'; // アコーディオンの配置方法
    
    // 中央アコーディオンの設定
    menuBtnTop?: string; // メニューボタンの上からの位置
    menuBtnLeft?: string; // メニューボタンの左からの位置
    menuTransform?: string; // メニューボタンの変形
    menuZIndex?: number; // メニューボタンの重なり順序
    menuMargin?: string; // メニューボタンのマージン
    menuJustifyContent?: string; // メニューボタン内の水平方向の配置
    menuAlignItems?: string; // メニューボタン内の垂直方向の配置
    
    bottom?: string; // 親コンテナの下からの位置

    // 下部ボタンの設定
    bottomMarginTop?: string; // 下部ボタンの上マージン
    
    onClick?: () => void; // 今はvoid関数であるが、クリック時に実行される関数を指定するためのもの
}

export const MenuTile = ({
    primary = false,
    label,
    backgroundColor,
    width,
    height,
    bottom,
    position = 'fixed',
    accordionPosition = 'absolute',
    menuBtnTop,
    menuBtnLeft,
    menuTransform,
    menuZIndex = 10,
    menuMargin = '20px 0',
    menuJustifyContent = 'center',
    menuAlignItems = 'center',
    bottomMarginTop = '-0px',
    onClick,
}: MenuTileProps) => {
    const dispatch = useDispatch();
    const menuIsOpen = useSelector((state: RootState) => state.menu.isOpen);
    // アニメーション状態を追跡するステート
    const [shouldAnimate, setShouldAnimate] = useState(false);
    
    // menuIsOpenの状態変化を監視し、trueになった時だけアニメーションを実行
    useEffect(() => {
        if (menuIsOpen) {
            setShouldAnimate(true);
            const animationDuration = 500;
            setTimeout(() => {
                setShouldAnimate(false);
            }, animationDuration);
        } else {
            setShouldAnimate(true);
        }
    }, [menuIsOpen]);
    
    // アコーディオンのクリックハンドラ - Reduxアクションをディスパッチ
    const handleAccordionClick = () => {
        dispatch({ type: 'menu/toggleMenu' });
        console.log("Accordion clicked, toggling menu state");
    };

    return (
        <div style={{ position: `${position}`, bottom: `${bottom}` }}>
            {/* アコーディオンの位置を指定 */}
            <div style={{
                width: `${width}`,
                height: `${height}`,
                position: 'relative',
            }} >
                {/* menuIsOpenの値に基づいて上段ボタンを条件付きレンダリング */}
                {menuIsOpen && (
                    <div 
                        className="top-buttons"
                        style={{
                            animation: shouldAnimate ? menuIsOpen? 'fadeIn 0.3s ease-in-out': 'fadeOut 0.3s ease-in-out' : 'none',
                        }}
                    > 
                        <Button
                            alt=""
                            backgroundColor="#FCAA1B"
                            borderRadiusBottomLeft="0px"
                            borderRadiusBottomRight="0px"
                            borderRadiusTopLeft="30px"
                            borderRadiusTopRight="0px"
                            color="#ffffff"
                            fontSize="24px"
                            width="50vw"
                            height="80px"
                            icon={"Steps"}
                            label="ログ"
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
                            borderRadiusTopRight="30px"
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
                )}

                <div style={{
                    position: `${accordionPosition}`,
                    justifyContent: menuJustifyContent,
                    alignItems: menuAlignItems,
                    margin: menuMargin,
                    top: menuBtnTop,
                    left: menuBtnLeft,
                    transform: menuTransform,
                    zIndex: menuZIndex
                    }}
                >
                    <Accordion
                        open={menuIsOpen}
                        width={100}
                        height={100}
                        borderRadius={50}
                        backgroundColor="#262626"
                        borderColor="#ffffff"
                        borderWidth={3}
                        bordered
                        icon={"Menu"}
                        label=""
                        onClick={handleAccordionClick} // 関数参照に変更
                        primary
                        textcolor="#ffffff"
                    />
                </div>

                <div className="bottom-buttons" style={{ marginTop: bottomMarginTop, backgroundColor: '#000000',}}>
                    <Button
                        alt=""
                        backgroundColor="#34AFB8"
                        borderRadiusBottomLeft="0px"
                        borderRadiusBottomRight="30px"
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
                        borderRadiusBottomLeft="30px"
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
        </div>
    );
}