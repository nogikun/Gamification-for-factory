import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '../../redux/store';
import InternParticipantsHorizontalBarChart from './InternParticipantsHorizontalBarChart';

// テーマ設定
const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark', background: { default: '#121212', paper: '#1e1e1e' } } });

// ReduxWrapper
const ReduxWrapper = ({ children, theme = 'light' }: { children: React.ReactNode; theme?: 'light' | 'dark' }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <div style={{ 
        padding: '20px', 
        backgroundColor: theme === 'light' ? '#f5f5f5' : '#121212',
        minHeight: '100vh',
      }}>
        {children}
      </div>
    </ThemeProvider>
  </Provider>
);

const meta: Meta<typeof InternParticipantsHorizontalBarChart> = {
  title: 'Charts/InternParticipantsHorizontalBarChart',
  component: InternParticipantsHorizontalBarChart,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: { control: 'text', description: 'グラフのタイトル' },
    height: { control: { type: 'range', min: 200, max: 800 }, description: 'グラフの高さ' },
    maxWidth: { control: { type: 'range', min: 300, max: 1000 }, description: '最大幅' },
    width: { control: { type: 'range', min: 200, max: 800 }, description: '幅' },
    titleAlign: { control: { type: 'select' }, options: ['left', 'center', 'right'], description: 'タイトルの配置' },
    rightMargin: { control: { type: 'range', min: 0, max: 100 }, description: '右マージン' }
  },
  args: {
    title: 'インターン参加者数',
    height: 400,
    maxWidth: 600,
    width: 500,
    titleAlign: 'center',
    rightMargin: 20
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="light"><Story /></ReduxWrapper>],
};

export const DarkMode: Story = {
  decorators: [(Story, { args }) => <ReduxWrapper theme="dark"><Story /></ReduxWrapper>],
};

export {};
