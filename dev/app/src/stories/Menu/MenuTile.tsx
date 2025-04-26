import React from 'react';

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
    onClick?: () => void; // 今はvoid関数であるが、クリック時に実行される関数を指定するためのもの
}

export const MenuTile = ({
    primary = false,
    label,
    backgroundColor,
    width,
    height,
    onClick,
}: MenuTileProps) => {
    const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';

    return (
        <div style={{
            width: `${width}`,
            height: `${height}`
        }} >
            <div> {/* 上段 */}
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
                    onClick={() => {}}
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
                    onClick={() => {}}
                    primary
                    variant="primary"
                />
            </div>

            <div> {/* 下段 */}
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
                    onClick={() => {}}
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
                    onClick={() => {}}
                    primary
                    variant="primary"
                />

            </div>
        </div>
    );
}