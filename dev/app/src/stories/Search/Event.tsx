import React, { useState, useEffect } from 'react';
import { useIonRouter } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';

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
import MuiAlert, { AlertProps as MuiAlertProps } from '@mui/material/Alert'; // Renamed AlertProps to MuiAlertProps to avoid conflict

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
export interface EventProps {
  event_id?: string;
  zIndex?: number; // Storybookでのargs用
  onClick?: () => void;
}

// コンポーネントの定義(props値を受け取る)
export const Event = ({
    event_id,
    zIndex = 1, // Storybookでのargs用、デフォルト値を設定
    onClick // フォーム表示ロジックで利用方法を再検討
}: EventProps) => {
    // router
    const ionRouter = useIonRouter();
    // Redux
    const dispatch = useDispatch();
    const darkTheme = useSelector((state: RootState) => state.theme.isDarkMode);
    const host = useSelector((state: RootState) => state.server.host);
    const portState = useSelector((state: RootState) => state.server.port);

    // portをstring型に、未定義の場合はundefinedに
    const port: string | undefined = typeof portState === 'number' 
        ? String(portState) 
        : (typeof portState === 'string' ? portState : undefined);

    // event_idをpropsから、またはReduxストアから取得
    // Storybookからargsで渡されたevent_idを優先し、なければReduxストアから取得
    const currentEventId = event_id || useSelector((state: RootState) => state.searchEvent.eventId);

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
        
        if (currentEventId) { // currentEventId を使用
            fetchData(currentEventId, host, port, "/demo/get-event")
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
    }, [currentEventId, host, port]); // 依存配列に currentEventId を追加

    // ローディング中
    if (loading) {
        return <div>Loading...</div>;
    }

    // エラー発生時
    if (error || !eventData) {
        return <Alert severity="error">Error: {error || "Event data not available."}</Alert>;
    }

    // MUIテーマの動的作成
    const muiTheme = createTheme({
        palette: {
            mode: darkTheme ? 'dark' : 'light',
        },
    });
    
    // 日付フォーマット関数
    const formatDate = (dateString: string) => {
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
        const submissionEndpoint = "/demo/join-event";
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
                qualifications: formData.licenses ? formData.licenses.split('\\n') : [],
                // applied_at is set by backend
            },
            event_id_model: {
                event_id: currentEventId,
            },
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                            image={eventData.image ? `data:image;base64,${eventData.image}` : 'https://via.placeholder.com/200'}
                            alt={eventData.title}
                        />
                        <CardContent sx={{ flex: 1 }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {eventData.title}
                            </Typography>
                            {eventData.tags && eventData.tags.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                    {eventData.tags.map((tag) => (
                                        <Chip key={tag} label={tag} size="small" sx={{ backgroundColor: getTagColor(tag), color: '#fff' }} />
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
                                    <TableCell>{formatDate(eventData.start_time)} - {formatDate(eventData.end_time)}</TableCell>
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
                                    <TableCell>{eventData.max_participants}名</TableCell>
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