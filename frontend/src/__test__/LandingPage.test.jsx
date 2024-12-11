import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import LandingPage from '../components/LandingPage';
import { MemoryRouter, useNavigate } from "react-router-dom";

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('LandingPage Component', () => {
  test('renders the landing page correctly', () => {
		const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Check if Login and Register buttons are rendered
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();

		// check if other text is on screen too
		expect(screen.getByText("Welcome!")).toBeInTheDocument();
		expect(screen.getByText("Login to Make Your Presentation Today")).toBeInTheDocument();
		expect(screen.getByText("PRESTO")).toBeInTheDocument();
		const imageElement = screen.getByAltText(/Panda making slide deck image/i);
    expect(imageElement).toBeInTheDocument();
  });

  test('navigates to login page when login button is clicked', () => {
		const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Simulate clicking the login button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  test('navigates to register page when register button is clicked', () => {
		const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Simulate clicking the register button
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(navigate).toHaveBeenCalledWith('/register');
  });
});
