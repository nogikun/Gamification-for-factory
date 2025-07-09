import type { Meta, StoryObj } from '@storybook/react';
import InternParticipantsHorizontalBarChart from './InternParticipantsHorizontalBarChart';
import { dataset } from '../../dummy_data/chartData';

const meta = {
  title: 'Charts/InternParticipantsHorizontalBarChart',
  component: InternParticipantsHorizontalBarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'グラフデータの配列',
    },
    title: {
      control: 'text',
      description: 'グラフのタイトル',
    },
    height: {
      control: 'number',
      description: 'グラフの高さ',
    },
    maxWidth: {
      control: 'text',
      description: 'グラフの最大幅',
    },
    width: {
      control: 'text',
      description: '全体の幅',
    },
    titleAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'タイトルの配置',
    },
    rightMargin: {
      control: 'number',
      description: '右側の余白',
    },
    dataLabel: {
      control: 'text',
      description: 'データキーのラベル',
    },
    legendPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '凡例の位置',
    },
    containerJustify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end'],
      description: 'コンテナの配置',
    },
    valueFormatter: {
      control: false,
      description: '値のフォーマッター関数',
    },
  },
} satisfies Meta<typeof InternParticipantsHorizontalBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトストーリー
export const Default: Story = {
  args: {
    data: dataset,
    title: "インターン参加回数",
    height: 400,
    maxWidth: '600px',
    width: '100%',
    titleAlign: 'center',
    rightMargin: 70,
    dataLabel: 'インターン参加回数',
    legendPosition: 'top',
    containerJustify: 'center',
    valueFormatter: (value: number | null) => `${value}回`,
  },
};

// 小さいサイズのストーリー
export const Small: Story = {
  args: {
    ...Default.args,
    height: 300,
    maxWidth: '400px',
    rightMargin: 50,
  },
};

// 大きいサイズのストーリー
export const Large: Story = {
  args: {
    ...Default.args,
    height: 600,
    maxWidth: '800px',
    rightMargin: 100,
  },
};

// 左寄せタイトルのストーリー
export const LeftAlignedTitle: Story = {
  args: {
    ...Default.args,
    titleAlign: 'left',
    title: "左寄せタイトル - インターン参加回数",
  },
};

// 右寄せタイトルのストーリー
export const RightAlignedTitle: Story = {
  args: {
    ...Default.args,
    titleAlign: 'right',
    title: "右寄せタイトル - インターン参加回数",
  },
};

// 凡例が底部のストーリー
export const BottomLegend: Story = {
  args: {
    ...Default.args,
    legendPosition: 'bottom',
    title: "凡例が底部の場合",
  },
};

// コンテナが左寄せのストーリー
export const LeftAlignedContainer: Story = {
  args: {
    ...Default.args,
    containerJustify: 'flex-start',
    maxWidth: '500px',
    title: "左寄せコンテナ",
  },
};

// コンテナが右寄せのストーリー
export const RightAlignedContainer: Story = {
  args: {
    ...Default.args,
    containerJustify: 'flex-end',
    maxWidth: '500px',
    title: "右寄せコンテナ",
  },
};

// カスタムデータのストーリー
export const CustomData: Story = {
  args: {
    ...Default.args,
    data: [
      { month: 'Q1', internParticipants: 75 },
      { month: 'Q2', internParticipants: 90 },
      { month: 'Q3', internParticipants: 85 },
      { month: 'Q4', internParticipants: 95 },
    ],
    title: "四半期別インターン参加者数",
    dataLabel: '四半期別参加者数',
    valueFormatter: (value: number | null) => `${value}人`,
  },
};

// 少ないデータのストーリー
export const MinimalData: Story = {
  args: {
    ...Default.args,
    data: [
      { month: '上半期', internParticipants: 120 },
      { month: '下半期', internParticipants: 150 },
    ],
    title: "半期別インターン参加者数",
    dataLabel: '半期別参加者数',
    height: 200,
    maxWidth: '400px',
    valueFormatter: (value: number | null) => `${value}人`,
  },
};

// 多いデータのストーリー
export const ExtensiveData: Story = {
  args: {
    ...Default.args,
    data: [
      { month: '1月', internParticipants: 25 },
      { month: '2月', internParticipants: 30 },
      { month: '3月', internParticipants: 45 },
      { month: '4月', internParticipants: 38 },
      { month: '5月', internParticipants: 50 },
      { month: '6月', internParticipants: 65 },
      { month: '7月', internParticipants: 70 },
      { month: '8月', internParticipants: 60 },
      { month: '9月', internParticipants: 40 },
      { month: '10月', internParticipants: 35 },
      { month: '11月', internParticipants: 30 },
      { month: '12月', internParticipants: 28 },
      { month: '来年1月', internParticipants: 32 },
      { month: '来年2月', internParticipants: 35 },
    ],
    title: "14ヶ月間のインターン参加者数",
    height: 500,
    maxWidth: '700px',
    rightMargin: 90,
  },
};

// 数値が高いデータのストーリー
export const HighValueData: Story = {
  args: {
    ...Default.args,
    data: [
      { month: '1月', internParticipants: 250 },
      { month: '2月', internParticipants: 300 },
      { month: '3月', internParticipants: 450 },
      { month: '4月', internParticipants: 380 },
      { month: '5月', internParticipants: 500 },
      { month: '6月', internParticipants: 650 },
    ],
    title: "高数値データ - インターン参加者数",
    dataLabel: '高数値参加者数',
    rightMargin: 100,
    valueFormatter: (value: number | null) => `${value}名`,
  },
};
