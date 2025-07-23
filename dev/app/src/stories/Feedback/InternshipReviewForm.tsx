import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { RootState } from '../../redux/store';
import './InternshipReviewForm.css';

// Types
interface FormData {
  applicationId: string;
  reviewerId: string;
  rating: number;
  comment: string;
}

interface ValidationErrors {
  applicationId?: string;
  reviewerId?: string;
  rating?: string;
  comment?: string;
}

interface InternshipReviewFormProps {
  darkMode?: boolean;
  onSubmitSuccess?: (reviewData: any) => void;
  backgroundColor?: string;
  width?: string;
  height?: string;
}

// Rating labels
const ratingLabels: { [key: number]: string } = {
  1: '非常に不満',
  2: '不満',
  3: '普通',
  4: '満足',
  5: '非常に満足',
};

export const InternshipReviewForm: React.FC<InternshipReviewFormProps> = ({
  darkMode = false,
  onSubmitSuccess,
  backgroundColor,
  width = '100%',
  height = 'auto',
}) => {
  // Redux state
  const theme = useSelector((state: RootState) => state.theme);
  const serverConfig = useSelector((state: RootState) => state.server);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    applicationId: '',
    reviewerId: '',
    rating: 0,
    comment: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(-1);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Theme setup
  const muiTheme = createTheme({
    palette: {
      mode: darkMode || theme.darkMode ? 'dark' : 'light',
    },
  });

  // Validation function
  const validateForm = (data: FormData): boolean => {
    const newErrors: ValidationErrors = {};

    // Application ID validation
    if (!data.applicationId || data.applicationId.trim() === '') {
      newErrors.applicationId = 'アプリケーションIDは必須です';
    } else if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(data.applicationId)) {
      newErrors.applicationId = '有効なUUID形式で入力してください';
    }

    // Reviewer ID validation
    if (!data.reviewerId || data.reviewerId.trim() === '') {
      newErrors.reviewerId = 'レビュアーIDは必須です';
    } else if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(data.reviewerId)) {
      newErrors.reviewerId = '有効なUUID形式で入力してください';
    }

    // Rating validation
    if (data.rating === 0) {
      newErrors.rating = '評価を選択してください';
    } else if (data.rating < 1 || data.rating > 5) {
      newErrors.rating = '評価は1から5の間で選択してください';
    }

    // Comment validation
    if (!data.comment || data.comment.trim() === '') {
      newErrors.comment = 'コメントは必須です';
    } else if (data.comment.length < 10) {
      newErrors.comment = 'コメントは10文字以上で入力してください';
    } else if (data.comment.length > 1000) {
      newErrors.comment = 'コメントは1000文字以下で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API submission function
  const submitReview = async (reviewData: any) => {
    const baseUrl = serverConfig.baseUrl || 'http://localhost:3000';
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // ngrok handling
      if (baseUrl.includes('ngrok')) {
        headers['ngrok-skip-browser-warning'] = 'true';
        headers['User-Agent'] = 'internship-review-form/1.0';
        headers['X-Forwarded-For'] = '127.0.0.1';
        headers.Accept = 'application/json';
      }

      const response = await fetch(`${baseUrl}/review`, {
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

  // Input change handler
  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error if exists
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Rating change handler
  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    const rating = newValue || 0;
    setFormData(prev => ({ ...prev, rating }));
    
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  // Form submission handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validation
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
      
      // Success handling
      setSnackbar({
        open: true,
        message: 'レビューが正常に送信されました。ありがとうございます！',
        severity: 'success',
      });

      // Reset form
      setFormData({
        applicationId: '',
        reviewerId: '',
        rating: 0,
        comment: '',
      });

      // Parent callback
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

  // Snackbar close handler
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div 
      className="InternshipReviewForm"
      style={{ 
        backgroundColor,
        width,
        height,
      }}
    >
      <ThemeProvider theme={muiTheme}>
        <Paper elevation={3} sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
          <Card>
            <CardContent>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  インターンシップレビュー
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  参加されたインターンシップについてのご感想をお聞かせください
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={4}>
                  
                  {/* Application ID input */}
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

                  {/* Reviewer ID input */}
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

                  {/* Rating section */}
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

                  {/* Comment input */}
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

                  {/* Submit button */}
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

          {/* Snackbar (notification) */}
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
    </div>
  );
};

export default InternshipReviewForm;