import { render, screen, waitFor } from '@testing-library/react';
import { Login } from './Login';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Mock dependencies
vi.mock('@react-oauth/google', () => ({
	GoogleLogin: ({ onSuccess }: any) => (
		<button
			data-testid='google-login-btn'
			onClick={() => {
				// Simulate success
				onSuccess({ credential: 'mock-jwt-token' });
			}}>
			Sign in with Google
		</button>
	),
}));

vi.mock('jwt-decode', () => ({
	jwtDecode: () => ({
		name: 'Test User',
		email: 'test@example.com',
		picture: 'http://example.com/pic.jpg',
	}),
}));

const createTestStore = () => {
	return configureStore({
		reducer: {
			auth: authReducer,
		},
	});
};

describe('Login', () => {
	it('renders welcome message', () => {
		const store = createTestStore();
		render(
			<Provider store={store}>
				<Login />
			</Provider>
		);

		expect(screen.getByText('Welcome to Notes')).toBeInTheDocument();
		expect(screen.getByText('Please sign in to continue')).toBeInTheDocument();
	});

	it('handles Google Login success', async () => {
		const store = createTestStore();
		render(
			<Provider store={store}>
				<Login />
			</Provider>
		);

		const loginBtn = screen.getByTestId('google-login-btn');
		loginBtn.click();

		// Check if store was updated
		await waitFor(() => {
			const state = store.getState();
			expect(state.auth.user).toEqual({
				name: 'Test User',
				email: 'test@example.com',
				picture: 'http://example.com/pic.jpg',
			});
			expect(state.auth.token).toBe('mock-jwt-token');
		});
	});
});
