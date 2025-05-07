import React, { useState } from 'react';
import { useIonRouter, IonToast } from '@ionic/react';

// mui
import { TextField, Button, ThemeProvider, createTheme, Typography } from '@mui/material';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setServerUrl } from '../../redux/serverSlice'; // setServerUrlアクションをインポート

// css
import './HostServerCard.css'; // cssファイルのインポート

export interface HostServerCardProps {
    host: string;
    port: string;
    width?: string;
    height?: string;
    title?: string;
}

export const HostServerCard = ({
    host,
    port,
    width = '250px',
    height = '100%',
    title = '接続先サーバー設定',
    ...props
}: HostServerCardProps) => {
    const dispatch = useDispatch();
    const hostState = useSelector((state: RootState) => state.server.host);
    const portState = useSelector((state: RootState) => state.server.port);
    const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

    const [inputHost, setInputHost] = useState(hostState); // ホスト入力用のローカルステート
    const [inputPort, setInputPort] = useState(portState); // ポート入力用のローカルステート
    const [showToast, setShowToast] = useState(false); // トースト表示用の状態
    
    // ダークモードに基づいてテーマを作成
    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            // ダークモード時のカスタム色設定
            ...(isDarkMode ? {
                text: {
                    primary: '#ffffff',
                    secondary: '#b3b3b3',
                },
                background: {
                    paper: '#333333',
                    default: '#121212',
                }
            } : {})
        },
    });
    
    const router = useIonRouter();
    const handleClick = () => {
        // サーバーのURLを更新するアクションをディスパッチ
        dispatch(setServerUrl({
            host: inputHost,
            port: inputPort,
        }));
        console.log("サーバーのURLが更新されました:", inputHost);
        console.log("ポート番号が更新されました:", inputPort);

        // トースト通知を表示
        setShowToast(true);
        
        // // ホーム画面に遷移
        // router.push('/home');
    }
    return (
        <div 
        className="host-server-card"
        style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px',
            width: `${width}`,
            height: `${height}`,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: isDarkMode ? '#333333' : '#ffffff'
        }}>
            <ThemeProvider theme={theme}>
                {/* タイトルを追加 */}
                <Typography 
                    variant="h6" 
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                        width: '100%',
                        marginBottom: '20px',
                        color: isDarkMode ? '#ffffff' : '#333333',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >
                    {title}
                </Typography>

                <TextField
                    fullWidth={true}
                    label="Host Server"
                    variant="outlined"
                    value={inputHost}
                    onChange={(e) => setInputHost(e.target.value)}
                    InputLabelProps={{
                        style: { color: isDarkMode ? '#b3b3b3' : undefined },
                    }}
                    InputProps={{
                        style: { color: isDarkMode ? '#ffffff' : undefined },
                    }}
                    sx={{
                        marginBottom: '15px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: isDarkMode ? '#555555' : undefined,
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? '#777777' : undefined,
                            },
                        }
                    }}
                />
                <TextField
                    fullWidth={true}
                    label="Port"
                    variant="outlined"
                    value={inputPort}
                    onChange={(e) => setInputPort(e.target.value)}
                    InputLabelProps={{
                        style: { color: isDarkMode ? '#b3b3b3' : undefined },
                    }}
                    InputProps={{
                        style: { color: isDarkMode ? '#ffffff' : undefined },
                    }}
                    sx={{
                        marginBottom: '15px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: isDarkMode ? '#555555' : undefined,
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? '#777777' : undefined,
                            },
                        }
                    }}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleClick}
                    sx={{
                        backgroundColor: isDarkMode ? '#4a6da7' : undefined,
                        '&:hover': {
                            backgroundColor: isDarkMode ? '#385990' : undefined,
                        }
                    }}
                >
                    設定を保存
                </Button>
            </ThemeProvider>
            
            {/* サーバー設定変更通知のトースト */}
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={`サーバー設定を更新しました - サーバー: ${inputHost}, ポート: ${inputPort}`}
                duration={2000}
                position="top"
                color="light"
            />
        </div>
    );
}

// デフォルトエクスポートを追加
export default HostServerCard;