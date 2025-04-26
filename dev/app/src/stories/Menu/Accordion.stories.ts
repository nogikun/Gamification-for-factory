import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Accordion, Icons } from './Accordion';

// ストーリーのセットアップ方法の詳細: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: 'Menu/AccordionPanel',
	component: Accordion,
	parameters: {
		// コンポーネントをCanvasの中央に配置するためのオプションパラメータ。詳細: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	// このコンポーネントは自動生成されたAutodocsエントリを持ちます: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// argTypesの詳細: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		backgroundColor: { control: 'color' },
        icon: {
                options: Object.keys(Icons), // アイコン名の配列
                mapping: Icons,
                control: {
                type: 'select',
                labels: {
                    Menu: 'メニュー',
                    // 他のアイコンも追加
                }
                }
            }
	},
	// onClickの引数をスパイするには`fn`を使用します。これにより、呼び出されるとアクションパネルに表示されます: https://storybook.js.org/docs/essentials/actions#action-args
	args: { onClick: fn() },
    
} satisfies Meta<typeof Accordion>;

// ストーリーの型を定義します。ストーリーの型は、Metaの型引数としてコンポーネントの型を指定することで取得できます。
// これにより、ストーリーの型がコンポーネントの型に基づいて自動的に推論されます。
export default meta;
type Story = StoryObj<typeof meta>;

// 引数を使ったストーリーの作成についての詳細: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        primary: true,
        label: 'Accordion',
        textcolor: "#ffffff",
        backgroundColor: "#262626",
        bordered: false,
        borderRadius: 50,
        width: 100,
        height: 100,
    },
};

export const MenuButton: Story = {
    args: {
        primary: true,
        label: "",
        textcolor: "#ffffff",
        backgroundColor: "#262626",
        bordered: false,
        borderRadius: 50,
        width: 100,
        height: 100,
        labelEnabled: false,
        icon: "Menu"
    }
};