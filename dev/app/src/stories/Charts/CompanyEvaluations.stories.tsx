import type { Meta, StoryObj } from '@storybook/react';
<<<<<<< HEAD
import CompanyEvaluations from './CompanyEvaluations';
import { companyEvaluations } from '../../dummy_data/chartData';
=======
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '../../redux/store';
import CompanyEvaluations from './CompanyEvaluations';

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

// カスタム企業評価データ
const customEvaluations = [
  { id: 'eval-04', companyName: 'テック企業A', rating: 4.5 },
  { id: 'eval-05', companyName: '製造業B', rating: 3.5 },
  { id: 'eval-06', companyName: 'スタートアップC', rating: 5 },
];
>>>>>>> c1a0b1a338e0e2acebc18e2b01b3b7dd497997d3

const meta: Meta<typeof CompanyEvaluations> = {
  title: 'Charts/CompanyEvaluations',
  component: CompanyEvaluations,
  parameters: {
<<<<<<< HEAD
    layout: 'centered',
    docs: {
      description: {
        component: '企業評価の表示コンポーネント。レーティングと企業情報をリスト形式で表示します。',
      },
    },
  },
  argTypes: {
    evaluations: {
      description: '企業評価データの配列',
      control: { type: 'object' },
    },
    title: {
      description: 'セクションのタイトル',
      control: { type: 'text' },
    },
    maxRating: {
      description: '評価の最大値',
      control: { type: 'number', min: 1, max: 10 },
    },
    precision: {
      description: '評価の精度（ステップ値）',
      control: { type: 'number', min: 0.1, max: 1, step: 0.1 },
    },
    variant: {
      description: 'カードの表示スタイル',
      control: { type: 'select' },
      options: ['outlined', 'elevation'],
    },
    elevation: {
      description: 'カードの影の深度',
      control: { type: 'number', min: 0, max: 24 },
    },
    borderRadius: {
      description: 'カードの角の丸み',
      control: { type: 'number', min: 0, max: 20 },
    },
    padding: {
      description: '外側の余白',
      control: { type: 'number', min: 0, max: 50 },
    },
  },
  tags: ['autodocs'],
=======
    layout: 'fullscreen',
    docs: {
      description: {
        component: '企業からの評価を表示するリストコンポーネントです。評価データ、タイトル、評価の最大値などをカスタマイズできます。'
      }
    }
  },
  argTypes: {
    title: { control: 'text', description: 'セクションのタイトル' },
    maxRating: { control: { type: 'range', min: 1, max: 10 }, description: '評価の最大値' },
    precision: { control: { type: 'select' }, options: [0.1, 0.5, 1], description: '評価の精度' },
    variant: { control: { type: 'select' }, options: ['outlined', 'elevation'], description: 'カードの表示スタイル' },
    elevation: { control: { type: 'range', min: 0, max: 24 }, description: 'カードの影の深度' },
    borderRadius: { control: { type: 'range', min: 0, max: 20 }, description: 'カードの角の丸み' },
    padding: { control: { type: 'range', min: 0, max: 10 }, description: '外側の余白' },
    innerPadding: { control: { type: 'range', min: 0, max: 5 }, description: '内側の余白' }
  },
  args: {
    title: '企業からの評価',
    maxRating: 5,
    precision: 0.5,
    variant: 'elevation',
    elevation: 2,
    borderRadius: 2,
    padding: 2,
    innerPadding: 1
  }
>>>>>>> c1a0b1a338e0e2acebc18e2b01b3b7dd497997d3
};

export default meta;
type Story = StoryObj<typeof meta>;

<<<<<<< HEAD
// デフォルトストーリー
export const Default: Story = {
  args: {
    evaluations: companyEvaluations,
    title: '企業評価',
    maxRating: 5,
    precision: 0.5,
    variant: 'elevation',
    elevation: 2,
    borderRadius: 8,
    padding: 16,
  },
};

// カスタムデータストーリー
export const WithCustomData: Story = {
  args: {
    evaluations: [
      {
        id: '1',
        companyName: 'テクノロジー株式会社',
        rating: 4.8,
        reviewCount: 42,
        description: '最新技術を駆使したイノベーション企業',
        industry: 'IT・ソフトウェア',
      },
      {
        id: '2', 
        companyName: '未来工業有限会社',
        rating: 4.2,
        reviewCount: 18,
        description: '持続可能な製造業のリーディングカンパニー',
        industry: '製造業',
      },
      {
        id: '3',
        companyName: 'グローバル商事',
        rating: 3.9,
        reviewCount: 67,
        description: '国際貿易のエキスパート企業',
        industry: '商社・卸売',
      },
    ],
    title: 'カスタム企業評価',
    maxRating: 5,
    precision: 0.1,
    variant: 'outlined',
    borderRadius: 12,
    padding: 20,
  },
};

// 高評価企業のみ
export const HighRatedCompanies: Story = {
  args: {
    evaluations: companyEvaluations.filter(company => company.rating >= 4.5),
    title: '高評価企業（4.5以上）',
    maxRating: 5,
    precision: 0.5,
    variant: 'elevation',
    elevation: 4,
    borderRadius: 10,
    padding: 24,
  },
};

// コンパクトスタイル
export const CompactStyle: Story = {
  args: {
    evaluations: companyEvaluations.slice(0, 3),
    title: 'コンパクト表示',
    maxRating: 5,
    precision: 0.5,
    variant: 'outlined',
    elevation: 0,
    borderRadius: 4,
    padding: 8,
  },
};

// 評価なしの場合
export const NoEvaluations: Story = {
  args: {
    evaluations: [],
    title: '評価データなし',
    maxRating: 5,
    precision: 0.5,
    variant: 'elevation',
    elevation: 2,
    borderRadius: 8,
    padding: 16,
  },
};
=======
export const Default: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
};

export const CustomData: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
  args: {
    evaluations: customEvaluations,
  },
};

export const HighRating: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
  args: {
    maxRating: 10,
    precision: 0.1,
  },
};

export const Outlined: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
  args: {
    variant: 'outlined',
  },
};

export const DarkMode: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="dark"><Story /></ReduxWrapper>],
};

export {};
>>>>>>> c1a0b1a338e0e2acebc18e2b01b3b7dd497997d3
