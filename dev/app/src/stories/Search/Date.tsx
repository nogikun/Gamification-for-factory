import react from 'react';
import {useIonRouter} from '@ionic/react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';

import './Date.css'; // cssファイルのインポート
// import { on } from 'events';

export interface DateProps {
    selected?: boolean; // 選択された日付かどうか
    date: string; // 日付；後でDate型に変換する
    onClickPath?: string; // ページ遷移のパス 例："/tab1"
    onClick?: () => void; // クリック時のイベントハンドラー
    backgroundColor?: string; // 背景色
    color?: string; // 文字色
    dayFontSize?: string; // 日付フォントサイズ
    weekdayFontSize?: string; // 曜日フォントサイズ
    width?: string; // 幅
    height?: string; // 高さ
    borderRadius?: string; // 角の丸み
    bordered?: boolean; // ボーダーの有無
    borderColor?: string; // ボーダーの色
    borderWidth?: number; // ボーダーの太さ
}

export const DateComponent = ({
    selected = false, // 選択された日付かどうか
    date,
    onClickPath = '/tab1', // ページ遷移のパス 例："/tab1"
    backgroundColor,
    color,
    dayFontSize,
    weekdayFontSize,
    width,
    height,
    borderRadius,
    bordered,
    borderColor,
    borderWidth,
    onClick = () => {},
    ...props
}: DateProps) => {
    const ionRouter = useIonRouter();
    const dispatch = useDispatch();
    const menuIsOpen = useSelector((state: RootState) => state.menu.isOpen);

    const day = new Date(date).getDate(); // 日付を取得
    const dateObj = new Date(date)
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][dateObj.getDay()]; // 曜日を取得
    let dayOfWeekColor = ['#FF5555', `${color}`, `${color}`, `${color}`, `${color}`, `${color}`, "#5555ff"][dateObj.getDay()]; // 曜日ごとの色を設定
    if (selected) { // 選択された日付の場合
        dayOfWeekColor = `${color}`;
    }
    const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    return (
        <div>
            <button
                type="button"
                className="date-button"
                onClick={() => {
                    // 通知
                    // console.log("selectedDate", formattedDate);
                    // 選択された日付をReduxストアに保存
                    dispatch({ type: 'searchDate/setSelectedDate', payload: formattedDate });
                }}
                style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer', // カーソルをポインターに変更
                }}
            >
                <div
                    className="date-component"
                    style={{
                        backgroundColor: backgroundColor,
                        color: color,
                        width: width,
                        height: height,
                        borderRadius: borderRadius,
                        display: 'grid',
                        placeItems: 'center',
                        // marginTop: '100px',
                        // marginBottom: '100px',
                        border: bordered ? `${borderWidth}px solid ${borderColor}` : 'none',
                        cursor: 'pointer', // カーソルをポインターに変更
                    }}
                >
                    <div
                        style={{
                            fontSize: dayFontSize,
                            fontWeight: 'bold',
                            paddingTop: '10px',
                            verticalAlign: 'bottom',
                        }}
                    >
                        {day}
                    </div>
                    {/* <br /> */}
                    <div
                        style={{
                            fontSize: weekdayFontSize,
                            fontWeight: 'bold',
                            paddingBottom: '15px',
                            color: dayOfWeekColor,
                        }}
                    >
                        {dayOfWeek}
                    </div>
                </div>
                
            </button>
        </div>
    );
};