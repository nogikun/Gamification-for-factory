import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MenuTile, MenuTileProps } from './MenuTile'

const meta = {
	title: 'Menu/Tile',
	component: MenuTile,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		backgroundColor: { control: 'color' },
    },
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: { onClick: fn() },
} satisfies Meta<typeof MenuTile>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的なボタンのストーリー（不使用）
export const Primary : Story ={
    args: {
        primary: true,
        label: 'Button',
        backgroundColor: "#6100ff",
        variant: 'primary',
        width: "100vw",
        height: "100%",
        position: "absolute",
        menuBtnTop: "50%",
        menuBtnLeft: "50%",
        menuTransform: "translate(-50%, -50%)",
        menuZIndex: 10,
        menuMargin: "0em",
        menuJustifyContent: "",
        menuAlignItems: "",
        bottomMarginTop: ""
    },
}