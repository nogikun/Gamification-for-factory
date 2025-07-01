import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/**
 * AI診断結果の表示プロパティ
 */
export interface AiDiagnosisResultProps {
  /** 診断結果のタイトル */
  title?: string;
  /** 診断結果の説明文 */
  description?: string;
  /** カードの表示スタイル */
  variant?: 'outlined' | 'elevation';
  /** カードの影の深度（variant='elevation'の場合のみ有効） */
  elevation?: number;
  /** カードの角の丸み */
  borderRadius?: number;
  /** 外側の余白 */
  padding?: number;
}

/**
 * AI診断結果を表示するカードコンポーネント
 */
export default function AiDiagnosisResult({
  title = "AI診断結果",
  description = "あなたは町工場などでのコツコツとした作業にこなす力に優れています。細かな工程や反復作業にも高い集中力を維持し、最後まで努力を積み重ねることができます。",
  variant = 'elevation',
  elevation = 2,
  borderRadius = 2,
  padding = 2,
}: AiDiagnosisResultProps) {

  return (
    <Box sx={{ p: padding }}>
      <Card 
        variant={variant}
        elevation={variant === 'elevation' ? elevation : 0}
        sx={{ borderRadius: borderRadius }}
      >
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
