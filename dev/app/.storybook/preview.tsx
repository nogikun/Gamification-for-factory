import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { Preview } from '@storybook/react';

// 動的リデューサー登録を使用
import { autoReducers } from '../src/redux/autoReducers';

// // メニュー状態用のリデューサー
// const menuReducer = (state = { isOpen: false }, action: any) => {
//   switch (action.type) {
//     case 'menu/toggleMenu':
//       return { ...state, isOpen: !state.isOpen };
//     default:
//       return state;
//   }
// };

// Storybook専用のモックストアを作成（動的リデューサー使用）
const mockStore = configureStore({
  reducer: autoReducers, // 自動的に全リデューサーを登録
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