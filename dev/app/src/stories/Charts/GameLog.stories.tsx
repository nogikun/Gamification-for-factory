import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '../../redux/store';
import GameLog from './GameLog';
import StarIcon from '@mui/icons-material/Star';
import RewardIcon from '@mui/icons-material/EmojiEvents';

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

// カスタムログデータ
const customLogs = [
  { date: '5/1', icon: <StarIcon />, color: '#FFD700', text: '新しいアチーブメントを獲得しました！' },
  { date: '5/2', icon: <RewardIcon />, color: '#FF6B35', text: 'イベントに参加しました' },
  { date: '5/3', icon: <StarIcon />, color: '#32CD32', text: 'レベルアップしました！' },
];

const meta: Meta<typeof GameLog> = {
  title: 'Charts/GameLog',
  component: GameLog,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'ゲームログを表示するコンポーネントです。ログデータ、タイトル、表示件数などをカスタマイズできます。'
      }
    }
  },
  argTypes: {
    title: { control: 'text', description: 'セクションのタイトル' },
    maxItems: { control: { type: 'number', min: 1, max: 20 }, description: '表示する最大アイテム数' },
    titleAlign: { control: { type: 'select' }, options: ['left', 'center', 'right'], description: 'タイトルの配置' },
    elevation: { control: { type: 'range', min: 0, max: 24 }, description: 'カードの影の深度' },
    borderRadius: { control: { type: 'range', min: 0, max: 20 }, description: 'カードの角の丸み' },
    spacing: { control: { type: 'range', min: 0, max: 5 }, description: 'アイテム間のスペース' },
    horizontalMargin: { control: { type: 'range', min: 0, max: 10 }, description: '水平マージン' },
    avatarSize: { control: { type: 'range', min: 16, max: 64 }, description: 'アバターのサイズ' },
    width: { control: { type: 'range', min: 200, max: 800 }, description: 'コンポーネントの幅' }
  },
  args: {
    title: 'ゲームログ',
    maxItems: 10,
    titleAlign: 'center',
    elevation: 2,
    borderRadius: 2,
    spacing: 1,
    horizontalMargin: 2,
    avatarSize: 32,
    width: 400
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
};

export const CustomData: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
  args: {
    logs: customLogs,
  },
};

export const LimitedItems: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
  args: {
    maxItems: 3,
  },
};

export const LeftAligned: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
  args: {
    titleAlign: 'left',
  },
};

export const LargeAvatars: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
  args: {
    avatarSize: 48,
  },
};

export const DarkMode: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="dark"><Story /></ReduxWrapper>],
};

export {};