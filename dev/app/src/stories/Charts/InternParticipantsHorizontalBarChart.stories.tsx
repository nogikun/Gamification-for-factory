import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import InternParticipantsVerticalBarChart from '../../components/InternParticipantsHorizontalBarChart';
import { store } from '../../redux/store';

const meta: Meta<typeof InternParticipantsVerticalBarChart> = {
  title: 'Charts/InternParticipantsHorizontalBarChart',
  component: InternParticipantsVerticalBarChart,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <div style={{ width: '800px', height: '500px' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithContainer: Story = {
  args: {},
  decorators: [
    (Story) => (
      <Provider store={store}>
        <div style={{ width: '100%', maxWidth: '900px', padding: '20px', backgroundColor: '#f5f5f5' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};
// Copyright (c) 2025 nogi
// All rights reserved.
