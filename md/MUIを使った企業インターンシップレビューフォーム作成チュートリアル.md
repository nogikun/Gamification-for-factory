<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# MUIを使った企業インターンシップレビューフォーム作成チュートリアル

Ionic + MUIでの企業インターンシップレビューフォーム実装の包括的なガイドです。以下のサンプルデータ形式に基づいてフォームを作成する方法を、ステップごとに詳しく解説します。

## 概要

MUI（Material UI）を使用してReactベースのレビューフォームを作成します。星評価、テキスト入力、バリデーション、状態管理、通知機能など、実用的なフォームに必要な要素を網羅的に実装していきます[1][2][3]。

## 必要な依存関係のインストール

### 基本ライブラリのインストール

```bash
# MUIの基本ライブラリ
npm install @mui/material @emotion/react @emotion/styled

# アイコンライブラリ
npm install @mui/icons-material

# 日付処理
npm install @mui/x-date-pickers date-fns

# React状態管理用（既にある場合はスキップ）
npm install react react-dom
```


### プロジェクト構成

```
src/
├── components/
│   └── InternshipReviewForm.tsx
├── hooks/
│   └── useFormValidation.ts
├── utils/
│   └── api.ts
└── types/
    └── review.ts
```


## ステップ1: TypeScript型定義の作成

`src/types/review.ts`

```typescript
// レビューデータの型定義
export interface InternshipReview {
  application_id: string;
  reviewer_id: string;
  rating: number;
  comment: string;
  review_id?: string;
  created_at?: string;
  updated_at?: string;
}

// フォームの状態管理用型定義
export interface FormData {
  applicationId: string;
  reviewerId: string;
  rating: number;
  comment: string;
}

// バリデーションエラー用型定義
export interface ValidationErrors {
  applicationId?: string;
  reviewerId?: string;
  rating?: string;
  comment?: string;
}
```


## ステップ2: バリデーション関数の作成

`src/hooks/useFormValidation.ts`

```typescript
import { useState, useCallback } from 'react';
import { FormData, ValidationErrors } from '../types/review';

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // バリデーション関数
  const validateForm = useCallback((data: FormData): boolean => {
    const newErrors: ValidationErrors = {};

    // Application IDの検証
    if (!data.applicationId || data.applicationId.trim() === '') {
      newErrors.applicationId = 'アプリケーションIDは必須です';
    } else if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(data.applicationId)) {
      newErrors.applicationId = '有効なUUID形式で入力してください';
    }

    // Reviewer IDの検証
    if (!data.reviewerId || data.reviewerId.trim() === '') {
      newErrors.reviewerId = 'レビュアーIDは必須です';
    } else if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(data.reviewerId)) {
      newErrors.reviewerId = '有効なUUID形式で入力してください';
    }

    // 評価の検証
    if (data.rating === 0) {
      newErrors.rating = '評価を選択してください';
    } else if (data.rating < 1 || data.rating > 5) {
      newErrors.rating = '評価は1から5の間で選択してください';
    }

    // コメントの検証
    if (!data.comment || data.comment.trim() === '') {
      newErrors.comment = 'コメントは必須です';
    } else if (data.comment.length < 10) {
      newErrors.comment = 'コメントは10文字以上で入力してください';
    } else if (data.comment.length > 1000) {
      newErrors.comment = 'コメントは1000文字以下で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  return { errors, validateForm, setErrors };
};
```


## ステップ3: API接続関数の作成

`src/utils/api.ts`

```typescript
import { InternshipReview } from '../types/review';

// APIベースURLの設定
const API_BASE_URL = 'http://localhost:8000'; // FastAPIサーバーのURL

// レビュー送信関数
export const submitReview = async (reviewData: Omit<InternshipReview, 'review_id' | 'created_at' | 'updated_at'>): Promise<InternshipReview> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // ngrokトンネルの場合の対応
    if (API_BASE_URL.includes('ngrok')) {
      headers['ngrok-skip-browser-warning'] = 'true';
      headers['User-Agent'] = 'internship-review-form/1.0';
      headers['X-Forwarded-For'] = '127.0.0.1';
      headers.Accept = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API submission error:', error);
    throw error;
  }
};
```


## ステップ4: メインフォームコンポーネントの作成

`src/components/InternshipReviewForm.tsx`

