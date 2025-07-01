import type { Meta, StoryObj } from '@storybook/react';
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

const meta: Meta<typeof CompanyEvaluations> = {
  title: 'Charts/CompanyEvaluations',
  component: CompanyEvaluations,
  parameters: {
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
};

export default meta;
type Story = StoryObj<typeof meta>;

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