import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { APIKeyCard } from './APIKeyCard';

// Storybook用のReduxプロバイダーラッパー
const ReduxWrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
        {children}
    </Provider>
);

const meta: Meta<typeof APIKeyCard> = {
    title: 'Settings/APIKeyCard',
    component: APIKeyCard,
    decorators: [
        (Story) => (
            <ReduxWrapper>
                <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
                    <Story />
                </div>
            </ReduxWrapper>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: `
APIキー管理用のカードコンポーネントです。

## 機能
- ✅ Gemini APIキーの入力・保存・削除
- ✅ 暗号化されたlocalStorageへの保存
- ✅ Redux状態管理との連携
- ✅ リアルタイムバリデーション
- ✅ APIキーのマスキング表示
- ✅ パスワード表示/非表示切り替え
- ✅ MUI + Ionicを使用したモダンなUI

## 使用技術
- React + TypeScript
- Redux Toolkit
- Material-UI (MUI)
- Ionic React
- Web Crypto API (暗号化)

## テスト方法
1. 有効なAPIキー（AIzaSyD...）を入力してバリデーションをテスト
2. 無効なAPIキーで適切なエラーメッセージが表示されることを確認
3. 保存・削除機能のテスト
4. 表示/非表示切り替えのテスト
                `
            }
        }
    },
    argTypes: {
        width: {
            control: { 
                type: 'select'
            },
            options: ['300px', '350px', '400px', '500px', '600px', '100%'],
            description: 'カードの幅（ピクセル値または%）',
            table: {
                category: 'Layout',
                type: { summary: 'string' }
            }
        },
        height: {
            control: { 
                type: 'select'
            },
            options: ['auto', '100%', '400px', '500px', '600px', '700px'],
            description: 'カードの高さ（ピクセル値、%、またはauto）',
            table: {
                category: 'Layout',
                type: { summary: 'string' }
            }
        },
        title: {
            control: { type: 'text' },
            description: 'カードのタイトル文字列',
            table: {
                category: 'Content',
                type: { summary: 'string' }
            }
        }
    },
    args: {
        width: '350px',
        height: '100%',
        title: 'Gemini API設定'
    }
};

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトストーリー
export const Default: Story = {
    args: {
        width: '350px',
        height: '100%',
        title: 'Gemini API設定'
    }
};

// 幅広バージョン
export const Wide: Story = {
    args: {
        width: '600px',
        height: '500px',
        title: 'Gemini API設定 (Wide)'
    }
};

// 小さいバージョン
export const Compact: Story = {
    args: {
        width: '300px',
        height: '400px',
        title: 'API設定'
    }
};

// 縦長バージョン
export const Tall: Story = {
    args: {
        width: '350px',
        height: '600px',
        title: 'Gemini API設定 (Tall)'
    }
};

// カスタムタイトル
export const CustomTitle: Story = {
    args: {
        width: '400px',
        height: 'auto',
        title: '🤖 AI API Configuration'
    }
};

// テスト用（事前定義されたAPIキー付き）
export const WithPrefilledKey: Story = {
    args: {
        width: '400px',
        height: '500px',
        title: 'テスト用 (事前入力済み)'
    },
    play: async ({ canvasElement }) => {
        // Storybookのplayファンクションでテスト用APIキーを事前入力
        const canvas = canvasElement;
        const input = canvas.querySelector('input[type="password"]') as HTMLInputElement;
        if (input) {
            input.value = 'AIzaSyDtestkey123456789abcdefghijklmnop';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
};

// ダークモードテスト
export const DarkMode: Story = {
    args: {
        width: '350px',
        height: '500px',
        title: 'Gemini API設定 (Dark)'
    },
    decorators: [
        (Story) => (
            <ReduxWrapper>
                <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#1e1e1e', 
                    minHeight: '100vh',
                    color: '#ffffff'
                }}>
                    <Story />
                </div>
            </ReduxWrapper>
        ),
    ]
};

// レスポンシブテスト（複数サイズ比較）
export const SizeComparison: Story = {
    args: {
        width: '350px',
        height: '450px',
        title: 'サイズ比較テスト'
    },
    decorators: [
        (Story) => (
            <ReduxWrapper>
                <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#f5f5f5', 
                    minHeight: '100vh',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h3>Small (300x400)</h3>
                        <APIKeyCard width="300px" height="400px" title="Small" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h3>Medium (350x450)</h3>
                        <Story />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h3>Large (500x600)</h3>
                        <APIKeyCard width="500px" height="600px" title="Large" />
                    </div>
                </div>
            </ReduxWrapper>
        ),
    ]
};

// レスポンシブテスト（フル幅）
export const FullWidth: Story = {
    args: {
        width: '100%',
        height: 'auto',
        title: 'フル幅レスポンシブ'
    },
    decorators: [
        (Story) => (
            <ReduxWrapper>
                <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#f5f5f5', 
                    minHeight: '100vh',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <Story />
                </div>
            </ReduxWrapper>
        ),
    ]
};

// Copyright (c) 2025 nogi
// All rights reserved.
