import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

// components
import { Event, EventProps } from './Event';

// meta情報の定義
const meta = {
    title: 'Search/Event',
    component: Event,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        // EventPropsに存在するプロパティのみ
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: { 
        onClick: fn(),
        event_id: "11" // Default event_id for all stories, can be overridden in specific stories
    },
} satisfies Meta<typeof Event>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story - 基本的なボタンのストーリー
export const Primary : Story ={
    args: {
        // 必要なevent_idのみ
        event_id: "11",

        zIndex: 0
    },
};
