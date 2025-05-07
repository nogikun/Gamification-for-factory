import {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';

import {DateComponent, DateProps} from './Date';

const meta = {
    title: 'Search/Date',
    component: DateComponent,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {control: 'color'},
        color: {control: 'color'},
        width: {control: 'text'},
        height: {control: 'text'},
        borderRadius: {control: 'text'},
        onClickPath: {control: 'text'},
        onClick: {action: 'clicked'},
    },
    args: {
        onClick: fn()
    },
} satisfies Meta<typeof DateComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        date: '2023-10-01',
        backgroundColor: '#6100ff',
        color: '#ffffff',
        width: "80px",
        height: '100px',
        borderRadius: '10px',
    },
};

export const SelectedDate: Story = {
    args: {
        date: '2024-05-04',
        backgroundColor: "#7381C0",
        color: "#ffffff",
        width: "80px",
        height: "100px",
        borderRadius: "10px",
        dayFontSize: "32px",
        weekdayFontSize: "24px",
        selected: true,
        borderWidth: 3,
        borderColor: "#7381C0",
        bordered: true
    }
};

export const NotSelectedDate: Story = {
    args: {
        date: "2024-05-04",
        backgroundColor: "#ffffff",
        color: "#aeaeae",
        width: "80px",
        height: "100px",
        borderRadius: "10px",
        dayFontSize: "32px",
        weekdayFontSize: "24px",
        bordered: true,
        borderColor: "#D9D9D9",
        borderWidth: 3
    }
};

export const NotSelectedDarkDate: Story = {
    args: {
        date: "2024-05-04",
        backgroundColor: "#333333",
        color: "#797979",
        width: "80px",
        height: "100px",
        borderRadius: "10px",
        dayFontSize: "32px",
        weekdayFontSize: "24px",
        bordered: true,
        borderColor: "#595959",
        borderWidth: 3
    }
};