import react from 'react';
import {useIonRouter} from '@ionic/react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';

// componentのインポート
import { DateComponent } from './Date';

import './DateTile.css'; // cssファイルのインポート

export interface DateTileProps {
    selectedDate?: string; // 選択された日付
    termDays?: number; // 期間の日付（± n 日）
    spaceBetween?: string; // 日付間のスペース
    horizonMargin?: string; // 日付端のスペース
    marginTop?: string; // 上部のマージン
    marginBottom?: string; // 下部のマージン
}

export const DateTile = ({
    selectedDate = '2023-10-01', // 選択された日付
    termDays = 2, // 期間の日付（± n 日）
    spaceBetween = '20px', // 日付間のスペース
    horizonMargin = '7px', // 日付端のスペース
    marginTop = '30px', // 上部のマージン
    marginBottom = '30px', // 下部のマージン
    ...props
}: DateTileProps) => {
    const dispatch = useDispatch();
    const searchSelectedDate = useSelector((state: RootState) => state.searchDate.selectedDate);
    if (searchSelectedDate) {
        selectedDate = searchSelectedDate;
        // console.log("selectedDate", selectedDate);
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // console.log("dark mode");
        dispatch({ type: 'theme/setDarkMode', payload: true }); // ダークモードの状態を更新（ダークモードの場合）
    } else {
        dispatch({ type: 'theme/setDarkMode', payload: false }); // ダークモードの状態を更新（ライトモードの場合）
    }

    const darkTheme = useSelector((state: RootState) => state.theme.isDarkMode);
    console.log("darkTheme", darkTheme);

    return (
        <div style={{
            marginLeft: `${horizonMargin}`,
            marginRight: `${horizonMargin}`,
            marginTop: `${marginTop}`,
            marginBottom: `${marginBottom}`,
        }}>
            
            <div style={{
                display: 'flex',
                justifyContent: 'space-between', // 日付を横並びに配置
                padding: `auto ${spaceBetween}`,
                textAlign: 'center' 
            }}>
                {/* 選択された日付を中心に、前後のn日間の日付を表示 */}
                {/* 
                    例: 選択日が2023-10-01、termDaysが2の場合、

                    【座標】   -1,         0,          1,          2,          3
                    【value】 2023-09-29, 2023-09-30, 2023-10-01, 2023-10-02, 2023-10-03

                    を表示
                */}
                {Array.from({ length: termDays * 2 + 1 }, (_, index) => {
                    const i = index + 1 - termDays ;
                    const date = new Date(selectedDate);
                    date.setDate(date.getDate() + i);
                    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD形式に変換
                    const isSelected = i === 1; // 選択された日付かどうか
                    
                    return (
                        <DateComponent
                            key={formattedDate}
                            backgroundColor={isSelected ? "#7381C0" : darkTheme ? "#333333" : "#ffffff"}
                            borderColor={isSelected ? "#7381C0" : darkTheme ? "#595959" : "#D9D9D9"}
                            borderRadius="10px"
                            borderWidth={3}
                            bordered
                            color={isSelected ? "#ffffff" : darkTheme ? "#797979" : "#aeaeae"}
                            date={formattedDate}
                            dayFontSize="32px"
                            height="100px"
                            onClick={() => {}}
                            weekdayFontSize="24px"
                            width="70px"
                            selected={isSelected}
                        />
                    );
                })}
            </div>
        </div>
    );
};