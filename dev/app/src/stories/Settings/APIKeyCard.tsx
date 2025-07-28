import React, { useState, useEffect } from 'react';
import { useIonRouter, IonToast } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';

// mui
import { 
    TextField, 
    Button, 
    ThemeProvider, 
    createTheme, 
    Typography, 
    IconButton,
    InputAdornment,
    Alert,
    Chip
} from '@mui/material';
import { Visibility, VisibilityOff, Delete, Save } from '@mui/icons-material';

// redux
import { setGeminiApiKey, clearGeminiApiKey } from '../../redux/envSlice';
import { validateGeminiApiKey } from '../../redux/envSlice';

// utils
import { 
    saveSpecificApiKey, 
    removeSpecificApiKey, 
    loadApiKeys, 
    maskApiKey,
    isEncryptionSupported 
} from '../../utils/apiKeyStorage';

// css
import './APIKeyCard.css';

// コンポーネントの型定義
export interface APIKeyCardProps {
    width?: string;
    height?: string;
    title?: string;
}

// コンポーネントの定義
export const APIKeyCard = ({
    width = '350px',
    height = '100%',
    title = 'Gemini API設定',
    ...props
}: APIKeyCardProps) => {
    const dispatch = useDispatch();
    
    // Redux state
    const geminiApiKey = useSelector((state: RootState) => state.env?.geminiApiKey || '');
    const isGeminiConfigured = useSelector((state: RootState) => state.env?.isGeminiConfigured || false);
    const isDarkMode = useSelector((state: RootState) => state.theme?.isDarkMode || false);
    
    // Local state
    const [inputApiKey, setInputApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'danger' | 'warning'>('success');
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState('');
    
    // ダークモードに基づいてテーマを作成
    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
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

    // コンポーネント初期化時にlocalStorageからデータを読み込み
    useEffect(() => {
        const loadStoredApiKeys = async () => {
            if (!isEncryptionSupported()) {
                setToastMessage('このブラウザは暗号化をサポートしていません');
                setToastColor('warning');
                setShowToast(true);
                return;
            }

            try {
                const storedKeys = await loadApiKeys();
                if (storedKeys?.geminiApiKey) {
                    dispatch(setGeminiApiKey(storedKeys.geminiApiKey));
                    setInputApiKey(storedKeys.geminiApiKey);
                }
            } catch (error) {
                console.error('APIキーの読み込みに失敗:', error);
            }
        };

        loadStoredApiKeys();
    }, [dispatch]);

    // APIキーのバリデーション
    const validateInput = (apiKey: string): boolean => {
        if (!apiKey.trim()) {
            setValidationError('APIキーを入力してください');
            return false;
        }
        
        if (!validateGeminiApiKey(apiKey)) {
            setValidationError('無効なGemini APIキー形式です（AIzaで始まる39文字）');
            return false;
        }
        
        setValidationError('');
        return true;
    };

    // APIキー保存処理
    const handleSave = async () => {
        if (!validateInput(inputApiKey)) {
            return;
        }

        setIsLoading(true);
        try {
            // Redux stateを更新
            dispatch(setGeminiApiKey(inputApiKey));
            
            // localStorageに暗号化して保存
            await saveSpecificApiKey('geminiApiKey', inputApiKey);
            
            setToastMessage('Gemini APIキーが正常に保存されました');
            setToastColor('success');
            setShowToast(true);
        } catch (error) {
            console.error('APIキーの保存に失敗:', error);
            setToastMessage('APIキーの保存に失敗しました');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    // APIキー削除処理
    const handleDelete = async () => {
        setIsLoading(true);
        try {
            // Redux stateをクリア
            dispatch(clearGeminiApiKey());
            
            // localStorageから削除
            await removeSpecificApiKey('geminiApiKey');
            
            // ローカル状態もクリア
            setInputApiKey('');
            setValidationError('');
            
            setToastMessage('Gemini APIキーが削除されました');
            setToastColor('success');
            setShowToast(true);
        } catch (error) {
            console.error('APIキーの削除に失敗:', error);
            setToastMessage('APIキーの削除に失敗しました');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    // 表示用APIキー（マスキング）
    const displayApiKey = showApiKey ? inputApiKey : maskApiKey(inputApiKey);

    return (
        <div 
            className="api-key-card"
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
            }}
        >
            <ThemeProvider theme={theme}>
                {/* タイトル */}
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

                {/* 設定状態表示 */}
                <div style={{ width: '100%', marginBottom: '15px', textAlign: 'center' }}>
                    <Chip 
                        label={isGeminiConfigured ? '設定済み' : '未設定'}
                        color={isGeminiConfigured ? 'success' : 'default'}
                        size="small"
                        sx={{
                            backgroundColor: isGeminiConfigured 
                                ? (isDarkMode ? '#2e7d32' : '#4caf50') 
                                : (isDarkMode ? '#424242' : '#e0e0e0'),
                            color: isDarkMode ? '#ffffff' : undefined
                        }}
                    />
                </div>

                {/* APIキー入力フィールド */}
                <TextField
                    fullWidth
                    label="Gemini API Key"
                    variant="outlined"
                    type={showApiKey ? 'text' : 'password'}
                    value={displayApiKey}
                    onChange={(e) => {
                        setInputApiKey(e.target.value);
                        setValidationError('');
                    }}
                    error={!!validationError}
                    helperText={validationError || 'AIzaで始まる39文字のAPIキーを入力'}
                    disabled={isLoading}
                    InputLabelProps={{
                        style: { color: isDarkMode ? '#b3b3b3' : undefined },
                    }}
                    InputProps={{
                        style: { color: isDarkMode ? '#ffffff' : undefined },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    edge="end"
                                    disabled={!inputApiKey}
                                    sx={{ color: isDarkMode ? '#b3b3b3' : undefined }}
                                >
                                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        marginBottom: '20px',
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

                {/* ボタン群 */}
                <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={isLoading || !inputApiKey.trim()}
                        fullWidth
                        sx={{
                            backgroundColor: isDarkMode ? '#4a6da7' : undefined,
                            '&:hover': {
                                backgroundColor: isDarkMode ? '#385990' : undefined,
                            }
                        }}
                    >
                        {isLoading ? '保存中...' : '保存'}
                    </Button>
                    
                    <Button 
                        variant="outlined" 
                        color="error" 
                        startIcon={<Delete />}
                        onClick={handleDelete}
                        disabled={isLoading || !isGeminiConfigured}
                        sx={{
                            minWidth: '100px',
                            borderColor: isDarkMode ? '#f44336' : undefined,
                            color: isDarkMode ? '#f44336' : undefined,
                            '&:hover': {
                                borderColor: isDarkMode ? '#d32f2f' : undefined,
                                backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : undefined,
                            }
                        }}
                    >
                        削除
                    </Button>
                </div>

                {/* 暗号化サポート警告 */}
                {!isEncryptionSupported() && (
                    <Alert 
                        severity="warning" 
                        sx={{ 
                            width: '100%', 
                            marginTop: '15px',
                            backgroundColor: isDarkMode ? '#333' : undefined,
                            color: isDarkMode ? '#fff' : undefined
                        }}
                    >
                        このブラウザは暗号化をサポートしていません
                    </Alert>
                )}
            </ThemeProvider>
            
            {/* 通知トースト */}
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
                position="top"
                color={toastColor}
            />
        </div>
    );
};
