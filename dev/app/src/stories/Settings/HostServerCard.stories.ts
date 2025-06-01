import {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';

import {HostServerCard} from './HostServerCard';

const meta = {
    title: 'Settings/HostServerCard',
    component: HostServerCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        host: {
            control: 'text',
            description: 'Host server URL',
        },
        port: {
            control: 'text',
            description: 'Port number',
        },
    },
} satisfies Meta<typeof HostServerCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
    args: {
        host: 'http://localhost',
        port: '8000',
    },
};