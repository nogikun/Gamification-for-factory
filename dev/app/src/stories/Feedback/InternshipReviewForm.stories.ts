import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import InternshipReviewForm from './InternshipReviewForm';

const meta = {
  title: 'Feedback/InternshipReviewForm',
  component: InternshipReviewForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'MUIを使用したインターンシップレビューフォームコンポーネント。星評価、テキスト入力、バリデーション機能を提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    darkMode: {
      control: 'boolean',
      description: 'ダークモードの有効/無効',
    },
    backgroundColor: {
      control: 'color',
      description: 'コンポーネントの背景色',
    },
    width: {
      control: 'text',
      description: 'コンポーネントの幅',
    },
    height: {
      control: 'text',
      description: 'コンポーネントの高さ',
    },
    onSubmitSuccess: {
      action: 'submitted',
      description: 'レビュー送信成功時のコールバック関数',
    },
  },
  args: {
    onSubmitSuccess: fn(),
  },
} satisfies Meta<typeof InternshipReviewForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    darkMode: false,
  },
};

// Dark mode story
export const DarkMode: Story = {
  args: {
    darkMode: true,
  },
};

// Custom styling story
export const CustomStyling: Story = {
  args: {
    darkMode: false,
    backgroundColor: '#f5f5f5',
    width: '600px',
    height: '800px',
  },
};

// Mobile view story
export const MobileView: Story = {
  args: {
    darkMode: false,
    width: '375px',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Tablet view story
export const TabletView: Story = {
  args: {
    darkMode: false,
    width: '768px',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// With custom callback story
export const WithCallback: Story = {
  args: {
    darkMode: false,
    onSubmitSuccess: (data: any) => {
      console.log('Review submitted:', data);
      alert('レビューが送信されました！');
    },
  },
};