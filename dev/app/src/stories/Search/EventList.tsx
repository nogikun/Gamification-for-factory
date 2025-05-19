import React, { useEffect, useState } from 'react';
import { useIonRouter } from '@ionic/react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';

// componentのインポート
import { CardComponent } from './Card';

// css
import './EventList.css'; // cssファイルのインポート
import { use } from 'chai';

// APIから返されるイベントデータの型定義
interface EventData {
    event_id: string;
    company_id: string;
    event_type: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    location: string;
    reward: string;
    required_qualifications: string[];
    max_participants: number;
    created_at: string;
    updated_at: string;
    tags: string[];
    image: string;
}

// apiに問い合わせて、データを取得する関数
function fetchData(targetDate: Date | string, host: string, port?: string){
    let formatedTargetDate: string;

    const formatter = new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    if (targetDate instanceof Date) {
        formatedTargetDate = formatter.format(targetDate).replace(/\//g, '-');
    } else {
        formatedTargetDate = targetDate;
    }
    
    const requestBody = {
        target_date: formatedTargetDate,
    };
    console.log("入力された日付:", targetDate);
    console.log("リクエストボディ:", requestBody);

    const url = port ? `${host}:${port}/demo/get-events` : `${host}/demo/get-events`;
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        redirect: 'follow',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        throw error; // エラーを再スローして、useEffectのcatchブロックで処理できるようにします
    });
}

export interface EventListProps {
    selectedDate?: string;
}

export const EventList = ({
    selectedDate,
    ...props
}: EventListProps) => {
    const dispatch = useDispatch();
    const searchSelectedDate = useSelector((state: RootState) => state.searchDate.selectedDate);
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    if (searchSelectedDate) {
        selectedDate = searchSelectedDate;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        dispatch({ type: 'theme/setDarkMode', payload: true });
    } else {
        dispatch({ type: 'theme/setDarkMode', payload: false });
    }

    const darkTheme = useSelector((state: RootState) => state.theme.isDarkMode);

    // 接続先の指定
    const host = useSelector((state: RootState) => state.server.host);
    const port = useSelector((state: RootState) => state.server.port);

    useEffect(() => {
        if (!searchSelectedDate) return;
        
        setLoading(true);
        setError(null);
        
        const targetDate = new Date(searchSelectedDate);
        console.log("targetDate", targetDate);

        fetchData(targetDate, host, port)
            .then(data => {
                console.log("APIレスポンス:", data);
                // より柔軟なデータチェック
                if (data) {
                    // データが配列でない場合は配列に変換（単一オブジェクトの場合など）
                    const eventsArray = Array.isArray(data) ? data : [data];
                    setEvents(eventsArray);
                } else {
                    setError("データが見つかりませんでした");
                }
            })
            .catch(err => {
                console.error("データ取得エラー:", err);
                setError("イベントデータの取得に失敗しました");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [searchSelectedDate]);

    return (
        <div>
            {loading && <p>読み込み中...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {/* 取得したイベントデータを表示 */}
            {events.map((event: EventData, index: number) => (
                <CardComponent
                    key={index} // indexをキーとして使用（ユニークなIDがない場合）event.event_idではなくindexを使用
                    backgroundColor={darkTheme ? "#333333" : "#f5f5f5"}
                    base64Image={event.image}
                    borderRadius="10px"
                    campany={event.location.split(" ")[2]}
                    color={darkTheme ? "#ffffff" : "#000000"}
                    currencySymbol="¥"
                    details={event.description}
                    startDate={event.start_time.split('T')[0]}
                    endDate={event.end_time.split('T')[0]}
                    height="auto"
                    onClick={() => {
                        // クリックイベント
                        console.log(`イベント詳細: ${event.event_id}`);
                        // 選択されたイベントIDをReduxストアに保存
                        dispatch({ type: 'searchEvent/setEventId', payload: event.event_id });
                    }}
                    paying={Number.parseInt(event.reward.replace(/[^0-9]/g, ""), 10)}
                    tags={event.tags.map(tag => ({
                        color: getTagColor(tag),
                        label: tag
                    }))}
                    title={event.title}
                    width="100%"
                />
            ))}
            
            {/* イベントがない場合のデフォルト表示（最低でも1つのカードを表示） */}
            {events.length === 0 && !loading && !error && (
                <CardComponent
                    backgroundColor={darkTheme ? "#333333" : "#f5f5f5"}
                    base64Image=""
                    borderRadius="10px"
                    campany="Automation 株式会社"
                    color={darkTheme ? "#ffffff" : "#000000"}
                    currencySymbol="¥"
                    details="詳細情報"
                    endDate="2023-10-31"
                    height="100px"
                    onClick={() => {}}
                    paying={7000}
                    startDate="2023-10-01"
                    tags={[
                        { color: '#ff0000', label: '溶接' },
                        { color: '#00ff00', label: '金属加工' }
                    ]}
                    title="1day インターンシップ"
                    width="80px"
                />
            )}
        </div>
    );
}

// タグの種類に応じて色を返す関数
function getTagColor(tag: string): string {
    const colorMap: Record<string, string> = {
        '金属加工': '#ff7043',
        'プラスチック成形': '#42a5f5',
        '組立': '#66bb6a',
        '検査': '#ffca28',
        '包装': '#ec407a',
    };
    
    return colorMap[tag] || '#9e9e9e';
}