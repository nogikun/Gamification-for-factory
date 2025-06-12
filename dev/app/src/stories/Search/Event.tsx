import React, { useState, useEffect } from 'react';
import { useIonRouter } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import { useParams } from 'react-router-dom';

// MUI Components
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { type AlertProps as MuiAlertProps } from '@mui/material/Alert'; // Renamed AlertProps to avoid conflict

// MUI Icons
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School'; // 資格・学習のアイコン
import PaymentsIcon from '@mui/icons-material/Payments'; // 報酬のアイコン
import BusinessIcon from '@mui/icons-material/Business'; // 会社・組織のアイコン
import InfoIcon from '@mui/icons-material/Info'; // 詳細のアイコン
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // 資格要件のアイコン

// css
import './Event.css';
import { MotionPhotosAuto } from '@mui/icons-material';

// local
import { apiConnector } from '@/scripts/apiConnector'; // APIコネクタをインポート

// タグオブジェクトの型定義
interface TagData {
    color: string;
    label: string;
}

// APIから返されるイベントデータの型定義
interface EventData {
    event_id: string;
    company_id: string;
    event_type: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    reward: string;
    required_qualifications: string[];
    available_spots: number;
    created_at: string;
    updated_at: string;
    tags: TagData[];  // タグオブジェクトの配列として定義
    image: string;
}

// ★ 新しい関数: IDで単一イベントを取得 (GETリクエスト) - apiConnectorを使用してngrokヘッダー自動適用
async function fetchEventById(eventId: string, host: string, port?: string): Promise<EventData> {
    const endpoint = `/event/${eventId}`;
    
    // apiConnectorのbaseURLを一時的に更新
    const originalBaseURL = apiConnector.defaults.baseURL;
    const newBaseURL = port ? `${host}:${port}` : host;
    apiConnector.defaults.baseURL = newBaseURL;
    
    console.log('Requesting URL via apiConnector:', `${newBaseURL}${endpoint}`);
    
    try {
        // apiConnectorを使用（Axiosインターセプターでngrokヘッダーが自動適用される）
        const response = await apiConnector.get(endpoint);
        return response.data;
    } catch (error: unknown) {
        console.error("API request error:", error);
        
        let errorDetail = 'Failed to fetch event data';
        
        // errorがAxiosErrorかどうかをチェック
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { status: number; headers: Record<string, string>; data: unknown } };
            if (axiosError.response) {
                const contentType = axiosError.response.headers['content-type'];
                errorDetail = `HTTP error! status: ${axiosError.response.status}`;
                
                if (contentType && !contentType.includes("application/json")) {
                    errorDetail += `. Expected application/json but received ${contentType}`;
                }
                
                if (axiosError.response.data) {
                    if (typeof axiosError.response.data === 'string') {
                        // HTMLやテキストレスポンスの場合
                        console.error("Server response (text):", axiosError.response.data.substring(0, 500));
                        errorDetail += `. Response: ${axiosError.response.data.substring(0, 100)}...`;
                    } else {
                        errorDetail += `. Response: ${JSON.stringify(axiosError.response.data)}`;
                    }
                }
            }
        } else if (error && typeof error === 'object' && 'request' in error) {
            errorDetail += '. No response received from server';
        } else if (error && typeof error === 'object' && 'message' in error) {
            errorDetail += `. ${(error as { message: string }).message}`;
        }
        
        throw new Error(errorDetail);
    } finally {
        // baseURLを元に戻す
        apiConnector.defaults.baseURL = originalBaseURL;
    }
}

// コンポーネントの型定義
export interface EventProps {
    event_id?: string;
    zIndex?: number; // Storybookでのargs用
    onClick?: () => void;
}

