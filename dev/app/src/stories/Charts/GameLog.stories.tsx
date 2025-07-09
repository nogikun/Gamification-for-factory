import type { Meta, StoryObj } from '@storybook/react';
<<<<<<< HEAD
import GameLog from './GameLog';
import { gameLogData } from '../../dummy_data/chartData';
=======
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
>>>>>>> c1a0b1a338e0e2acebc18e2b01b3b7dd497997d3

const meta: Meta<typeof GameLog> = {
  title: 'Charts/GameLog',
  component: GameLog,
  parameters: {
<<<<<<< HEAD
    layout: 'centered',
    docs: {
      description: {
        component: 'ゲームログの表示コンポーネント。ユーザーのゲーム活動履歴をタイムライン形式で表示します。',
      },
    },
  },
  argTypes: {
    logs: {
      description: 'ゲームログデータの配列',
      control: { type: 'object' },
    },
    title: {
      description: 'セクションのタイトル',
      control: { type: 'text' },
    },
    maxItems: {
      description: '表示する最大アイテム数',
      control: { type: 'number', min: 1, max: 20 },
    },
    titleAlign: {
      description: 'タイトルの配置',
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
    },
    elevation: {
      description: 'カードの影の深度',
      control: { type: 'number', min: 0, max: 24 },
    },
    borderRadius: {
      description: 'カードの角の丸み',
      control: { type: 'number', min: 0, max: 20 },
    },
    spacing: {
      description: 'カード間の間隔',
      control: { type: 'number', min: 0, max: 5 },
    },
    horizontalMargin: {
      description: '左右の余白',
      control: { type: 'number', min: 0, max: 50 },
    },
    avatarSize: {
      description: 'アバターのサイズ',
      control: { type: 'number', min: 20, max: 80 },
    },
  },
  tags: ['autodocs'],
=======
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
>>>>>>> c1a0b1a338e0e2acebc18e2b01b3b7dd497997d3
};

export default meta;
type Story = StoryObj<typeof meta>;

<<<<<<< HEAD
// デフォルトストーリー
export const Default: Story = {
  args: {
    logs: gameLogData,
    title: 'ゲームログ',
    maxItems: 10,
    titleAlign: 'left',
    elevation: 2,
    borderRadius: 8,
    spacing: 2,
    horizontalMargin: 16,
    avatarSize: 40,
  },
};

// カスタムデータストーリー
export const WithCustomData: Story = {
  args: {
    logs: [
      {
        id: '1',
        timestamp: '2024-01-15T10:30:00Z',
        action: 'ログイン',
        description: 'ゲームにログインしました',
        color: '#4CAF50',
        user: 'プレイヤー1',
        points: 0,
      },
      {
        id: '2',
        timestamp: '2024-01-15T10:35:00Z',
        action: 'クエストクリア',
        description: 'チュートリアルクエストをクリアしました',
        color: '#2196F3',
        user: 'プレイヤー1',
        points: 100,
      },
      {
        id: '3',
        timestamp: '2024-01-15T10:45:00Z',
        action: 'レベルアップ',
        description: 'レベル2に上がりました',
        color: '#FF9800',
        user: 'プレイヤー1',
        points: 50,
      },
      {
        id: '4',
        timestamp: '2024-01-15T11:00:00Z',
        action: 'アイテム取得',
        description: 'レア武器「炎の剣」を取得しました',
        color: '#9C27B0',
        user: 'プレイヤー1',
        points: 200,
      },
    ],
    title: 'カスタムゲームログ',
    maxItems: 5,
    titleAlign: 'center',
    elevation: 4,
    borderRadius: 12,
    spacing: 3,
    horizontalMargin: 20,
    avatarSize: 50,
  },
};

// コンパクト表示
export const Compact: Story = {
  args: {
    logs: gameLogData.slice(0, 5),
    title: 'コンパクトログ',
    maxItems: 5,
    titleAlign: 'left',
    elevation: 1,
    borderRadius: 4,
    spacing: 1,
    horizontalMargin: 8,
    avatarSize: 32,
  },
};

// 最新のアクティビティ
export const RecentActivity: Story = {
  args: {
    logs: gameLogData.slice(0, 3),
    title: '最新のアクティビティ',
    maxItems: 3,
    titleAlign: 'center',
    elevation: 3,
    borderRadius: 10,
    spacing: 2,
    horizontalMargin: 16,
    avatarSize: 45,
  },
};

// ログなしの場合
export const NoLogs: Story = {
  args: {
    logs: [],
    title: 'アクティビティなし',
    maxItems: 10,
    titleAlign: 'left',
    elevation: 2,
    borderRadius: 8,
    spacing: 2,
    horizontalMargin: 16,
    avatarSize: 40,
  },
};

// 大きなアバター
export const LargeAvatars: Story = {
  args: {
    logs: gameLogData.slice(0, 4),
    title: '大型アバター表示',
    maxItems: 4,
    titleAlign: 'left',
    elevation: 2,
    borderRadius: 8,
    spacing: 3,
    horizontalMargin: 24,
    avatarSize: 60,
  },
};
=======
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
>>>>>>> c1a0b1a338e0e2acebc18e2b01b3b7dd497997d3
