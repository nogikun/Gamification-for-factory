import {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';

import {EventList, EventListProps} from './EventList';

const meta = {
    title: 'Search/EventList',
    component: EventList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
    },
    args: {
        // onClick: fn()
    },
} satisfies Meta<typeof EventList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        selectedDate: "2025-05-05",
    },
};