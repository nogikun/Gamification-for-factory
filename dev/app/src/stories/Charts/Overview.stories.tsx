import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Paper, Typography, Box } from '@mui/material';
import { store } from '../../redux/store';
import InternParticipantsHorizontalBarChart from './InternParticipantsHorizontalBarChart';
import AiDiagnosisResult from './AiDiagnosisResult';
import CompanyEvaluations from './CompanyEvaluations';
import GameLog from './GameLog';

// テーマ設定
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

// Storybook用のReduxプロバイダーラッパー
const ReduxWrapper = ({ children, theme = 'light' }: { children: React.ReactNode; theme?: 'light' | 'dark' }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <div style={{ 
        padding: '20px', 
        backgroundColor: theme === 'light' ? '#f5f5f5' : '#121212',
        minHeight: '100vh',
        color: theme === 'light' ? '#000' : '#fff'
      }}>
        {children}
      </div>
    </ThemeProvider>
  </Provider>
);

// 統合コンポーネント
const ChartsOverview = ({ theme = 'light' }: { theme?: 'light' | 'dark' }) => (
  <Box sx={{ flexGrow: 1 }}>
    <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
      Charts Components Overview
    </Typography>
    
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3,
      '@media (min-width: 900px)': {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'auto auto',
        gap: 3
      }
    }}>
      {/* インターン参加回数グラフ */}
      <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          インターン参加回数チャート
        </Typography>
        <InternParticipantsHorizontalBarChart />
      </Paper>

      {/* AI診断結果 */}
      <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          AI診断結果カード
        </Typography>
        <AiDiagnosisResult />
      </Paper>

      {/* 企業評価 */}
      <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          企業からの評価
        </Typography>
        <CompanyEvaluations />
      </Paper>

      {/* ゲームログ */}
      <Paper elevation={3} sx={{ p: 2, height: '100%', maxHeight: '600px', overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          ゲームログ
        </Typography>
        <GameLog />
      </Paper>
    </Box>
  </Box>
);

const meta: Meta<typeof ChartsOverview> = {
  title: 'Charts/Overview',
  component: ChartsOverview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
全チャートコンポーネントの統合表示です。

## 含まれるコンポーネント

### 1. InternParticipantsHorizontalBarChart
- インターン参加回数を表示する横棒グラフ
- MUI X-Charts使用

### 2. AiDiagnosisResult  
- AI診断結果を表示するカード
- Material-UI Card使用

### 3. CompanyEvaluations
- 企業からの評価リスト
- Rating コンポーネント使用

### 4. GameLog
- ゲームログの表示
- Avatar とアイコン使用

## 機能
- ✅ レスポンシブGrid レイアウト
- ✅ ライト/ダークモード対応
- ✅ 統一されたデザインシステム
- ✅ Redux状態管理統合

## 使用技術
- React + TypeScript
- Material-UI (MUI)
- MUI X-Charts
- Redux Toolkit
        `
      }
    }
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'テーマモード（ライト/ダーク）',
      table: {
        category: 'Appearance',
        type: { summary: 'string' }
      }
    }
  },
  args: {
    theme: 'light'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトストーリー
export const Default: Story = {
  decorators: [
    (Story, { args }) => (
      <ReduxWrapper theme={args.theme}>
        <Story />
      </ReduxWrapper>
    ),
  ],
  args: {
    theme: 'light'
  }
};

// ダークモード
export const DarkMode: Story = {
  decorators: [
    (Story, { args }) => (
      <ReduxWrapper theme={args.theme}>
        <Story />
      </ReduxWrapper>
    ),
  ],
  args: {
    theme: 'dark'
  }
};

// テーマ比較（上下分割）
export const ThemeComparison: Story = {
  decorators: [
    (Story) => (
      <div>
        <div style={{ marginBottom: '40px' }}>
          <Typography variant="h4" align="center" style={{ marginBottom: '20px' }}>
            Light Theme
          </Typography>
          <ReduxWrapper theme="light">
            <ChartsOverview theme="light" />
          </ReduxWrapper>
        </div>
        
        <div>
          <Typography variant="h4" align="center" style={{ marginBottom: '20px', color: '#fff' }}>
            Dark Theme
          </Typography>
          <ReduxWrapper theme="dark">
            <ChartsOverview theme="dark" />
          </ReduxWrapper>
        </div>
      </div>
    ),
  ]
};

// モバイルビュー
export const MobileView: Story = {
  decorators: [
    (Story, { args }) => (
      <ReduxWrapper theme={args.theme}>
        <div style={{ maxWidth: '375px', margin: '0 auto', border: '1px solid #ccc' }}>
          <Story />
        </div>
      </ReduxWrapper>
    ),
  ],
  args: {
    theme: 'light'
  }
};

// タブレットビュー
export const TabletView: Story = {
  decorators: [
    (Story, { args }) => (
      <ReduxWrapper theme={args.theme}>
        <div style={{ maxWidth: '768px', margin: '0 auto', border: '1px solid #ccc' }}>
          <Story />
        </div>
      </ReduxWrapper>
    ),
  ],
  args: {
    theme: 'light'
  }
};

// デスクトップビュー
export const DesktopView: Story = {
  decorators: [
    (Story, { args }) => (
      <ReduxWrapper theme={args.theme}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', border: '1px solid #ccc' }}>
          <Story />
        </div>
      </ReduxWrapper>
    ),
  ],
  args: {
    theme: 'light'
  }
};
