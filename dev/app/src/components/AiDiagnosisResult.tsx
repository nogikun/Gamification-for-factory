import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/**
 * AI診断結果を表示するカードコンポーネント
 */
export default function AiDiagnosisResult() {
  // 表示するテキスト（最初の画像にあったものを参考にしています）
  const diagnosisTitle = "AI診断結果";
  const diagnosisText = "あなたは町工場などでのコツコツとした作業にこなす力に優れています。細かな工程や反復作業にも高い集中力を維持し、最後まで努力を積み重ねることができます。";

  return (
    <Box sx={{ p: 2 }}> {/* カード全体の左右の余白を調整 */}
      <Card elevation={2} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            {diagnosisTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {diagnosisText}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}