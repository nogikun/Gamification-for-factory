import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button, ButtonProps, Icons } from './Button';

const meta = {
	title: 'Menu/PageButton',
	component: Button,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		backgroundColor: { control: 'color' },
        icon: {
            options: Object.keys(Icons), // アイコン名の配列
            mapping: Icons,
            control: {
              type: 'select',
              labels: {
                Crown: 'ランキング',
                Battle: '戦闘',
                Search: '探す',
                Settings: '設定',
                Steps: 'あしあと',
                // 他のアイコンも追加
              }
            }
          }
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的なボタンのストーリー（不使用）
export const Primary : Story ={
    args: {
        primary: true,
        label: 'Button',
        backgroundColor: "#6100ff",
        disabled: false,
        variant: 'primary',
        width: "200px",
        height: "100px",
        borderRadiusTopLeft: "100px",
        borderRadiusTopRight: "0px",
        borderRadiusBottomLeft: "0px",
        borderRadiusBottomRight: "0px",
        fontSize: "32px",
        color: "#ffffff"
    },
};

export const Ranks : Story ={
    args: {
        primary: true,
        label: "ログ",
        backgroundColor: "#FCAA1B",
        disabled: false,
        variant: 'primary',
        width: "200px",
        height: "80px",
        borderRadiusTopLeft: "80px",
        borderRadiusTopRight: "0px",
        borderRadiusBottomLeft: "0px",
        borderRadiusBottomRight: "0px",
        color: "#ffffff",
        fontSize: "24px",
        alt: "",
        icon: "Crown",
        onClickPath: "/tab4"
    },
};

export const Settings : Story ={
    args: {
        primary: true,
        label: "設定",
        backgroundColor: "#A3A3A3",
        disabled: false,
        variant: 'primary',
        width: "200px",
        height: "80px",
        borderRadiusTopLeft: "0px",
        borderRadiusTopRight: "80px",
        borderRadiusBottomLeft: "0px",
        borderRadiusBottomRight: "0px",
        fontSize: "24px",
        color: "#ffffff",
        alt: "",
        icon: "Settings"
    },
};

export const Search : Story ={
    args: {
        primary: true,
        label: "探す",
        backgroundColor: "#34AFB8",
        disabled: false,
        variant: 'primary',
        width: "200px",
        height: "80px",
        borderRadiusTopLeft: "0px",
        borderRadiusTopRight: "0px",
        borderRadiusBottomLeft: "0px",
        borderRadiusBottomRight: "80px",
        color: "#ffffff",
        alt: "",
        fontSize: "24px",
        icon: "Search"
    },
};

export const Battle : Story ={
    args: {
        primary: true,
        label: "戦う",
        backgroundColor: "#FF8587",
        disabled: false,
        variant: 'primary',
        width: "200px",
        height: "80px",
        borderRadiusTopLeft: "0px",
        borderRadiusTopRight: "0px",
        borderRadiusBottomLeft: "80px",
        borderRadiusBottomRight: "0px",
        color: "#ffffff",
        fontSize: "24px",
        icon: "Battle"
    },
};

export const Activity: Story = {
    args: {
        primary: true,
        label: "あしあと",
        backgroundColor: "#FCAA1B",
        disabled: false,
        variant: "primary",
        width: "200px",
        height: "80px",
        borderRadiusTopLeft: "80px",
        borderRadiusTopRight: "0px",
        borderRadiusBottomLeft: "0px",
        borderRadiusBottomRight: "0px",
        color: "#ffffff",
        fontSize: "24px",
        alt: "",
        icon: "Steps",
        onClickPath: "/tab4"
    }
};