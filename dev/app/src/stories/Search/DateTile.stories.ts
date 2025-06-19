import {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';

import {DateTile, DateTileProps} from './DateTile';

const meta = {
    title: 'Search/DateTile',
    component: DateTile,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
    },
    args: {
        // onClick: fn()
    },
} satisfies Meta<typeof DateTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        selectedDate: "2025-05-05",
        termDays: 2,
        spaceBetween: "20px",
        horizonMargin: "10px"
    },
};