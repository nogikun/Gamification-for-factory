import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { Preview } from '@storybook/react';

import { menuReducer } from '../src/redux/menuSlice'; // メニューのリデューサーをインポート
import { searchDateReducer } from '../src/redux/searchDateSlice'; // 検索日付のリデューサーをインポート
import { searchEventReducer } from '../src/redux/searchEventSlice'; // 検索のリデューサーをインポート
import { themeReducer } from '../src/redux/themeSlice'; // テーマのリデューサーをインポート
import { serverReducer } from '../src/redux/serverSlice'; // サーバーのリデューサーをインポート

// // メニュー状態用のリデューサー
// const menuReducer = (state = { isOpen: false }, action: any) => {
//   switch (action.type) {
//     case 'menu/toggleMenu':
//       return { ...state, isOpen: !state.isOpen };
//     default:
//       return state;
//   }
// };

// Storybook専用のモックストアを作成
const mockStore = configureStore({
  reducer: {
    menu: menuReducer,
    searchDate: searchDateReducer,
    searchEvent: searchEventReducer,
    theme: themeReducer,
    server: serverReducer,
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