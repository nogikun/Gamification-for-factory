import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
	const { baseElement } = render(<App />);
	expect(baseElement).toBeDefined();
});

// Copyright (c) 2025 nogi, KazuakiTakahashi
// All rights reserved.
