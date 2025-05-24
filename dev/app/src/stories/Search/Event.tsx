import React, { useState, useEffect } from 'react';
import { useIonRouter } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';

// components
import { CardComponent } from './Card';

// css
import './Event.css';

// APIから返されるイベントデータの型定義（重複しているので、共通化することを検討）
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
function fetchData(selectedEventId: string, host: string, port?: string, endpoint?: string) {
    // リクエストボディ
    const requestBody = {
        event_id: selectedEventId
    };

    // 問い合わせ処理
    const url = port ? `${host}:${port}${endpoint}` : `${host}${endpoint}`;
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

// コンポーネントの型定義
export interface EventProps {   // props（パラメータ）の型定義
    primary?: boolean;          // プライマリーボタンかどうか
    color ?: string;            // ボタンの色
    backgroundColor?: string;   // ボタンの背景色
    event_id: string;           // 選択中のイベントデータ（無い場合はエラー）
    endpoint?: string;         // APIのエンドポイント
    onClick?: () => void;       // クリック時のイベントハンドラー
}

// コンポーネントの定義(props値を受け取る)
export const Event = ({
    primary = false,
    color,
    backgroundColor,
    event_id = useSelector((state: RootState) => state.searchEvent.eventId),
    endpoint = "/demo/get-event",
    onClick,
    ...props
}: EventProps) => {
    // router
    const ionRouter = useIonRouter();
    // Redux
    const dispatch = useDispatch();                                             // 状態を更新するためのdispatch関数を取得
    const menuIsOpen = useSelector((state: RootState) => state.menu.isOpen);    // Reduxストアから状態を取得

    // ダークモードの状態を取得
    const darkTheme = useSelector((state: RootState) => state.theme.isDarkMode);

    // API接続
    const host = useSelector((state: RootState) => state.server.host);              // 接続先のホスト名を取得
    const port = useSelector((state: RootState) => state.server.port);              // 接続先のポート番号を取得
    // const eventId = useSelector((state: RootState) => state.searchEvent.eventId);   // 選択中のイベントIDを取得
    
    // イベントデータ状態管理
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // タグの色を取得する関数
    const getTagColor = (tag: string): string => {
        // タグに応じて色を返すロジック (暫定的な実装)
        const hash = tag.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        return `hsl(${hash % 360}, 70%, 60%)`;
    };
    
    // イベントデータを取得
    useEffect(() => {
        setLoading(true);
        setError(null);
        
        if (event_id) {
            fetchData(event_id, host, port, endpoint)
                .then(data => {
                    setEventData(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        } else {
            setError("Event ID is required");
            setLoading(false);
        }
    }, [event_id, host, port, endpoint]);

    // ローディング中
    if (loading) {
        return <div>Loading...</div>;
    }

    // エラー発生時
    if (error || !eventData) {
        return <div>Error: {error}</div>;
    }
    
    return (
        <div>
            <CardComponent
                // key={index} // indexをキーとして使用（ユニークなIDがない場合）event.event_idではなくindexを使用
                backgroundColor={darkTheme ? "#000000" : "#ffffff"}
                base64Image={eventData.image}
                borderRadius="10px"
                campany={eventData.location.split(" ")[2]}
                color={darkTheme ? "#ffffff" : "#000000"}
                currencySymbol="¥"
                details={eventData.description}
                startDate={eventData.start_time.split('T')[0]}
                endDate={eventData.end_time.split('T')[0]}
                height="auto"
                onClick={() => console.log(`イベント詳細: ${eventData.event_id}`)}
                paying={Number.parseInt(eventData.reward.replace(/[^0-9]/g, ""), 10)}
                tags={eventData.tags.map((tag: string) => ({
                    color: getTagColor(tag),
                    label: tag
                }))}
                title={eventData.title}
                width="100%"
            />
            <div style={{
                margin: "7%",
            }}>
                <p>詳細：</p>
                <p>{eventData.description}</p>
                <p>場所: {eventData.location}</p>
                <p>募集人数： {eventData.max_participants}</p>
                <p>資格要件: {eventData.required_qualifications.join(", ")}</p>
            </div>
        </div>
    );
};