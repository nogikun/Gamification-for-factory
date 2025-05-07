import React from 'react';
import { useIonRouter } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import './Card.css'; // cssファイルのインポート

// mui
import { Card, CardContent, CardMedia, Box, Chip, Typography } from '@mui/material';
import { createTheme, ThemeOptions, alpha, getContrastRatio } from '@mui/material/styles';

// タグ情報の型
export interface TagProps {
    label: string;
    color: string;
}

export interface CardProps {
    jobID?: string; // ジョブID
    title: string; // タイトル
    campany: string; // 会社名
    details: string; // 詳細情報
    tags: TagProps[]; // タグ情報 [{key: "key", value: "value"}, ... , {key: "key", value: "value"}]
    startDate: string; // 開始日
    endDate: string; // 終了日
    paying: number; // 支払い金額
    currencySymbol?: "¥" | "$" | "€"; // 通貨記号
    backgroundColor?: string; // 背景色
    color?: string; // 文字色
    width?: string; // 幅
    height?: string; // 高さ
    borderRadius?: string; // 角の丸み
    bordered?: boolean; // ボーダーの有無
    borderColor?: string; // ボーダーの色
    borderWidth?: number; // ボーダーの太さ
    base64Image?: string; // Base64エンコードされた画像データ（PNG, JPEGなど）
    onClick: () => void; // クリック時のイベントハンドラー
}

export const CardComponent = ({
    jobID,
    title,
    campany,
    details,
    tags,
    startDate,
    endDate,
    paying,
    currencySymbol = "¥",
    backgroundColor,
    color,
    width,
    height,
    borderRadius,
    bordered,
    borderColor,
    borderWidth,
    base64Image,
    onClick = () => {},
}: CardProps) => {
    const ionRouter = useIonRouter();
    const dispatch = useDispatch();
    const menuIsOpen = useSelector((state: RootState) => state.menu.isOpen);

    return (
        <div style={{
            margin: "10px 10px 10px 10px",
        }}>
            <button
            type="button"
            style={{
                backgroundColor: 'transparent', // 透明なボタン
                border: 'none',
            }}
            onClick={() => {
                // クリックイベント
                console.log("jobID", jobID);
            }}>
                <Card
                variant="outlined"
                sx={{ 
                    p: 1.5, display: 'flex', flexWrap: 'wrap', zIndex: 1, 
                    width: "100%",
                    height: "100%",
                    borderRadius: 2, backgroundColor, color, borderColor, borderWidth, borderStyle: bordered ? "solid" : "none", cursor: "pointer" }}
                >
                <CardMedia
                    component="img"
                    width="140"
                    height="140"
                    // alt="123 Main St, Phoenix, AZ cover"
                    src={`data:image/png;base64,${base64Image}`} //pngのみ
                    sx={{
                    borderRadius: '6px',
                    width: { xs: '140px', sm: '140px', md: '140px' },
                    height: { xs: '140px', sm: '140px', md: '140px' },
                    }}
                />

                <Box sx={{
                    alignSelf: 'center', ml: 2, 
                    width: { xs: '48vw', sm: '50vw', md: '220px' },
                    textAlign: 'left', // テキストを左寄せ
                }}>
                    <Typography variant="h6" fontWeight="bold" noWrap gutterBottom>
                    {title}
                    </Typography>
                    <Typography variant="body2" fontWeight="regular">
                    {campany}
                    </Typography>
                    <Typography variant="body2" fontWeight="regular">
                    {startDate} ~ {endDate}
                    </Typography>
                    <Typography fontWeight="bold" noWrap gutterBottom>
                    {currencySymbol} {paying.toLocaleString()}
                    </Typography>
                    
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '7px',
                        marginTop: '5px',
                        marginBottom: '5px',
                    }}>
                        {tags.map((tag, index) => (
                            <Chip
                                key={tag.label} // 一意のキーを指定
                                size="small"
                                variant="outlined"
                                color='primary'
                                label={tag.label}
                                sx={{
                                    '.MuiChip-icon': { fontSize: 16, ml: '4px', color: 'success.500' },
                                    // bgcolor: tag.color,
                                    borderColor: tag.color,
                                    color: tag.color,
                                }}
                            />
                        ))}
                    </div>

                </Box>
                </Card>
            </button>
        </div>
    );
};