```typescript
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  Paper,
  Rating,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Alert,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { useFormValidation } from '../hooks/useFormValidation';
import { submitReview } from '../utils/api';
import { FormData } from '../types/review';

// 評価ラベルの定義
const ratingLabels: { [key: number]: string } = {
  1: '非常に不満',
  2: '不満',
  3: '普通',
  4: '満足',
  5: '非常に満足',
};

interface InternshipReviewFormProps {
  darkMode?: boolean;
  onSubmitSuccess?: (reviewData: any) => void;
}

export const InternshipReviewForm: React.FC<InternshipReviewFormProps> = ({
  darkMode = false,
  onSubmitSuccess,
}) => {
  // 状態管理
  const [formData, setFormData] = useState<FormData>({
    applicationId: '',
    reviewerId: '',
    rating: 0,
    comment: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(-1);
  
  // スナックバー（通知）の状態
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // バリデーションフック
  const { errors, validateForm, setErrors } = useFormValidation();

  // MUIテーマの設定
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  // フォーム入力値の変更処理
  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // エラーがある場合はクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // 評価変更処理
  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    const rating = newValue || 0;
    setFormData(prev => ({ ...prev, rating }));
    
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  // フォーム送信処理
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // バリデーション実行
    if (!validateForm(formData)) {
      setSnackbar({
        open: true,
        message: '入力内容に誤りがあります。修正してください。',
        severity: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        application_id: formData.applicationId,
        reviewer_id: formData.reviewerId,
        rating: formData.rating,
        comment: formData.comment,
      };

      const result = await submitReview(reviewData);
      
      // 成功時の処理
      setSnackbar({
        open: true,
        message: 'レビューが正常に送信されました。ありがとうございます！',
        severity: 'success',
      });

      // フォームをリセット
      setFormData({
        applicationId: '',
        reviewerId: '',
        rating: 0,
        comment: '',
      });

      // 親コンポーネントのコールバック実行
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }

    } catch (error) {
      console.error('Submit error:', error);
      setSnackbar({
        open: true,
        message: `送信エラー: ${error instanceof Error ? error.message : '不明なエラーが発生しました'}`,
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // スナックバーを閉じる処理
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
        <Card>
          <CardContent>
            {/* ヘッダー */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                インターンシップレビュー
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                参加されたインターンシップについてのご感想をお聞かせください
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* フォーム */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={4}>
                
                {/* アプリケーションID入力 */}
                <FormControl fullWidth error={!!errors.applicationId}>
                  <TextField
                    label="アプリケーションID"
                    placeholder="例: 4a0545ff-6982-4b1e-94f6-d7ec11ec283a"
                    value={formData.applicationId}
                    onChange={handleInputChange('applicationId')}
                    error={!!errors.applicationId}
                    helperText={errors.applicationId || 'インターンシップ応募時に発行されたIDを入力してください'}
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>

                {/* レビュアーID入力 */}
                <FormControl fullWidth error={!!errors.reviewerId}>
                  <TextField
                    label="レビュアーID"
                    placeholder="例: 55555555-5555-5555-5555-555555555555"
                    value={formData.reviewerId}
                    onChange={handleInputChange('reviewerId')}
                    error={!!errors.reviewerId}
                    helperText={errors.reviewerId || 'あなたのユーザーIDを入力してください'}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>

                {/* 評価セクション */}
                <FormControl error={!!errors.rating}>
                  <Typography component="legend" variant="h6" gutterBottom>
                    総合評価
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating
                      name="internship-rating"
                      value={formData.rating}
                      onChange={handleRatingChange}
                      onChangeActive={(event, newHover) => {
                        setHoverRating(newHover);
                      }}
                      icon={<StarIcon fontSize="large" />}
                      emptyIcon={<StarBorderIcon fontSize="large" />}
                      size="large"
                      precision={1}
                    />
                    <Box sx={{ ml: 2, minWidth: 120 }}>
                      {ratingLabels[hoverRating !== -1 ? hoverRating : formData.rating] && (
                        <Typography variant="body2" color="text.secondary">
                          {ratingLabels[hoverRating !== -1 ? hoverRating : formData.rating]}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {errors.rating && (
                    <FormHelperText>{errors.rating}</FormHelperText>
                  )}
                </FormControl>

                {/* コメント入力 */}
                <FormControl fullWidth error={!!errors.comment}>
                  <TextField
                    label="レビューコメント"
                    placeholder="インターンシップの感想や学んだことなどを詳しくお聞かせください..."
                    value={formData.comment}
                    onChange={handleInputChange('comment')}
                    error={!!errors.comment}
                    helperText={errors.comment || `${formData.comment.length}/1000文字`}
                    multiline
                    rows={6}
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>

                {/* 送信ボタン */}
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                    sx={{
                      minWidth: 200,
                      py: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    {isSubmitting ? '送信中...' : 'レビューを送信'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* スナックバー（通知） */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </ThemeProvider>
  );
};

export default InternshipReviewForm;
```


## ステップ5: 使用方法とテスト

### アプリケーションでの使用例

```typescript
// App.tsx
import React from 'react';
import InternshipReviewForm from './components/InternshipReviewForm';

function App() {
  const handleSubmitSuccess = (reviewData: any) => {
    console.log('Review submitted successfully:', reviewData);
    // 成功時の追加処理（画面遷移など）
  };

  return (
    <div className="App">
      <InternshipReviewForm
        darkMode={false}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </div>
  );
}

export default App;
```


## ステップ6: 高度な機能の追加

### React Hook Formとの統合（オプション）

より高度なフォーム管理が必要な場合：

```bash
npm install react-hook-form @hookform/resolvers yup
```

