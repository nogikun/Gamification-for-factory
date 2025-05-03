import react from 'react';
import {useIonRouter} from '@ionic/react';

// componentのインポート
import { DateComponent } from './Date';

import './DateTile.css'; // cssファイルのインポート

export interface DateTileProps {
    selectedDate?: string; // 選択された日付
    termDays?: number; // 期間の日付（± n 日）
}

export const DateTile = ({
    selectedDate = '2023-10-01', // 選択された日付
    termDays = 2, // 期間の日付（± n 日）
    ...props
}: DateTileProps) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: 'auto 20px' }}>
            {Array.from({ length: termDays * 2 + 1 }, (_, index) => {
                const i = index - termDays;
                const date = new Date(selectedDate);
                date.setDate(date.getDate() + i);
                const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD形式に変換
                const isSelected = i === 0; // 選択された日付かどうか
                
                return (
                    <DateComponent
                        key={formattedDate}
                        backgroundColor={isSelected ? "#7381C0" : "#ffffff"}
                        borderColor={isSelected ? "#7381C0" : "#D9D9D9"}
                        borderRadius="10px"
                        borderWidth={3}
                        bordered
                        color={isSelected ? "#ffffff" : "#aeaeae"}
                        date={formattedDate}
                        dayFontSize="32px"
                        height="100px"
                        onClick={() => {}}
                        weekdayFontSize="24px"
                        width="80px"
                        selected={isSelected}
                    />
                );
            })}
        </div>
    );
};