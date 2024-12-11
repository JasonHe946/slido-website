import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';

const mockAxios = new axiosMock(axios);

vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: vi.fn(),
  };
});

describe('LoginPage Component', () => {
  let setTokenFn;

  beforeEach(() => {
    setTokenFn = vi.fn();
    localStorage.clear();
    mockAxios.reset(); // Reset axios mock before each test
  });

  test('renders the login form and handles successful login', async () => {
    // Mock successful login response
    mockAxios.onPost('http://localhost:5005/admin/auth/login').reply(200, {
      token: 'test-token',
    });

    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <LoginPage setTokenFn={setTokenFn} />
      </MemoryRouter>
    );

    // Check if login form is rendered correctly
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'jason@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'passwordjason' },
    });

    // Simulate form submission
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    // Wait for the axios mock to resolve and check if navigation and token are handled
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(setTokenFn).toHaveBeenCalledWith('test-token');
    });

    // Check if the user is navigated to the dashboard
    expect(navigate).toHaveBeenCalledWith("/dashboard");
  });

  test('when login fails the error modal should display', async () => {
    // Mock failed login response
    mockAxios.onPost('http://localhost:5005/admin/auth/login').reply(400, {
      error: 'Invalid email or password',
    });

    render(
      <MemoryRouter>
        <LoginPage setTokenFn={setTokenFn} />
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'randomemail@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'notpassword' },
    });

    // Simulate form submission
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    // Error modal should appear
    await waitFor(() => {
      expect(screen.getByText('Login Error')).toBeInTheDocument();
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  test('navigates to register page when clicking "Sign up here"', () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <LoginPage setTokenFn={setTokenFn} />
      </MemoryRouter>
    );

    // Simulate clicking the sign-up link
    fireEvent.click(screen.getByText(/Sign up here/i));
    expect(navigate).toHaveBeenCalledWith('/register');
  });

  test('back button navigates to the landing page', () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <LoginPage setTokenFn={setTokenFn} />
      </MemoryRouter>
    );

    // Simulate clicking the back button
    fireEvent.click(screen.getByText(/Back/i));
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
