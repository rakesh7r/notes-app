import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';

// Helper to create a store for testing
const createTestStore = (initialMode: 'light' | 'dark' = 'light') => {
	return configureStore({
		reducer: {
			theme: themeReducer,
		},
		preloadedState: {
			theme: {
				mode: initialMode,
			},
		},
	});
};

describe('ThemeToggle', () => {
	it('renders the toggle button', () => {
		const store = createTestStore();
		render(
			<Provider store={store}>
				<ThemeToggle />
			</Provider>
		);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('toggles theme from light to dark on click', () => {
		const store = createTestStore('light');
		render(
			<Provider store={store}>
				<ThemeToggle />
			</Provider>
		);

		const button = screen.getByRole('button');
		// Initial state check (looking for Moon icon logic or title)
		expect(button).toHaveAttribute('title', 'Switch to dark mode');

		fireEvent.click(button);

		// Check if state updated (Redux state update propagation)
		// Since we are testing the component, we can check the title update which reflects the new state
		expect(button).toHaveAttribute('title', 'Switch to light mode');
	});

	it('toggles theme from dark to light on click', () => {
		const store = createTestStore('dark');
		render(
			<Provider store={store}>
				<ThemeToggle />
			</Provider>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('title', 'Switch to light mode');

		fireEvent.click(button);

		expect(button).toHaveAttribute('title', 'Switch to dark mode');
	});
});
