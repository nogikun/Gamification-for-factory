import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '../../redux/store';
import AiDiagnosisResult from './AiDiagnosisResult';

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

const meta: Meta<typeof AiDiagnosisResult> = {
  title: 'Charts/AiDiagnosisResult',
  component: AiDiagnosisResult,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: { control: 'text', description: '診断結果のタイトル' },
    description: { control: 'text', description: '診断結果の説明文' },
    variant: { control: { type: 'select' }, options: ['outlined', 'elevation'], description: 'カードの表示スタイル' },
    elevation: { control: { type: 'range', min: 0, max: 24, step: 1 }, description: 'カードの影の深度' },
    borderRadius: { control: { type: 'range', min: 0, max: 20, step: 1 }, description: 'カードの角の丸み' },
    padding: { control: { type: 'range', min: 0, max: 10, step: 0.5 }, description: '外側の余白' }
  },
  args: {
    title: "AI診断結果",
    description: "あなたは町工場などでのコツコツとした作業にこなす力に優れています。細かな工程や反復作業にも高い集中力を維持し、最後まで努力を積み重ねることができます。",
    variant: 'elevation',
    elevation: 2,
    borderRadius: 2,
    padding: 2
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
};

export const Outlined: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
  args: { variant: 'outlined' },
};

export const DarkMode: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="dark"><Story /></ReduxWrapper>],
};

export {};