```typescript
// src/components/AdvancedInternshipReviewForm.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Rating,
  Typography,
} from '@mui/material';

// バリデーションスキーマ
const schema = yup.object({
  applicationId: yup
    .string()
    .required('アプリケーションIDは必須です')
    .matches(
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
      '有効なUUID形式で入力してください'
    ),
  reviewerId: yup
    .string()
    .required('レビュアーIDは必須です')
    .matches(
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
      '有効なUUID形式で入力してください'
    ),
  rating: yup
    .number()
    .required('評価を選択してください')
    .min(1, '評価は1以上で選択してください')
    .max(5, '評価は5以下で選択してください'),
  comment: yup
    .string()
    .required('コメントは必須です')
    .min(10, 'コメントは10文字以上で入力してください')
    .max(1000, 'コメントは1000文字以下で入力してください'),
});

export const AdvancedInternshipReviewForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      applicationId: '',
      reviewerId: '',
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const reviewData = {
        application_id: data.applicationId,
        reviewer_id: data.reviewerId,
        rating: data.rating,
        comment: data.comment,
      };
      
      await submitReview(reviewData);
      reset();
      // 成功処理
    } catch (error) {
      // エラー処理
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="applicationId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="アプリケーションID"
            error={!!errors.applicationId}
            helperText={errors.applicationId?.message}
            fullWidth
            margin="normal"
          />
        )}
      />

      <Controller
        name="reviewerId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="レビュアーID"
            error={!!errors.reviewerId}
            helperText={errors.reviewerId?.message}
            fullWidth
            margin="normal"
          />
        )}
      />

      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <Box>
            <Typography component="legend">評価</Typography>
            <Rating
              {...field}
              onChange={(event, newValue) => {
                field.onChange(newValue);
              }}
            />
            {errors.rating && (
              <Typography color="error" variant="caption">
                {errors.rating.message}
              </Typography>
            )}
          </Box>
        )}
      />

      <Controller
        name="comment"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="コメント"
            error={!!errors.comment}
            helperText={errors.comment?.message}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        fullWidth
        sx={{ mt: 2 }}
      >
        送信
      </Button>
    </Box>
  );
};
```


## ステップ7: カスタマイズとスタイリング

### テーマのカスタマイズ

```typescript
// src/theme/customTheme.ts
import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", "Noto Sans JP", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});
```


## ベストプラクティスとトラブルシューティング

### パフォーマンス最適化

1. **メモ化の活用**[4][5]：
```typescript
import { memo, useCallback, useMemo } from 'react';

const OptimizedComponent = memo(({ data, onSubmit }) => {
  const memoizedData = useMemo(() => processData(data), [data]);
  
  const handleSubmit = useCallback((formData) => {
    onSubmit(formData);
  }, [onSubmit]);

  return (
    // コンポーネント内容
  );
});
```

2. **バリデーションの最適化**[6]：
```typescript
// デバウンス機能付きバリデーション
import { useDebounce } from 'use-debounce';

const useValidationWithDebounce = (value: string, delay: number = 300) => {
  const [debouncedValue] = useDebounce(value, delay);
  
  return useMemo(() => {
    return validateField(debouncedValue);
  }, [debouncedValue]);
};
```


### エラーハンドリング

1. **ネットワークエラー対応**[7]：
```typescript
const handleNetworkError = (error: Error) => {
  if (error.name === 'NetworkError') {
    setSnackbar({
      open: true,
      message: 'ネットワーク接続を確認してください',
      severity: 'error',
    });
  } else if (error.message.includes('timeout')) {
    setSnackbar({
      open: true,
      message: 'タイムアウトが発生しました。再度お試しください',
      severity: 'error',
    });
  }
};
```

2. **フォーム状態の復元**：
```typescript
// ローカルストレージを活用した下書き保存
const saveDraft = useCallback((formData: FormData) => {
  localStorage.setItem('internship-review-draft', JSON.stringify(formData));
}, []);

const loadDraft = useCallback(() => {
  const saved = localStorage.getItem('internship-review-draft');
  return saved ? JSON.parse(saved) : null;
}, []);
```


### アクセシビリティの考慮

1. **ARIA属性の適切な使用**[8]：
```typescript
<Rating
  name="internship-rating"
  value={rating}
  onChange={handleRatingChange}
  aria-label="インターンシップの総合評価"
  aria-describedby="rating-help-text"
/>
<Typography id="rating-help-text" variant="caption">
  1から5までの星で評価してください
</Typography>
```

2. **キーボードナビゲーション対応**：
```typescript
<TextField
  onKeyDown={(e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  }}
/>
```


## 結論

このチュートリアルでは、MUIを使用して企業インターンシップレビューフォームを作成する包括的な方法を解説しました。基本的なフォーム実装から高度な機能まで、実際の開発現場で使える実用的なアプローチを提供しています[1][2][3]。

主要なポイント：

- **型安全性**: TypeScriptを活用した堅牢な型定義
- **バリデーション**: 包括的な入力検証とエラーハンドリング
- **ユーザーエクスペリエンス**: 直感的なUI設計と適切なフィードバック
- **拡張性**: カスタマイズ可能な設計とモジュラー構造
- **アクセシビリティ**: 誰でも使いやすいインターフェース

このフォームを基盤として、プロジェクトの要件に応じてさらなるカスタマイズや機能追加を行うことができます[9][10][11]。