// コンポーネントの定義(props値を受け取る)
export const Event = ({
    event_id: event_id_prop,
    zIndex = 1, // Storybookでのargs用、デフォルト値を設定
    onClick
}: EventProps) => {
    // router
    const ionRouter = useIonRouter();
    // Redux
    const dispatch = useDispatch();
    const darkTheme = useSelector((state: RootState) => state.theme.isDarkMode);
    const host = useSelector((state: RootState) => state.server.host);
    const portState = useSelector((state: RootState) => state.server.port);

    // useEffect
    useEffect(() => {
        // ホストとポートの変更を監視してAPIコネクタのベースURLを更新
        const newBaseUrl = portState ? `${host}:${portState}` : host;
        apiConnector.defaults.baseURL = newBaseUrl; // APIコネクタのベースURLを更新
        console.log(`Event.tsx: API base URL updated to: ${newBaseUrl}`);
    }, [host, portState]); // hostとportStateが変更されたときに実行

    // portをstring型に、未定義の場合はundefinedに
    const port: string | undefined = typeof portState === 'number' 
        ? String(portState) 
        : (typeof portState === 'string' ? portState : undefined);

    const params = useParams<{ eventIdFromUrl?: string }>(); // ★ URLパラメータを取得 (optional chain)
    const eventIdFromUrl = params.eventIdFromUrl;
    const eventIdFromRedux = useSelector((state: RootState) => state.searchEvent.eventId);

    // props -> URL -> Redux の優先順位でIDを決定
    const derivedEventId = event_id_prop || eventIdFromUrl || eventIdFromRedux;
    
    console.log(`Event.tsx: prop event_id: ${event_id_prop}, from URL: ${eventIdFromUrl}, from Redux: ${eventIdFromRedux}, derived currentEventId: ${derivedEventId}`);

    // currentEventIdをステートとして管理し、derivedEventIdの変更を監視して更新
    const [currentEventId, setCurrentEventId] = useState<string | undefined>(derivedEventId);

    useEffect(() => {
        const newId = event_id_prop || eventIdFromUrl || eventIdFromRedux;
        if (newId !== currentEventId) {
            setCurrentEventId(newId);
            console.log(`Event.tsx: currentEventId state updated to: ${newId}`);
        }
    }, [event_id_prop, eventIdFromUrl, eventIdFromRedux, currentEventId]); // currentEventIdも依存配列に含めて自身の更新ループを防ぐ

    // イベントデータ状態管理
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false); // フォーム表示状態
    const [formData, setFormData] = useState({ // フォームデータ
        lastName: '',
        firstName: '',
        email: '',
        phoneNumber: '',
        birthDate: '',
        address: '',
        licenses: '',
        motivation: '',
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

    const AlertComponent = React.forwardRef<HTMLDivElement, MuiAlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // タグの色を取得する関数
    const getTagColor = (tag: TagData | string): string => {
        // タグオブジェクトの場合はcolorプロパティを使用
        if (typeof tag === 'object' && tag.color) {
            return tag.color;
        }
        // 文字列の場合はハッシュ値から色を生成 (後方互換性)
        const tagString = typeof tag === 'string' ? tag : (tag as TagData).label || '';
        const hash = tagString.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        return `hsl(${hash % 360}, 70%, 60%)`;
    };

    // タグのラベルを取得する関数
    const getTagLabel = (tag: TagData | string): string => {
        if (typeof tag === 'object' && tag.label) {
            return tag.label;
        }
        return typeof tag === 'string' ? tag : '';
    };
    
    // イベントデータを取得
    useEffect(() => {
        setLoading(true);
        setError(null);

        console.log(`Event.tsx useEffect triggered for data fetching. currentEventId: ${currentEventId}, typeof: ${typeof currentEventId}`);
        
        if (currentEventId && typeof currentEventId === 'string' && currentEventId.trim() !== "") {
            console.log(`Event.tsx: Attempting to fetch event with ID: ${currentEventId}`);
            fetchEventById(currentEventId, host, port)
                .then(data => {
                    // APIからのデータが単一オブジェクトであることを確認
                    if (data && typeof data === 'object' && !Array.isArray(data)) {
                        // EventData型にキャストする前に必要なプロパティが存在するか確認
                        // バックエンドのEventSchemaとフロントのEventDataの齟齬を吸収
                        const apiResponse = data as unknown as Record<string, unknown>;
                        console.log("Event.tsx: Raw apiResponse.tags:", apiResponse.tags);
                        
                        // tagsの処理を独立した関数にする
                        const processEventTags = (rawTags: unknown): TagData[] => {
                            let processedTags: TagData[] = [];
                            
                            // 配列の場合
                            if (Array.isArray(rawTags)) {
                                processedTags = rawTags.map((tag: unknown) => {
                                    if (typeof tag === 'object' && tag !== null) {
                                        const tagObj = tag as { label?: unknown; color?: unknown };
                                        if (tagObj.label) {
                                            return {
                                                label: String(tagObj.label),
                                                color: tagObj.color ? String(tagObj.color) : `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
                                            };
                                        }
                                    } else if (typeof tag === 'string') {
                                        const hash = tag.split('').reduce((acc: number, char: string) => {
                                            return char.charCodeAt(0) + ((acc << 5) - acc);
                                        }, 0);
                                        return {
                                            label: tag,
                                            color: `hsl(${hash % 360}, 70%, 60%)`
                                        };
                                    }
                                    return {
                                        label: String(tag),
                                        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
                                    };
                                });
                            }
                            // 文字列の場合
                            else if (typeof rawTags === 'string' && rawTags.trim() !== '') {
                                try {
                                    // JSONとしてパースを試みる
                                    const parsed = JSON.parse(rawTags);
                                    if (Array.isArray(parsed)) {
                                        // 配列の各要素を適切なTagData形式に変換
                                        processedTags = parsed.map((item: unknown) => {
                                            if (typeof item === 'object' && item !== null && 'label' in item) {
                                                const itemObj = item as { label: unknown; color?: unknown };
                                                return {
                                                    label: String(itemObj.label),
                                                    color: 'color' in item ? String((item as { color: unknown }).color) : `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
                                                };
                                            } else if (typeof item === 'string') {
                                                const hash = item.split('').reduce((acc: number, char: string) => {
                                                    return char.charCodeAt(0) + ((acc << 5) - acc);
                                                }, 0);
                                                return {
                                                    label: item,
                                                    color: `hsl(${hash % 360}, 70%, 60%)`
                                                };
                                            } else {
                                                return {
                                                    label: String(item),
                                                    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
                                                };
                                            }
                                        });
                                    } else {
                                        processedTags = [
                                            {
                                                label: String(parsed),
                                                color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
                                            }
                                        ];
                                    }
                                } catch (e) {
                                    // カンマ区切りの文字列として処理
                                    processedTags = rawTags.split(',')
                                        .map((t: string) => t.trim())
                                        .filter(Boolean)
                                        .map((tag: string) => {
                                            const hash = tag.split('').reduce((acc: number, char: string) => {
                                                return char.charCodeAt(0) + ((acc << 5) - acc);
                                            }, 0);
                                            return {
                                                label: tag,
                                                color: `hsl(${hash % 360}, 70%, 60%)`
                                            };
                                        });
                                }
                            }
                            
                            console.log("Event.tsx: Processed tags for EventData:", processedTags);
                            return processedTags;
                        };
                        
                        const transformedData: EventData = {
                            event_id: String(apiResponse.event_id ?? ''),
                            company_id: String(apiResponse.company_id ?? ''),
                            event_type: String(apiResponse.event_type ?? ''),
                            title: String(apiResponse.title ?? ''),
                            description: String(apiResponse.description ?? ''),
                            start_date: String(apiResponse.start_date ?? ''),
                            end_date: String(apiResponse.end_date ?? ''),
                            location: String(apiResponse.location ?? ''),
                            reward: String(apiResponse.reward ?? ''),
                            required_qualifications: Array.isArray(apiResponse.required_qualifications) ? apiResponse.required_qualifications.map(q => String(q)) : (typeof apiResponse.required_qualifications === 'string' ? [String(apiResponse.required_qualifications)] : []),
                            available_spots: typeof apiResponse.available_spots === 'number' ? apiResponse.available_spots : Number(apiResponse.available_spots) || 0,
                            created_at: String(apiResponse.created_at ?? ''),
                            updated_at: String(apiResponse.updated_at ?? ''),
                            tags: processEventTags(apiResponse.tags),
                            image: String(apiResponse.image ?? ''),
                        };
                        setEventData(transformedData);
                    } else {
                        // データ形式が予期しないものだった場合
                        console.error("Unexpected data format received:", data);
                        setError("Received unexpected data format for event details.");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching event details:', err);
                    setError(err.message || "Failed to fetch event details");
                    setLoading(false);
                });
        } else {
            console.log(`Event.tsx: Event ID is invalid or missing ('${currentEventId}'), skipping API call.`);
            setError("指定されたイベントIDの形式が正しくないか、見つかりません。");
            setLoading(false);
        }
    }, [currentEventId, host, port]); // 依存配列に currentEventId を追加

    // ローディング中
    if (loading) {
        return <div>Loading...</div>;
    }

    // エラー発生時
    if (error || !eventData) {
        // エラーがある場合はアラートをAPIに送信
        apiConnector.post('/debug/error-report', {
            error: error || "Event data not available",
            message: `Failed to fetch event details for ID: ${currentEventId}`,
            debug_info: "Event component",
            status_code: 500,
            timestamp: new Date().toISOString(),
        }).catch(err => {
            console.error('Error logging to API:', err);
        });

        return <Alert severity="error">Error: {error || "Event data not available."}</Alert>;
    }

    // MUIテーマの動的作成
    const muiTheme = createTheme({
        palette: {
            mode: darkTheme ? 'dark' : 'light',
        },
    });
    
    // 日付フォーマット関数
    const formatDate = (dateString: string | undefined) => { // undefinedを許容
        if (!dateString) return "N/A"; // dateStringがundefinedの場合の処理
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleFormInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyButtonClick = () => {
        setShowForm(true);
        // 元のonClickはここでは実行しないか、または別の形で利用
    };

    const initialFormData = {
        lastName: '',
        firstName: '',
        email: '',
        phoneNumber: '',
        birthDate: '',
        address: '',
        licenses: '',
        motivation: '',
    };

    const handleFormSubmit = async () => { // asyncキーワードを追加
        // APIエンドポイント（仮）
        const submissionEndpoint = "/join-event";
        const url = port ? `${host}:${port}${submissionEndpoint}` : `${host}${submissionEndpoint}`;

        const submissionData = {
            applicant: {
                applicant_id: `demo-applicant-${Date.now()}`, // Placeholder
                company_id: 'demo-company-001', // Placeholder
                event_id: currentEventId,
                name: `${formData.firstName} ${formData.lastName}`,
                phone_num: formData.phoneNumber,
                email: formData.email,
                birthdate: formData.birthDate ? formData.birthDate : null, // Ensure YYYY-MM-DD or null
                address: formData.address,
                qualifications: formData.licenses ? formData.licenses.split('\n') : [],
                motivation: formData.motivation,
                // applied_at is set by backend
            },
            event_id_model: {
                event_id: currentEventId,
            },
        };

        try {
            // ngrokヘッダーを準備（より確実な回避のため複数のヘッダーを使用）
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            
            // ngrokトンネルの場合、ブラウザ警告をスキップするヘッダーを追加
            if (url.includes('ngrok')) {
                headers['ngrok-skip-browser-warning'] = 'true';
                headers['User-Agent'] = 'ngrok-api-client/1.0';
                headers['X-Forwarded-For'] = '127.0.0.1';
                headers.Accept = 'application/json';
                console.log('Event: ngrokトンネル検出（参加申し込み）: 複数ヘッダーでブラウザ警告をスキップ');
            }
            
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                // const result = await response.json();
                // console.log('Application submitted successfully:', result);
                setSnackbarMessage('イベントへの参加申し込みが完了しました。');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setShowForm(false);
                setFormData(initialFormData); // Reset form
            } else {
                const errorData = await response.json();
                console.error('Failed to submit application:', errorData);
                setSnackbarMessage(`申し込みに失敗しました: ${errorData.detail || response.statusText}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (err) {
            console.error('Error submitting application:', err);
            setSnackbarMessage(`申し込み中にエラーが発生しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <div style={{ zIndex: zIndex, position: 'relative' }}>
            <ThemeProvider theme={muiTheme}>
                {/* イベントカード */}
                <Paper elevation={3} sx={{ p: 2, margin: 'auto', maxWidth: 700, flexGrow: 1 }}>
                    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 2 }}>
                        <CardMedia
                            component="img"
                            sx={{ width: { xs: '100%', md: 200 }, height: { xs: 200, md: 'auto' }, objectFit: 'cover' }}
                            image={eventData.image ? `data:image/png;base64,${eventData.image}` : 'https://via.placeholder.com/200'}
                            alt={eventData.title}
                        />
                        <CardContent sx={{ flex: 1 }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {eventData.title}
                            </Typography>
                            {eventData.tags && eventData.tags.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                    {eventData.tags.map((tag, index) => (
                                        <Chip 
                                            key={`${getTagLabel(tag)}-${index}`} 
                                            label={getTagLabel(tag)} 
                                            size="small" 
                                            sx={{ 
                                                backgroundColor: getTagColor(tag), 
                                                color: '#fff' 
                                            }} 
                                        />
                                    ))}
                                </Box>
                            )}
                            <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <BusinessIcon sx={{ mr: 1 }} /> {eventData.company_id} {/* 仮 */}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                                <PaymentsIcon sx={{ mr: 1 }} /> {eventData.reward}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <InfoIcon sx={{ mr: 1 }} /> イベント詳細
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {eventData.description}
                    </Typography>

                    <TableContainer component={Paper} sx={{ mb: 2 }} variant="outlined">
                        <Table aria-label="event details table">
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="row" sx={{ width: '30%', fontWeight: 'bold' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CalendarTodayIcon sx={{ mr: 1 }} /> 期間
                                        </Box>
                                    </TableCell>
                                    <TableCell>{formatDate(eventData.start_date)} - {formatDate(eventData.end_date)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocationOnIcon sx={{ mr: 1 }} /> 場所
                                        </Box>
                                    </TableCell>
                                    <TableCell>{eventData.location}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PeopleIcon sx={{ mr: 1 }} /> 募集人数
                                        </Box>
                                    </TableCell>
                                    <TableCell>{eventData.available_spots}名</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <SchoolIcon sx={{ mr: 1 }} /> 資格要件
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {eventData.required_qualifications && eventData.required_qualifications.length > 0 ? (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {eventData.required_qualifications.map((qualification) => (
                                                    <Chip 
                                                        key={qualification} 
                                                        label={qualification} 
                                                        size="small" 
                                                        icon={<CheckCircleOutlineIcon />} 
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">特になし</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* フォーム表示部分 */} 
                    {showForm && (
                        <Box component="form" sx={{ mt: 2, mb: 2, p: 2, border: '1px solid grey', borderRadius: 1 }}>
                            <Typography variant="h6" gutterBottom>参加申し込みフォーム</Typography>
                            <TextField
                                fullWidth
                                label="姓"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleFormInputChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="名"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleFormInputChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="メールアドレス"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleFormInputChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="電話番号"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleFormInputChange}
                                margin="normal"
                            />
                            <TextField
                                sx={{ 
                                    '& .MuiInputBase-root': { // TextFieldのルート要素（枠線や背景を含む部分）
                                        height: '56px', // heightを指定
                                    },
                                }}
                                fullWidth
                                label="生年月日"
                                name="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={handleFormInputChange}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                fullWidth
                                label="住所"
                                name="address"
                                value={formData.address}
                                onChange={handleFormInputChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="資格・スキル"
                                name="licenses"
                                value={formData.licenses}
                                onChange={handleFormInputChange}
                                margin="normal"
                                multiline
                                rows={3}
                            />
                            <TextField
                                fullWidth
                                label="応募動機"
                                name="motivation"
                                value={formData.motivation}
                                onChange={handleFormInputChange}
                                margin="normal"
                                multiline
                                rows={4}
                            />
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                onClick={handleFormSubmit}
                                sx={{ 
                                    mt: 2,
                                    padding: '10px 20px', // 上下のpaddingを10px、左右のpaddingを20pxに設定
                                    borderRadius: '25px', // 高さに応じて調整 (例: padding 10px * 2 + フォントサイズ等)
                                    fontSize: '1.1rem' // 少しフォントサイズを大きくする
                                }}
                            >
                                申し込む
                            </Button>
                        </Box>
                    )}
                    
                    {/* 「イベントに参加する」ボタン / フォーム表示時は非表示にする */} 
                    {!showForm && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                size="large" 
                                onClick={handleApplyButtonClick} // フォーム表示用の関数に変更
                                sx={{ 
                                    borderRadius: '50px',
                                    height: 'auto',
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                }}
                            >
                                イベントに参加する
                            </Button>
                        </Box>
                    )}
                </Paper>

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <AlertComponent onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </AlertComponent>
                </Snackbar>
            </ThemeProvider>
        </div>
    );
};

export default Event;