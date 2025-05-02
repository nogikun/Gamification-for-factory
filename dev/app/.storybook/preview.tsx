import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { Preview } from '@storybook/react';

// メニュー状態用のリデューサー
const menuReducer = (state = { isOpen: false }, action: any) => {
  switch (action.type) {
    case 'menu/toggleMenu':
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
};

// Storybook専用のモックストアを作成
const mockStore = configureStore({
  reducer: {
    menu: menuReducer
  }
});

// すべてのストーリーにグローバルに適用されるデコレーター
const preview: Preview = {
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <Story />
      </Provider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;