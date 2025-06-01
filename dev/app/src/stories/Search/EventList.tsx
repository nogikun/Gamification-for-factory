import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useIonRouter, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';

// componentのインポート
import { CardComponent } from './Card';

// css
import './EventList.css'; // cssファイルのインポート

// APIから返されるイベントデータの型定義（バックエンドスキーマに合わせて更新）
interface EventData {
    event_id: string;
    company_id: string;
    event_type: string;
    title: string;
    description: string;
    start_date: string;  // start_time から start_date に変更
    end_date: string;    // end_time から end_date に変更
    location: string;
    reward: string;
    required_qualifications: string;  // string[] から string に変更（バックエンドに合わせて）
    available_spots: number;  // max_participants から available_spots に変更
    created_at: string;
    updated_at: string;
    tags: string | string[];  // バックエンドから文字列またはstring[]で返される可能性がある
    image: string;
}

// apiに問い合わせて、データを取得する関数
function fetchData(targetDate: Date | string, host: string, port?: string){
    let formatedTargetDate: string;

    if (targetDate instanceof Date) {
        // DateオブジェクトをISO形式の日付文字列 (YYYY-MM-DD) に変換
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        formatedTargetDate = `${year}-${month}-${day}`;
    } else {
        // 文字列の場合、そのまま使用（既にフォーマット済みと仮定）
        formatedTargetDate = targetDate;
    }
    
    const requestBody = {
        target_date: formatedTargetDate,
    };
    console.log("入力された日付:", targetDate);
    console.log("フォーマット後の日付:", formatedTargetDate);
    console.log("リクエストボディ:", requestBody);

    const url = port ? `${host}:${port}/get-events` : `${host}/get-events`;
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

// カスタムフック: フォーカス管理
const usePageFocus = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useIonViewWillEnter(() => {
        // ページがアクティブになる時、最初の要素にフォーカス
        if (containerRef.current) {
            const firstFocusable = containerRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable instanceof HTMLElement) {
                firstFocusable.focus();
            }
        }
    });

    useIonViewWillLeave(() => {
        // ページが非アクティブになる時、フォーカスをクリア
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    });

    return containerRef;
};

export const EventList = ({
    selectedDate,
    ...props
}: EventListProps) => {
    const dispatch = useDispatch();
    const ionRouter = useIonRouter();
    const containerRef = usePageFocus(); // カスタムフックを使用

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
                // 追加: event_id 一覧を出力
                const eventsArray = Array.isArray(data) ? data : [data];
                console.log("APIレスポンスの event_id 一覧:", eventsArray.map(ev => ev.event_id));
                // より柔軟なデータチェック
                if (data) {
                    // データが配列でない場合は配列に変換（単一オブジェクトの場合など）
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
        <div ref={containerRef} role="region" aria-label="イベント一覧">
            {loading && <p role="status">読み込み中...</p>}
            {error && <p role="alert" className="error-message">{error}</p>}
            
            {/* 取得したイベントデータを表示 */}
            {events.map((event: EventData, index: number) => (
                <CardComponent
                    key={index} // indexをキーとして使用（ユニークなIDがない場合）event.event_idではなくindexを使用
                    backgroundColor={darkTheme ? "#333333" : "#f5f5f5"}
                    base64Image={event.image}
                    borderRadius="10px"
                    campany={event.location ? (event.location.split(" ")[2] || event.location) : "情報なし"}
                    color={darkTheme ? "#ffffff" : "#000000"}
                    currencySymbol="¥"
                    details={event.description || "詳細情報なし"}
                    endDate={formatDateForCard(event.end_date)}
                    height="auto"
                    onClick={() => {
                        // クリックイベント
                        console.log(`Card clicked. Event ID from event object: ${event.event_id}, Type: ${typeof event.event_id}`);
                        console.log(`イベント詳細: ${event.event_id}`);
                        // 選択されたイベントIDをReduxストアに保存 (URLパラメータをメインとするが、念のため残すことも可能)
                        dispatch({ type: 'searchEvent/setEventId', payload: event.event_id });
                        // ページに遷移 (URLにevent_idを含める)
                        ionRouter.push(`/event/${event.event_id}`);
                    }}
                    paying={event.reward ? Number.parseInt(event.reward.replace(/[^0-9]/g, ""), 10) || 0 : 0}
                    startDate={formatDateForCard(event.start_date)}
                    tags={parseTags(event.tags).map(tag => ({
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

// バックエンドの日付文字列をフロントエンド用にフォーマットする関数
function formatDateForCard(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD形式
    } catch (error) {
        console.error('Date formatting error:', error);
        return dateString; // フォーマットに失敗した場合は元の文字列を返す
    }
}

// バックエンドのtags（JSON文字列または文字列配列）をフロントエンド用の文字列配列に変換する関数
function parseTags(tagsData: string | string[]): string[] {
    const processItem = (item: any): string | null => {
        if (typeof item === 'string') {
            return item;
        }
        if (typeof item === 'object' && item !== null) {
            if (typeof (item as any).label === 'string') {
                return (item as any).label;
            }
        }
        // If it's not a string and not an object with a string label, try to stringify
        // but return null if it results in [object Object] to filter it out later
        const stringified = String(item);
        return stringified !== '[object Object]' ? stringified : null;
    };

    let processedTags: (string | null)[] = [];

    if (Array.isArray(tagsData)) {
        processedTags = tagsData.map(processItem);
    }
    else if (typeof tagsData === 'string') {
        if (!tagsData.trim()) {
            return [];
        }
        try {
            const parsed = JSON.parse(tagsData);
            if (Array.isArray(parsed)) {
                processedTags = parsed.map(processItem);
            } else {
                // If parsed is not an array, process it as a single item
                processedTags = [processItem(parsed)];
            }
        } catch (e) {
            // Not a valid JSON string (and it's not empty).
            // Treat the original string as a single tag.
            processedTags = [tagsData]; // Keep original string as is
        }
    }

    return processedTags.filter((tag): tag is string => tag !== null && tag.trim() !== '');
}